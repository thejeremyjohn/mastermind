from django.db import models

class Highscore(models.Model):
    name = models.CharField(max_length=15)
    score = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} --> {}'.format(self.name, self.score)
