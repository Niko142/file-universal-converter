import { CONVERSIONS_OPTIONS } from "@/constants/conversionTypes";
import {
  renderSelectOption,
  renderStartOption,
} from "../templates/selectOptions";
import { getFileExtensions, getUniqueExtensions } from "../utils/fileUtils";

/**
 * Обновление состояния input-селекторов
 * @param {HTMLSelectElement} categorySelect - Селектор категории
 * @param {HTMLSelectElement} conversionSelect - Селектор выбора типа конвертации
 * @param {boolean} disabled - Флаг для блокирования/разблокирования селекторов
 */
const updateSelects = (categorySelect, conversionSelect, disabled = true) => {
  categorySelect.disabled = disabled;
  conversionSelect.disabled = disabled;

  if (disabled) {
    categorySelect.value = "";
    conversionSelect.value = "";
  }
};

/**
 * Формирование подходящих option на основе ext
 * @param {HTMLSelectElement} conversionSelector - Селектор выбора типа конвертации
 * @param {Array} items - Массив доступных типов конвертации
 * @param {string} fileExt - Расширение файла
 */
const makeSuitableOptions = (conversionSelector, items, fileExt) => {
  // Стартовая очистка и добавление заглушки
  conversionSelector.innerHTML = renderStartOption;

  // Фильтруем подходящие option на основе полученного ext
  const filteredOptions = items.filter((item) =>
    item.value.startsWith(fileExt)
  );

  // Формируем подходящие option
  filteredOptions.forEach((item) => {
    conversionSelector.insertAdjacentHTML(
      "beforeend",
      renderSelectOption(item)
    );
  });

  conversionSelector.disabled = filteredOptions.length === 0;
};

// Инициализация select-handler-логики
export const initSelectHandler = ({
  conversionSelector,
  categorySelector,
  fileSelector,
  handler,
}) => {
  // Обработчик в случа изменения файла для конвертирования
  const handleFileChange = () => {
    conversionSelector.value = "";

    if (fileSelector.files.length === 0) {
      updateSelects(categorySelector, conversionSelector);
      return;
    }

    // Формируем список уникальных ext
    const uniqueExts = getUniqueExtensions(fileSelector.files);

    if (uniqueExts.length > 1) {
      updateSelects(categorySelector, conversionSelector);

      handler.showError("Ошибка: файлы должны быть одинакового типа");
      return;
    }

    categorySelector.disabled = false;
  };

  // Обработчик в случае изменения категории
  const handleCategoryChange = () => {
    const optionItems = CONVERSIONS_OPTIONS[categorySelector.value] || [];

    const fileExt = getFileExtensions(fileSelector.files)[0];

    makeSuitableOptions(conversionSelector, optionItems, fileExt);
  };

  fileSelector.addEventListener("change", handleFileChange);
  categorySelector.addEventListener("change", handleCategoryChange);

  // clean-up для оптимизации
  return () => {
    fileSelector.removeEventListener("change", handleFileChange);
    categorySelector.removeEventListener("change", handleCategoryChange);
  };
};

// Валидация данных перед отправкой формы
export function validateSelections({
  files,
  handler,
  categorySelector,
  conversionSelector,
}) {
  if (files.length === 0) {
    handler.showError("Выберите файл");
    return false;
  }
  if (!categorySelector.value) {
    handler.showError("Выберите категорию");
    return false;
  }
  if (!conversionSelector.value) {
    handler.showError("Выберите формат конвертации");
    return false;
  }
  return true;
}
