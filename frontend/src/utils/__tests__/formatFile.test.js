import { describe, expect, test } from "vitest";
import { formatFileSize } from "../formatFile";

describe("Проверка преобразования размера файла", () => {
  test("Нулевое значение", () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
  });
  test("Форматирование в килобайты", () => {
    expect(formatFileSize(1024)).toBe("1.00 KB");
  });
  test("Форматирование в мегабайты", () => {
    expect(formatFileSize(1048576)).toBe("1.00 MB");
  });
  test("Случайно выбранное число", () => {
    expect(formatFileSize(1234)).toBe("1.21 KB");
  });
});
