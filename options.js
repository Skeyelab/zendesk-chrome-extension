// Options page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('settings-form');
  const zendeskDomain = document.getElementById('zendeskDomain');
  const sidebarEnabled = document.getElementById('sidebarEnabled');
  const status = document.getElementById('status');
  
  // Load saved settings
  chrome.storage.sync.get(['zendeskDomain', 'sidebarEnabled'], (result) => {
    zendeskDomain.value = result.zendeskDomain || '';
    sidebarEnabled.checked = result.sidebarEnabled !== false; // Default to true
  });
  
  // Save settings
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = {
      zendeskDomain: zendeskDomain.value.trim(),
      sidebarEnabled: sidebarEnabled.checked
    };
    
    chrome.storage.sync.set(settings, () => {
      status.textContent = 'Settings saved successfully!';
      status.className = 'status success';
      
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    });
  });
});
