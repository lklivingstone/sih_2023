import PyPDF2


def pdf_extraction_alg(pdf_file: str) -> str:

    pdf_text = []

    with open(pdf_file, 'rb') as pdf:
        reader = PyPDF2.PdfReader(pdf, strict=False)

        for page in reader.pages:
            content = page.extract_text()
            pdf_text.append(content)

    output_string = ''

    for item in pdf_text:
        output_string += item
    return output_string

def get_summarize_header():

    header = ""
    with open("prompt/headers/summarize_prompt_header.txt") as f:
        header = f.read()

    return header

def get_text_summarization():

    header = ""
    with open("prompt/headers/text_summarization.txt") as f:
        header = f.read()

    return header

def get_science_tech_news():

    header = ""
    with open("prompt/headers/science_and_tech_and_news.txt") as f:
        header = f.read()

    return header

def get_grammar_checks():

    header = ""
    with open("prompt/headers/grammar_checks.txt") as f:
        header = f.read()

    return header