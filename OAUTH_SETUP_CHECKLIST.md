# OAuth Setup Checklist

Quick reference checklist for setting up Zendesk OAuth. See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed instructions.

## Setup Steps

### 1️⃣ Create Zendesk OAuth Client

- [ ] Log in to Zendesk Admin Center
- [ ] Navigate to: **Apps and integrations** → **APIs** → **OAuth Clients**
- [ ] Click **Add OAuth client**
- [ ] Set **Client kind** to **Confidential** (⚠️ Required)
- [ ] Enter a descriptive name (e.g., "Zendesk Chrome Extension")
- [ ] **Save and copy Client ID** (needed for proxy)
- [ ] **Save and copy Client Secret** (shown only once!)

### 2️⃣ Get Chrome Extension ID

- [ ] Load extension in Chrome (`chrome://extensions/`)
- [ ] Enable **Developer mode**
- [ ] Copy the **Extension ID** (under extension name)
- [ ] Format: 32-character string (e.g., `lmnoabcdefghijklpqrstuvwxyz1234`)

**Quick script to get ID:**
```javascript
// Run in extension context (popup, options page, etc.)
console.log('Extension ID:', chrome.runtime.id);
console.log('Redirect URI:', chrome.identity.getRedirectURL());
```

### 3️⃣ Add Redirect URI to Zendesk

- [ ] Return to Zendesk OAuth client settings
- [ ] Add redirect URI: `https://<EXTENSION_ID>.chromiumapp.org/`
- [ ] Example: `https://lmnoabcdefghijklpqrstuvwxyz1234.chromiumapp.org/`
- [ ] ⚠️ Must include trailing slash `/`
- [ ] Click **Save**

### 4️⃣ Configure Proxy Server

Set these environment variables in your proxy deployment:

- [ ] `ZENDESK_CLIENT_ID` = (Client ID from step 1)
- [ ] `ZENDESK_CLIENT_SECRET` = (Client Secret from step 1)
- [ ] `SESSION_SECRET` = (Generate with: `openssl rand -hex 32`)
- [ ] `ALLOWED_ORIGINS` = `chrome-extension://<EXTENSION_ID>`
- [ ] `NODE_ENV` = `production` (for production)

### 5️⃣ Verification

- [ ] Proxy health check responds: `curl https://your-proxy.com/health`
- [ ] Extension ID matches between Chrome and proxy `ALLOWED_ORIGINS`
- [ ] Redirect URI matches between Zendesk and extension ID
- [ ] No credentials in git history
- [ ] `.env` file is in `.gitignore`

## Environment Variables Template

```bash
# Zendesk OAuth Configuration
ZENDESK_CLIENT_ID=your_client_id_here
ZENDESK_CLIENT_SECRET=your_client_secret_here

# Session Configuration (generate with: openssl rand -hex 32)
SESSION_SECRET=your_generated_secure_random_string_here

# CORS Configuration (use actual extension ID)
ALLOWED_ORIGINS=chrome-extension://your-extension-id-here

# Optional
NODE_ENV=production
ZENDESK_SUBDOMAIN=your-subdomain
```

## Common Mistakes to Avoid

❌ Using "Public" client kind (must be "Confidential")  
❌ Missing trailing slash in redirect URI  
❌ Wrong extension ID (unpacked vs published are different)  
❌ Committing credentials to git  
❌ Storing client secret in extension code  
❌ Forgetting to set `ALLOWED_ORIGINS`

## Quick Commands

**Generate session secret:**
```bash
openssl rand -hex 32
```

**Get extension ID from command line:**
```bash
# Run in extension directory
node -e "console.log(require('./manifest.json').key ? 'Using key in manifest' : 'ID assigned by Chrome')"
```

**Test proxy health:**
```bash
curl https://your-proxy-url.com/health
```

## Need Help?

- 📖 Full documentation: [OAUTH_SETUP.md](./OAUTH_SETUP.md)
- 🐛 Issues: [GitHub Issues](https://github.com/Skeyelab/zendesk-chrome-extension/issues)
- 📚 Proxy README: [proxy/README.md](./proxy/README.md)
