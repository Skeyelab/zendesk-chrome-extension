// Background script for handling extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Only inject on Zendesk pages
  if (tab.url && tab.url.includes('zendesk.com')) {
    // Send message to content script to toggle sidebar
    chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
  } else {
    // Show notification if not on a Zendesk page
    chrome.action.setBadgeText({ text: '!', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b', tabId: tab.id });
    
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '', tabId: tab.id });
    }, 3000);
  }
});
