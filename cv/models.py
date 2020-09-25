from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .validators import file_size_validator
from .storage import OverwriteStorage
from django.utils import timezone


class Profile(models.Model):
    name = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', unique=True)
    premiums = models.DateTimeField(default=timezone.now)
    signature = models.CharField(max_length=200, blank=True)

    def __repr__(self):
        return self.name

    def __str__(self):
        return str(self.name)

    def greater_than_today(self):
        if self.premiums >= timezone.now():
            return True
        else:
            return False

    def short_date(self):
        return str(self.premiums.strftime("%d %B %Y (%H:%M)"))

class Cv(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, blank=True)
    job_title = models.CharField(max_length=200, blank=True)
    photo = models.ImageField(upload_to='images/', blank=True, validators=[file_size_validator])
    cv_photo = models.ImageField(upload_to='images/cv_photo/', blank=True, validators=[file_size_validator])
    first_name = models.CharField(max_length=200, blank=True)
    last_name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(max_length=200, blank=True)
    phone = models.CharField(max_length=200, blank=True)
    country = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=200, blank=True)
    street_and_number = models.CharField(max_length=200, blank=True)
    postal_code = models.CharField(max_length=200, blank=True)
    place_of_birth = models.CharField(max_length=200, blank=True)
    date_of_birth = models.CharField(max_length=200, blank=True)
    professional_summary = models.TextField(blank=True)
    hobbies = models.CharField(max_length=200, blank=True)
    template = models.IntegerField(default=1, blank=True)
    date_created = models.DateTimeField(max_length=200, blank=True, default=timezone.now)
    language = models.CharField(max_length=200, blank=True, default="pl")

    def __str__(self):
        return self.title


class Social_and_websites(models.Model):
    cv = models.ForeignKey(Cv, related_name='social_and_websites', on_delete=models.CASCADE)
    link = models.CharField(max_length=400, blank=True)
    idx = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return str(self.pk)


class Employment_history(models.Model):
    cv = models.ForeignKey(Cv, related_name='employment_history', on_delete=models.CASCADE)
    job_title = models.CharField(max_length=200, blank=True)
    employer = models.CharField(max_length=200, blank=True)
    start_date = models.CharField(max_length=200, blank=True, null=True)
    end_date = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    idx = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.employer


class Education_and_courses(models.Model):
    cv = models.ForeignKey(Cv, related_name='education_and_courses', on_delete=models.CASCADE)
    school = models.CharField(max_length=200, blank=True)
    degree = models.CharField(max_length=200, blank=True)
    start_date = models.CharField(max_length=200, blank=True, null=True)
    end_date = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    idx = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.school + ' - ' + self.degree


class Skills(models.Model):
    cv = models.ForeignKey(Cv, related_name='skills', on_delete=models.CASCADE)
    skill = models.CharField(max_length=200, blank=True)
    level = models.PositiveSmallIntegerField(blank=True, null=True)
    idx = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.skill


class Languages(models.Model):
    cv = models.ForeignKey(Cv, related_name='languages', on_delete=models.CASCADE)
    language = models.CharField(max_length=200, blank=True)
    level = models.PositiveSmallIntegerField(blank=True, null=True)
    idx = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.language


class References(models.Model):
    cv = models.ForeignKey(Cv, related_name='references', on_delete=models.CASCADE)
    referents_fullname = models.CharField(max_length=200, blank=True)
    company = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=200, blank=True)
    email = models.EmailField(max_length=200, blank=True)
    idx = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.referents_fullname


class Custom(models.Model):
    cv = models.ForeignKey(Cv, related_name='custom', on_delete=models.CASCADE)
    activity = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    start_date = models.CharField(max_length=200, blank=True, null=True)
    end_date = models.CharField(max_length=200, blank=True, null=True)
    idx = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.activity


class Rodo(models.Model):
    cv = models.ForeignKey(Cv, related_name='rodo', on_delete=models.CASCADE)
    rodo = models.CharField(max_length=500, blank=True)
    idx = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.rodo


class Codes(models.Model):
    name = models.CharField(max_length=200, blank=True)
    start = models.DateTimeField(default=timezone.now)
    end = models.DateTimeField(default=timezone.now)
    counter = models.IntegerField(default=0)

    def __str__(self):
        return self.name