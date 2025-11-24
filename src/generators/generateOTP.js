/**
 * Generates an OTP code.
 * @param {Object} options - Generation options.
 * @param {number} options.length - The length of the OTP code.
 * @param {string} options.type - The type of OTP code (e.g., numeric, alphanumeric).
 * @returns {string} The generated OTP code.
 */
 
export function generateOTP(options = {}) {
  // Default options.
  const defaults = {
    length: 4,
    type: 'numeric',
    details: false,
  };
   
  const opts = { ...defaults, ...options };
   
  function generateOtpCode() {
    let code = '';
    const chars = opts.type === 'numeric' ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     
    for (let i = 0; i < opts.length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
     
    return code;
  }
   
  if (opts.details) {
    return {
      code: generateOtpCode(),
      length: opts.length,
      type: opts.type,
    };
  }
  
  return generateOtpCode();
}