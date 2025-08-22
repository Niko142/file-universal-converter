import { CONVERSIONS_OPTIONS } from "@/constants/conversions";
import {
  renderSelectOption,
  renderStartOption,
} from "../templates/selectOption";

const categorySelect = document.querySelector("#category");
const conversionSelect = document.querySelector("#conversion-type");

export const initSelectHandler = () => {
  categorySelect.addEventListener("change", () => {
    const optionItems = CONVERSIONS_OPTIONS[categorySelect.value] || [];

    // Стартовая очистка и добавление заглушки
    conversionSelect.innerHTML = "";
    conversionSelect.innerHTML = renderStartOption;

    // Формирование опций на основе выбранной категории
    optionItems.forEach((item) => {
      conversionSelect.insertAdjacentHTML(
        "beforeend",
        renderSelectOption({ value: item.value, label: item.label })
      );
    });

    conversionSelect.disabled = false;
  });
};

export function validateSelections(handler) {
  if (!categorySelect.value) {
    handler.showError("Ошибка: необходимо выбрать категорию");
    return false;
  }

  if (!conversionSelect.value) {
    handler.showError("Не выбран формат преобразования");
    return false;
  }

  return true;
}
