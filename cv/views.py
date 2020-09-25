from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView, ListView
from .forms import UserCreationForm
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from django.contrib.auth.models import User
from .models import Profile
from .models import Cv
from .models import Codes
from .forms import CvForm
from django.core.mail import send_mail


def main(request):
    return render(request, 'cv/main.html')


class List(ListView):
    template_name = 'cv/list.html'
    context_object_name = 'cv_list'

    def get_queryset(self):
        user = self.request.user
        if str(user) is not "AnonymousUser":
            return Cv.objects.filter(author_id=user.id).order_by('date_created')
        else:
            return None


class Create(CreateView):
    template_name = 'cv/edit.html'
    model = Cv
    form_class = CvForm
    success_url = reverse_lazy('list')

    def get(self, request):
        form = self.form_class(request.POST, request.FILES)
        form.instance.author = self.request.user
        form.save()
        return redirect('/app/' + str(form.instance.id))


class Update(UpdateView):
    template_name = 'cv/edit.html'
    model = Cv
    form_class = CvForm
    success_url = reverse_lazy('list')


def delete(request, pk):
    cv = get_object_or_404(Cv, pk=pk)
    cv.photo.delete()
    cv.delete()
    return redirect('list')


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            Profile.objects.create(name=user)
            send_mail(
                'Witamy na cvbox!',
                f'Właśnie założyłeś konto na cvbox.pl. Twoja nazwa użytkownika to: {username}',
                'biurocvbox@gmail.com',
                [f'{email}'],
                fail_silently=False,
            )
            return redirect('list')
    else:
        form = UserCreationForm()

    return render(request, 'registration/register.html', {'form': form, })


def regulamin(request):
    return render(request, 'cv/regulamin.html', {})

def privacy(request):
    return render(request, 'cv/privacy.html', {})

def kontakt(request):
    return render(request, 'cv/kontakt.html', {})


def pricing(request):
    context = [
        {
            'id': 1,
            'url': 'https://ssl.dotpay.pl/t2/?chk=9405495e653e6219f1830a348e05a771deba3b84e2e2469b86fc3c31743d74cb&pid=9av33gfvy7lf5mm8yl2lwv74kz5vuov1',
            'title': 'Beginner',
            'price': 7,
            'days': 7,
            'arguments': [
                'Nielimitowana ilość dokumentów CV',
                'Nielimitowane pobieranie PDF',
                'Nielimitowany dostęp do wszystkich szablonów',
            ]
        },
        {
            'id': 2,
            'url': 'https://ssl.dotpay.pl/t2/?chk=2c8aa8b2362b0fe4c68c40eaa20e70bf20c711f5ab10aaa9899bcdd446431d81&pid=y81ir6a188bpos1hsy9w63l4u5x9brhe',
            'title': 'Standard',
            'price': 19,
            'days': 30,
            'arguments': [
                'Nielimitowana ilość dokumentów CV',
                'Nielimitowane pobieranie PDF',
                'Nielimitowany dostęp do wszystkich szablonów',
            ]
        },
        {
            'id': 3,
            'url': 'https://ssl.dotpay.pl/t2/?chk=c4e7fd6b35a42a60c4cc8319f89243225df2fc303338cbeedf0d8be3f3a04ffc&pid=y2myx7dh8i2rw866khikbvhcyeoloolt',
            'title': 'Professional',
            'price': 99,
            'days': 365,
            'arguments': [
                'Nielimitowana ilość dokumentów CV',
                'Nielimitowane pobieranie PDF',
                'Nielimitowany dostęp do wszystkich szablonów',
            ]
        },
    ]
    return render(request, 'cv/pricing.html', {'context': context})


def add_time(profile, days):
    days_quantity_to_add = timezone.timedelta(days=days)
    if profile.premiums <= timezone.now():
        profile.premiums = timezone.now() + days_quantity_to_add
    else:
        profile.premiums = profile.premiums + days_quantity_to_add
    profile.save()


@api_view(['GET', 'POST'])
def payment_response(request):
    if request.method == 'POST':

        amount = int(float(request.POST.get('operation_amount')))
        signature = str(request.POST.get('signature'))
        email = request.POST.get('email')
        user = get_object_or_404(User, email=email)
        user_profile = get_object_or_404(Profile, name=user)

        if user_profile.signature != signature:
            user_profile.signature = signature
            user_profile.save()

            if amount in [3, 7]:
                add_time(user_profile, 7)

            if amount in [9, 19]:
                add_time(user_profile, 30)

            if amount in [59, 99]:
                add_time(user_profile, 365)

    return Response('OKO!')