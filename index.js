// Import isEmail validator module.
import { isEmail } from "./src/validators/email.js";
// Import isPassword & getPasswordStrength & isPasswordMatch validator module.
import { isPassword, getPasswordStrength, isPasswordMatch } from "./src/validators/password.js";
// Import isUsername validator module.
import { isUsername } from "./src/validators/username.js";
// Import isOTP validator module.
import { isOTP } from "./src/validators/otp.js";
// Import generatePassword module.
import { generatePassword } from "./src/generators/generatePassword.js";
// Import generateOTP module.
import { generateOTP } from "./src/generators/generateOTP.js";

// Export validator modules.
export { isEmail, isPassword, getPasswordStrength, isUsername, isPasswordMatch, isOTP, generatePassword, generateOTP };
