/**
 * Checks if a string is safe from XSS (Cross-Site Scripting) attacks.
 * @param {string} input - The string to check for XSS.
 * @param {Object} options - Validation options.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {boolean|Object} true if safe, false if XSS detected, or object with details
 */
export function isXSSSafe(input, options = {}) {
    // Default options
    const defaults = {
        details: false,
    };

    const opts = { ...defaults, ...options };
    const errors = [];

    // Basic validation
    if (!input || typeof input !== 'string') {
        if (opts.details) {
            return { safe: false, errors: ['Input must be a non-empty string'] };
        }
        return false;
    }

    // Common XSS patterns to detect
    const xssPatterns = [
        /<script[^>]*>[\s\S]*?<\/script>/gi,  // <script> tags
        /javascript:/gi,                     // javascript: protocol
        /vbscript:/gi,                       // vbscript: protocol
        /data:text\/html/gi,                  // data: protocol with html
        /onload\s*=/gi,                       // onload attribute
        /onerror\s*=/gi,                      // onerror attribute
        /onclick\s*=/gi,                      // onclick attribute
        /onmouseover\s*=/gi,                  // onmouseover attribute
        /onmouseout\s*=/gi,                   // onmouseout attribute
        /<iframe[^>]*>/gi,                    // iframe tags
        /<object[^>]*>/gi,                    // object tags
        /<embed[^>]*>/gi,                     // embed tags
        /<form[^>]*>/gi,                      // form tags
        /<input[^>]*>/gi,                     // input tags
        /<meta[^>]*>/gi,                      // meta tags
        /<link[^>]*>/gi,                      // link tags
        /<style[^>]*>[\s\S]*?<\/style>/gi,     // style tags
    ];

    // Check for each pattern
    for (const pattern of xssPatterns) {
        if (pattern.test(input)) {
            errors.push(`Potential XSS detected: ${pattern.source.replace(/\\s\*=/g, '=').replace(/gi/g, '')}`);
        }
    }

    // Return value
    const isSafe = errors.length === 0;

    if (opts.details) {
        return {
            safe: isSafe,
            errors: errors.length > 0 ? errors : null,
            input: input,
        };
    }

    return isSafe;
}