from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.posts_list, name="post-list"),
    path('posts/comments/<int:pk>/', views.post_comments, name="post-comments"),
    path('posts/detail/<int:pk>/', views.post_detail, name="post-detail"),
    path('posts/like/<int:pk>/', views.post_like, name="post-like"),
    path('posts/comments/like/<int:pk>/', views.post_comment_like, name="post-comment-like"),
    path('posts/create/', views.post_create, name="post-create"),
    path('posts/comments/create/<int:pk>/', views.post_create_comment, name="post-create-comment"),
    path('posts/delete/<int:pk>/', views.post_delete, name="post-delete"),
    path('posts/update/', views.post_update, name="post-update"),
    path('posts/user/', views.current_user, name="current-user"),
    path('posts/posts_liked_by_user/', views.posts_liked_by_user, name="posts-liked-by-user"),
    path('posts/comments_liked_by_user/<int:pk>', views.comments_liked_by_user, name="comments-liked-by-user"),
    path('communities/', views.communities_list, name="communities-list"),
    path('community/<int:pk>/', views.community, name="community"),
    path('community/users_in_community/<int:pk>', views.users_in_community, name="users-in-community"),
    path('community/handle_membership/<int:pk>/', views.handle_membership, name="handle-membership")
    
]
