import { getFilenameFromResponse } from "@/utils/headers";

// Обработчик для конвертации файлов
export async function convertFiles(formData, progressBar = null) {
  const response = await fetch("http://localhost:8000/convert", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || response.status);
  }

  const contentType = response.headers.get("content-type");
  // Если сервер вернул JSON, значит несколько файлов
  if (contentType?.includes("application/json")) {
    const data = await response.json();
    return {
      type: "multiple",
      files: data.files,
    };
  } else {
    // Иначе бинарный файл с одним файлом
    // Стандартная обработка файла
    const blob = await readBinaryResponse(response, progressBar);
    const filename = getFilenameFromResponse(response) || "Converted-file";

    return {
      type: "single",
      blob,
      filename,
    };
  }
}

// Загрузка выбранного файла
export async function downloadFile(fileId) {
  const response = await fetch(`http://localhost:8000/download-file/${fileId}`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки файла ${fileId}`);
  }
  return response.blob();
}

// Загрузка нескольких файлов в виде ZIP-архива
export async function downloadZip(fileIds) {
  const formData = new FormData();
  fileIds.forEach((id) => formData.append("file_ids", id));

  const response = await fetch("http://localhost:8000/download-zip", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Ошибка при создании ZIP");
  }
  return response.blob();
}

// Обработчик для чтения бинарного ответа
async function readBinaryResponse(response, progressBar) {
  const reader = response.body.getReader();
  const contentLength = +response.headers.get("Content-Length") || 0;
  let receivedLength = 0;
  const chunks = [];

  // Показываем начальный прогресс
  if (progressBar) {
    progressBar.fillProgress(0);
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    receivedLength += value.length;

    if (contentLength && progressBar) {
      const percent = (receivedLength / contentLength) * 100;
      progressBar.fillProgress(percent);
    } else if (progressBar) {
      // Если Content-Length недоступен, то делаем имитацию
      const estimatedPercent = Math.min(
        (receivedLength / (1024 * 1024)) * 15,
        85
      );
      progressBar.fillProgress(estimatedPercent);
    }
  }

  if (progressBar) {
    progressBar.fillProgress(100);
  }

  return new Blob(chunks);
}
