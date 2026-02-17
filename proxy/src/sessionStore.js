import crypto from 'crypto';

/**
 * In-memory session store
 * In production, replace with Redis or database
 */
class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Create a new session
   * @param {Object} data - Session data (accessToken, refreshToken, etc.)
   * @returns {string} Session token
   */
  create(data) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    this.sessions.set(sessionToken, {
      ...data,
      createdAt: Date.now()
    });
    return sessionToken;
  }

  /**
   * Get session by token
   * @param {string} sessionToken - Session token
   * @returns {Object|null} Session data or null if not found
   */
  get(sessionToken) {
    return this.sessions.get(sessionToken) || null;
  }

  /**
   * Delete a session
   * @param {string} sessionToken - Session token
   */
  delete(sessionToken) {
    this.sessions.delete(sessionToken);
  }

  /**
   * Clear all sessions
   */
  clear() {
    this.sessions.clear();
  }

  /**
   * Get session count (for testing/monitoring)
   */
  size() {
    return this.sessions.size;
  }
}

// Singleton instance
const sessionStore = new SessionStore();

export default sessionStore;
