import PyPDF2
import requests
import os

from .translate import get_translation

MODEL = "TheBloke/Nous-Hermes-Llama2-AWQ"
TOKENS = 1200
TEMP = 0.9
ENDPOINT_URL = "http://localhost:8000/v1/completions"
NUM = 1

DATA = {
        "model": MODEL,
        "max_tokens": TOKENS,
        "temperature": TEMP,
        "n": NUM
    }

HEADERS = {
        "Content-Type": "application/json"
    }


def request_response(message, is_document, isFirstMessage):

    hindi = []
    english = []

    DATA['prompt'] = message

    response = requests.post(ENDPOINT_URL, json=DATA, headers=HEADERS, stream=True)

    if response.status_code == 200:
        result = response.json()
        for choice in range(NUM):
            english.append(result['choices'][choice]['text'])
            hindi.append(get_translation(result['choices'][choice]['text']))

        if isFirstMessage == 1:
            title = get_header(english[0])
        else:
            title = english[0][:30]

        return {
            "english": english,
            "hindi": hindi,
            "title": title
        }

    else:
        print("\n", f"Error: {response.status_code} - {response.text}")
        return -1


def get_header(message):
    DATA['prompt'] = "### Instruction: \nCreate a 3 to 5 word title for the message passed using the meaning of the text. and ensure that the full semantics are captured.\n" + \
                    "### Input:\n" + message + "\n"\
                    "### Response:\n"

    response = requests.post(ENDPOINT_URL, json=DATA, headers=HEADERS)

    if response.status_code == 200:
        result = response.json()
        return result['choices'][0]['text']


def pdf_extraction_alg(uploaded_file):

    root_directory_path = os.getcwd()
    unique_file_name = os.path.join(root_directory_path, uploaded_file.name)

    with open(unique_file_name, 'wb') as destination_file:
        for chunk in uploaded_file.chunks():
            destination_file.write(chunk)

    pdf_text = []

    with open(unique_file_name, 'rb') as pdf:
        reader = PyPDF2.PdfReader(pdf, strict=False)

        for page in reader.pages:
            content = page.extract_text()
            pdf_text.append(content)

    os.remove(unique_file_name)

    output_string = ''

    for item in pdf_text:
        output_string += item
    return output_string


def get_summarize_header():

    header = ""
    with open("prompt/headers/summarize_prompt_header.txt") as f:
        header = f.read()

    return header


def get_default_header():

    header = ""
    with open("prompt/headers/default.txt") as f:
        header = f.read()

    return header
