from django.urls import path
from . import views

urlpatterns = [
    path('api/highscore/', views.TopHighscoreListCreate.as_view() ),
    path('api/highscore-all/', views.AllHighscoreListCreate.as_view() ),
]
