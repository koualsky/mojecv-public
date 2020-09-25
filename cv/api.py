from rest_framework import viewsets
from django.contrib.auth.models import User
from django.utils import timezone

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

from .serializers import UserSerializer
from .serializers import ProfileSerializer
from .serializers import CvSerializer
from .serializers import Social_and_websitesSerializer
from .serializers import Employment_historySerializer
from .serializers import Education_and_coursesSerializer
from .serializers import SkillsSerializer
from .serializers import LanguagesSerializer
from .serializers import ReferencesSerializer
from .serializers import CustomSerializer
from .serializers import RodoSerializer
from .serializers import CodesSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class CvViewSet(viewsets.ModelViewSet):
    serializer_class = CvSerializer
    model = Cv

    def get_queryset(self):
        user = self.request.user
        print('z api: ', user)
        if str(user) is not "AnonymousUser":
            return Cv.objects.filter(author_id=user.id)
        else:
            return None


class Social_and_websitesViewSet(viewsets.ModelViewSet):
    queryset = Social_and_websites.objects.all()
    serializer_class = Social_and_websitesSerializer


class Employment_historyViewSet(viewsets.ModelViewSet):
    queryset = Employment_history.objects.all()
    serializer_class = Employment_historySerializer


class Education_and_coursesViewSet(viewsets.ModelViewSet):
    queryset = Education_and_courses.objects.all()
    serializer_class = Education_and_coursesSerializer


class SkillsViewSet(viewsets.ModelViewSet):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer


class LanguagesViewSet(viewsets.ModelViewSet):
    queryset = Languages.objects.all()
    serializer_class = LanguagesSerializer


class ReferencesViewSet(viewsets.ModelViewSet):
    queryset = References.objects.all()
    serializer_class = ReferencesSerializer


class CustomViewSet(viewsets.ModelViewSet):
    queryset = Custom.objects.all()
    serializer_class = CustomSerializer


class RodoViewSet(viewsets.ModelViewSet):
    queryset = Rodo.objects.all()
    serializer_class = RodoSerializer


class CodesViewSet(viewsets.ModelViewSet):
    now = timezone.now()
    queryset = Codes.objects.filter(start__lte=now, end__gte=now)
    serializer_class = CodesSerializer
