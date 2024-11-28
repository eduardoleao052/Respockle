# Generated by Django 5.1.2 on 2024-11-28 18:20

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_remove_community_memberscount_community_author_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='reported_by_user',
            field=models.ManyToManyField(related_name='reported_posts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='reports',
            field=models.IntegerField(default=0),
        ),
    ]