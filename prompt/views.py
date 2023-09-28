from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import time
import subprocess
from asgiref.sync import sync_to_async
from django.http import JsonResponse
import requests
import json
import os
from .utils import (
    get_summarize_header,
    pdf_extraction_alg
)
from .translate import(
    init_translator,
    get_translation
)


MODEL = "NousResearch/Nous-Hermes-llama-2-7b"
TOKENS = 1200
TEMP = 0.9
ENDPOINT_URL = "http://localhost:8000/v1/completions"

DATA = {
        "model": MODEL,
        "max_tokens": TOKENS,
        "temperature": TEMP
    }

HEADERS = {
        "Content-Type": "application/json"
    }
init_translator()


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

        root_directory_path = os.getcwd()  # Replace with the actual path
        unique_file_name = os.path.join(root_directory_path, uploaded_file.name)

        with open(unique_file_name, 'wb') as destination_file:
            for chunk in uploaded_file.chunks():
                destination_file.write(chunk)

        extracted_text = pdf_extraction_alg(unique_file_name)

        os.remove(unique_file_name)

        prompt = "### Instruction: " + header + "\n" + \
                 "### Input: " +  extracted_text + "\nPlease provide a detailed2-paragraph summary of the above text." + \
                 "\n### Response: "
        DATA['prompt'] = prompt

        response = requests.post(ENDPOINT_URL, json=DATA, headers=HEADERS)

        if response.status_code == 200:
            result = response.json()
            hindi = get_translation(result['choices'][0]['text'])

            return JsonResponse({
                "message": 'Generation Successful',
                "english": result['choices'][0]['text'],
                "hindi": hindi}, status=200
                )
        else:
            print(prompt,"\n",f"Error: {response.status_code} - {response.text}")
            return JsonResponse({"message": 'Error'})
        
    else:
        return JsonResponse({"message": 'No document uploaded'}, status=400)


@sync_to_async
@api_view(['POST'])  
def summarize(request):

    header = get_summarize_header()
    json_data = json.loads(request.body)

    prompt = "### Instruction: " + header + "\n" + \
             "### Input: " +  json_data['prompt'] + "\nPlease provide a detailed 2-paragraph summary of the above text." + \
             "\n### Response: "

    response = requests.post(ENDPOINT_URL, json=DATA, headers=HEADERS)

    if response.status_code == 200:
        result = response.json()
        hindi = get_translation(result['choices'][0]['text'])

        return JsonResponse({
            "message": 'Generation Successful',
            "english": result['choices'][0]['text'],
            "hindi": hindi}, status=200)
    else:
        print(prompt,"\n",f"Error: {response.status_code} - {response.text}")
        return JsonResponse({"message": 'Error'})


@api_view(['GET'])
def test_view(request):
    return Response("hi")
