// Функция для получения расширения всех файлов
export function getFileExtensions(fileList) {
  return [...fileList].map((file) => {
    const splitFile = file.name.split(".");

    return splitFile.length > 1 ? splitFile.pop().toLowerCase() : "";
  });
}

// Функция для получения уникальных расширений
export function getUniqueExtensions(files) {
  const extensions = getFileExtensions(files);
  return [...new Set(extensions)];
}
