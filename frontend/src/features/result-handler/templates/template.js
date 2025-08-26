import { formatFileSize } from "@/utils/formatFile";

export const resultTemplates = {
  renderSingleResult({ filename, size }) {
    return `
      <div class="result-container">
        <p class="success-message">Конвертация завершена успешно!</p>
        <p class="file-info">Результат: ${filename} (${formatFileSize(size)})</p>
        <button class="download-btn">Скачать файл</button>
      </div>
    `;
  },

  renderFileInfo({ filename, size, index }) {
    return `       
      <div class="file-item">
        <div class="file-info">
          <p class="file-name">${filename}</p>
          <p class="file-size">Размер:(${formatFileSize(size)})</p>
        </div>
        <button class="download-single-btn" data-index="${index}">
          Скачать
        </button>
      </div>
    `;
  },

  renderMultipleResult({ filesList, filesLength }) {
    return `
     <div class="result-container">
        <p class="success-message">Конвертация завершена успешно!</p>
        <div class="files-list">
          <h4>Обработанных файлов (${filesLength}):</h4>
          <button class="download-zip-btn">Скачать все</button>
          <h4>Скачивание по отдельности:</h4>
          ${filesList}
        </div>
      </div>
    `;
  },

  renderErrorMessage(message) {
    return `<div class="error-message">${message}</div>`;
  },
};
