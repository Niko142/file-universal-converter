from fastapi import APIRouter, UploadFile, File, Form, Response, HTTPException
from converters import image_converter  # Убрали font_converter
import os
import urllib.parse

router = APIRouter()

@router.post("/convert")
def convert(
    file: UploadFile = File(...),
    conversion_type: str = Form(...)
):
    # Проверяем расширение исходного файла
    base_name, ext = os.path.splitext(file.filename or "")
    ext = ext.lstrip(".").lower()

    # Словарь допустимых комбинаций
    allowed_conversions = {
        "png2jpg": ("png", "jpg"),
        "jpg2png": ("jpg", "png"),
        "png2webp": ("png", "webp"),
        "jpg2webp": ("jpg", "webp"),
        "webp2png": ("webp", "png"),
        "webp2jpg": ("webp", "jpg"),
    }

    if conversion_type not in allowed_conversions:
        raise HTTPException(status_code=400, detail="Недопустимое преобразование форматов")

    expected_input, expected_output = allowed_conversions[conversion_type]

    # Проверка совпадения формата входного файла
    if ext and ext != expected_input:
        raise HTTPException(
            status_code=400,
            detail=f"Файл должен быть в формате .{expected_input}, а не .{ext}"
        )

    try:
        # Выбор результатов конвертации
        if conversion_type in ["png2jpg", "jpg2png", "png2webp", "jpg2webp", "webp2png", "webp2jpg"]:
            result_bytes, out_ext = image_converter.convert_image(file, conversion_type)
        else:
            raise HTTPException(status_code=400, detail="Неподдерживаемый тип конвертации")

    # Обработка неожиданных ошибок 
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Внутренняя ошибка: {str(e)}")

    
    if not out_ext:
        out_ext = expected_output

    # Формируем имя результата
    final_filename = f"{base_name}.{out_ext}"
    quoted_filename = urllib.parse.quote(final_filename)

    # MIME-типы
    media_types = {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "webp": "image/webp",
    }
    media_type = media_types.get(out_ext.lower(), "application/octet-stream")

    return Response(
        content=result_bytes,
        media_type=media_type,
        headers={
            "Content-Disposition": f"attachment; filename=\"{final_filename}\"; filename*=UTF-8''{quoted_filename}"
        }
    )