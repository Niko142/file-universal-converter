import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".convert-form");
  const resultDiv = document.querySelector(".result-block");
  let lastDownloadUrl = null;
  let lastFileName = null;

  form.addEventListener("submit", handleFormSubmit);

  async function handleFormSubmit(e) {
    e.preventDefault();
    clearResult();

    const formData = new FormData(form);
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      showError("Необходимо выбрать файл для конвертации");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/convert", {
        method: "POST",
        body: formData,
      });

      // Проверка Content-Type перед обработкой
      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        // Если это JSON ошибка (должно быть от FastAPI)
        if (contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || `Ошибка сервера: ${response.status}`
          );
        }
        // Если это HTML ошибка (по умолчанию от FastAPI)
        else if (contentType.includes("text/html")) {
          const errorText = await response.text();
          const errorMatch =
            errorText.match(/<h1>\d+\s+([^<]+)<\/h1>/) ||
            errorText.match(/<title>\d+\s+([^<]+)<\/title>/);
          if (errorMatch) {
            throw new Error(errorMatch[1]);
          } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
          }
        } else {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
      }

      // Обработка blob
      const blob = await response.blob();
      const filename = getFilenameFromResponse(response) || "converted-file";

      lastFileName = filename;

      showDownloadButton(blob, filename);
    } catch (err) {
      showError("Ошибка: " + err.message);
    }
  }

  // Вывод кнопки для загрузки файла
  function showDownloadButton(blob, filename) {
    if (lastDownloadUrl) {
      try {
        window.URL.revokeObjectURL(lastDownloadUrl);
      } catch {}
    }

    const url = window.URL.createObjectURL(blob);
    lastDownloadUrl = url;

    resultDiv.innerHTML = `
      <div class="result-container">
        <p class="success-message">Конвертация завершена успешно!</p>
        <p class="file-info">Файл: ${filename} (${formatFileSize(
      blob.size
    )})</p>
        <button class="download-btn" onclick="downloadFile()">Скачать результат</button>
      </div>
    `;
    resultDiv.style.display = "block";
  }

  // Загрузка файла
  function downloadFile() {
    if (!lastDownloadUrl || !lastFileName) return;

    const a = document.createElement("a");
    a.href = lastDownloadUrl;
    a.download = lastFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function getFilenameFromResponse(response) {
    const cd = response.headers.get("Content-Disposition");
    if (!cd) return null;

    const match =
      cd.match(/filename\s*=\s*"([^"]+)"/i) ||
      cd.match(/filename\s*=\s*([^;]+)/i);

    return match ? match[1].trim() : null;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Показ ошибки
  function showError(msg) {
    resultDiv.innerHTML = `<div class="error-message">${msg}</div>`;
    resultDiv.style.display = "block";
  }

  // Очистка результата
  function clearResult() {
    resultDiv.innerHTML = "";
    resultDiv.style.display = "none";
    lastFileName = null;
  }

  window.downloadFile = downloadFile;
});
