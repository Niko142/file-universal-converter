from typing import Tuple
from fastapi import UploadFile
from fontTools.ttLib import TTFont
import io

def convert_font(file: UploadFile, conversion_type: str) -> Tuple[bytes, str]:
    input_bytes = file.file.read()
    in_buffer = io.BytesIO(input_bytes)

    font = TTFont(in_buffer)

    out_buffer = io.BytesIO()

    if conversion_type == "ttf2woff":
        font.flavor = "woff"
        font.save(out_buffer)
        return out_buffer.getvalue(), "woff"

    elif conversion_type == "ttf2woff2":
        font.flavor = "woff2"
        font.save(out_buffer)
        return out_buffer.getvalue(), "woff2"

    else:
        raise ValueError("Неподдерживаемый тип конвертации")
