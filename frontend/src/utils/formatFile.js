import { UNIT_SIZE } from "@/constants/file";

/**
 * Преобразование размер полученного файла в нормальный вид
 * @param {number} bytes - Размер файла в байтах
 * @returns Отформатированный размер
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];

  // Определяем подходящую единицу измерения через логарифмы
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(UNIT_SIZE));
  const unitValue = bytes / Math.pow(UNIT_SIZE, unitIndex); // Вычисление значения

  const formattedValue = unitValue.toFixed(2);

  return `${formattedValue} ${units[unitIndex]}`;
};
