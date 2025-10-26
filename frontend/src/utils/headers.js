// Извлечение имени файла из Content-Disposition
export function getFilenameFromResponse(response) {
  const content = response.headers.get("Content-Disposition");

  if (!content) return null;

  const match =
    content.match(/filename\s*=\s*"([^"]+)"/i) ||
    content.match(/filename\s*=\s*([^;]+)/i);

  return match ? match[1].trim() : null;
}
