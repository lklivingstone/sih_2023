def get_summarize_header():

    header = ""
    with open("headers/summarize_prompt_header.txt") as f:
        header = f.read()

    return header