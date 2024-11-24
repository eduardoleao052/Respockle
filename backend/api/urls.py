from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.posts_list, name="post-list"),
    path('posts/detail/', views.post_detail, name="post-detail"),
    path('posts/like/<int:pk>/', views.post_like, name="post-like"),
    path('posts/create/', views.post_create, name="post-create"),
    path('posts/delete/<int:pk>/', views.post_delete, name="post-delete"),
    path('posts/update/', views.post_update, name="post-update"),
    path('posts/user/', views.current_user, name="current-user"),
    path('posts/posts_liked_by_user/', views.posts_liked_by_user, name="posts-liked-by-user"),
    path('communities/', views.communities_list, name="communities-list"),
]
