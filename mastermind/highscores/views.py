from .models import Highscore
from .serializers import HighscoreSerializer
from rest_framework import generics

class AllHighscoreListCreate(generics.ListCreateAPIView):
    queryset = Highscore.objects.all()
    serializer_class = HighscoreSerializer

class TopHighscoreListCreate(generics.ListCreateAPIView):
    queryset = Highscore.objects.order_by('-score', 'created_at')[:10]
    serializer_class = HighscoreSerializer
