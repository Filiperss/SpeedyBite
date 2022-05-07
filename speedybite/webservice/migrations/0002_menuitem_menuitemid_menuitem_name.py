# Generated by Django 4.0.4 on 2022-05-07 20:26

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('webservice', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='menuitem',
            name='MenuItemId',
            field=models.IntegerField(),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='menuitem',
            name='name',
            field=models.CharField(max_length=250),
            preserve_default=False,
        ),
    ]
