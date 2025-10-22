import { HIDE_DELAY } from "@/constants/delay";
import { clampPercent } from "@/utils/math";
import { renderProgressBar } from "../templates/progressBar";
import { PROGRESS_TEXTS } from "../constants/text";

export const initProgressBar = () => {
  const form = document.querySelector(".converter-form");

  if (!form) {
    console.warn("Converter-form не найдена");
    return;
  }

  form.insertAdjacentHTML("beforeend", renderProgressBar());

  const progressBar = form.querySelector(".progress");
  const progressText = progressBar.querySelector(".progress__text");
  const progressFill = progressBar.querySelector(".progress__fill");

  let hideTimeout = null;
  // Метод для скрытия индикатора
  const hideProgress = () => {
    return new Promise((resolve) => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      hideTimeout = setTimeout(() => {
        progressBar.classList.remove("active");
        progressFill.style.width = "0%";
        hideTimeout = null;
        resolve();
      }, HIDE_DELAY);
    });
  };

  // Метод заполнения индикатора
  const fillProgress = (percent) => {
    const clampedPercent = clampPercent(percent);

    requestAnimationFrame(() => {
      progressFill.style.width = `${clampedPercent}%`;
    });

    if (clampedPercent < 90) {
      progressText.textContent = PROGRESS_TEXTS.preparing;
    } else {
      progressText.textContent = PROGRESS_TEXTS.complete;
    }
  };

  // Метод показа индикатора
  const showProgress = (text = PROGRESS_TEXTS.preparing) => {
    progressText.textContent = text;
    progressBar.classList.add("active");
  };

  return {
    showProgress,
    hideProgress,
    fillProgress,
  };
};
