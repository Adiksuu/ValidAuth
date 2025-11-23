/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @param {Object} options - Validation options.
 * @param {boolean} options.allowPlusAddressing - Whether to allow plus addressing (e.g., user+tag@domain.com).
 * @param {boolean} options.requireTLD - Whether a top-level domain is required (e.g., .com, .pl).
 * @param {string[]} options.blockedDomains - List of blocked domains.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {boolean|Object} true/false or an object with details
 */

export function isEmail(email, options = {}) {
  // Default options
  const defaults = {
    allowPlusAddressing: true,
    requireTLD: true,
    blockedDomains: [],
    details: false,
  };

  const opts = { ...defaults, ...options };
  const errors = [];

  // Basic validation.
  if (!email || typeof email !== "string") {
    if (opts.details) {
      return { valid: false, errors: ["Email must be a non-empty string"] };
    }
    return false;
  }

  // Remove whitespace characters
  email = email.trim();

  // Check email length
  if (email.length === 0) {
    if (opts.details) {
      return { valid: false, errors: ["Email cannot be empty"] };
    }
    return false;
  }

  if (email.length > 254) {
    if (opts.details) {
      return {
        valid: false,
        errors: ["Email exceeds maximum length (max 254 characters)"],
      };
    }
    return false;
  }

  // Check if email contains "@"
  if (!email.includes("@")) {
    if (opts.details) {
      return { valid: false, errors: ['Email must contain "@" symbol'] };
    }
    return false;
  }

  // Split email to local and domain
  const parts = email.split("@");

  if (parts.length !== 2) {
    if (opts.details) {
      return {
        valid: false,
        errors: ['Email must contain exactly one "@" symbol'],
      };
    }
    return false;
  }

  const [localPart, domain] = parts;

  // Validate local part
  if (localPart.length === 0) {
    errors.push("Email local part cannot be empty");
  }
  if (localPart.length > 64) {
    errors.push("Email local part exceeds maximum length (max 64 characters)");
  }

  // Check if local part starts/ends with dot
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    errors.push("Email local part cannot start or end with a dot");
  }

  // Check if local part contains consecutive dots
  if (localPart.includes("..")) {
    errors.push("Email local part cannot contain consecutive dots");
  }

  // Check "+" addressing if not allowed
  if (!opts.allowPlusAddressing && localPart.includes("+")) {
    errors.push('Email local part cannot contain "+" symbol');
  }

  // Basic character validation in local part
  const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+$/;
  if (!localPartRegex.test(localPart.replace(/\+.*$/, ""))) {
    errors.push("Email local part contains invalid characters");
  }

  // Domain validation
  if (domain.length === 0) {
    errors.push("Domain cannot be empty");
  }
  if (domain.length > 253) {
    errors.push("Domain exceeds maximum length (max 253 characters)");
  }

  // Check if domain contains TLD
  if (opts.requireTLD && !domain.includes(".")) {
    errors.push("Domain must contain a top-level domain (e.g., .com, .org)");
  }

  // Check if domain starts/ends with dot or hyphen
  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.startsWith("-") ||
    domain.endsWith("-")
  ) {
    errors.push("Domain cannot start or end with a dot or hyphen");
  }

  // Check if domain contains consecutive dots
  if (domain.includes("..")) {
    errors.push("Domain cannot contain consecutive dots");
  }

  // Basic character validation in domain
  const domainRegex = /^[a-zA-Z0-9.-]+$/;
  if (!domainRegex.test(domain)) {
    errors.push("Domain contains invalid characters");
  }

  // Check blocked domains
  if (opts.blockedDomains.length > 0) {
    const domainLower = domain.toLowerCase();
    if (
      opts.blockedDomains.some(
        (blocked) => domainLower === blocked.toLowerCase(),
      )
    ) {
      errors.push("This domain is not allowed to use");
    }
  }

  // Return value
  const isValid = errors.length === 0;

  if (opts.details) {
    return {
      valid: isValid,
      errors: errors.length > 0 ? errors : null,
      email: email,
      localPart: localPart,
      domain: domain,
    };
  }

  return isValid;
}
