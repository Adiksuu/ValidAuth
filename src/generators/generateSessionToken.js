/**
 * Generates a secure session token.
 * @param {boolean} options.length - The length of the token (count without timestamp and userID).
 * @param {string} options.userID - The user ID associated with the session.
 * @param {string} options.expiresIn - The expiration time for the session token.
 * @param {boolean} options.includeTimestamp - Whether to include a timestamp.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {string|Object} session token or an object with detailed information.
 */
export function generateSessionToken(options = {}) {
    // Default options
     const defaults = {
        length: 32,
        userID: null,
        expiresIn: '1h',
        includeTimestamp: true,
        details: false,
    };
    const opts = { ...defaults, ...options };
    const errors = [];

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    if (opts.length < 16) {
        if (opts.details) {
            return {
                token: '',
                errors: ['Token length should be at least 16 characters.'],
            };
        }
    }

    for (let i = 0; i < opts.length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }

    if (opts.includeTimestamp) {
        token += Date.now().toString();
    }

    if (opts.userID) {
        token += opts.userID;
    }

    // Return value
    if (opts.details) {
        return {
            token,
            userID: opts.userID,
            expiresIn: opts.expiresIn,
            length: token.length,
            timestamp: opts.includeTimestamp ? Date.now() : null,
            errors: errors.length > 0 ? errors : null,
        };
    }

    return token;
}