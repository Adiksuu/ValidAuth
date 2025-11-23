/**
 * Validates a username.
 * @param {string} username - The username to validate.
 * @param {Object} options - Validation options.
 * @param {boolean} options.minLength - The minimum length of the username.
 * @param {boolean} options.maxLength - The maximum length of the username.
 * @param {boolean} options.allowSpecialChars - Whether to allow special characters.
 * @param {boolean} options.forbidSpaces - Whether to forbid spaces.
 * @param {boolean} options.forbidStartingNumber - Whether to forbid usernames starting with a number.
 * @param {string[]} options.blockedUsernames - List of blocked usernames.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {boolean|Object} true/false or an object with details
 */
export function isUsername(username, options = {}) {
    // Default options
    const defaults = {
        minLength: 3,
        maxLength: 30,
        allowSpecialChars: false,
        forbidSpaces: true,
        forbidStartingNumber: true,
        blockedUsernames: [],
        details: false,
    };

    const opts = { ...defaults, ...options };
    const errors = [];

    // Basic validation.
    if (!username || typeof username !== "string") {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Username must be a non-empty string"],
            };
        }
        return false;
    }
    // Remove whitespace characters
    username = username.trim();

    // Check username length
    if (username.length < opts.minLength) {
        if (opts.details) {
            return {
                valid: false,
                errors: [
                    `Username must be at least ${opts.minLength} characters long`,
                ],
            };
        }
        return false;
    }
    if (username.length > opts.maxLength) {
        if (opts.details) {
            return {
                valid: false,
                errors: [
                    `Username must be no more than ${opts.maxLength} characters long`,
                ],
            };
        }
        return false;
    }

    // Check for spaces
    if (opts.forbidSpaces && /\s/.test(username)) {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Username cannot contain spaces"],
            };
        }
        return false;
    }
    // Check for special characters
    if (!opts.allowSpecialChars && /[!@#$%^&*(),.?":{}|<>]/.test(username)) {
        if (opts.details) {
            return {
                valid: false,
                errors: [
                    "Username cannot contain special characters",
                ],
            };
        }
        return false;
    }

    // Check if username starts with a number
    if (opts.forbidStartingNumber && /^[0-9]/.test(username)) {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Username cannot start with a number"],
            };
        }
        return false;
    }

    // Check for blocked usernames
    if (opts.blockedUsernames.includes(username.toLowerCase())) {
        if (opts.details) {
            return {
                valid: false,
                errors: ["This username is not allowed"],
            };
        }
        return false;
    }

    // Return value
    const isValid = errors.length === 0;
    if (opts.details) {
        return {
            valid: isValid,
            errors: errors.length > 0 ? errors : null,
            username: username,
        };
    }
    
    return isValid;
}