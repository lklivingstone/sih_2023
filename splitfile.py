import PyPDF2
name = "micromachines-14-01354-v2-1.pdf"
pdf_text = ""
with open(name, 'rb') as pdf:
    reader = PyPDF2.PdfReader(pdf, strict=False)

    for page in reader.pages:
        content = page.extract_text()
        pdf_text += content

print(len(pdf_text))

n = 1000
ls = []
size = len(pdf_text)

while size > n:
    temp = pdf_text[n:]
    q = temp.index(" ")
    temp = pdf_text[:n + q]

    ls.append(temp)
    
    try:
        pdf_text = pdf_text[n + q + 1:]
    
    except:
        ls.append(pdf_text)
        break

    size = len(pdf_text)

ls.append(pdf_text)

with open("f.txt", 'w') as f:
    for i in ls:
        f.write("\n\n" + i + "\n\n")
    

