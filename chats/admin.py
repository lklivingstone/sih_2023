from django.contrib import admin

# Register your models here.
from .models import Chat, Prompt

admin.site.register(Chat)
admin.site.register(Prompt)