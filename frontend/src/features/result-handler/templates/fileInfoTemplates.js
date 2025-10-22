import { formatFileSize } from "@/utils/formatFile";

export const renderFileInfo = ({ filename, size, index }) => {
  return `       
      <div class="file-item">
        <div class="file-info">
          <p class="file-info__name">${filename}</p>
          <p class="file-info__size">${formatFileSize(size)}</p>
        </div>
        <button class="btn btn--download-single" data-index="${index}">
          Скачать
        </button>
      </div>
    `;
};
