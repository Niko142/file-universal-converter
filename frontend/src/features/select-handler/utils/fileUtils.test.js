import { describe, expect, test } from "vitest";
import { getFileExtensions, getUniqueExtensions } from "./fileUtils";

// Имитируем попадаемый список файлов
const singleFile = {
  name: "file.png",
};

const sameExtensionFiles = [
  {
    name: "file1.png",
  },
  {
    name: "file2.png",
  },
];

const differentExtensionFiles = [
  {
    name: "image.png",
  },
  {
    name: "file.pdf",
  },
  {
    name: "imagfefe.webp",
  },
];

// Частные и произвольные случаи
const complexFiles = [
  { name: "image.PNG" },
  { name: "document.pdf" },
  { name: "file" },
  { name: "image." },
  { name: "archive.tar.gz" },
  { name: "script.min.js" },
];

describe("fileUtils", () => {
  describe("Функция для получения расширений всех файлов", () => {
    test("1 файл в списке", () => {
      expect(getFileExtensions([singleFile])).toStrictEqual(["png"]);
    });
    test("Список файлов с одинаковым расширением", () => {
      expect(getFileExtensions(sameExtensionFiles)).toStrictEqual([
        "png",
        "png",
      ]);
    });
    test("Список файлов с разными расширениями", () => {
      expect(getFileExtensions(differentExtensionFiles)).toStrictEqual([
        "png",
        "pdf",
        "webp",
      ]);
    });
    test("Сложные и частные случаи имен файлов", () => {
      expect(getFileExtensions(complexFiles)).toStrictEqual([
        "png",
        "pdf",
        "",
        "",
        "gz",
        "js",
      ]);
    });
  });
  describe("Функция для получения уникальных расширений", () => {
    test("1 файл в списке", () => {
      expect(getUniqueExtensions([singleFile])).toStrictEqual(["png"]);
    });
    test("Список файлов с одинаковым расширением", () => {
      expect(getUniqueExtensions(sameExtensionFiles)).toStrictEqual(["png"]);
    });
    test("Список файлов с разными расширениями", () => {
      expect(getUniqueExtensions(differentExtensionFiles)).toStrictEqual([
        "png",
        "pdf",
        "webp",
      ]);
    });
  });
});
