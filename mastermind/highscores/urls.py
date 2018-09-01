from django.urls import path
from . import views

urlpatterns = [
    path('api/highscore/', views.HighscoreListCreate.as_view() ),
]
