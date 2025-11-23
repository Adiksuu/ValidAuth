# 🔐 validauth

> Lightweight, powerful authentication validators for JavaScript applications

[![npm version](https://img.shields.io/npm/v/validauth.svg)](https://www.npmjs.com/package/validauth)
[![npm downloads](https://img.shields.io/npm/dm/validauth.svg)](https://www.npmjs.com/package/validauth)
[![license](https://img.shields.io/npm/l/validauth.svg)](https://github.com/adiksuu/validauth/blob/main/LICENSE)

**validauth** is a modern JavaScript library that provides robust validators for authentication forms. Built with security and developer experience in mind, it helps you validate emails, passwords, usernames, and more with just a few lines of code.

## ✨ Features

- 🎯 **Focused on Auth** - Specialized validators for authentication flows
- 🪶 **Lightweight** - Zero dependencies, minimal footprint
- 🔒 **Security-first** - Built-in checks for common vulnerabilities
- ⚙️ **Highly Configurable** - Customize validation rules to fit your needs
- 📦 **Easy to Use** - Simple, intuitive API
- 🌍 **Framework Agnostic** - Works with React, Vue, Angular, vanilla JS, and more
- 📝 **TypeScript Ready** - Full TypeScript support (coming soon)
- 🧪 **Well Tested** - Comprehensive test coverage

## 🚀 Quick Start

### Installation
```bash
npm install validauth
```

### Basic Usage
```javascript
const { isEmail, isPassword, isUsername } = require('validauth');

// Email validation
if (isEmail('user@example.com')) {
  console.log('Valid email!');
}

// Password validation
if (isPassword('MyP@ssw0rd123')) {
  console.log('Strong password!');
}

// Username validation
if (isUsername('johndoe')) {
  console.log('Valid username!');
}

// Advanced validation with detailed errors
const result = isPassword('weak', {
  minLength: 10,
  details: true
});

if (!result.valid) {
  console.log('Errors:', result.errors);
}
```

## 📚 Documentation

### Current Validators

#### ✉️ Email Validation

Validate email addresses with customizable rules:
```javascript
isEmail(email, {
  allowPlusAddressing: true,    // Allow user+tag@domain.com
  requireTLD: true,              // Require .com, .org, etc.
  blockedDomains: [],            // Block specific domains
  details: false                 // Get detailed error messages
});
```

**Examples:**
```javascript
// Block temporary email services
isEmail('user@tempmail.com', {
  blockedDomains: ['tempmail.com', '10minutemail.com']
}); // false

// Allow local emails (for development)
isEmail('admin@localhost', {
  requireTLD: false
}); // true

// Get detailed validation info
isEmail('invalid@', { details: true });
// Returns: { valid: false, errors: ['Domain cannot be empty'], ... }
```

[📖 Full Email Documentation](docs/EMAIL.md)

---

#### 🔑 Password Validation

Validate password strength with comprehensive security checks:
```javascript
isPassword(password, {
  minLength: 8,                    // Minimum password length
  maxLength: 128,                  // Maximum password length
  requireUppercase: true,          // Require uppercase letters
  requireLowercase: true,          // Require lowercase letters
  requireNumbers: true,            // Require numbers
  requireSymbols: true,            // Require special characters
  forbidCommonPasswords: true,     // Block common/leaked passwords
  details: false                   // Get detailed error messages
});
```

**Examples:**
```javascript
// Default validation (strong requirements)
isPassword('MyP@ssw0rd123'); // true
isPassword('weak'); // false

// Custom requirements
isPassword('SimplyPassword123', {
  requireSymbols: false,
  minLength: 6
}); // true

// Block common passwords
isPassword('password123', {
  forbidCommonPasswords: true
}); // false
```

**Security Features:**
- ✅ Checks against 10,000+ common/leaked passwords
- ✅ Configurable complexity requirements
- ✅ Length validation
- ✅ Character type requirements

[📖 Full Password Documentation](docs/PASSWORD.md)

---

#### 👤 Username Validation

Validate usernames with rules for length, characters, and reserved names:
```javascript
isUsername(username, {
  minLength: 3,                    // Minimum username length
  maxLength: 30,                   // Maximum username length
  allowSpecialChars: false,        // Allow special characters
  forbidSpaces: true,              // Forbid spaces
  forbidStartingNumber: true,      // Forbid starting with number
  blockedUsernames: [],            // Reserved/blocked usernames
  details: false                   // Get detailed error messages
});
```

**Examples:**
```javascript
// Default validation
isUsername('johndoe'); // true
isUsername('ab'); // false (too short)
isUsername('user@name'); // false (special chars not allowed)

// Block reserved usernames
isUsername('admin', {
  blockedUsernames: ['admin', 'root', 'system']
}); // false

// Gaming platform (allow numbers at start)
isUsername('Player_1', {
  forbidStartingNumber: false
}); // true

// Get detailed feedback
const result = isUsername('123user', { details: true });
// Returns: { valid: false, errors: ['Username cannot start with a number'], ... }
```

**Common Use Cases:**
- 🎮 Gaming platforms (gamer tags)
- 📱 Social media handles
- 💼 Professional networks
- 🌐 Forums and communities

[📖 Full Username Documentation](docs/USERNAME.md)

---

#### 💪 Password Strength Calculator

Calculate password strength with detailed feedback:
```javascript
getPasswordStrength(password)
```

**Returns:**
```javascript
{
  strength: 'weak' | 'medium' | 'strong',
  score: 0-100,                    // Numerical strength score
  estimatedCrackTimeInYears: int, // Numerical crack time in years
  crackTimeDisplay: string, // Estimated time to crack in string
}
```

**Example:**
```javascript
const strength = getPasswordStrength('MyP@ssw0rd123');
console.log(strength);
// {
//   strength: 'weak',
//   score: 0,
//   estimatedCrackTimeInYears: 0,
//   crackTimeDisplay: '10 seconds'
// }
```

---

### 🔜 Coming Soon

- 📱 **Phone Number Validation** - International format support
- 🔢 **PIN/OTP Validation** - Verification code validation
- 🔄 **Password Match** - Compare password and confirm password
- 🧹 **Sanitizers** - Clean and format input data
- 🛡️ **Breach Detection** - Check against Have I Been Pwned database
- 📝 **TypeScript Definitions** - Full TypeScript support
- ⚛️ **React Hooks** - Easy integration with React
- 🎨 **Vue Composables** - Vue 3 integration
- 🚂 **Framework Integrations** - Express, Fastify middleware

## 💡 Use Cases

### Complete Registration Form
```javascript
const { isEmail, isPassword, isUsername } = require('validauth');

function validateRegistration(email, password, username) {
  const errors = {};
  
  // Validate email
  const emailResult = isEmail(email, {
    allowPlusAddressing: false,
    blockedDomains: ['tempmail.com', 'throwaway.email'],
    details: true
  });
  
  if (!emailResult.valid) {
    errors.email = emailResult.errors;
  }
  
  // Validate password
  const passwordResult = isPassword(password, {
    minLength: 10,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true
  });
  
  if (!passwordResult.valid) {
    errors.password = passwordResult.errors;
  }
  
  // Validate username
  const usernameResult = isUsername(username, {
    minLength: 4,
    maxLength: 20,
    forbidStartingNumber: true,
    blockedUsernames: ['admin', 'root', 'system', 'moderator'],
    details: true
  });
  
  if (!usernameResult.valid) {
    errors.username = usernameResult.errors;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Usage
const result = validateRegistration(
  'user@example.com',
  'MyP@ssw0rd123',
  'johndoe'
);

if (!result.valid) {
  console.log('Validation errors:', result.errors);
} else {
  console.log('All valid! Proceed with registration.');
}
```

### Login Form
```javascript
function validateLogin(identifier, password) {
  // Check if identifier is email or username
  const isEmailFormat = identifier.includes('@');
  
  if (isEmailFormat) {
    return isEmail(identifier) && isPassword(password, {
      minLength: 1, // Just check if exists
      requireUppercase: false,
      requireNumbers: false,
      requireSymbols: false,
      forbidCommonPasswords: false
    });
  } else {
    return isUsername(identifier, {
      minLength: 1
    }) && password.length > 0;
  }
}
```

### Password Reset
```javascript
function validateNewPassword(newPassword, username) {
  const result = isPassword(newPassword, {
    minLength: 12,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true
  });
  
  if (!result.valid) {
    return result;
  }
  
  // Check if password contains username
  if (newPassword.toLowerCase().includes(username.toLowerCase())) {
    return {
      valid: false,
      errors: ['Password cannot contain your username']
    };
  }
  
  return { valid: true };
}
```

### Social Media Registration
```javascript
function validateSocialSignup(email, username) {
  // Email validation
  const emailValid = isEmail(email, {
    allowPlusAddressing: true,
    details: true
  });
  
  // Username/handle validation
  const usernameValid = isUsername(username, {
    minLength: 3,
    maxLength: 30,
    forbidStartingNumber: true,
    blockedUsernames: ['admin', 'support', 'help', 'official'],
    details: true
  });
  
  return {
    email: emailValid,
    username: usernameValid,
    valid: emailValid.valid && usernameValid.valid
  };
}
```

## 🎯 Why validauth?

### Before validauth:
```javascript
// Complex regex, hard to maintain
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,29}$/;

if (!emailRegex.test(email)) {
  return 'Invalid email';
}

// Manual password checks
if (password.length < 8) return 'Too short';
if (!/[A-Z]/.test(password)) return 'Need uppercase';
if (!/[0-9]/.test(password)) return 'Need numbers';

// Manual username checks
if (username.length < 3) return 'Too short';
if (/[!@#$%]/.test(username)) return 'No special chars';
if (username === 'admin') return 'Reserved';

// No protection against common passwords
// No customization, no detailed errors
// Lots of repetitive code
```

### After validauth:
```javascript
const emailResult = isEmail(email, {
  blockedDomains: ['tempmail.com'],
  details: true
});

const passwordResult = isPassword(password, {
  minLength: 10,
  forbidCommonPasswords: true,
  details: true
});

const usernameResult = isUsername(username, {
  minLength: 4,
  blockedUsernames: ['admin', 'root'],
  details: true
});

// Clean, readable, comprehensive validation
if (!emailResult.valid) return emailResult.errors;
if (!passwordResult.valid) return passwordResult.errors;
if (!usernameResult.valid) return usernameResult.errors;
```

## 🏗️ Project Status

validauth is actively developed and maintained. We're working on adding more validators and features based on community feedback.

**Current version:** 1.2.0  
**Status:** ✅ Stable

### Roadmap

- [x] Email validation
- [x] Password validation
- [x] Password strength calculator
- [x] Username validation
- [ ] Phone number validation
- [ ] PIN/OTP validation
- [ ] Password match validator
- [ ] Sanitizers and formatters
- [ ] TypeScript definitions
- [ ] React hooks
- [ ] Vue composables
- [ ] Framework integrations (Express, Fastify)
- [ ] Breach detection (Have I Been Pwned)

## 🤝 Contributing

Contributions are welcome! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🔧 Code contributions

### Development Setup
```bash
# Clone the repository
git clone https://github.com/Adiksuu/validauth.git
cd validauth

# Install dependencies
npm install

# Run tests
npm test

# Run examples
node test.js
```

## 📊 Comparison with Other Libraries

| Feature | validauth | validator.js | joi | yup |
|---------|-----------|--------------|-----|-----|
| Size | ~15KB | ~100KB | ~150KB | ~80KB |
| Dependencies | 0 | 0 | Many | Many |
| Auth-focused | ✅ | ❌ | ❌ | ❌ |
| Common password check | ✅ | ❌ | ❌ | ❌ |
| Password strength | ✅ | ❌ | ❌ | ❌ |
| Detailed errors | ✅ | ⚠️ | ✅ | ✅ |
| Easy to use | ✅ | ✅ | ⚠️ | ⚠️ |
| TypeScript | 🔜 | ✅ | ✅ | ✅ |

## 📦 Bundle Size

- **validauth**: ~15KB minified, ~5KB gzipped
- **Zero dependencies**: No bloat from external packages
- **Tree-shakeable**: Import only what you need
```javascript
// Import only what you need
import { isEmail } from 'validauth'; // ~3KB
import { isPassword } from 'validauth'; // ~8KB
import { isUsername } from 'validauth'; // ~2KB
```

## 🌍 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Node.js 12+

## 📄 License

MIT © [Adiksuu]

See [LICENSE](MIT) for details.

## 🙏 Acknowledgments

- Inspired by the need for better authentication validation in modern web apps
- Built with ❤️ for the JavaScript community
- Common password list curated from security research and breach databases
- Reserved username list compiled from industry best practices

## 📞 Support

- 📧 Email: codeadiksuu@gmail.com
- 💬 Issues: [GitHub Issues](https://github.com/Adiksuu/validauth/issues)
<!-- - 📖 Documentation: [GitHub Wiki](https://github.com/Adiksuu/validauth/wiki) -->

## 🔥 Quick Links

<!-- - [📖 Full Documentation](https://github.com/Adiksuu/validauth/wiki) -->
- [📝 Email Validation Guide](docs/EMAIL.md)
- [🔑 Password Validation & Password Strength Guide](docs/PASSWORD.md)
- [👤 Username Validation Guide](docs/USERNAME.md)
<!-- - [💪 Password Strength Guide](docs/PASSWORD_STRENGTH.md) -->
<!-- - [🎯 Examples & Recipes](examples/) -->
<!-- - [📋 Changelog](CHANGELOG.md) -->
<!-- - [🤝 Contributing Guide](CONTRIBUTING.md) -->

---

**Made with ❤️ by [Adiksuu]**

⭐ Star this repo if you find it useful!

<!-- ## 💬 Testimonials

> "Finally, a validation library that just makes sense for auth flows!" - Developer

> "The detailed error messages saved me hours of debugging." - Another Developer

> "Common password checking out of the box? Amazing!" - Yet Another Developer -->

<!-- ## 📈 Stats

- ⭐ Stars on GitHub
- 📦 Downloads per week
- 🐛 Issues closed
- 🎉 Contributors -->

<!-- ---

## Example Projects

Check out these example implementations:

- [React Registration Form](examples/react-registration)
- [Express API with validauth](examples/express-api)
- [Vue 3 Login Form](examples/vue-login)
- [Vanilla JS Examples](examples/vanilla-js) -->

## FAQ

**Q: Can I use this in production?**  
A: Yes! validauth is stable and well-tested.

**Q: Does it work with TypeScript?**  
A: TypeScript definitions are coming soon. For now, you can use it with `any` types.

**Q: How do I add custom validation rules?**  
A: You can combine validauth with your own validation logic, or open an issue to request a new feature.

**Q: Is the common password list up to date?**  
A: Yes, we regularly update it based on the latest security research.

**Q: Can I use this on the backend?**  
A: Absolutely! validauth works in both browser and Node.js environments.

**Q: How often is the package updated?**  
A: We aim for regular updates with new features and security improvements.

**Q: Can I contribute?**  
A: Yes! We welcome contributions. Just send a message on my email

## Security

If you discover a security vulnerability, please email codeadiksuu@gmail.com. All security vulnerabilities will be promptly addressed.

## Changelog

### [1.2.0] - 23.11.2025

#### Added
- Username validation with comprehensive options
- Blocked/reserved username checking

### [1.1.2] - 23.11.2025

#### Added
- Added browser support

### [1.1.0-1.1.1] - 23.11.2025

#### Added
- Password validation with security checks
- Common password detection (10,000+ passwords)
- Password strength calculator

### [1.0.0] - 23.11.2025

#### Added
- Initial release
- Email validation with full options support
- Detailed error messages
- Zero dependencies

<!-- [See full changelog](CHANGELOG.md) -->