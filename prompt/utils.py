import PyPDF2


def pdf_extraction_alg(pdf_file: str) -> [str]:

    with open(pdf_file, 'rb') as pdf:
        reader = PyPDF2.PdfReader(pdf, strict=False)
        
    pdf_text = []

    for page in reader.pages:
        content = page.extract_text()
        pdf_text.append(content)

    return pdf_text

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
