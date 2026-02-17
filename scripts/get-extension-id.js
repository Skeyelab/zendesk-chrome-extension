#!/usr/bin/env node

/**
 * Helper script to get Chrome Extension ID and generate OAuth redirect URI
 * 
 * This script helps developers quickly obtain the necessary information for
 * configuring Zendesk OAuth redirect URIs.
 * 
 * Usage:
 *   node scripts/get-extension-id.js [extension-id]
 * 
 * If no extension ID is provided, it will prompt for one or provide instructions.
 */

const readline = require('readline');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function printHeader() {
  console.log('\n' + colors.bright + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.bright + '  Chrome Extension OAuth Configuration Helper' + colors.reset);
  console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset + '\n');
}

function printInstructions() {
  console.log(colors.cyan + 'How to get your Chrome Extension ID:' + colors.reset);
  console.log('  1. Open Chrome and navigate to: ' + colors.bright + 'chrome://extensions/' + colors.reset);
  console.log('  2. Enable ' + colors.bright + 'Developer mode' + colors.reset + ' (toggle in top right)');
  console.log('  3. Find your extension: ' + colors.bright + '"Zendesk Sidebar Extension"' + colors.reset);
  console.log('  4. Copy the ' + colors.bright + 'ID' + colors.reset + ' field (32-character string)\n');
  
  console.log(colors.cyan + 'Alternative method:' + colors.reset);
  console.log('  Run this in your extension\'s console (popup, options page, etc.):');
  console.log(colors.yellow + '    chrome.runtime.id' + colors.reset + '\n');
}

function validateExtensionId(id) {
  // Chrome extension IDs are 32-character lowercase alphanumeric strings
  const regex = /^[a-z]{32}$/;
  return regex.test(id);
}

function generateRedirectUri(extensionId) {
  return `https://${extensionId}.chromiumapp.org/`;
}

function generateCorsOrigin(extensionId) {
  return `chrome-extension://${extensionId}`;
}

function printResults(extensionId) {
  const redirectUri = generateRedirectUri(extensionId);
  const corsOrigin = generateCorsOrigin(extensionId);
  
  console.log(colors.bright + colors.green + '✓ Configuration Details:' + colors.reset + '\n');
  
  console.log(colors.cyan + '  Extension ID:' + colors.reset);
  console.log(colors.bright + '    ' + extensionId + colors.reset + '\n');
  
  console.log(colors.cyan + '  OAuth Redirect URI (for Zendesk):' + colors.reset);
  console.log(colors.bright + '    ' + redirectUri + colors.reset);
  console.log('    ↳ Add this to your Zendesk OAuth client\'s Redirect URLs\n');
  
  console.log(colors.cyan + '  CORS Origin (for proxy ALLOWED_ORIGINS):' + colors.reset);
  console.log(colors.bright + '    ' + corsOrigin + colors.reset);
  console.log('    ↳ Add this to your proxy\'s ALLOWED_ORIGINS environment variable\n');
  
  console.log(colors.yellow + '⚠ Important Notes:' + colors.reset);
  console.log('  • Extension IDs are different between unpacked and published versions');
  console.log('  • If you reload an unpacked extension, the ID may change');
  console.log('  • Update both Zendesk and proxy configurations if the ID changes\n');
}

function printNextSteps() {
  console.log(colors.bright + 'Next Steps:' + colors.reset);
  console.log('  1. Add the redirect URI to your Zendesk OAuth client');
  console.log('  2. Add the CORS origin to your proxy\'s ALLOWED_ORIGINS');
  console.log('  3. Restart your proxy server if needed');
  console.log('  4. Test the OAuth flow\n');
  
  console.log(colors.cyan + 'Documentation:' + colors.reset);
  console.log('  • Full setup guide: ' + colors.bright + 'OAUTH_SETUP.md' + colors.reset);
  console.log('  • Quick checklist: ' + colors.bright + 'OAUTH_SETUP_CHECKLIST.md' + colors.reset + '\n');
}

async function promptForExtensionId() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(colors.cyan + 'Enter your Chrome Extension ID: ' + colors.reset, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  printHeader();
  
  let extensionId = process.argv[2];
  
  if (!extensionId) {
    printInstructions();
    extensionId = await promptForExtensionId();
    console.log(); // blank line
  }
  
  if (!extensionId) {
    console.log(colors.red + '✗ No extension ID provided.' + colors.reset);
    console.log('  Run the script with an ID: ' + colors.bright + 'node scripts/get-extension-id.js <extension-id>' + colors.reset + '\n');
    process.exit(1);
  }
  
  if (!validateExtensionId(extensionId)) {
    console.log(colors.red + '✗ Invalid extension ID format.' + colors.reset);
    console.log('  Extension IDs must be 32-character lowercase alphanumeric strings.');
    console.log('  Example: ' + colors.yellow + 'lmnoabcdefghijklpqrstuvwxyz1234' + colors.reset);
    console.log('  You provided: ' + colors.yellow + extensionId + colors.reset + '\n');
    process.exit(1);
  }
  
  printResults(extensionId);
  printNextSteps();
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error(colors.red + '✗ Error:' + colors.reset, error.message);
    process.exit(1);
  });
}

module.exports = {
  validateExtensionId,
  generateRedirectUri,
  generateCorsOrigin
};
