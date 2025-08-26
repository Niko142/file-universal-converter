import { cleanupUrls, triggerDownload } from "@/utils/downloadFile";
import { downloadFile, downloadZip } from "@/services/conversionService";
import { resultTemplates } from "../templates/template";

export const createResultHandler = (container) => {
  let downloadUrls = [];
  let lastDownloadURL = null;
  let lastFileName = null;

  const showCurrentFile = async (blob, filename) => {
    lastDownloadURL = window.URL.createObjectURL(blob);
    lastFileName = filename;

    container.innerHTML = resultTemplates.renderSingleResult({
      filename: filename,
      size: blob.size,
    });

    container
      .querySelector(".download-btn")
      .addEventListener("click", () =>
        triggerDownload(lastDownloadURL, lastFileName)
      );

    container.style.display = "block";
  };

  const showMultipleFiles = async (filesData) => {
    // Загружаем все файлы
    const loadedFiles = await Promise.all(
      filesData.map(async (fileData) => {
        try {
          const blob = await downloadFile(fileData.id);
          const url = window.URL.createObjectURL(blob);

          return {
            id: fileData.id,
            filename: fileData.filename,
            size: blob.size,
            url: url,
          };
        } catch (err) {
          console.error(`Ошибка загрузки файла ${fileData.filename}:`, err);
          return null;
        }
      })
    );

    const validFiles = loadedFiles.filter(Boolean);
    if (validFiles.length === 0) {
      throw new Error("Не удалось загрузить файлы");
    }

    downloadUrls = validFiles;

    const filesList = validFiles
      .map((fileData, index) =>
        resultTemplates.renderFileInfo({
          filename: fileData.filename,
          size: fileData.size,
          index: index,
        })
      )
      .join("");

    container.innerHTML = resultTemplates.renderMultipleResult({
      filesList: filesList,
      filesLength: validFiles.length,
    });

    // События для отдельных файлов
    container.querySelectorAll(".download-single-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        const fileData = downloadUrls[index];
        triggerDownload(fileData.url, fileData.filename);
      });
    });

    // Событие для ZIP
    container
      .querySelector(".download-zip-btn")
      .addEventListener("click", () => handleZipDownload(filesData));

    container.style.display = "block";
  };

  const handleZipDownload = async (filesData) => {
    try {
      const fileIds = filesData.map((file) => file.id);
      const blob = await downloadZip(fileIds);

      const zipUrl = window.URL.createObjectURL(blob);
      triggerDownload(zipUrl, "Converted-files.zip");
      window.URL.revokeObjectURL(zipUrl);
    } catch (err) {
      alert("Ошибка при скачивании ZIP: " + err.message);
    }
  };

  return {
    // Показываем успешный результат
    showResult: async (result) => {
      cleanupUrls(downloadUrls, lastDownloadURL);

      await (result.type === "single"
        ? showCurrentFile(result.blob, result.filename)
        : showMultipleFiles(result.files));
    },
    // Показываем ошибку
    showError: (message) => {
      container.innerHTML = resultTemplates.renderErrorMessage(message);
      container.style.display = "block";
    },
    // Очистка данных
    clear: () => {
      container.innerHTML = "";
      container.style.display = "none";
      cleanupUrls(downloadUrls, lastDownloadURL);
      lastFileName = null;
    },
  };
};
