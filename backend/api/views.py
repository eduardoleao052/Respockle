from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, PostSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Post
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def posts_list(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

# Create your views here.
@api_view(['GET'])
def current_user(request):
    users = User.objects.filter(id = request.user.id)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# Create your views here.
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

# Create your views here.
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
    print("AAAAAAA",user)
    serializer = PostSerializer(instance=post, data={'content': post.content, 'title': post.title})
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save(author=post.author)
    return Response(serializer.data)

# Create your views here.
@api_view(['GET'])
def posts_liked_by_user(request):
    posts = Post.objects.filter(liked_by_user = request.user.id)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)









# DEPRECATED:
class CreatePostView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class DeletePostView(generics.DestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Post.objects.filter(author = user)
        return queryset


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

