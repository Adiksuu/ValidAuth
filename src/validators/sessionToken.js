/**
 * Validates a session token to check if it's still valid (not expired).
 * @param {string} token - The session token to validate.
 * @param {Object} options - Validation options.
 * @param {number} options.length - The length of the random part of the token.
 * @param {string} options.userID - The user ID associated with the session (if included in token).
 * @param {string} options.expiresIn - The expiration time (e.g., '1h', '30m').
 * @param {boolean} options.includeTimestamp - Whether the token includes a timestamp.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {boolean|Object} true/false or an object with details
 */
export function isSessionTokenValid(token, options = {}) {
    // Default options (matching generateSessionToken defaults)
    const defaults = {
        length: 32,
        userID: null,
        expiresIn: '1h',
        includeTimestamp: true,
        details: false,
    };

    const opts = { ...defaults, ...options };
    const errors = [];

    // Basic validation
    if (!token || typeof token !== 'string') {
        if (opts.details) {
            return { valid: false, errors: ['Token must be a non-empty string'] };
        }
        return false;
    }

    if (!opts.includeTimestamp) {
        if (opts.details) {
            return { valid: false, errors: ['Token must include timestamp to validate expiration'] };
        }
        return false;
    }

    // Parse expiresIn to milliseconds
    let expiresInMs;
    const match = opts.expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
        if (opts.details) {
            return { valid: false, errors: ['Invalid expiresIn format (use format like "1h", "30m")'] };
        }
        return false;
    }
    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
        case 's': expiresInMs = value * 1000; break;
        case 'm': expiresInMs = value * 60 * 1000; break;
        case 'h': expiresInMs = value * 60 * 60 * 1000; break;
        case 'd': expiresInMs = value * 24 * 60 * 60 * 1000; break;
        default:
            if (opts.details) {
                return { valid: false, errors: ['Invalid time unit in expiresIn'] };
            }
            return false;
    }

    // Extract timestamp and validate userID if provided
    let timestampStr;
    let remainingToken = token;

    if (opts.userID) {
        const userIDLen = opts.userID.length;
        const userIDPart = remainingToken.slice(-userIDLen);
        if (userIDPart !== opts.userID) {
            if (opts.details) {
                return { valid: false, errors: ['UserID mismatch in token'] };
            }
            return false;
        }
        remainingToken = remainingToken.slice(0, -userIDLen);
    }

    // Extract timestamp (after random part)
    const timestampStart = opts.length;
    timestampStr = remainingToken.slice(timestampStart);
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) {
        if (opts.details) {
            return { valid: false, errors: ['Invalid timestamp in token'] };
        }
        return false;
    }

    // Check expiration
    const now = Date.now();
    if (now - timestamp > expiresInMs) {
        if (opts.details) {
            return { valid: false, errors: ['Token has expired'] };
        }
        return false;
    }

    // Return value
    const isValid = errors.length === 0;

    if (opts.details) {
        return {
            valid: isValid,
            errors: errors.length > 0 ? errors : null,
            token,
            timestamp,
            expiresAt: timestamp + expiresInMs,
            remainingTime: timestamp + expiresInMs - now,
        };
    }

    return isValid;
}