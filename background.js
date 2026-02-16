// Background script for handling extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Only inject on Zendesk pages - properly validate the hostname
  if (tab.url) {
    try {
      const url = new URL(tab.url);
      // Check if hostname ends with .zendesk.com or is exactly zendesk.com
      if (url.hostname.endsWith('.zendesk.com') || url.hostname === 'zendesk.com') {
        // Send message to content script to toggle sidebar
        chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
        return;
      }
    } catch (e) {
      // Invalid URL, show notification
    }
  }
  
  // Show notification if not on a Zendesk page
  chrome.action.setBadgeText({ text: '!', tabId: tab.id });
  chrome.action.setBadgeBackgroundColor({ color: '#f59e0b', tabId: tab.id });
  
  setTimeout(() => {
    chrome.action.setBadgeText({ text: '', tabId: tab.id });
  }, 3000);
});
