export function initProgressBar() {
  const progressBar = document.querySelector(".progress");
  const progressFill = document.querySelector(".progress-fill");
  const progressText = document.querySelector(".progress-text");

  if (!progressBar || !progressFill) {
    console.error("Элементы индикатора загрузки не найдены");
    return;
  }

  // Показываем индикатор
  function showProgress(text = "Подготовка...") {
    progressText.textContent = text;
    progressBar.classList.add("active");
  }

  // Скрываем индикатор
  function hideProgress() {
    setTimeout(() => {
      progressBar.classList.remove("active");
      progressFill.style.width = "0%";
    }, 500);
  }

  // Эффект заполняемости шкалы
  function fillProgress(percent) {
    const clampedPercent = Math.min(Math.max(percent, 0), 100);

    requestAnimationFrame(() => {
      progressFill.style.width = `${clampedPercent}%`;
    });

    if (clampedPercent < 30) {
      progressText.textContent = "Подготовка...";
    } else {
      progressText.textContent = "Готово!";
    }

    if (clampedPercent >= 100) {
      setTimeout(() => hideProgress(), 1000);
    }
  }

  return {
    showProgress,
    hideProgress,
    fillProgress,
  };
}
