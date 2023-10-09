from django.db import models
from django.contrib.auth import get_user_model
import uuid

class Chat(models.Model):
    chat_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    user_id = models.UUIDField(editable=False)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for creation
    updated_at = models.DateTimeField(auto_now=True) 

    @property
    def id(self):
        return self.chat_id
    
    def __str__(self):
        return self.name

class Prompt(models.Model):
    prompt_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    chat_id = models.UUIDField(editable=False)
    prompt = models.TextField()  # A long text field for the prompt
    ans = models.JSONField()  # A JSON field for the answer
    langs = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for creation
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.prompt[:20]
    
    @property
    def id(self):
        return self.prompt_id