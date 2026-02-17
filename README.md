# Zendesk Sidebar Extension

A Chrome extension that provides a convenient side panel for Zendesk agents, displaying ticket information and requester details. Includes a backend proxy for secure Zendesk API access.

## Repo structure

```
extension/   Chrome extension (side panel, content script, options)
proxy/       Backend proxy for Zendesk OAuth + API (deployed via Coolify)
```

## Features

- **Side Panel** — Uses Chrome's native Side Panel API; Zendesk viewport resizes automatically (like Invoice Ninja)
- **Automatic Ticket Detection** — Detects when you're viewing a Zendesk ticket
- **Ticket Information** — Displays ticket ID, requester name, and email
- **One-Click Access** — Click the extension icon to open the side panel

## Installation (Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/Skeyelab/zendesk-chrome-extension.git
   cd zendesk-chrome-extension
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the **`extension/`** directory

5. The extension icon should appear in your Chrome toolbar

## OAuth Setup

To enable OAuth authentication with Zendesk (required for API access):

1. **Quick Start:** Follow the [OAuth Setup Checklist](./OAUTH_SETUP_CHECKLIST.md)
2. **Detailed Guide:** See [OAuth Setup Documentation](./OAUTH_SETUP.md)
3. **Helper Tool:** Run `node scripts/get-extension-id.js` to get your extension ID and redirect URIs

**Key Steps:**
- Create a Zendesk OAuth client (Admin Center → APIs → OAuth Clients)
- Set client kind to **Confidential**
- Add redirect URI: `https://<EXTENSION_ID>.chromiumapp.org/`
- Configure proxy with client credentials

See documentation for complete setup instructions.

## Usage

1. Navigate to any Zendesk ticket page
2. Click the extension icon in your toolbar — the side panel opens on the right
3. Zendesk resizes to make room (no overlay)
4. Ticket ID and requester info display automatically
5. Click the gear icon in the side panel header to open settings

## Configuration

Access settings via the gear icon in the side panel, or right-click the extension icon and select "Options".

- **Zendesk Domain** — Restrict the extension to a specific Zendesk instance (optional; leave empty for all)
- **Enable Sidebar** — Toggle the side panel on/off

## Technical Details

- **Manifest Version:** 3
- **Permissions:** Storage, Active Tab, Tabs, Side Panel
- **Host Permissions:** `*.zendesk.com`

### Extension (`extension/`)

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration |
| `background.js` | Enables side panel on icon click |
| `content.js` | Extracts ticket data from Zendesk DOM |
| `sidepanel.html/css/js` | Side panel UI and data rendering |
| `options.html/js` | Settings page |
| `popup.html/js` | Extension popup |
| `icons/` | Extension icons |

### Proxy (`proxy/`)

Backend service for secure Zendesk OAuth token exchange and API proxying. Deployed via Coolify. See `proxy/README.md` (coming soon).

### Running Checks Locally

Before submitting a pull request, make sure to run the following checks:

1. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

2. **Run linter**:
   ```bash
   npm run lint
   ```

3. **Validate manifest.json**:
   ```bash
   npm run validate:manifest
   ```

4. **Auto-fix linting issues** (optional):
   ```bash
   npm run lint:fix
   ```

These checks are automatically run in CI on every push and pull request.

## Contributing

Contributions are welcome! Please open a Pull Request. All work follows TDD (tests first).

## License

MIT License — see LICENSE file for details.
