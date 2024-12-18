# Generated by Django 5.1.2 on 2024-11-28 19:28

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_post_reported_by_user_post_reports'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='author_profile_picture',
            field=models.ImageField(default='', upload_to=''),
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_health_professional', models.BooleanField(default=False)),
                ('email', models.CharField(default='', max_length=100)),
                ('bio', models.TextField()),
                ('profile_picture', models.ImageField(default='../assets/default_profile_picture.png', upload_to='')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
