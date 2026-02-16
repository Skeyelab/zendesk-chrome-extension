# Zendesk Sidebar Extension

A Chrome extension that provides a convenient sidebar for Zendesk agents, displaying ticket information and requester details.

## Features

- 🎯 **Automatic Ticket Detection** - Automatically detects when you're viewing a Zendesk ticket
- 📋 **Ticket Information** - Displays the current ticket ID
- 👤 **Requester Details** - Shows requester name and email
- 🖱️ **One-Click Access** - Click extension icon to toggle sidebar open/closed
- ⚙️ **Integrated Settings** - Settings button built into sidebar header for easy access
- 🎨 **Clean UI** - Beautiful, modern sidebar design that resizes the viewport (like Invoice Ninja) instead of overlaying content
- 🔄 **Smooth Transitions** - Animated sidebar appearance with page content resizing

## Installation

### For Development

1. Clone this repository:
   ```bash
   git clone https://github.com/Skeyelab/zendesk-chrome-extension.git
   cd zendesk-chrome-extension
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the extension directory

5. The extension icon should appear in your Chrome toolbar

### For Users

The extension will be available in the Chrome Web Store soon.

## Usage

1. **Opening the Sidebar**:
   - Navigate to any Zendesk page
   - Click the extension icon in your Chrome toolbar to toggle the sidebar open/closed
   - The sidebar will automatically show ticket information when you're on a ticket page

2. **Using the Sidebar**:
   - The sidebar appears on the right side, resizing the page content to accommodate it
   - The page content smoothly adjusts to make room for the sidebar (similar to Invoice Ninja's approach)
   - View ticket ID and requester information at a glance
   - Click the ⚙ (settings) button to configure the extension
   - Click the × button to close the sidebar and restore the original page layout

3. **Configuration**:
   - Click the ⚙ (settings) button in the sidebar header
   - (Optional) Enter your Zendesk domain (e.g., `yourcompany.zendesk.com`)
   - Leave empty to work with any Zendesk instance
   - Toggle the sidebar enable/disable setting

## Configuration

Access the settings page by:
- Clicking the extension icon and selecting "Open Settings"
- Or right-clicking the extension icon and selecting "Options"

### Settings Options:

- **Zendesk Domain**: Restrict the extension to a specific Zendesk instance (optional)
- **Enable Sidebar**: Toggle the sidebar on/off

## Future Enhancements

🚀 The roadmap includes:
- Integration with external API systems (e.g., Swell.is)
- Additional ticket details and metadata
- Quick actions and shortcuts
- Custom fields display
- Enhanced requester information

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Storage, Active Tab
- **Host Permissions**: `*.zendesk.com`

## Development

The extension consists of:
- `manifest.json` - Extension configuration
- `content.js` - Content script that runs on Zendesk pages
- `sidebar.css` - Styles for the sidebar UI
- `options.html/js` - Settings page
- `popup.html/js` - Extension popup
- `icons/` - Extension icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.