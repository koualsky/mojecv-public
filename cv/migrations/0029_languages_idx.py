# Generated by Django 2.1 on 2020-02-18 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0028_auto_20200214_1930'),
    ]

    operations = [
        migrations.AddField(
            model_name='languages',
            name='idx',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
