from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import time
import subprocess
from asgiref.sync import sync_to_async
from django.http import JsonResponse
import requests
import json


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
        # Add the logic
        return JsonResponse({"message": 'Document uploaded successfully'}, status=200)
    else:
        return JsonResponse({"message": 'No document uploaded'}, status=400)


@sync_to_async
@api_view(['POST'])  
def summarize(request):


    header = ""

    json_data = json.loads(request.body)

    with open("prompt/summarize_prompt_header.txt") as f:
        header = f.read()

    prompt = header + "\nPlease provide a summary of the following text:\n"+ json_data['prompt']
    endpoint_url = "http://localhost:8000/v1/completions"

    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "model": "TheBloke/Llama-2-7b-chat-fp16",
        "prompt": prompt,
        "max_tokens": 500,
        "temperature": 0.7
    }

    try:
        response = requests.post(endpoint_url, json=data, headers=headers)

        if response.status_code == 200:
            result = response.json()
            return JsonResponse({"message": 'Generation Successful',"data":result}, status=200)
    
        else:
            print(prompt,f"Error: {response.status_code} - {response.text}")
            return None
        
    except:
        return JsonResponse({"prompt":prompt})


@api_view(['GET'])
def test_view(request):
    return Response("hi")