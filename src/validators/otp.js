/**
 * Validates an OTP code.
 * @param {string} otp - The OTP code to validate.
 * @param {string} correctOTP - The correct OTP code.
 * @param {Object} options - Validation options.
 * @param {number} options.attempts - The number of attempts made.
 * @param {number} options.maxAttempts - The maximum number of attempts allowed.
 * @param {boolean} options.details - Whether to return detailed information.
 * @returns {boolean|Object} true/false or an object with details
 */
 
 export function validateOTP(otp, correctOTP, options = {}) {
   // Default options
   const defaults = {
     correctOTP,
     maxAttempts: 3,
     details: false,
   };
 
   const opts = { ...defaults, ...options };
   const errors = [];
   
   // Basic validation.
   
   // Max attempts validation
   if (opts.maxAttempts <= 0) {
     if (opts.details) {
       return {
         valid: false,
         errors: ['Max attempts must be greater than 0.'],
       };
     }
     return false;
   }
   
   // OTP validation
   if (otp !== correctOTP) {
     if (opts.details) {
       return {
         valid: false,
         errors: ['Invalid OTP.'],
       };
     }
     return false;
   }
   
   if (opts.attempts > opts.maxAttempts) {
     if (opts.details) {
       return {
         valid: false,
         errors: ['Max attempts exceeded.'],
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
       otp,
       correctOTP,
       attempts: opts.attempts,
       remainingAttempts: opts.maxAttempts - opts.attempts,
       maxAttempts: opts.maxAttempts,
     };
   }
   
   return isValid;
 }