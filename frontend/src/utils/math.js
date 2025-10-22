// Функция для ограничения процента в диапазоне
export const clampPercent = (percent) => {
  return Math.min(Math.max(percent, 0), 100);
};
