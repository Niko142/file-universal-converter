import { formatFileSize } from "./formatFile";

export const createResultHandler = (container) => {
  let lastDownloadUrl = null; // Ссылка на URL в формате Blob
  let lastFileName = null; // Последнее имя файла

  // Метод для очистки памяти от предыдущего Blob-URL (во избежание утечек памяти)
  function revokeUrl() {
    if (lastDownloadUrl) {
      try {
        window.URL.revokeObjectURL(lastDownloadUrl);
      } catch (err) {
        console.error("Не удалось освободить URL:", err);
      }
    }
  }

  // Обработчик для возможности скачивания файла
  function downloadFile() {
    if (!lastDownloadUrl || !lastFileName) return;

    const link = document.createElement("a");
    link.href = lastDownloadUrl;
    link.download = lastFileName;

    // Добавление ссылки в DOM для выполнения клика (для кроссбраузерности)
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return {
    // Вывод сообщений об ошибке
    showError: (message) => {
      container.innerHTML = `<div class="error-message">${message}</div>`;
      container.style.display = "block";
    },

    // Демонстрация успешной конвертации в формате:
    // "Название файл" - "Размер файла"
    // с возможностью установки файла
    showSuccess: (blob, filename) => {
      // Очистка предыдущего URL и формирование нового
      revokeUrl();
      lastDownloadUrl = window.URL.createObjectURL(blob);
      lastFileName = filename;

      container.innerHTML = `
        <div class="result-container">
          <p class="success-message">Конвертация завершена успешно!</p>
          <p class="file-info">Результат: ${filename} (${formatFileSize(blob.size)})</p>
          <button class="download-btn">Скачать результат</button>
        </div>
      `;

      // Обработчик кнопки для загрузки
      container
        .querySelector(".download-btn")
        .addEventListener("click", downloadFile);

      container.style.display = "block";
    },

    // Очистка данных перед началом каждого submit
    clear: () => {
      container.innerHTML = "";
      container.style.display = "none";
      revokeUrl();
      lastFileName = null;
    },
  };
};
