from django.contrib import admin
from django.urls import path


from .views import (
    sample_view,
    test_view,
    upload_document
)

urlpatterns = [
    path('sample/', sample_view, name='sample'),
    path('test/', test_view, name='sample'),
    path('upload-document/', upload_document, name='Upload Document'),
]