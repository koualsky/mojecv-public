# Generated by Django 2.1 on 2019-11-26 21:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0009_auto_20191124_2025'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='social_and_websites',
            name='cv',
        ),
    ]
