import {
  initSelectHandler,
  validateSelections,
} from "./features/select-handler";
import { initProgressBar } from "./features/progress-bar";
import { convertFiles } from "./services/conversionService";
import { createResultHandler } from "./features/result-handler";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".convert-form");
  const resultContainer = document.querySelector(".result-block");
  const conversionSelect = document.querySelector("#conversion-type");

  // Обработчик показа результатов
  const resultHandler = createResultHandler(resultContainer);
  // Инициализация логики работы select-компонентов
  initSelectHandler(conversionSelect);
  // Инициализация логики и функционала индикатора загрузки
  const progressBar = initProgressBar();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    resultHandler.clear();

    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    const files = fileInput.files;
    for (let file of files) {
      formData.append("files", file);
    }
    formData.append("conversion_type", conversionSelect.value);

    if (
      !validateSelections({
        handler: resultHandler,
        conversionSelector: conversionSelect,
      })
    ) {
      return;
    }

    try {
      progressBar.showProgress();

      // Результаты конвертации файла/ов
      const result = await convertFiles(formData, progressBar);

      // Показ результата
      resultHandler.showResult(result);
    } catch (err) {
      resultHandler.showError("Ошибка: " + err.message);
    } finally {
      progressBar.hideProgress(400);
    }
  };

  form.addEventListener("submit", handleFormSubmit);
});
