from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.posts_list, name="post-list"),
    path('posts_by_likes/', views.posts_by_likes_list, name="post-by-likes-list"),
    path('posts/saved_posts/', views.saved_posts, name="post-list"),
    path('posts/saved_posts_by_likes/', views.saved_posts_by_likes, name="user-posts-by-likes-list"),
    path('posts/user_posts/<int:pk>/', views.user_posts, name="post-list"),
    path('posts/user_posts_by_likes/<int:pk>/', views.user_posts_by_likes, name="user-posts-by-likes-list"),
    path('posts/comments/<int:pk>/', views.post_comments, name="post-comments"),
    path('posts/detail/<int:pk>/', views.post_detail, name="post-detail"),
    path('posts/like/<int:pk>/', views.post_like, name="post-like"),
    path('posts/report/<int:pk>/', views.post_report, name="post-report"),
    path('posts/save/<int:pk>/', views.post_save, name="post-save"),
    path('posts/comments/like/<int:pk>/', views.post_comment_like, name="post-comment-like"),
    path('posts/create/', views.post_create, name="post-create"),
    path('posts/add_warning/<int:pk>/', views.post_add_warning, name="post-add_warning"),
    path('posts/comments/create/<int:pk>/', views.post_create_comment, name="post-create-comment"),
    path('posts/delete/<int:pk>/', views.post_delete, name="post-delete"),
    path('posts/update/', views.post_update, name="post-update"),
    path('posts/user/', views.current_user, name="current-user"),
    path('posts/user/username/<int:pk>/', views.username, name="username"),
    path('posts/posts_liked_by_user/', views.posts_liked_by_user, name="posts-liked-by-user"),
    path('posts/posts_reported_by_user/', views.posts_reported_by_user, name="posts-reported-by-user"),
    path('posts/posts_saved_by_user/', views.posts_saved_by_user, name="posts-saved-by-user"),
    path('posts/comments_liked_by_user/<int:pk>', views.comments_liked_by_user, name="comments-liked-by-user"),
    path('communities/', views.communities_list, name="communities-list"),
    path('community/<int:pk>/', views.community, name="community"),
    path('community/create/', views.community_create, name="community-create"),
    path('community/delete/<int:pk>/', views.community_delete, name="community-create"),
    path('community_by_like/<int:pk>/', views.community_by_likes, name="community-by-likes"),
    path('community_by_report/<int:pk>/', views.community_by_reports, name="community-by-reports"),
    path('community/users_in_community/<int:pk>/', views.users_in_community, name="users-in-community"),
    path('community/handle_membership/<int:pk>/', views.handle_membership, name="handle-membership"),
    path('user/communities/', views.user_communities, name="user-communities"),
    path('user/profile/<int:pk>/', views.user_profile, name="user-profile"),
    path('user/profile/update/<int:pk>/', views.profile_update, name="profile-update")

]
