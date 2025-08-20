from typing import Tuple
from fastapi import UploadFile
from PIL import Image
import io

def convert_image(file: UploadFile, conversion_type: str) -> Tuple[bytes, str]:
    input_bytes = file.file.read()
    img = Image.open(io.BytesIO(input_bytes))

    out = io.BytesIO()

    if conversion_type in ["png2jpg", "jpg2png"]:
        img = img.convert("RGB")
        img.save(out, format="JPEG")
        return out.getvalue(), "jpg"

    elif conversion_type in ["jpg2png", "webp2png"]:
        img.save(out, format="PNG")
        return out.getvalue(), "png"

    elif conversion_type in ["png2webp", "jpg2webp"]:
        img.save(out, format="WEBP")
        return out.getvalue(), "webp"

    else:
        raise ValueError("Данное преобразование не поддерживается")
