# Generated by Django 2.1 on 2020-07-14 18:46

from django.db import migrations, models
from django.utils import timezone


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0044_cv_cv_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='premiums',
            field=models.DateTimeField(default=timezone.now),
        ),
    ]
