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
import fs from 'fs';

const commonPasswords = fs.readFileSync(new URL('../utils/commonPasswords.txt', import.meta.url), 'utf8').split('\n').map(line => line.trim()).filter(Boolean);
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
      return { valid: false, errors: ["Password must be a non-empty string"] };
    }
    return false;
  }

  // Remove whitespace characters
  password = password.trim();

  // Check password length
  if (password.length < opts.minLength) {
    if (opts.details) {
        return { valid: false, errors: [`Password must be at least ${opts.minLength} characters long`] };
    }
    return false;
  }
  if (password.length > opts.maxLength) {
    if (opts.details) {
        return { valid: false, errors: [`Password must be at most ${opts.maxLength} characters long`] };
    }
    return false;
  }

  // Check if password contains uppercase letters
  if (opts.requireUppercase && !/[A-Z]/.test(password)) {
    if (opts.details) {
        return { valid: false, errors: ["Password must contain at least one uppercase letter"] };
    }
    return false;
  }

  // Check if password contains lowercase letters
  if (opts.requireLowercase && !/[a-z]/.test(password)) {
    if (opts.details) {
        return { valid: false, errors: ["Password must contain at least one lowercase letter"] };
    }
    return false;
  }

  // Check if password contains numbers
  if (opts.requireNumbers && !/[0-9]/.test(password)) {
    if (opts.details) {
        return { valid: false, errors: ["Password must contain at least one number"] };
    }
    return false;
  }

  // Check if password contains symbols
  if (opts.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
    if (opts.details) {
        return { valid: false, errors: ["Password must contain at least one symbol"] };
    }
    return false;
  }

  // Check if password contains common passwords
  if (opts.forbidCommonPasswords && commonPasswords.includes(password)) {
    if (opts.details) {
        return { valid: false, errors: ["Password cannot be a common password"] };
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