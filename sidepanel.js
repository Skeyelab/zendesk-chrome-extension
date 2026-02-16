// Side panel: requests ticket data from the content script and renders it
const POLL_INTERVAL_MS = 2000;
let pollTimer = null;

const contentEl = document.getElementById('content');
document.getElementById('settingsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

function escapeHtml(text) {
  const el = document.createElement('span');
  el.textContent = text;
  return el.innerHTML;
}

function render(data) {
  if (!data || !data.isTicketPage) {
    contentEl.innerHTML =
      '<div class="section"><p class="empty-state">Navigate to a Zendesk ticket to see information here.</p></div>';
    return;
  }

  contentEl.innerHTML = `
    <div class="section">
      <h3>Ticket Information</h3>
      <div class="field">
        <label>Ticket ID</label>
        <span class="value">#${escapeHtml(data.ticketId || '—')}</span>
      </div>
    </div>
    <div class="section">
      <h3>Requester</h3>
      <div class="field">
        <label>Name</label>
        <span class="value">${escapeHtml(data.requesterName || 'Loading...')}</span>
      </div>
      <div class="field">
        <label>Email</label>
        <span class="value">${escapeHtml(data.requesterEmail || 'Loading...')}</span>
      </div>
    </div>`;
}

async function fetchAndRender() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    const data = await chrome.tabs.sendMessage(tab.id, { action: 'getTicketData' });
    render(data);
  } catch {
    // Content script not yet injected or tab not on Zendesk
    render(null);
  }
}

// Listen for push updates from the content script (SPA navigation)
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'ticketDataUpdated') {
    render(message.data);
  }
});

// Poll for fresh data (catches dynamic DOM changes the content script can't observe)
function startPolling() {
  stopPolling();
  pollTimer = setInterval(fetchAndRender, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
}

// Refresh when the active tab changes
chrome.tabs.onActivated.addListener(() => fetchAndRender());

// Initial fetch + start polling
fetchAndRender();
startPolling();
