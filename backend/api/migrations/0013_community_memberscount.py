# Generated by Django 5.1.2 on 2024-11-26 21:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_post_saved_by_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='community',
            name='membersCount',
            field=models.IntegerField(default=0),
        ),
    ]
