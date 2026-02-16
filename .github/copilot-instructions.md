# Copilot Instructions for Zendesk Chrome Extension

## Repository Overview

This is a Chrome extension that provides a sidebar for Zendesk agents to quickly view ticket information and requester details. The extension is built using Chrome Manifest V3 with vanilla JavaScript (no build tools or dependencies required).

**Key Facts:**
- Language: JavaScript (ES6+)
- Framework: Vanilla JS (no external dependencies)
- Build Process: None required - pure HTML/CSS/JS
- Target Platform: Chrome (Chromium-based browsers)
- Extension Type: Chrome Manifest V3
- Size: Small codebase (~15 files)

## Project Structure

### Core Extension Files
- `manifest.json` - Extension configuration (Manifest V3, defines permissions and scripts)
- `background.js` - Service worker for handling extension icon clicks and toggle logic
- `content.js` - Content script injected into Zendesk pages, extracts ticket data
- `sidepanel.html` - Side panel UI HTML structure
- `sidepanel.css` - Side panel styling with purple-blue gradient design
- `sidepanel.js` - Side panel logic for displaying ticket information
- `options.html` - Extension settings page HTML
- `options.js` - Settings page logic (domain filter, enable/disable toggle)
- `popup.html` - Extension popup HTML (opened from toolbar icon)
- `popup.js` - Popup logic

### Documentation Files
- `README.md` - User documentation, features, installation guide
- `IMPLEMENTATION.md` - Technical implementation details and architecture
- `TEST.html` - Testing guide for manual testing
- `DEMO.html` - Visual mockup demo

### Assets
- `icons/` - Extension icons (icon16.png, icon48.png, icon128.png, icon.svg)

### Configuration
- `.gitignore` - Excludes node_modules, build artifacts, IDE files

## Development Instructions

### Installation for Testing
There is NO build step required. To test the extension:

1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `zendesk-chrome-extension` directory
6. The extension is now installed and ready to test

**Important:** Always test on an actual Zendesk instance (e.g., `yourcompany.zendesk.com/agent/tickets/12345`) to verify functionality.

### Testing the Extension

**Manual Testing Steps:**
1. Install the extension using the steps above
2. Navigate to a Zendesk ticket page (URL must match pattern: `*.zendesk.com/agent/tickets/*`)
3. Click the extension icon in Chrome toolbar to open the side panel
4. Verify the side panel displays:
   - Ticket ID (e.g., "Ticket #12345")
   - Requester name (extracted from page)
   - Requester email (extracted from page)
5. Test settings:
   - Click the ⚙ button in the side panel header
   - Configure Zendesk domain filter (optional)
   - Toggle sidebar enable/disable
6. Test navigation: Navigate to different tickets and verify data updates

**No automated tests exist** - all testing is manual. Do not add test frameworks unless specifically requested.

### Code Modification Guidelines

**When making changes:**
1. **No build process** - Edit files directly, reload extension in `chrome://extensions/`
2. **Test immediately** - After any change, click "Reload" button in `chrome://extensions/` and test on a Zendesk page
3. **XSS Protection** - All dynamic content displayed in the UI must be HTML-escaped (see `escapeHtml()` in `sidepanel.js`)
4. **Minimal permissions** - Only request necessary Chrome permissions in `manifest.json`
5. **Host restrictions** - Keep extension limited to `*.zendesk.com` domains

### Key Code Patterns

**Content Script (content.js):**
- Extracts ticket ID from URL: `/agent/tickets/(\d+)`
- Uses DOM selectors to find requester name and email
- Listens for `getTicketData` messages from side panel
- Observes URL changes for SPA navigation (Zendesk is a single-page app)
- Debounce delay: 500ms for URL changes

**Side Panel (sidepanel.js):**
- Requests ticket data from content script via message passing
- Updates every 2 seconds when visible (polling interval: 2000ms)
- HTML-escapes all dynamic content using `escapeHtml()` function
- Handles chrome.tabs permission gracefully

**Background Worker (background.js):**
- Handles extension icon clicks
- Opens/closes side panel on current tab

### Security Requirements

**CRITICAL - Always follow these security practices:**
1. **XSS Protection** - Never use `innerHTML` with unsanitized data. Use `textContent` or `escapeHtml()` utility
2. **Content Security Policy** - No inline scripts, all JS in external files
3. **Minimal Permissions** - Only request permissions actually used
4. **No External APIs** - Current MVP makes no external network requests (privacy-focused)

**Before completing any task:**
- Run CodeQL security scan (if available)
- Verify all dynamic content is properly escaped
- Check that no new permissions were added to manifest.json unless necessary

## Common Tasks

### Adding a New UI Element to Side Panel
1. Edit `sidepanel.html` - Add HTML structure
2. Edit `sidepanel.css` - Add styling (follow existing gradient theme)
3. Edit `sidepanel.js` - Add logic to populate the element
4. If data comes from page: Update `content.js` to extract it
5. Test: Reload extension and verify on a Zendesk ticket page

### Adding a New Setting
1. Edit `options.html` - Add form input
2. Edit `options.js` - Add save/load logic for new setting
3. Use `chrome.storage.sync` API for persistence
4. Test: Open options page, change setting, verify it persists

### Changing Extension Behavior
1. **For UI changes:** Edit HTML/CSS files, reload extension
2. **For data extraction:** Edit `content.js`, reload extension
3. **For icon click behavior:** Edit `background.js`, reload extension
4. **Always test** on actual Zendesk instance after changes

## Architecture Notes

**Message Passing Flow:**
1. User clicks extension icon → `background.js` opens side panel
2. Side panel opens → `sidepanel.js` requests data from active tab
3. Content script receives request → `content.js` extracts data from DOM
4. Content script responds → `sidepanel.js` displays data
5. URL changes in Zendesk → `content.js` detects change, sends update

**Data Extraction:**
The extension uses CSS selectors to extract data from Zendesk's DOM. These selectors target:
- `[data-test-id="ticket-requester-name"]` - Requester name
- `[data-test-id="ticket-requester-email"]` - Requester email
- URL pattern: `/agent/tickets/(\d+)` - Ticket ID

**Note:** Zendesk's DOM structure may change. If data extraction breaks, update selectors in `content.js`.

## Troubleshooting

**Extension not loading:**
- Check Chrome version (must support Manifest V3)
- Verify all required files exist
- Check Chrome Developer Tools console for errors

**Data not displaying:**
- Verify you're on a Zendesk ticket page (`*.zendesk.com/agent/tickets/*`)
- Check Chrome Developer Tools → Extensions → Service Workers for background.js errors
- Check content script console in page's DevTools

**Changes not taking effect:**
- Always click "Reload" in `chrome://extensions/` after code changes
- Clear Chrome storage if testing storage-related changes: `chrome.storage.sync.clear()`

## Future Enhancements

The codebase is architected to support:
- External API integrations (e.g., Swell.is customer data)
- Additional ticket metadata display
- Quick action buttons
- Custom field display

When adding API integrations, remember to:
1. Add required host permissions to `manifest.json`
2. Implement error handling for network requests
3. Consider rate limiting and caching
4. Update security documentation

## Important Reminders

- **No build tools** - Do not add webpack, npm scripts, or other build tooling unless specifically requested
- **No frameworks** - This is vanilla JS only. Do not add React, Vue, or other frameworks
- **Test on real Zendesk** - Always test on an actual Zendesk instance, not just local HTML files
- **Reload after changes** - Always reload extension in `chrome://extensions/` after code changes
- **Security first** - XSS protection is critical for extensions that display user-generated content
