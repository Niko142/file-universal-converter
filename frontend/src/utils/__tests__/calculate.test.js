import { describe, expect, test } from "vitest";
import { calculateExactPercent, clampPercent } from "../calculate";

describe("calculate utils", () => {
  describe("clampPercent", () => {
    test("Нулевое значение", () => {
      expect(clampPercent(0)).toBe(0);
    });
    test("Положительное ненулевое значение", () => {
      expect(clampPercent(57)).toBe(57);
    });
    test("Отрицательное значение", () => {
      expect(clampPercent(-6)).toBe(0);
    });
    test("Значение больше диапазона", () => {
      expect(clampPercent(153)).toBe(100);
    });
  });

  describe("calculateExactPercent", () => {
    test("Корректное вычисление для целых чисел из диапазона", () => {
      expect(calculateExactPercent(50, 100)).toBe(50);
      expect(calculateExactPercent(25, 100)).toBe(25);
      expect(calculateExactPercent(100, 100)).toBe(100);
      expect(calculateExactPercent(0, 100)).toBe(0);
    });
    test("Маленькое и бесконечное значение", () => {
      expect(calculateExactPercent(100, 0)).toBe(Infinity);
      expect(calculateExactPercent(10, 1)).toBe(1000);
    });
    test("Большое значение", () => {
      expect(calculateExactPercent(1048576, 10485760)).toBe(10);
    });
  });
});
