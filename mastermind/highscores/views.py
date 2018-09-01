from .models import Highscore
from .serializers import HighscoreSerializer
from rest_framework import generics

class HighscoreListCreate(generics.ListCreateAPIView):
    queryset = Highscore.objects.all()
    serializer_class = HighscoreSerializer
