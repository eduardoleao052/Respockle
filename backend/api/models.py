from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    author_username = models.TextField(default='')
    likes = models.IntegerField(default=0)
    liked_by_user = models.ManyToManyField(User, related_name="liked_posts")

    def __str__(self):
        return self.title
    