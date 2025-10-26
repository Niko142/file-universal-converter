export const renderErrorMessage = (message) => {
  return `
    <div class="error-message">
      <i data-lucide="circle-x"></i>
      <p>${message}</p>
    </div>`;
};
