# Generated by Django 2.1 on 2020-07-20 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0046_codes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='codes',
            name='counter',
            field=models.IntegerField(default=0),
        ),
    ]
