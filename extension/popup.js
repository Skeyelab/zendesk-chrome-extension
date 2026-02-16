// Popup JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const openSettingsBtn = document.getElementById('openSettings');
  
  openSettingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
