# Generated by Django 2.1 on 2019-11-24 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0006_auto_20191120_1413'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cv',
            name='title',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
