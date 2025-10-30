import { createIcons, RefreshCcw } from "lucide";
import { initProgressBar } from "./features/progress-bar";
import { initResultHandler } from "./features/result-handler";
import {
  initSelectHandler,
  validateSelections,
} from "./features/select-handler";
import { convertFiles } from "./services/conversion.service";

import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  createIcons({
    icons: {
      RefreshCcw,
    },
    attrs: { width: 24, height: 24 },
  });
  const form = document.querySelector(".converter-form");
  const fileInput = document.querySelector('input[type="file"]');
  const conversionSelect = document.querySelector("#conversion-type");
  const categorySelect = document.querySelector("#category");

  // Обработчик показа результатов
  const resultHandler = initResultHandler();
  // Инициализация логики работы select-компонентов
  initSelectHandler({
    conversionSelector: conversionSelect,
    categorySelector: categorySelect,
    fileSelector: fileInput,
    handler: resultHandler,
  });
  // Инициализация логики и функционала индикатора загрузки
  const progressBar = initProgressBar();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    resultHandler.clear();

    const formData = new FormData();
    const files = fileInput.files;
    for (let file of files) {
      formData.append("files", file);
    }
    formData.append("conversion_type", conversionSelect.value);

    // Обработчик валидации
    if (
      !validateSelections({
        files: files,
        handler: resultHandler,
        categorySelector: categorySelect,
        conversionSelector: conversionSelect,
      })
    ) {
      return;
    }

    try {
      progressBar.showProgress();

      // Конвертируем файлы
      const result = await convertFiles(formData, progressBar);

      // Если все прошло успешно, то скрываем progress-bar и выводим результаты
      await progressBar.hideProgress();
      resultHandler.showResult(result);
    } catch (err) {
      await progressBar.hideProgress();
      resultHandler.showError(err.message);
    }
  };

  form.addEventListener("submit", handleFormSubmit);
});
