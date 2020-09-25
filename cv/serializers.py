from rest_framework import serializers
from django.contrib.auth.models import User

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
from .models import Codes


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'profile',
        )


class Social_and_websitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Social_and_websites
        fields = '__all__'


class Employment_historySerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment_history
        fields = '__all__'


class Education_and_coursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education_and_courses
        fields = '__all__'


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = '__all__'


class LanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = '__all__'


class ReferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = References
        fields = '__all__'


class CustomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom
        fields = '__all__'


class RodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rodo
        fields = '__all__'


class CvSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)

    social_and_websites = Social_and_websitesSerializer(many=True, read_only=True)
    employment_history = Employment_historySerializer(many=True, read_only=True)
    education_and_courses = Education_and_coursesSerializer(many=True, read_only=True)
    skills = SkillsSerializer(many=True, read_only=True)
    languages = LanguagesSerializer(many=True, read_only=True)
    references = ReferencesSerializer(many=True, read_only=True)
    custom = CustomSerializer(many=True, read_only=True)
    rodo = RodoSerializer(many=True, read_only=True)

    class Meta:
        model = Cv
        fields = (
            'id',
            'author',
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
            'template',
            'date_created',
            'language',
            'social_and_websites',
            'employment_history',
            'education_and_courses',
            'skills',
            'languages',
            'references',
            'custom',
            'rodo',
        )


class CodesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Codes
        fields = '__all__'