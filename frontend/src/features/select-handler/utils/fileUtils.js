// Функция для получения расширения всех файлов
export function getFileExtensions(fileList) {
  return [...fileList].map((file) => file.name.split(".").pop().toLowerCase());
}
// Функция для получения уникальных расширений
export function getUniqueExtensions(files) {
  const extensions = getFileExtensions(files);
  return [...new Set(extensions)];
}
