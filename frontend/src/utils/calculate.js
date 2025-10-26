import { UNIT_SIZE } from "@/constants/file";

/**
 * Ограничивает процент в диапазоне от 0 до 100
 * @param {number} percent - Процент для ограничения
 * @returns Процент загрузки в диапазоне [0, 100]
 */
export const clampPercent = (percent) => {
  return Math.min(Math.max(percent, 0), 100);
};

/**
 * Вычисляет точный процент загрузки
 * @param {number} receivedLength - Количество полученных байт
 * @param {number} contentLength - Размер контента, байт
 * @returns Процент загрузки в диапазоне [0, 100]
 */
export const calculateExactPercent = (receivedLength, contentLength) => {
  return (receivedLength / contentLength) * 100;
};

/**
 * Имитирует процент загрузки, если отсутствует размер контента (Content-Length)
 * @param {number} receivedLength - Количество полученных байт
 * @param {number} estimatedSize - Примерный размер контента, байт
 * @returns Оценочный процент загрузки в диапазоне [0, 85]
 */
export const calculateEstimatedPercent = (receivedLength) => {
  // Конвертируем размера в килобайты
  const kilobytes = receivedLength / UNIT_SIZE;

  // Наиболее подходящий подход: расчет на базе логарифма
  const estimate = Math.log(kilobytes + 10) * 18;

  // Ограничиваем 85%, чтобы показать, что это оценка (не точный размер)
  return Math.min(estimate, 85);
};
