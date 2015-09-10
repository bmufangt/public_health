# -*- coding: utf-8 -*-
import logging

from django.http import JsonResponse
from django.shortcuts import render

from management.models import Service, WorkRecord
from services.utils import get_resident, new_year_day
from ehr.forms import PsychiatricInfoForm
from .forms import AftercareForm
from .models import Aftercare

debug = logging.getLogger('debug')


def personal_info_page(request):
    resident = get_resident(request)
    ehr_no = resident.ehr_no if resident.ehr_no else ''
    form = PsychiatricInfoForm()
    return render(request, 'psychiatric/personal_info.html',
                  {'form': form, 'resident': resident})


def personal_info_review(request):
    resident = get_resident(request)
    if resident.psychiatric_info_table:
        form = PsychiatricInfoForm(instance=resident.psychiatric_info_table)
        success = True
        message = render(request, 'ehr/psychiatric_info_review_content.html',
                         {'form': form, 'resident': resident}).content
    else:
        success, message = False, ''
    return JsonResponse({'success': success, 'message': message})


def personal_info_submit(request):
    form = PsychiatricInfoForm(request.POST)
    if form.is_valid():
        result = form.save()
        resident = get_resident(request)
        resident.psychiatric = True
        resident.psychiatric_info_table = result
        resident.save()
        success = True
    else:
        success = False

    return JsonResponse({'success': success})


def aftercare_page(request):
    return render(request, 'psychiatric/aftercare_page.html')


def aftercare_form(request):
    resident = get_resident(request)
    item_alias = request.POST.get('item_alias')
    service_item = Service.objects.get(alias=item_alias, service_type__alias='psychiatric')
    try:
        record = WorkRecord.objects.get(resident=resident,
                                        service_item=service_item,
                                        submit_time__gte=new_year_day())
    except WorkRecord.DoesNotExist:
        form = AftercareForm()
        return render(request, 'psychiatric/psy_visit_form_content.html',
                      {'form': form, 'resident': resident})
    else:
        result = Aftercare.objects.get(id=record.item_id)
        form = AftercareForm(instance=result)
        return render(request, 'psychiatric/aftercare_review.html',
                      {'form': form, 'resident': resident})


def aftercare_review(request):
    pass


def aftercare_submit(request):
    success = False
    form = AftercareForm(request.POST)
    if form.is_valid():
        result = form.save()
        resident = get_resident(request)
        item_alias = request.POST.get('item_alias')
        debug.info(item_alias)
        service_item = Service.items.get(alias=item_alias,
                                         service_type__alias='psychiatric')
        debug.info('ddd')
        record = WorkRecord(provider=request.user, resident=resident, service_item=service_item,
                            app_label='psychiatric', model_name='Aftercare',
                            item_id=result.id, service_item_alias=service_item.alias)
        record.save()
        success = True

    return JsonResponse({'success': success})


from ehr.forms import BodyExamForm
from ehr.models import BodyExam


def body_exam_page(request):
    return render(request, 'psychiatric/body_exam_page.html')


def body_exam_form(request):
    resident = get_resident(request)
    records = WorkRecord.objects.filter(resident=resident,
                                        model_name='BodyExam',
                                        submit_time__gte=new_year_day())
    if records.count():
        result = BodyExam.objects.get(id=records[0].item_id)
        form = BodyExamForm(instance=result)
    else:
        form = BodyExamForm()

    return render(request, 'ehr/body_exam_form.html', {'form': form, 'resident': resident,
                                                       'type_alias': 'psychiatric'})

from ehr.forms import PhysicalExaminationForm, BloodRoutineTestForm, BloodGlucoseForm, \
    ElectrocardiogramForm, AlanineAminotransferaseForm, GlutamicOxalaceticTransaminaseForm


def body_exam_submit(request):
    submit_data = request.POST.copy()
    if 'csrfmiddlewaretoken' in submit_data:
        submit_data.pop('csrfmiddlewaretoken')

    if submit_data:
        success = True
        message = u'记录保存成功'
        resident = get_resident(request)
        record = WorkRecord.objects.filter(resident=resident, model_name='BodyExam',
                                           submit_time__gte=new_year_day()).first()
        if record:
            result, created = BodyExam.objects.update_or_create(id=record.item_id, defaults=submit_data)
        else:
            form = BodyExamForm(submit_data)
            if form.is_valid():
                result = form.save()
            else:
                success = False
                message = u'记录数据存在问题'

        if success:
            if PhysicalExaminationForm(submit_data).is_valid():
                service_item = Service.items.get(alias='physical_examination',
                                                 service_type__alias='psychiatric')

                WorkRecord.objects.create(provider=request.user, resident=resident, service_item=service_item,
                                          app_label='psychiatric', model_name='BodyExam',
                                          item_id=result.id, service_item_alias=service_item.alias)

            if BloodRoutineTestForm(submit_data).is_valid():
                service_item = Service.items.get(alias='blood_routine_test',
                                                 service_type__alias='psychiatric')
                WorkRecord.objects.create(provider=request.user, resident=resident, service_item=service_item,
                                          app_label='psychiatric', model_name='BodyExam',
                                          item_id=result.id, service_item_alias=service_item.alias)

            if BloodGlucoseForm(submit_data).is_valid():
                service_item = Service.items.get(alias='blood_glucose',
                                                 service_type__alias='psychiatric')
                WorkRecord.objects.create(provider=request.user, resident=resident, service_item=service_item,
                                          app_label='psychiatric', model_name='BodyExam',
                                          item_id=result.id, service_item_alias=service_item.alias)

            if ElectrocardiogramForm(submit_data).is_valid():
                service_item = Service.items.get(alias='electrocardiogram',
                                                 service_type__alias='psychiatric')
                WorkRecord.objects.create(provider=request.user, resident=resident, service_item=service_item,
                                          app_label='psychiatric', model_name='BodyExam',
                                          item_id=result.id, service_item_alias=service_item.alias)

            if AlanineAminotransferaseForm(submit_data).is_valid():
                service_item = Service.items.get(alias='alanine_aminotransferase',
                                                 service_type__alias='psychiatric')
                WorkRecord.objects.create(provider=request.user, resident=resident, service_item=service_item,
                                          app_label='psychiatric', model_name='BodyExam',
                                          item_id=result.id, service_item_alias=service_item.alias)

            if GlutamicOxalaceticTransaminaseForm(submit_data).is_valid():
                service_item = Service.items.get(alias='glutamic_oxalacetic_transaminase',
                                                 service_type__alias='psychiatric')
                WorkRecord.objects.create(provider=request.user, resident=resident, service_item=service_item,
                                          app_label='psychiatric', model_name='BodyExam',
                                          item_id=result.id, service_item_alias=service_item.alias)

    else:
        success = False
        message = u'没有提交任何数据结果'

    return JsonResponse({'success': success, 'message': message})
