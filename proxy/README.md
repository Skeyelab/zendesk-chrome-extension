# Zendesk Proxy Service

Backend proxy service for secure Zendesk OAuth token exchange and API proxying. This service handles OAuth authorization code exchange with Zendesk and manages session tokens for the Chrome extension.

## ⚠️ OAuth Setup Required

Before using this proxy, you must set up OAuth authentication with Zendesk:

1. **Quick Start:** Follow [OAuth Setup Checklist](../OAUTH_SETUP_CHECKLIST.md)
2. **Detailed Guide:** See [OAuth Setup Documentation](../OAUTH_SETUP.md)
3. **Helper Script:** Run `node ../scripts/get-extension-id.js` to get configuration values

**You will need:**
- Zendesk OAuth client ID and secret (from Zendesk Admin Center)
- Chrome extension ID (from `chrome://extensions/`)
- Session secret (generate with `openssl rand -hex 32`)

## Features

- **OAuth Token Exchange**: Exchanges OAuth authorization codes for access/refresh tokens
- **Session Management**: Stores tokens securely with opaque session tokens
- **CORS Support**: Configured for Chrome extension origins
- **Health Checks**: Built-in health endpoint for monitoring
- **Production Ready**: Dockerized with non-root user and health checks

## Architecture

### Endpoints

#### `POST /auth/callback`
Exchange OAuth authorization code for session token.

**Request:**
```json
{
  "code": "oauth_authorization_code",
  "subdomain": "your-zendesk-subdomain"
}
```

**Response (Success):**
```json
{
  "sessionToken": "opaque_session_token_hex_string"
}
```

**Response (Error):**
```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200`: Success - Returns session token
- `400`: Bad Request - Missing required fields
- `401`: Unauthorized - Zendesk token exchange failed
- `500`: Server Error

#### `GET /health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok"
}
```

### Session Storage

The proxy uses an **in-memory session store** by default for simplicity. Each session contains:
- Access token
- Refresh token
- Token expiration time
- Token type
- Zendesk subdomain

**Note:** For production deployments with multiple instances, consider using Redis or a database for session persistence.

## Environment Variables

**📖 See [OAuth Setup Guide](../OAUTH_SETUP.md) for instructions on obtaining these values.**

Required environment variables:

| Variable | Description | Example | How to get |
|----------|-------------|---------|-----------|
| `ZENDESK_CLIENT_ID` | Zendesk OAuth client ID | `your_client_id` | From Zendesk Admin Center OAuth client |
| `ZENDESK_CLIENT_SECRET` | Zendesk OAuth client secret | `your_client_secret` | From Zendesk Admin Center OAuth client |
| `SESSION_SECRET` | Secret for session token generation | `random_secure_string` | Generate: `openssl rand -hex 32` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `chrome-extension://abc123` | Use extension ID from Chrome |

Optional environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `SESSION_STORE` | Session store type (memory/redis) | `memory` |
| `ZENDESK_SUBDOMAIN` | Default Zendesk subdomain | - |

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in `.env`:**
   ```env
   PORT=3000
   NODE_ENV=development
   ZENDESK_CLIENT_ID=your_client_id_here
   ZENDESK_CLIENT_SECRET=your_client_secret_here
   SESSION_SECRET=your_secure_random_secret
   ALLOWED_ORIGINS=chrome-extension://your-extension-id
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000` with auto-reload.

### Testing

Run tests with Vitest:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

The test suite includes:
- Token exchange validation
- Session management
- CORS configuration
- Error handling

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

## Deployment with Coolify

[Coolify](https://coolify.io) is a self-hosted alternative to Heroku that supports Docker deployments.

### Prerequisites
- Coolify instance running
- GitHub repository connected to Coolify

### Deployment Steps

1. **Add Repository to Coolify:**
   - In Coolify dashboard, click "New Resource" → "Application"
   - Select "Public Repository" and enter: `https://github.com/Skeyelab/zendesk-chrome-extension`
   - Choose the branch to deploy (e.g., `main`)

2. **Configure Build Settings:**
   - **Build Pack**: Dockerfile
   - **Dockerfile Location**: `proxy/Dockerfile`
   - **Build Context**: `proxy/`
   - **Port**: `3000`

3. **Set Environment Variables:**
   Go to the "Environment" tab and add:
   
   ```env
   ZENDESK_CLIENT_ID=your_zendesk_client_id
   ZENDESK_CLIENT_SECRET=your_zendesk_client_secret
   SESSION_SECRET=generate_a_secure_random_string_here
   ALLOWED_ORIGINS=chrome-extension://your_extension_id
   NODE_ENV=production
   ```

   **Important:** 
   - Generate a secure `SESSION_SECRET` (e.g., using `openssl rand -hex 32`)
   - Get your extension ID from Chrome after loading the unpacked extension
   - If deploying multiple extension versions, separate origins with commas

4. **Configure Health Checks (Optional):**
   - **Health Check Path**: `/health`
   - **Health Check Interval**: `30s`

5. **Deploy:**
   - Click "Deploy" button
   - Coolify will build the Docker image and start the container
   - Monitor the deployment logs for any errors

6. **Get Deployment URL:**
   - After successful deployment, Coolify will provide a URL (e.g., `https://proxy-abc123.coolify.io`)
   - Update your Chrome extension to use this URL for OAuth callbacks

### Updating the Extension

After deploying the proxy, update your Chrome extension configuration:

1. Update the proxy URL in the extension's OAuth flow
2. Ensure the extension ID is in the `ALLOWED_ORIGINS` environment variable
3. Test the OAuth flow end-to-end

## Docker Build (Manual)

If you want to build and run the Docker image manually:

```bash
# Build the image
docker build -t zendesk-proxy:latest .

# Run the container
docker run -p 3000:3000 \
  -e ZENDESK_CLIENT_ID=your_client_id \
  -e ZENDESK_CLIENT_SECRET=your_client_secret \
  -e SESSION_SECRET=your_session_secret \
  -e ALLOWED_ORIGINS=chrome-extension://your-extension-id \
  -e NODE_ENV=production \
  zendesk-proxy:latest
```

## Security Considerations

1. **Session Tokens**: Use cryptographically secure random tokens (32 bytes)
2. **CORS**: Strictly limit `ALLOWED_ORIGINS` to your extension IDs only
3. **HTTPS**: Always use HTTPS in production (Coolify provides this automatically)
4. **Secrets**: Never commit `.env` files or expose secrets
5. **Rate Limiting**: Consider adding rate limiting for production (not included in MVP)

## Troubleshooting

### "Not allowed by CORS" error
- Verify extension ID in `ALLOWED_ORIGINS` matches your actual extension ID
- Extension IDs change between loading unpacked and published versions
- Use Chrome DevTools Network tab to see the actual `Origin` header being sent

### "Missing required environment variables" error
- Check all required environment variables are set in Coolify
- Environment variables are case-sensitive

### Health check failing
- Ensure port 3000 is exposed in Coolify
- Check application logs for startup errors
- Verify the health endpoint responds: `curl https://your-proxy-url.com/health`

### Token exchange failing
- Verify `ZENDESK_CLIENT_ID` and `ZENDESK_CLIENT_SECRET` are correct
- Check the Zendesk subdomain being sent from the extension
- Review application logs for detailed error messages

## Architecture Notes

### Why In-Memory Sessions?

For the MVP, in-memory session storage is used because:
- Simple and fast
- No external dependencies
- Suitable for single-instance deployments
- Automatic cleanup on restart

**When to upgrade:** If you need:
- Multiple proxy instances (load balancing)
- Session persistence across restarts
- Distributed deployments

Consider migrating to Redis:
1. Add Redis connection in `src/sessionStore.js`
2. Set `SESSION_STORE=redis` environment variable
3. Add `REDIS_URL` environment variable

### OAuth Flow

```
Extension → Zendesk OAuth → Extension gets code → 
POST /auth/callback with code → Proxy exchanges with Zendesk →
Proxy returns session token → Extension stores session token →
Extension uses session token for API requests
```

## License

MIT License — see LICENSE file in repository root.
