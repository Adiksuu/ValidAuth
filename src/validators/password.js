/**
 * Validates a password.
 * @param {string} password - The password to validate.
 * @param {Object} options - Validation options.
 * @param {boolean} options.minLength - The minimum length of the password.
 * @param {boolean} options.maxLength - The maximum length of the password.
 * @param {boolean} options.requireUppercase - Whether to require at least one uppercase letter.
 * @param {boolean} options.requireLowercase - Whether to require at least one lowercase letter.
 * @param {boolean} options.requireNumbers - Whether to require at least one number.
 * @param {boolean} options.requireSymbols - Whether to require at least one symbol.
 * @param {boolean} options.forbidCommonPasswords - Whether to forbid common passwords.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {boolean|Object} true/false or an object with details
 */
import { commonPasswords } from "../utils/commonPasswords.js";
export function isPassword(password, options = {}) {
    // Default options
    const defaults = {
        minLength: 8,
        maxLength: 128,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        forbidCommonPasswords: true,
        details: false,
    };

    const opts = { ...defaults, ...options };
    const errors = [];

    // Basic validation.
    if (!password || typeof password !== "string") {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Password must be a non-empty string"],
            };
        }
        return false;
    }

    // Remove whitespace characters
    password = password.trim();

    // Check password length
    if (password.length < opts.minLength) {
        if (opts.details) {
            return {
                valid: false,
                errors: [
                    `Password must be at least ${opts.minLength} characters long`,
                ],
            };
        }
        return false;
    }
    if (password.length > opts.maxLength) {
        if (opts.details) {
            return {
                valid: false,
                errors: [
                    `Password must be at most ${opts.maxLength} characters long`,
                ],
            };
        }
        return false;
    }

    // Check if password contains uppercase letters
    if (opts.requireUppercase && !/[A-Z]/.test(password)) {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Password must contain at least one uppercase letter"],
            };
        }
        return false;
    }

    // Check if password contains lowercase letters
    if (opts.requireLowercase && !/[a-z]/.test(password)) {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Password must contain at least one lowercase letter"],
            };
        }
        return false;
    }

    // Check if password contains numbers
    if (opts.requireNumbers && !/[0-9]/.test(password)) {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Password must contain at least one number"],
            };
        }
        return false;
    }

    // Check if password contains symbols
    if (
        opts.requireSymbols &&
        !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)
    ) {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Password must contain at least one symbol"],
            };
        }
        return false;
    }

    // Check if password contains common passwords
    if (opts.forbidCommonPasswords && commonPasswords.has(password)) {
        if (opts.details) {
            return {
                valid: false,
                errors: ["Password cannot be a common password"],
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
            password: password,
        };
    }

    return isValid;
}

/**
 * Calculates the strength of a password.
 * @param {string} password - The password to evaluate.
 * @param {Object} options - Validation options.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {string|Object} 'weak' | 'medium' | 'strong' or an object with details
 */
export function getPasswordStrength(password, options = {}) {
    const defaults = {
        details: false,
    };
    const opts = { ...defaults, ...options };
    let score = 0;
    let crackTime = 0;

    if (typeof password !== "string" || password.length === 0) {
        if (opts.details) {
            return {
                strength: "weak",
                score: 0,
                errors: ["Password must be a non-empty string"],
            };
        }
        return "weak";
    }

    // Common password penalty - set score to 0 if common password
    if (commonPasswords.has(password)) {
        score = 0;
    } else {
        // Length scoring (0-40 points)
        if (password.length >= 8) score += 10;
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;
        if (password.length >= 20) score += 10;

        // Character variety scoring (0-40 points, 10 points each)
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) score += 10;

        // Complexity bonus (0-20 points)
        // Bonus for longer passwords with more character variety
        const charTypes = [
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password),
        ].filter(Boolean).length;

        if (password.length >= 16 && charTypes >= 3) score += 10;
        if (password.length >= 20 && charTypes === 4) score += 10;
    }

    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine strength based on 0-100 score
    let strength = "weak";
    if (score >= 70) {
        strength = "strong";
        if (score >= 95) {
            crackTime = 1e15; // 1 quadrillion years
        } else if (score >= 85) {
            crackTime = 1e12; // 1 trillion years
        } else if (score >= 80) {
            crackTime = 1e10; // 10 billion years
        } else {
            crackTime = 1e9; // 1 billion years
        }
    } else if (score >= 40) {
        strength = "medium";
        if (score >= 55) {
            crackTime = 1e7; // 10 million years
        } else if (score >= 50) {
            crackTime = 1e6; // 1 million years
        } else if (score >= 45) {
            crackTime = 1e5; // 100,000 years
        } else {
            crackTime = 1e4; // 10,000 years
        }
    } else {
        strength = "weak";
        if (score >= 20) {
            crackTime = 1e3; // 1,000 years
        } else if (score >= 10) {
            crackTime = 1e2; // 100 years
        } else {
            crackTime = 1e1; // 10 years
        }
    }
    if (opts.details) {
        return {
            strength: strength,
            score: score,
            estimatedCrackTimeInYears: Math.floor(
                crackTime / (60 * 60 * 24 * 365)
            ),
            crackTimeDisplay: (() => {
                const seconds = crackTime;
                const years = Math.floor(seconds / (60 * 60 * 24 * 365));
                if (years >= 1) {
                    return `${years} year${years > 1 ? "s" : ""}`;
                }
                const months = Math.floor(seconds / (60 * 60 * 24 * 30));
                if (months >= 1) {
                    return `${months} month${months > 1 ? "s" : ""}`;
                }
                const days = Math.floor(seconds / (60 * 60 * 24));
                if (days >= 1) {
                    return `${days} day${days > 1 ? "s" : ""}`;
                }
                const hours = Math.floor(seconds / (60 * 60));
                if (hours >= 1) {
                    return `${hours} hour${hours > 1 ? "s" : ""}`;
                }
                const minutes = Math.floor(seconds / 60);
                if (minutes >= 1) {
                    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
                }
                return `${seconds} second${seconds !== 1 ? "s" : ""}`;
            })(),
        };
    }
    return strength;
}

/**
 * Calculates the strength of a password.
 * @param {string} password - The password to evaluate.
 * @param {string} confirmPassword - The confirmation password to compare.
 * @param {Object} options - Validation options.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {string|Object} true | false or an object with details
 */
export function isPasswordMatch(password, confirmPassword, options = {}) {
    // Default options
    const defaults = {
        details: false,
    }
    const opts = { ...defaults, ...options };
    const errors = [];

    // Basic validation.
    if (typeof password !== "string" || typeof confirmPassword !== "string") {
        if (opts.details) {
            return {
                match: false,
                errors: ["Both passwords must be strings"],
            };
        }
        return false;
    }
    if (password !== confirmPassword) {
        if (opts.details) {
            return {
                match: false,
                errors: ["Passwords do not match"],
            };
        }
        return false;
    }

    // Return value
    const isValid = errors.length === 0;

    if (opts.details) {
        return {
            match: isValid,
            errors: errors.length > 0 ? errors : null,
        };
    }
    return isValid;
}