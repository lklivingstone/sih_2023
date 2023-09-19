from django.contrib import admin
from django.urls import path


from .views import (
    sample_view,
    test_view
)

urlpatterns = [
    path('sample/', sample_view, name='sample'),
    path('test/', test_view, name='sample')
]