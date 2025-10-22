import { downloadFile, downloadZip } from "@/services/conversionService";
import {
  renderErrorMessage,
  renderFileInfo,
  renderMultipleResult,
  renderSingleResult,
} from "../templates";
import { cleanupUrls, triggerDownload } from "@/utils/downloadFile";
import { createObjectUrl, revokeObjectURL } from "@/utils/url";

export const initResultHandler = () => {
  const resultContainer = document.querySelector(".results");

  let downloadUrls = []; // Массив для хранения URL
  let lastDownloadURL = null; // Последний URL файла
  let lastFileName = null; // Последнее имя файла

  // Рендер контейнера результатов
  const displayResultContainer = (html, display = "block") => {
    resultContainer.innerHTML = html;
    resultContainer.style.display = display;
  };

  // Отображение блока для загрузки одиночного файла
  const showSingleFile = (blob, filename) => {
    lastDownloadURL = createObjectUrl(blob);
    lastFileName = filename;

    displayResultContainer(
      renderSingleResult({
        filename,
        size: blob.size,
      })
    );

    resultContainer
      .querySelector(".btn--download")
      .addEventListener("click", () =>
        triggerDownload(lastDownloadURL, lastFileName)
      );
  };

  // Логика загрузки нескольких файлов
  const loadMultipleFiles = async (files) => {
    const loadedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const blob = await downloadFile(file.id);
          const url = createObjectUrl(blob);

          return {
            ...file,
            size: blob.size,
            url: url,
          };
        } catch (err) {
          console.error(`Ошибка загрузки файла ${file.filename}:`, err);
          return;
        }
      })
    );
    return loadedFiles.filter(Boolean);
  };

  // Отображение блока для загрузки нескольких файлов
  const showMultipleFiles = async (filesData) => {
    const validFiles = await loadMultipleFiles(filesData);
    if (validFiles.length === 0) {
      throw new Error("Не удалось загрузить файлы");
    }

    downloadUrls = validFiles;
    const filesList = validFiles
      .map((file, ind) =>
        renderFileInfo({
          ...file,
          index: ind,
        })
      )
      .join("");

    displayResultContainer(
      renderMultipleResult({
        filesList: filesList,
        filesLength: validFiles.length,
      })
    );

    // Обработчик события для скачивания файлов по отдельности
    resultContainer.querySelectorAll(".btn--download-single").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        const fileData = downloadUrls[index];
        triggerDownload(fileData.url, fileData.filename);
      });
    });

    // Обработчик события для файлов в ZIP-формате
    resultContainer
      .querySelector(".btn--download-zip")
      .addEventListener("click", () => handleZipDownload(filesData));
  };

  // Обработчик для загрузки ZIP-папки с конвертированными файлами
  const handleZipDownload = async (filesData) => {
    try {
      const filesID = filesData.map((file) => file.id);
      const blob = await downloadZip(filesID);

      const zipUrl = createObjectUrl(blob);
      triggerDownload(zipUrl, "Converted-files.zip");
      revokeObjectURL(zipUrl);
    } catch (err) {
      console.error("Ошибка при скачивании ZIP: " + err.message);
      return;
    }
  };

  // Метод для отображения результата
  const showResult = async (result) => {
    const { type, blob, filename, files } = result;
    cleanupUrls(downloadUrls, lastDownloadURL);

    type === "single"
      ? showSingleFile(blob, filename)
      : await showMultipleFiles(files);
  };

  // Метод для отображения ошибки
  const showError = (msg) => {
    displayResultContainer(renderErrorMessage(msg));
  };

  // Метод для очистки данных
  const clear = () => {
    displayResultContainer("", "none");
    cleanupUrls(downloadUrls, lastDownloadURL);
    lastDownloadURL = lastFileName = null;
  };

  return {
    showResult,
    showError,
    clear,
  };
};
