from fastapi import APIRouter, UploadFile, File, Form, Response, HTTPException
from converters import image_converter, image_to_pdf, font_converter
from io import BytesIO
import zipfile
import os
import urllib.parse
import uuid
from typing import Dict
import tempfile
import json
import re

router = APIRouter()

# Аналог хранилища данных 
file_storage: Dict[str, tuple[str, bytes]] = {}

@router.post("/convert")
async def convert(
    files: list[UploadFile] = File(...),
    conversion_type: str = Form(...),
):
    allowed_conversions = {
        # Изображения
        "png2jpg": ("png", "jpg"),
        "png2webp": ("png", "webp"),
        "jpg2png": ("jpg", "png"),
        "jpg2webp": ("jpg", "webp"),
        "webp2png": ("webp", "png"),
        "webp2jpg": ("webp", "jpg"),
        # Документы
        "png2pdf": ("png", "pdf"),
        "jpg2pdf": ("jpg", "pdf"),
        "webp2pdf": ("webp", "pdf"),
        # Шрифты
        "ttf2woff": ("ttf", "woff"),
        "ttf2woff2": ("ttf", "woff2"),
    }

    if conversion_type not in allowed_conversions:
        raise HTTPException(status_code=400, detail="Недопустимое преобразование форматов")

    expected_input, expected_output = allowed_conversions[conversion_type]

    results: list[tuple[str, bytes]] = []

    for file in files:
        base_name, ext = os.path.splitext(file.filename or "")
        ext = ext.lstrip(".").lower()

        if not re.match(r'^[A-Za-z0-9_\-\.]+$', file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"Недопустимое имя файла '{file.filename}'"
            )

        # Валидация расширения для каждого файла
        if ext and ext != expected_input:
            raise HTTPException(
                status_code=400,
                detail=f"Файл {file.filename} должен быть в формате .{expected_input}, а не .{ext}",
            )

        try:
            if conversion_type in {"png2jpg", "jpg2png", "png2webp", "jpg2webp", "webp2png", "webp2jpg"}:
                result_bytes, out_ext = image_converter.convert_image(file, conversion_type)
            elif conversion_type in {"png2pdf", "jpg2pdf", "webp2pdf"}:
                result_bytes, out_ext = image_to_pdf.convert_to_pdf(file)
            elif conversion_type in {"ttf2woff", "ttf2woff2"}:
                result_bytes, out_ext = font_converter.convert_font(file, conversion_type)
            else:
                raise HTTPException(status_code=400, detail="Неподдерживаемый тип конвертации")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"{file.filename}: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка при обработке {file.filename}: {e}")

        if not out_ext:
            out_ext = expected_output

        final_filename = f"{base_name}.{out_ext}"
        results.append((final_filename, result_bytes))

    # Если один файл — отдаём как обычный файл
    if len(results) == 1:
        final_filename, content = results[0]
        quoted_filename = urllib.parse.quote(final_filename)

        media_types = {
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "webp": "image/webp",
            "pdf": "application/pdf",
            "woff": "font/woff",
            "woff2": "font/woff2",
        }
        media_type = media_types.get(final_filename.rsplit(".", 1)[-1].lower(), "application/octet-stream")

        return Response(
            content=content,
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{final_filename}"; filename*=UTF-8\'\'{quoted_filename}',
                "Content-Length": str(len(content)),
            },
        )

    # Если файлов несколько — возвращаем JSON с информацией о файлах
    file_details = []
    for filename, content in results:
        file_id = str(uuid.uuid4())
        file_storage[file_id] = (filename, content)
        
        file_details.append({
            "id": file_id,
            "filename": filename,
            "size": len(content)
        })

    return {
        "files": file_details,
        "total_files": len(file_details)
    }

@router.get("/download-file/{file_id}")
async def download_file(file_id: str):
    """Скачивание конкретного отдельного файла"""
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    filename, content = file_storage[file_id]
    quoted_filename = urllib.parse.quote(filename)
    
    media_types = {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "webp": "image/webp",
        "pdf": "application/pdf",
        "woff": "font/woff",
        "woff2": "font/woff2",
    }
    
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    media_type = media_types.get(ext, "application/octet-stream")
    
    return Response(
        content=content,
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"; filename*=UTF-8\'\'{quoted_filename}',
            "Content-Length": str(len(content))
        },
    )

@router.post("/download-zip")
async def download_zip(file_ids: list[str] = Form(...)):
    """Создание и скачивание всех файлов в формате ZIP"""
    if not file_ids:
        raise HTTPException(status_code=400, detail="Не указаны файлы для ZIP")
    
    # Проверяем, что все файлы существуют
    files_to_zip = []
    for file_id in file_ids:
        if file_id not in file_storage:
            raise HTTPException(status_code=404, detail=f"Файл {file_id} не найден")
        files_to_zip.append(file_storage[file_id])
    
    # Создаем ZIP
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for filename, content in files_to_zip:
            zf.writestr(filename, content)
    zip_buffer.seek(0)

    return Response(
        content=zip_buffer.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="converted_files.zip"', "Content-Length": str(len(zip_bytes))},
    )