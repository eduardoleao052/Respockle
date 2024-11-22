from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def notes_list(request):
    notes = Note.objects.all()
    serializer = NoteSerializer(notes, many=True)
    users = User.objects.filter(id = request.user.id)
    serializer2 = UserSerializer(users, many=True)
    return Response(serializer.data + serializer2.data)

# Create your views here.
@api_view(['GET'])
def current_user(request):
    notes = Note.objects.all()
    serializer = NoteSerializer(notes, many=True)
    users = User.objects.filter(id = request.user.id)
    serializer2 = UserSerializer(users, many=True)
    return Response(serializer.data + serializer2.data)

# Create your views here.
@api_view(['POST'])
def note_create(request):
    serializer = NoteSerializer(data=request.data)
    print(">>>>>>", serializer)
    if serializer.is_valid():
        serializer.save(author=request.user)
    return Response(serializer.data)

@api_view(['GET'])
def note_detail(request, pk):
	note = Note.objects.get(id=pk)
	serializer = NoteSerializer(note, many=False)
	return Response(serializer.data)

@api_view(['POST'])
def note_update(request, pk):
	task = Note.objects.get(id=pk)
	serializer = NoteSerializer(instance=task, data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)


@api_view(['DELETE'])
def note_delete(request, pk):
	task = Note.objects.get(id=pk)
	task.delete()

	return Response('Item succsesfully deleted!')

# Create your views here.
@api_view(['POST'])
def note_like(request, pk):
    note = Note.objects.get(id=pk)
    note.likes += 1
    serializer = NoteSerializer(instance=note, data={'content': note.content, 'title': note.title})
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save(author=note.author)
    return Response(serializer.data)

# DEPRECATED:
class CreateNoteView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Note.objects.all()
        return queryset
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class DeleteNoteView(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Note.objects.filter(author = user)
        return queryset


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
