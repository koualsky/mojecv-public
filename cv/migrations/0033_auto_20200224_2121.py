# Generated by Django 2.1 on 2020-02-24 21:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0032_auto_20200224_2116'),
    ]

    operations = [
        migrations.AlterField(
            model_name='education_and_courses',
            name='end_date',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='education_and_courses',
            name='start_date',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='employment_history',
            name='end_date',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='employment_history',
            name='start_date',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
