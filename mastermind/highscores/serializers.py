from rest_framework import serializers
from .models import Highscore

class HighscoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highscore
        fields = '__all__'
