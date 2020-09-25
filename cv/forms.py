from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

from .models import Profile
from .models import Cv
from .models import Social_and_websites
from .models import Employment_history
from .models import Education_and_courses
from .models import Skills
from .models import Languages
from .models import References
from .models import Custom
from .models import Rodo


class UserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2", )

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('premiums', )


class CvForm(forms.ModelForm):
    class Meta:
        model = Cv
        fields = (
            'title',
            'job_title',
            'photo',
            'cv_photo',
            'first_name',
            'last_name',
            'email',
            'phone',
            'country',
            'city',
            'street_and_number',
            'postal_code',
            'place_of_birth',
            'date_of_birth',
            'professional_summary',
            'hobbies',
        )


class Social_and_websitesForm(forms.ModelForm):
    class Meta:
        model = Social_and_websites
        fields = ('link', )


class Employment_historyForm(forms.ModelForm):
    class Meta:
        model = Employment_history
        fields = (
            'job_title',
            'employer',
            'start_date',
            'end_date',
            'city',
            'description',
        )


class Education_and_coursesForm(forms.ModelForm):
    class Meta:
        model = Education_and_courses
        fields = (
            'school',
            'degree',
            'start_date',
            'end_date',
            'city',
            'description',
        )


class SkillsForm(forms.ModelForm):
    class Meta:
        model = Skills
        fields = ('skill', 'level', )


class LanguagesForm(forms.ModelForm):
    class Meta:
        model = Languages
        fields = ('language', 'level', )


class ReferencesForm(forms.ModelForm):
    class Meta:
        model = References
        fields = ('referents_fullname', 'company', 'phone', 'email', )


class CustomForm(forms.ModelForm):
    class Meta:
        model = Custom
        fields = ('activity', 'city', 'description', 'start_date', 'end_date', )


class RodoForm(forms.ModelForm):
    class Meta:
        model = Rodo
        fields = ('rodo', )
