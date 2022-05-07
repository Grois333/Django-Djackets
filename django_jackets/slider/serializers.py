from rest_framework import serializers

from .models import Slide

class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = (
            "id",
            "title",
            "description",
            "get_absolute_url",
            "get_slide_image",
        )