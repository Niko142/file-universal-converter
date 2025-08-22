import {
  initSelectHandler,
  validateSelections,
} from "./features/select-handler";
import { initProgressBar } from "./features/progress-bar";
import { getFilenameFromResponse } from "./utils/headers";
import { createResultHandler } from "./utils/resultHandler";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".convert-form");
  const resultContainer = document.querySelector(".result-block");

  // Обработчик показа результатов
  const resultHandler = createResultHandler(resultContainer);
  // Инициализация логики работы select-компонентов
  initSelectHandler();
  // Инициализация логики и функционала индикатора загрузки
  const progressBar = initProgressBar();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    resultHandler.clear();

    const formData = new FormData(form);
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      resultHandler.showError("Необходимо выбрать файл для конвертации");
      return;
    }

    // Валидация select-полей (на основе true/false)
    if (!validateSelections(resultHandler)) {
      return;
    }

    try {
      // Задаем разметку индикатора
      progressBar.showProgress();

      const response = await fetch("http://localhost:8000/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(`${data.detail || response.status}`);
      }

      // Чтение потока данных
      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length") || 0;

      let receivedLength = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;

        if (contentLength) {
          let percent = (receivedLength / contentLength) * 100;
          progressBar.fillProgress(percent.toFixed(1));
        }
      }

      const blob = new Blob(chunks);
      const filename = getFilenameFromResponse(response) || "converted-file";

      resultHandler.showSuccess(blob, filename);
    } catch (err) {
      resultHandler.showError("Ошибка: " + err.message);
    } finally {
      progressBar.hideProgress(400);
    }
  };

  form.addEventListener("submit", handleFormSubmit);
});
