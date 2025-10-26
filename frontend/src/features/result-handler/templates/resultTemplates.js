import { formatFileSize } from "@/utils/formatFile";

export const renderSingleResult = ({ filename, size }) => {
  return `
      <div class="result-container">
        <h4 class="success-message">
          <i data-lucide="circle-check"></i>
          Файл успешно конвертирован
        </h4>
        <div class="result-list">
          <div class="file-info">
            <p class="file-info__name">${filename}</p>
            <p class="file-info__size">${formatFileSize(size)}</p>
          </div>
          <button class="btn btn--download">
            Скачать 
            <i data-lucide="download"></i>
          </button>
        </div>
      </>
    `;
};

export const renderMultipleResult = ({ filesList, filesLength }) => {
  return `
     <div class="result-container">
        <div class="success-message success-message--multiple">
            <p>Файлы успешно конвертированы!</p>
            <span>Обработано файлов: ${filesLength}</span>
        </div>
        <div class="files-list">
          <div class="files-list__header">
            <h4>Скачивание файлов:</h4> 
            <button class="btn btn--download-zip">
              Скачать все
              <i data-lucide="folder-down"></i>
            </button>
          </div>
          ${filesList}
        </div>
      </div>
    `;
};
