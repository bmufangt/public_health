# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url
from ehr import views
from .preview import *
from .forms import *

urlpatterns = patterns('',
    url(r'^$', views.family_relation, name='family_relation'),
    #url(r'^vaccine_card/', VaccineCardFormPreview(VaccineCardForm), name='vaccine_card'),
    url(r'^member/add_child/$', views.member_add_child, name='member_add_child'),
    url(r'^member/add_adult/$', views.member_add_adult, name='member_add_adult'),
    url(r'^member/add__selected_adult/$', views.member_add_selected_adult, name='member_add_selected_adult'),
    url(r'^member/del/$', views.member_del, name='member_del'),
    #url(r'^personal_info/(\d+)/$', views.resident_health_file, name='personal_info'),
    url(r'^personal_info/(?P<resident_id>\d+)/$', PersonalInfoFormPreview(PersonalInfoForm), name='personal_info'),
    url(r'^personal_info_review/(?P<resident_id>\d+)/$', views.personal_info_review, name='personal_info_review'),
    url(r'^psychiatric_info/(?P<resident_id>\d+)/$', PsychiatricInfoFormPreview(PsychiatricInfoForm), name='psychiatirc_info'),
    url(r'^psychiatric_info_review/(?P<resident_id>\d+)/$', views.psychiatric_info_review, name='psychiatric_info_review'),
    url(r'^health_file/$', views.health_file, name='health_file'),
    url(r'^family_list/$', views.family_list, name='family_list'),
    url(r'^child_add_new/$', views.child_add_new, name='child_add_new'),
    url(r'^family_add_adult/$', views.family_add_adult, name='family_add_adult'),
    url(r'^family_add_adult_query/$', views.family_add_adult_query, name='family_add_adult_query'),
    url(r'^family_add_adult/$', views.family_add_adult, name='family_add_adult'),
    url(r'^family_member_rm/$', views.family_member_rm, name='family_member_rm'),
    url(r'^personal_info_submit/$', views.personal_info_submit, name='personal_info_submit'),
    url(r'^personal_info_table_new/$', views.personal_info_table_new, name='personal_info_table_new'),
    url(r'^personal_info_review_new/$', views.personal_info_review_new, name='personal_info_review_new'),

    url(r'^record_list/$', views.record_list, name='record_list'),
    url(r'^record_detail_review/$', views.record_detail_review, name='record_detail_review'),

    url(r'^ehr_page/$', views.ehr_page, name='ehr_page'),
    url(r'^change_resident/$', views.change_resident, name='change_resident'),

)
