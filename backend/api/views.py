from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, PostSerializer, CommunitySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Post, Community
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view

# <-------- POSTS --------->

@api_view(['GET'])
def posts_list(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    serializer = PostSerializer(post)
    return Response(serializer.data)


@api_view(['GET'])
def current_user(request):
    users = User.objects.filter(id = request.user.id)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def post_create(request):
    data=request.data
    data["author_username"] = request.user.username
    serializer = PostSerializer(data=data)
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

@api_view(['GET'])
def posts_liked_by_user(request):
    posts = Post.objects.filter(liked_by_user = request.user.id)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

# <--------- COMMUNITIES --------->

@api_view(['GET'])
def communities_list(request):
    communities = Community.objects.all()
    serializer = CommunitySerializer(communities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def community(request, pk):
    posts = Post.objects.filter(community=pk)
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
        #community.members -= 1
        user.communities.remove(community)
    else:
        #community.members += 1
        user.communities.add(community)
    serializer = CommunitySerializer(instance=community, data={'name': community.name, 'description': community.description})
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

