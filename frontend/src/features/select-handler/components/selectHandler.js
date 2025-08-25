import { CONVERSIONS_OPTIONS } from "@/constants/conversions";
import {
  renderSelectOption,
  renderStartOption,
} from "../templates/selectOption";

const categorySelect = document.querySelector("#category");

export const initSelectHandler = (conversionSelector) => {
  categorySelect.addEventListener("change", () => {
    const optionItems = CONVERSIONS_OPTIONS[categorySelect.value] || [];

    // Стартовая очистка и добавление заглушки
    conversionSelector.innerHTML = "";
    conversionSelector.innerHTML = renderStartOption;

    // Формирование опций на основе выбранной категории
    optionItems.forEach((item) => {
      conversionSelector.insertAdjacentHTML(
        "beforeend",
        renderSelectOption({ value: item.value, label: item.label })
      );
    });

    conversionSelector.disabled = false;
  });
};

export function validateSelections({ handler, conversionSelector }) {
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
