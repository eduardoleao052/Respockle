from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, PostSerializer, CommunitySerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Post, Community, Comment
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view

# <-------- POSTS --------->

@api_view(['GET'])
def posts_list(request):
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def posts_by_likes_list(request):
    posts = Post.objects.all().order_by('-likes')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def saved_posts(request):
    posts = Post.objects.filter(saved_by_user = request.user.id)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def saved_posts_by_likes(request):
    posts = Post.objects.filter(saved_by_user = request.user.id).order_by('-likes')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def post_comments(request, pk):
    comments = Comment.objects.filter(post=pk).order_by('-created_at')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    serializer = PostSerializer(post)
    return Response(serializer.data)


@api_view(['GET'])
def current_user(request):
    users = User.objects.get(id = request.user.id)
    serializer = UserSerializer(users)
    return Response(serializer.data)

@api_view(['POST'])
def post_create(request):
    data=request.data
    data["author_username"] = request.user.username
    serializer = PostSerializer(data=data)
    if serializer.is_valid():
        serializer.save(author=request.user)
    return Response(serializer.data)

@api_view(['POST'])
def post_create_comment(request, pk):
    data=request.data
    data["author_username"] = request.user.username
    data["post"] = pk
    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        serializer.save(author=request.user)
    return Response(serializer.data)

@api_view(['GET'])
def post_detail(request, pk):
	post = Post.objects.get(id=pk)
	serializer = PostSerializer(post, many=False)
	return Response(serializer.data)

@api_view(['POST'])
def post_update(request, pk):
	task = Post.objects.get(id=pk)
	serializer = PostSerializer(instance=task, data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)

@api_view(['DELETE'])
def post_delete(request, pk):
	task = Post.objects.get(id=pk)
	task.delete()

	return Response('Item succsesfully deleted!')

@api_view(['POST'])
def post_like(request, pk):
    post = Post.objects.get(id=pk)
    user = User.objects.get(id = request.user.id)
    if user.liked_posts.contains(post):
        post.likes -= 1
        user.liked_posts.remove(post)
    else:
        post.likes += 1
        user.liked_posts.add(post)
    serializer = PostSerializer(instance=post, data={'content': post.content, 'title': post.title, 'community': post.community.id})
    if serializer.is_valid():
        serializer.save(author=post.author)
    return Response(serializer.data)

@api_view(['POST'])
def post_save(request, pk):
    post = Post.objects.get(id=pk)
    user = User.objects.get(id = request.user.id)
    if user.saved_posts.contains(post):
        user.saved_posts.remove(post)
    else:
        user.saved_posts.add(post)
    serializer = PostSerializer(instance=post, data={'content': post.content, 'title': post.title, 'community': post.community.id})
    if serializer.is_valid():
        serializer.save(author=post.author)
    return Response(serializer.data)

@api_view(['POST'])
def post_comment_like(request, pk):
    comment = Comment.objects.get(id=pk)
    user = User.objects.get(id = request.user.id)
    if user.liked_comments.contains(comment):
        comment.likes -= 1
        user.liked_comments.remove(comment)
    else:
        comment.likes += 1
        user.liked_comments.add(comment)
    serializer = CommentSerializer(instance=comment, data={'content': comment.content, 'post': comment.post.id})
    if serializer.is_valid():
        serializer.save(author=comment.author)
    return Response(serializer.data)

@api_view(['GET'])
def posts_liked_by_user(request):
    posts = Post.objects.filter(liked_by_user = request.user.id)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def posts_saved_by_user(request):
    posts = Post.objects.filter(saved_by_user = request.user.id)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def comments_liked_by_user(request, pk):
    comments = Comment.objects.filter(liked_by_user = request.user.id, post=pk)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

# <--------- COMMUNITIES --------->

@api_view(['GET'])
def communities_list(request):
    communities = Community.objects.all()
    serializer = CommunitySerializer(communities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def user_communities(request):
    communities = Community.objects.filter(members=request.user.id)
    serializer = CommunitySerializer(communities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def community(request, pk):
    posts = Post.objects.filter(community=pk)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def community_by_likes(request, pk):
    posts = Post.objects.filter(community=pk).order_by('-likes')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def users_in_community(request, pk):
    users = User.objects.filter(communities = pk)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def handle_membership(request, pk):
    community = Community.objects.get(id=pk)
    user = User.objects.get(id = request.user.id)
    if user.communities.contains(community):
        user.communities.remove(community)
    else:
        user.communities.add(community)
    serializer = CommunitySerializer(instance=community, data={'name': community.name, 'description': community.description})
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

