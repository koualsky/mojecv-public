# Generated by Django 2.1 on 2020-07-27 20:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0047_auto_20200720_1442'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='signature',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
