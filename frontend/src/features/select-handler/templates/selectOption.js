// Рендер стартовой заглушки
export const renderStartOption = () => {
  return `<option value="" disabled selected>...</option>`;
};

// Рендер опций, взятых из Conversions-констант
export const renderSelectOption = ({ value, label }) => {
  return `<option value="${value}">${label}</option>`;
};
