from django.urls import path
from . import views

urlpatterns = [
    path('notes/', views.notes_list, name="note-list"),
    path('notes/detail/', views.note_detail, name="note-detail"),
    path('notes/like/<int:pk>/', views.note_like, name="note-like"),
    path('notes/create/', views.note_create, name="note-create"),
    path('notes/delete/<int:pk>/', views.note_delete, name="note-delete"),
    path('notes/update/', views.note_update, name="note-update"),
    path('notes/user/', views.current_user, name="current-user"),
    path('notes/notes_liked_by_user/', views.notes_liked_by_user, name="notes-liked-by-user")
]
