'''
Serializers convertem dados retornados pelos Models do Django
em JSON que pode ser consumido pelo frontend por meio de chamadas de API.
'''

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Community, Comment, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password" : {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "content", "created_at", "author", "author_username", "community_profile_picture", "likes", "reports", "community"]
        extra_kwargs = {"author" : {"read_only": True}, "likes" : {"read_only": True}, "reports" : {"read_only": True}}

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "content", "created_at", "author", "author_username", "author_profile_picture", "likes", "post"]
        extra_kwargs = {"author" : {"read_only": True}, "likes" : {"read_only": True}}

class CommunitySerializer(serializers.ModelSerializer):
    community_picture = serializers.ImageField(required=False)
    class Meta:
        model = Community
        fields = ["id", "name", "description", "members", "author", "author_username", "community_picture"]
        extra_kwargs = {"author" : {"read_only": True}}

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "bio", "email", "profile_picture", "is_health_professional", "user_id"]
        extra_kwargs = {"user_id" : {"read_only": True}}