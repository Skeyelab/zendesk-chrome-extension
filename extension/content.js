// Content script: extracts ticket data from Zendesk and sends it to the side panel
(function () {
  'use strict';

  const URL_CHANGE_DEBOUNCE_MS = 500;
  let lastUrl = location.href;

  function isTicketPage() {
    return window.location.pathname.includes('/agent/tickets/');
  }

  function getTicketId() {
    const match = window.location.pathname.match(/\/agent\/tickets\/(\d+)/);
    return match ? match[1] : null;
  }

  function getRequesterInfo() {
    const nameEl =
      document.querySelector('[data-test-id="ticket-requester-name"]') ||
      document.querySelector('.requester .name') ||
      document.querySelector('[data-garden-id="typography.anchor"]');

    const emailEl =
      document.querySelector('[data-test-id="ticket-requester-email"]') ||
      document.querySelector('.requester .email');

    return {
      name: nameEl ? nameEl.textContent.trim() : null,
      email: emailEl ? emailEl.textContent.trim() : null
    };
  }

  function getTicketData() {
    if (!isTicketPage()) return { isTicketPage: false };
    const requester = getRequesterInfo();
    return {
      isTicketPage: true,
      ticketId: getTicketId(),
      requesterName: requester.name,
      requesterEmail: requester.email
    };
  }

  // Respond to data requests from the side panel
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'getTicketData') {
      sendResponse(getTicketData());
    }
  });

  // Push updates to the side panel when the URL changes (SPA navigation)
  const observer = new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        chrome.runtime.sendMessage({
          action: 'ticketDataUpdated',
          data: getTicketData()
        }).catch(() => {});
      }, URL_CHANGE_DEBOUNCE_MS);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true });
})();
