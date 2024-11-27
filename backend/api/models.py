from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Community(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='communities_created_by_user', default=1)
    author_username = models.TextField(default='')
    members = models.ManyToManyField(User, related_name="communities")

    def __str__(self):
        return self.name
    
class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    author_username = models.TextField(default='')
    likes = models.IntegerField(default=0)
    liked_by_user = models.ManyToManyField(User, related_name="liked_posts")
    community = models.ForeignKey(Community, related_name="posts_in_community", on_delete=models.CASCADE)
    saved_by_user = models.ManyToManyField(User, related_name="saved_posts")

    def __str__(self):
        return self.title
    
class Comment(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    author_username = models.TextField(default='')
    likes = models.IntegerField(default=0)
    liked_by_user = models.ManyToManyField(User, related_name="liked_comments")
    post = models.ForeignKey(Post, related_name="comments_in_post", on_delete=models.CASCADE)

    def __str__(self):
        return self.post.title + ' comment'
    