
from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess
from asgiref.sync import sync_to_async
from django.http import JsonResponse
import json
from rest_framework import status

from .utils import (
    get_default_header,
    pdf_extraction_alg,
    request_response
)
from .translate import (
    init_translator
)

from chats.models import (
    Chat,
    Prompt
)


init_translator()


@sync_to_async
@api_view(['POST'])
def sample_view(request):
    curl_command = [
        'curl',
        'http://localhost:8000/v1/completions',
        '-H', 'Content-Type: application/json',
        '-d', '{"model": "TheBloke/Llama-2-7b-chat-fp16",'
        'prompt": "Hi there. Tell me a story",'
        '"max_tokens": 700, "temperature": 0.9 }'
    ]

    try:
        result = subprocess.run(
            curl_command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True, check=True)

        response_data = result.stdout

        return JsonResponse({
            'message': 'cURL request successful',
            'data': response_data
            })

    except subprocess.CalledProcessError as e:
        error_message = e.stderr
        return JsonResponse({
            'error': 'cURL request failed',
            'message': error_message
            })


@sync_to_async
@api_view(['POST'])
def upload_document(request):
    uploaded_file = request.FILES.get('document')
    if uploaded_file:

        header = get_default_header()
        extracted_text = pdf_extraction_alg(uploaded_file)

        prompt = "### Instruction: " + header + "\n" + \
                 "### Input: " + extracted_text + \
                 "\nPlease provide a detailed multiple paragraph summary " + \
                 "of the above text." + \
                 "\n### Response:\n"

        result = request_response(prompt, True)

        if result == -1:
            return JsonResponse({
                'meta': {
                    'status_code': 500,
                    'message': 'failure'
                },
                'data': {
                    "message": 'Model Error'
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user_id = request.data.get('user-id')
        # Provide a name for the chat
        chat = Chat(user_id=user_id, name=result['english'][0][:37]+'...')
        chat.save()
        new_chat_id = chat.chat_id

        prompt = Prompt(
            chat_id=new_chat_id,
            prompt='***DOC***'+uploaded_file.name+'*#*#*#'+prompt,
            ans={
                "English": result['english'],
                "Hindi": result['hindi']
                },
            langs=["English", "Hindi"]
            )

        prompt.save()

        return JsonResponse({
            'meta': {
                'status_code': 200,
                'message': 'success'
            },
            'data': {
                'prompt_id': prompt.prompt_id,
                'chat_id': prompt.chat_id,
                'prompt': prompt.prompt,
                'ans': prompt.ans,
                'langs': prompt.langs,
                'timestamp': prompt.created_at
            }
        }, status=status.HTTP_200_OK)

    else:
        return JsonResponse({"message": 'No document uploaded'}, status=400)


@sync_to_async
@api_view(['POST'])
def summarize(request):

    header = get_default_header()
    json_data = json.loads(request.body)

    # print(json_data)
    prompt = "### Instruction:\n" + header +\
        "\n### Input:\n" + json_data['prompt'] + \
             "\n### Response:\n"

    chat_id = json_data.get('chat-id')

    if chat_id:
        first_message = 1
    else:
        first_message = 0

    result = request_response(prompt, False, first_message)

    prompt_chat = json_data['prompt']

    user_id = json_data['user-id']
    chat_id = json_data.get('chat-id')
    new_chat_id = None

    if chat_id:
        new_chat_id = chat_id

    else:
        chat = Chat(user_id=user_id, name=result['title'])
        chat.save()
        new_chat_id = chat.chat_id

    prompt = Prompt(
        chat_id=new_chat_id,
        prompt=prompt_chat,
        ans={
            "English": result['english'],
            "Hindi": result['hindi'],
            },
        langs=["English", "Hindi"])

    prompt.save()

    if result == -1:
        return JsonResponse({
                'meta': {
                    'status_code': 500,
                    'message': 'failure'
                },
                'data': {
                    "message": 'Model Error'
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse({
            'meta': {
                'status_code': 200,
                'message': 'success'
            },
            'data': {
                'prompt_id': prompt.prompt_id,
                'chat_id': prompt.chat_id,
                'prompt': prompt.prompt,
                'ans': prompt.ans,
                'langs': prompt.langs,
                'timestamp': prompt.created_at
            }
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
def test_view(request):
    return Response("hi")
