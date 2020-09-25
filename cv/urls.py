from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views
from . import views

from rest_framework import routers
from .api import UserViewSet
from .api import ProfileViewSet
from .api import CvViewSet
from .api import Social_and_websitesViewSet
from .api import Employment_historyViewSet
from .api import Education_and_coursesViewSet
from .api import SkillsViewSet
from .api import LanguagesViewSet
from .api import ReferencesViewSet
from .api import CustomViewSet
from .api import RodoViewSet
from .api import CodesViewSet

router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'profile', ProfileViewSet)
router.register(r'cv', CvViewSet, basename='cv-detail')
router.register(r'social_and_websites', Social_and_websitesViewSet)
router.register(r'employment_history', Employment_historyViewSet)
router.register(r'education_and_courses', Education_and_coursesViewSet)
router.register(r'skills', SkillsViewSet)
router.register(r'languages', LanguagesViewSet)
router.register(r'references', ReferencesViewSet)
router.register(r'custom', CustomViewSet)
router.register(r'rodo', RodoViewSet)
router.register(r'codes', CodesViewSet)

urlpatterns = [

    # API
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path('app/', TemplateView.as_view(template_name='index.html')),

    # WWW
    path('main/', views.main, name='main'),
    path('', views.List.as_view(), name='list'),
    path('create/', views.Create.as_view(), name='create'),
    path('update/<int:pk>', views.Update.as_view(), name='update'),
    path('delete/<int:pk>', views.delete, name='delete'),
    path('regulamin/', views.regulamin, name='regulamin'),
    path('privacy/', views.privacy, name='privacy'),
    path('kontakt/', views.kontakt, name='kontakt'),
    path('pricing/', views.pricing, name='pricing'),
    path('payment_response/', views.payment_response, name='payment_response'),

    # Authentication
    path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/login/', auth_views.LoginView.as_view(template_name='cv/login.html'), name='login'),
    path('accounts/register/', views.register, name='register'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)