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
        errors.push("Username must be a non-empty string");
    } else {
        // Remove whitespace characters
        username = username.trim();
    }

    // Check username length
    if (typeof username === "string" && username.trim().length < opts.minLength) {
        errors.push(`Username must be at least ${opts.minLength} characters long`);
    }
    if (typeof username === "string" && username.trim().length > opts.maxLength) {
        errors.push(`Username must be no more than ${opts.maxLength} characters long`);
    }

    // Check for spaces
    if (opts.forbidSpaces && typeof username === "string" && /\s/.test(username.trim())) {
        errors.push("Username cannot contain spaces");
    }
    // Check for special characters
    if (!opts.allowSpecialChars && typeof username === "string" && /[!@#$%^&*(),.?":{}|<>]/.test(username.trim())) {
        errors.push("Username cannot contain special characters");
    }

    // Check if username starts with a number
    if (opts.forbidStartingNumber && typeof username === "string" && /^[0-9]/.test(username.trim())) {
        errors.push("Username cannot start with a number");
    }

    // Check for blocked usernames
    if (typeof username === "string" && opts.blockedUsernames.includes(username.toLowerCase())) {
        errors.push("This username is not allowed");
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