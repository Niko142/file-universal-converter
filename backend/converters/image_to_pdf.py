from typing import Tuple
from fastapi import UploadFile
from PIL import Image
import io

def convert_to_pdf(file: UploadFile) -> Tuple[bytes, str]:
    input_bytes = file.file.read()
    img = Image.open(io.BytesIO(input_bytes))
    img = img.convert("RGB")

    out = io.BytesIO()
    img.save(out, format="PDF")
    return out.getvalue(), "pdf"
