# Generated by Django 2.1 on 2020-01-01 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0016_social_and_websites_idx'),
    ]

    operations = [
        migrations.AlterField(
            model_name='social_and_websites',
            name='idx',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]