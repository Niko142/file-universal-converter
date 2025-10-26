/**
 * Создает временный Blob-URL для доступа к Blob
 * @param {Blob} blob
 * @returns Временный URL
 */
export const createObjectUrl = (blob) => window.URL.createObjectURL(blob);
/**
 * Освобождает ранее используемый Blob-URL для освобождения памяти
 * @param {string} url - Blob-URL
 * @returns Освобожденный URL
 */
export const revokeObjectURL = (url) => window.URL.revokeObjectURL(url);
