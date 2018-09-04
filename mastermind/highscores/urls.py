from django.urls import path
from . import views

urlpatterns = [
    path('api/highscore/', views.TopHighscoreListCreate.as_view() ),
]
