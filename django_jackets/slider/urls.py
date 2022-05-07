from django.urls import path, include

from slider import views

urlpatterns = [
    path('latest-slides/', views.LatestSlideList.as_view()),
]