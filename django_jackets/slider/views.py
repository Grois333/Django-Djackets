from django.shortcuts import render

from django.db.models import Q
from django.http import Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Slide

from .serializers import SlideSerializer

# Create your views here.

#Slide Item
class LatestSlideList(APIView):
    def get(self, request, format=None):
        slides = Slide.objects.all()[0:4]
        serializer = SlideSerializer(slides, many=True)
        return Response(serializer.data)