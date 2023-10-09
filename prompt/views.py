from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess
from asgiref.sync import sync_to_async
from django.http import JsonResponse
import json
import os
import uuid
from rest_framework import status

from .utils import (
    get_summarize_header,
    get_grammar_checks,
    pdf_extraction_alg,
    request_response
)
from .translate import(
    init_translator
)

from chats.models import (
    Chat,
    Prompt
)

init_translator()

########################

import time

########################

@sync_to_async
@api_view(['POST'])
def sample_view(request):
    curl_command = [
        'curl',
        'http://localhost:8000/v1/completions',
        '-H', 'Content-Type: application/json',
        '-d', '{"model": "TheBloke/Llama-2-7b-chat-fp16", "prompt": "Hi there. Tell me a story", "max_tokens": 700, "temperature": 0.9}'
    ]

    try:
        result = subprocess.run(curl_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)

        response_data = result.stdout

        return JsonResponse({'message': 'cURL request successful', 'data': response_data})

    except subprocess.CalledProcessError as e:
        error_message = e.stderr
        return JsonResponse({'error': 'cURL request failed', 'message': error_message})


@sync_to_async
@api_view(['POST'])  
def upload_document(request):
    uploaded_file = request.FILES.get('document')
    if uploaded_file:
        
        header = get_summarize_header()
        extracted_text = pdf_extraction_alg(uploaded_file)

        prompt = "### Instruction: " + header + "\n" + \
                 "### Input: " +  extracted_text + "\nPlease provide a detailed2 -paragraph summary of the above text." + \
                 "\n### Response:\n"
        result = request_response(prompt)

        user_id = request.data.get('user_id')
        chat_id = request.data.get('chat_id')

        if chat_id == -1:
            chat = Chat(user_id=user_id, name=result['english'][:20])  # Provide a name for the chat
            chat.save()
            new_chat_id = chat.chat_id

        else:
            new_chat_id = chat_id

        prompt = Prompt(chat_id=new_chat_id, prompt='***DOC***'+prompt, ans={"English": result['english'], "Hindi": result['hindi']}, langs=["English", "Hindi"])
        prompt.save()
        
        return Response({
            'meta' : {
                'status_code' : 200,
                'message' : 'success'
            },
            'data' : {
                'prompt_id' : prompt.prompt_id,
                'chat_id' : prompt.chat_id,
                'prompt' : prompt.prompt,
                'ans' : prompt.ans,
                'langs' : prompt.langs,
                'timestamp' : prompt.created_at
            }
        }, status=status.HTTP_200_OK)

        ############### CORRECT CODE ######################
        
        if result == -1:
            return JsonResponse({"message": 'Error'})
        else:
            return JsonResponse({
                "qid": uuid.uuid1(),
                "aid": uuid.uuid1(),
                "question": 'Can you Summarize?',
                "message": 'Generation Successful',
                "english": result['english'],
                "hindi": result['hindi']
                }, 
                status=200
                )
    else:
        return JsonResponse({"message": 'No document uploaded'}, status=400)
        ############### -------- CORRECT CODE END ######################


@sync_to_async
@api_view(['POST'])  
def summarize(request):

    header = get_summarize_header()
    json_data = json.loads(request.body)
  
    prompt = "### Instruction: " + header + "\n" + \
             "### Input: " +  json_data['prompt'] + "\nPlease provide a detailed 2-paragraph summary of the above text." + \
             "\n### Response: "

    result = request_response(prompt)

    prompt_chat = json_data['prompt']

    user_id = json_data['user_id'] 
    chat_id = json_data['chat_id'] 

    if chat_id == -1:
        chat = Chat(user_id=user_id, name=result['english'][:20])  # Provide a name for the chat
        chat.save()
        new_chat_id = chat.chat_id

    else:
        new_chat_id = chat_id

    prompt = Prompt(chat_id=new_chat_id, prompt=prompt_chat, ans={"English": result['english'], "Hindi": result['hindi']}, langs=["English", "Hindi"])
    prompt.save()

    if result == -1:
            return JsonResponse({"message": 'Error'})
    else:
         return Response({
            'meta' : {
                'status_code' : 200,
                'message' : 'success'
            },
            'data' : {
                'prompt_id' : prompt.prompt_id,
                'chat_id' : prompt.chat_id,
                'prompt' : prompt.prompt,
                'ans' : prompt.ans,
                'langs' : prompt.langs,
                'timestamp' : prompt.created_at
            }
        }, status=status.HTTP_200_OK)

        # return JsonResponse({
        #     "qid": uuid.uuid1(),
        #     "aid": uuid.uuid1(),
        #     "question": json_data['prompt'],
        #     "message": 'Generation Successful',
        #     "english": result['english'],
        #     "hindi": result['hindi']
        #     }, 
        #     status=200
        #     )
    

@sync_to_async
@api_view(['POST'])  
def check_grammar(request):

    header = get_grammar_checks()
    json_data = json.loads(request.body)
  
    prompt = "### Instruction: " + header + "\n" + \
             "### Input: " +  json_data['prompt'] + "\nPlease perform grammar checks on this text and return the reformatted version with minimal changes to make it grammatically correct." + \
             "\n### Response: "

    result = request_response(prompt)

    if result == -1:
            return JsonResponse({"message": 'Error'})
    else:
        return JsonResponse({
            "qid": uuid.uuid1(),
            "aid": uuid.uuid1(),
            "question": json_data['prompt'],
            "message": 'Generation Successful',
            "english": result['english'],
            "hindi": result['hindi']
            }, 
            status=200
            )


@api_view(['GET'])
def test_view(request):
    return Response("hi")
