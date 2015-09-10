from django import template

from management.models import Clinic

register = template.Library()


@register.inclusion_tag("management/town_clinic_select.html")
def town_clinic_select():
    town_clinics = Clinic.objects.filter(level=2)
    return {'town_clinics': town_clinics}