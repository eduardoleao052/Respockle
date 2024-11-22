'''
Serializers convertem dados retornados pelos Models do Django
em JSON que pode ser consumido pelo frontend por meio de chamadas de API.
'''

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password" : {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author", "author_username", "likes"]
        extra_kwargs = {"author" : {"read_only": True}, "likes" : {"read_only": True}}
