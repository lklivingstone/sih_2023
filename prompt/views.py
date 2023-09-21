from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import time
import subprocess
from asgiref.sync import sync_to_async
from django.http import JsonResponse
import requests
import json
from utils import (
    get_summarize_header,
    pdf_extraction_alg
)

MODEL = "TheBloke/Llama-2-7b-chat-fp16"
TOKENS = 1200
TEMP = 0.9

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
        extracted_text = pdf_extraction_alg(uploaded_file)
        print(extracted_text)

        # End the logic
        return JsonResponse({"message": 'Document uploaded successfully', "text": extracted_text}, status=200)
    else:
        return JsonResponse({"message": 'No document uploaded'}, status=400)


@sync_to_async
@api_view(['POST'])  
def summarize(request):

    header = get_summarize_header()
    json_data = json.loads(request.body)

    prompt = "<<SYS>>" + header + "<</SYS>>" + "\n[INST]" + "Please provide a summary of the following text:\n"+ json_data['prompt'] + "[/INST]\n"
    endpoint_url = "http://localhost:8000/v1/completions"

    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "model": MODEL,
        "prompt": prompt,
        "max_tokens": TOKENS,
        "temperature": TEMP
    }

    response = requests.post(endpoint_url, json=data, headers=headers)

    if response.status_code == 200:
        result = response.json()
        return JsonResponse({"message": 'Generation Successful',"data":result['choices'][0]['text']}, status=200)
    else:
        print(prompt,"\n",f"Error: {response.status_code} - {response.text}")
        return JsonResponse({"message": 'Error'})


@api_view(['GET'])
def test_view(request):
    return Response("hi")