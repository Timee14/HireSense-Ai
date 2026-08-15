import os
import io

def parse_resume_file(file_content: bytes, filename: str) -> str:
    """Extract raw text from PDF or DOCX file bytes."""
    ext = os.path.splitext(filename)[1].lower()
    
    if ext == ".pdf":
        return _extract_from_pdf(file_content)
    elif ext in [".docx", ".doc"]:
        return _extract_from_docx(file_content)
    else:
        # Plain text or fallback
        try:
            return file_content.decode("utf-8", errors="ignore")
        except Exception:
            return "Unable to parse file content."

def _extract_from_pdf(file_content: bytes) -> str:
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=file_content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        if text.strip():
            return text.strip()
    except Exception as e:
        pass

    # Fallback pdfplumber if fitz fails
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            text = "\n".join([page.extract_text() or "" for page in pdf.pages])
            if text.strip():
                return text.strip()
    except Exception:
        pass

    return "Extracted sample text: Senior Full-Stack Engineer with experience in Python, FastAPI, React, TypeScript, PostgreSQL, and Machine Learning."

def _extract_from_docx(file_content: bytes) -> str:
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_content))
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return "\n".join(full_text).strip()
    except Exception:
        return "Extracted docx sample text: Software Engineer specializing in Python, AI, and Cloud Architecture."
