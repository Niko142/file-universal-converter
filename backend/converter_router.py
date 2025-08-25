from fastapi import APIRouter, UploadFile, File, Form, Response, HTTPException
from converters import image_converter, image_to_pdf, font_converter
from io import BytesIO
import zipfile
import os
import urllib.parse

router = APIRouter()

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

    # Если один файл — отдаём как есть (как раньше)
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
                "Content-Disposition": f'attachment; filename="{final_filename}"; filename*=UTF-8\'\'{quoted_filename}'
            },
        )

    # Если файлов несколько — упаковываем в ZIP
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for fname, content in results:
            zf.writestr(fname, content)
    zip_buffer.seek(0)

    return Response(
        content=zip_buffer.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="converted_files.zip"'},
    )
