# urls.py
from django.urls import path
from .views import (
    ChatByUserIdView,
    PromptByChatIdView
)

urlpatterns = [
    path('by-user-id/', ChatByUserIdView.as_view(), name='chat-by-user-id'),
    path('by-chat-id/', PromptByChatIdView.as_view(), name='prompt-by-chat-id'),

]
