# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Chat, Prompt
from .serializers import ChatSerializer, PromptSerializer

class ChatByUserIdView(APIView):
    def get(self, request, *args, **kwargs):
        uid = request.query_params.get('user_id', None)  # Get 'user_id' from query parameters
        if uid is None:
            return Response({'error': 'Missing "user_id" parameter in the URL.'}, status=status.HTTP_400_BAD_REQUEST)
        
        chats = Chat.objects.filter(user_id=uid)
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PromptByChatIdView(APIView):
    def get(self, request, *args, **kwargs):
        chat_id = request.query_params.get('chat_id', None)
        prompts = Prompt.objects.filter(chat_id=chat_id)
        serializer = PromptSerializer(prompts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
