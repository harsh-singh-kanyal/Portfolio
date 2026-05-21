import os
import sys

def read_pdf():
    try:
        from pypdf import PdfReader
    except ImportError:
        print("Required package 'pypdf' is not installed.")
        sys.exit(1)

    path1 = r'C:\Users\Haresh Kanyal\Desktop\Latest Resume.pdf'
    path2 = r'C:\Users\Haresh Kanyal\OneDrive\Desktop\Latest Resume.pdf'
    
    path = path1 if os.path.exists(path1) else path2
    if not os.path.exists(path):
        print(f"Error: Could not find the resume PDF at {path1} or {path2}.")
        sys.exit(1)
        
    out_path = r'C:\Users\Haresh Kanyal\.gemini\antigravity\scratch\resume_final.txt'
    try:
        reader = PdfReader(path)
        with open(out_path, 'w', encoding='utf-8') as f:
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    f.write(f"--- Page {i+1} ---\n")
                    f.write(text + "\n")
        print(f"Successfully wrote to {out_path}")
    except Exception as e:
        print(f"Error reading PDF: {e}")

if __name__ == '__main__':
    read_pdf()
