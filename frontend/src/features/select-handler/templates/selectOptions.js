// Рендер стартовой заглушки
export const renderStartOption = () => {
  return `<option value="" disabled selected>Не выбрано</option>`;
};

// Рендер опций, взятых из Conversions-констант
export const renderSelectOption = (option) => {
  return `<option value="${option.value}">${option.label}</option>`;
};
