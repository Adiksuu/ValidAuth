/**
 * Generates a strong password based on specified criteria.
 * @param {boolean} options.length - The length of the password.
 * @param {boolean} options.includeUppercase - Whether to include uppercase letters.
 * @param {boolean} options.includeLowercase - Whether to include lowercase letters.
 * @param {boolean} options.includeNumbers - Whether to include numbers.
 * @param {boolean} options.includeSymbols - Whether to include symbols.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {string|Object} password or an object with detailed information.
 */
import { getPasswordStrength } from "../validators/password.js";

export function generatePassword(options = {}) {
    // Default options
    const defaults = {
        length: 12,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        details: false,
    };

    const opts = { ...defaults, ...options };
    const errors = [];

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    let allChars = '';

    if (opts.includeUppercase) allChars += uppercaseChars;
    if (opts.includeLowercase) allChars += lowercaseChars;
    if (opts.includeNumbers) allChars += numberChars;
    if (opts.includeSymbols) allChars += symbolChars;

    if (allChars.length === 0) {
        if (opts.details) {
            return {
                password: '',
                errors: ['At least one character type must be selected.'],
            };
        }
        return '';
    }
    let password = '';
    for (let i = 0; i < opts.length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }
    if (opts.details) {
        return {
            password,
            length: opts.length,
            errors,
            strength: getPasswordStrength(password, { details: true }),
        }
    }
}