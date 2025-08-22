export function initProgressBar() {
  const progressBar = document.querySelector(".progress");
  const progressFill = document.querySelector(".progress-fill");

  if (!progressBar || !progressFill) {
    console.error("Элементы индикатора загрузки не найдены");
    return;
  }

  function showProgress() {
    progressBar.classList.add("active");
    fillProgress(0);
  }

  function hideProgress(delay) {
    setTimeout(() => {
      progressBar.classList.remove("active");
    }, delay);
  }

  function fillProgress(percent) {
    progressFill.style.width = `${percent}%`;
  }

  return {
    showProgress,
    hideProgress,
    fillProgress,
  };
}
