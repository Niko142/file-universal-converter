import { API_BASE_URL } from "@/api/config";
import {
  calculateEstimatedPercent,
  calculateExactPercent,
} from "@/utils/calculate";
import { getFilenameFromResponse } from "@/utils/headers";

// Обработчик расчета процентов для progress-бара
export const calculateProgress = (receivedLength, contentLength) => {
  return contentLength > 0
    ? calculateExactPercent(receivedLength, contentLength)
    : calculateEstimatedPercent(receivedLength);
};

// Обработчик для чтения бинарного ответа
const readBinaryResponse = async (response, progressBar) => {
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

    if (progressBar) {
      const percent = calculateProgress(receivedLength, contentLength);
      progressBar.fillProgress(percent);
    }
  }

  // Конечный процесс
  if (progressBar) {
    progressBar.fillProgress(100);
  }

  return new Blob(chunks);
};

// Обработка бинарного ответа нескольких файлов
const handleMultipleResponse = async (response, progressBar) => {
  const data = await response.json();

  if (progressBar) {
    progressBar.fillProgress(100);
  }

  return {
    type: "multiple",
    files: data.files,
  };
};

// Обработка бинарного ответа единичного файла
const handleSingleFileResponse = async (response, progressBar) => {
  const blob = await readBinaryResponse(response, progressBar);
  const filename = getFilenameFromResponse(response) || "Converted-file";

  return {
    type: "single",
    blob,
    filename,
  };
};

// Обработчик для конвертации файлов
export const convertFiles = async (formData, progressBar = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || response.status);
    }

    const contentType = response.headers.get("content-type");

    // Если сервер вернул JSON, значит несколько файлов
    return contentType?.includes("application/json")
      ? handleMultipleResponse(response, progressBar)
      : handleSingleFileResponse(response, progressBar);
  } catch (err) {
    if (err.name === "TypeError" && err.message.startsWith("Failed to fetch")) {
      throw new Error("Не удалось подключиться к серверу. Попробуйте позже.");
    }
    throw err;
  }
};

// Загрузка выбранного файла
export const downloadFile = async (fileId) => {
  const response = await fetch(`${API_BASE_URL}/download-file/${fileId}`);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки файла ${fileId}`);
  }

  return response.blob();
};

// Загрузка нескольких файлов в виде ZIP-архива
export const downloadZip = async (filesId) => {
  const formData = new FormData();

  filesId.forEach((id) => formData.append("file_ids", id));

  const response = await fetch(`${API_BASE_URL}/download-zip`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Ошибка при создании ZIP");
  }

  return response.blob();
};
