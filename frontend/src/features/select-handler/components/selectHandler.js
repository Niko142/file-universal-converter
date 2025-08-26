import { CONVERSIONS_OPTIONS } from "@/constants/conversions";
import {
  renderSelectOption,
  renderStartOption,
} from "../templates/selectOption";

const categorySelect = document.querySelector("#category");

export const initSelectHandler = ({
  conversionSelector,
  fileSelector,
  handler,
}) => {
  // Функция для получения расширения всех файлов
  function getFileExtensions(fileList) {
    return [...fileList].map((file) =>
      file.name.split(".").pop().toLowerCase()
    );
  }

  // Обработчик, управляющий disabled в зависимости от изменения input-file
  fileSelector.addEventListener("change", () => {
    conversionSelector.value = "";

    if (fileSelector.files.length === 0) {
      categorySelect.value = "";
      categorySelect.disabled = conversionSelector.disabled = true;
      return;
    }

    // Берем расширения всех файлов (если их несколько)
    const filesExt = getFileExtensions(fileSelector.files);

    // Фильтруем для получения только уникальных ext
    const uniqueExts = [...new Set(filesExt)];

    if (uniqueExts.length > 1) {
      categorySelect.value = "";
      categorySelect.disabled = conversionSelector.disabled = true;

      handler.showError("Ошибка: файлы должны быть одинакового типа");
      return;
    }

    categorySelect.disabled = false;
  });

  categorySelect.addEventListener("change", () => {
    const optionItems = CONVERSIONS_OPTIONS[categorySelect.value] || [];

    // Стартовая очистка и добавление заглушки
    conversionSelector.innerHTML = renderStartOption;

    // Берем единственно нужное нам расширение
    const fileExt = getFileExtensions(fileSelector.files)[0];

    // Фильтруем подходящие option на основе полученного ext
    const filteredOptions = optionItems.filter((item) =>
      item.value.startsWith(fileExt)
    );

    // Формируем нужные option
    filteredOptions.forEach((item) => {
      conversionSelector.insertAdjacentHTML(
        "beforeend",
        renderSelectOption({ value: item.value, label: item.label })
      );
    });

    conversionSelector.disabled = filteredOptions.length === 0;
  });
};

// Валидация формы
export function validateSelections({ filesData, handler, conversionSelector }) {
  if (filesData.length === 0) {
    handler.showError("Ошибка: Необходимо выбрать файл");
    return false;
  }
  if (!categorySelect.value) {
    handler.showError("Ошибка: необходимо выбрать категорию");
    return false;
  }
  if (!conversionSelector.value) {
    handler.showError("Не выбран формат преобразования");
    return false;
  }
  return true;
}
