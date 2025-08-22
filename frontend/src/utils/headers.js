// Извлечение имени файла из Content-Disposition
export function getFilenameFromResponse(response) {
  const cd = response.headers.get("Content-Disposition");
  if (!cd) return null;

  const match =
    cd.match(/filename\s*=\s*"([^"]+)"/i) ||
    cd.match(/filename\s*=\s*([^;]+)/i);

  return match ? match[1].trim() : null;
}
