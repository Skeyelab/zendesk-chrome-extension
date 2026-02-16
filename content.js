// Content script that runs on Zendesk pages
(function() {
  'use strict';

  // Constants
  const URL_CHANGE_DEBOUNCE_MS = 500;
  const CONTENT_UPDATE_INTERVAL_MS = 2000;
  const SIDEBAR_WIDTH = 320; // Width of sidebar in pixels

  // Check if sidebar already exists
  if (document.getElementById('zendesk-extension-sidebar')) {
    return;
  }

  // Store interval and observer references for cleanup
  let updateInterval = null;
  let urlObserver = null;

  // Check if we're on a Zendesk ticket page
  function isTicketPage() {
    return window.location.pathname.includes('/agent/tickets/');
  }

  // Extract ticket ID from URL
  function getTicketId() {
    const match = window.location.pathname.match(/\/agent\/tickets\/(\d+)/);
    return match ? match[1] : null;
  }

  // Extract requester information from the page
  function getRequesterInfo() {
    // Try multiple selectors to find requester info
    const requesterName = document.querySelector('[data-test-id="ticket-requester-name"]') ||
                         document.querySelector('.requester .name') ||
                         document.querySelector('[data-garden-id="typography.anchor"]');
    
    const requesterEmail = document.querySelector('[data-test-id="ticket-requester-email"]') ||
                          document.querySelector('.requester .email');
    
    return {
      name: requesterName ? requesterName.textContent.trim() : 'Loading...',
      email: requesterEmail ? requesterEmail.textContent.trim() : 'Loading...'
    };
  }

  // Create the sidebar
  function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'zendesk-extension-sidebar';
    sidebar.className = 'zendesk-ext-sidebar';
    
    const header = document.createElement('div');
    header.className = 'zendesk-ext-header';
    header.textContent = 'Zendesk Helper';
    
    const content = document.createElement('div');
    content.className = 'zendesk-ext-content';
    content.id = 'zendesk-ext-content';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'zendesk-ext-close';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Close sidebar';
    closeBtn.onclick = () => {
      hideSidebar();
    };
    
    header.appendChild(closeBtn);
    sidebar.appendChild(header);
    sidebar.appendChild(content);
    document.body.appendChild(sidebar);
    
    // Resize the page content to make room for sidebar
    resizePageContent(true);
    
    return content;
  }
  
  // Resize page content to accommodate sidebar
  function resizePageContent(show) {
    if (show) {
      // Add margin to body to push content left
      document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;
    } else {
      // Remove inline style to restore original layout
      document.body.style.marginRight = '';
    }
  }
  
  // Hide sidebar and restore page layout
  function hideSidebar() {
    const sidebar = document.getElementById('zendesk-extension-sidebar');
    if (sidebar) {
      sidebar.classList.add('zendesk-ext-hidden');
      resizePageContent(false);
    }
    
    // Clean up intervals and observers when sidebar is closed
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    if (urlObserver) {
      urlObserver.disconnect();
      urlObserver = null;
    }
  }

  // Helper function to escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Update sidebar content with ticket information
  function updateSidebarContent(contentDiv) {
    const ticketId = getTicketId();
    const requester = getRequesterInfo();
    
    if (ticketId) {
      // Use template with escaped values to prevent XSS
      contentDiv.innerHTML = `
        <div class="zendesk-ext-section">
          <h3>Ticket Information</h3>
          <div class="zendesk-ext-field">
            <label>Ticket ID:</label>
            <span class="zendesk-ext-value">#${escapeHtml(ticketId)}</span>
          </div>
        </div>
        
        <div class="zendesk-ext-section">
          <h3>Requester</h3>
          <div class="zendesk-ext-field">
            <label>Name:</label>
            <span class="zendesk-ext-value">${escapeHtml(requester.name)}</span>
          </div>
          <div class="zendesk-ext-field">
            <label>Email:</label>
            <span class="zendesk-ext-value">${escapeHtml(requester.email)}</span>
          </div>
        </div>
        
        <div class="zendesk-ext-footer">
          <small>Zendesk Sidebar Extension v1.0</small>
        </div>
      `;
    } else {
      contentDiv.innerHTML = `
        <div class="zendesk-ext-section">
          <p>No ticket detected. Please navigate to a ticket page.</p>
        </div>
      `;
    }
  }

  // Initialize the sidebar
  function init() {
    // Check if we should show the sidebar based on settings
    chrome.storage.sync.get(['zendeskDomain', 'sidebarEnabled'], (result) => {
      const sidebarEnabled = result.sidebarEnabled !== false; // Default to true
      const configuredDomain = result.zendeskDomain || '';
      
      // Check if current domain matches configured domain (if set)
      const currentDomain = window.location.hostname;
      const shouldShow = sidebarEnabled && (
        !configuredDomain || 
        currentDomain.includes(configuredDomain)
      );
      
      if (shouldShow && isTicketPage()) {
        const contentDiv = createSidebar();
        updateSidebarContent(contentDiv);
        
        // Update sidebar when URL changes (SPA navigation)
        // Observe only the body to reduce mutation observer overhead
        let lastUrl = location.href;
        urlObserver = new MutationObserver(() => {
          const url = location.href;
          if (url !== lastUrl) {
            lastUrl = url;
            if (isTicketPage()) {
              setTimeout(() => updateSidebarContent(contentDiv), URL_CHANGE_DEBOUNCE_MS);
            }
          }
        });
        urlObserver.observe(document.body, { subtree: true, childList: true });
        
        // Also update periodically to catch dynamic content loading
        // Store interval ID for cleanup
        updateInterval = setInterval(() => {
          const sidebar = document.getElementById('zendesk-extension-sidebar');
          if (sidebar && !sidebar.classList.contains('zendesk-ext-hidden') && isTicketPage()) {
            updateSidebarContent(contentDiv);
          }
        }, CONTENT_UPDATE_INTERVAL_MS);
      }
    });
  }

  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
