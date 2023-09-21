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
    get_summarize_header
)
from PIL import Image
from pytesseract import pytesseract
import enum


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

        class OS(enum.Enum):
            Mac = 0
            Windows = 1


        class Lang(enum.Enum):
            ENG = 'eng'
            SPA = 'spa'


        class ImageReader:
            def _init_(self, os: OS):
                if os == OS.Windows:
                    windows_path = r""
                    pytesseract.tesseract_cmd = windows_path
                    print("Running on Windows!")

            def extract_text(self, image: str, lang: str) -> str:
                img = Image.open(image)
                extracted_text = pytesseract.image_to_string(img, lang=lang)
                return extracted_text


        if _name_ == "_main_":
            ir = ImageReader(OS.Windows)
            text = ir.extract_text('Images/AT-2023-2011GR_page-0001.jpg', lang='eng')
            print(text)

        # End the logic
        return JsonResponse({"message": 'Document uploaded successfully'}, status=200)
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