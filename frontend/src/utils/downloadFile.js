import { revokeObjectURL } from "./url";

// Очистка от предыдущих Blob-URL
export function cleanupUrls(urls = [], lastUrl = null) {
  urls.forEach((urlData) => {
    try {
      revokeObjectURL(urlData.url);
    } catch (err) {
      console.error("Ошибка освобождения URL:", err);
    }
  });

  if (lastUrl) {
    try {
      revokeObjectURL(lastUrl);
    } catch (err) {
      console.error("Ошибка освобождения URL:", err);
    }
  }
}

// Обработчик для возможности скачивания файла
export function triggerDownload(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();
}
