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
const { isEmail, isPassword } = require('validauth');

// Simple email validation
if (isEmail('user@example.com')) {
  console.log('Valid email!');
}

// Password validation with default rules
if (isPassword('MyP@ssw0rd123')) {
  console.log('Strong password!');
}

// Advanced validation with options
const result = isPassword('weak', {
  minLength: 10,
  requireSymbols: true,
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

// Custom requirements for less strict validation
isPassword('SimplyPassword123', {
  requireSymbols: false,
  minLength: 6
}); // true

// Block common passwords
isPassword('password123', {
  forbidCommonPasswords: true
}); // false

// Get detailed feedback
const result = isPassword('short', { details: true });
console.log(result);
// {
//   valid: false,
//   errors: ['Password must be at least 8 characters long'],
//   password: 'short'
// }
```

**Security Features:**
- ✅ Checks against 10,000+ common/leaked passwords
- ✅ Configurable complexity requirements
- ✅ Length validation (prevent too short or too long passwords)
- ✅ Character type requirements (uppercase, lowercase, numbers, symbols)
- ✅ Displaying password strength

[📖 Full Password Documentation](docs/PASSWORD.md)

### 🔜 Coming Soon

- 👤 **Username Validation** - Length, character, and reserved name checks
- 📱 **Phone Number Validation** - International format support
- 🔢 **PIN/OTP Validation** - Verification code validation
- 🛡️ **Password Strength Calculator** - Score passwords from weak to very strong
- 🔍 **Breach Detection** - Check against Have I Been Pwned database

## 💡 Use Cases

### Registration Forms
```javascript
const { isEmail, isPassword } = require('validauth');

function validateRegistration(email, password) {
  // Validate email
  const emailResult = isEmail(email, {
    allowPlusAddressing: false,
    blockedDomains: ['tempmail.com', 'throwaway.email'],
    details: true
  });
  
  if (!emailResult.valid) {
    return { success: false, field: 'email', errors: emailResult.errors };
  }
  
  // Validate password
  const passwordResult = isPassword(password, {
    minLength: 10,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true
  });
  
  if (!passwordResult.valid) {
    return { success: false, field: 'password', errors: passwordResult.errors };
  }
  
  return { success: true };
}
```

### Login Forms
```javascript
function validateLogin(email, password) {
  // Quick validation without strict rules
  const emailValid = isEmail(email);
  const passwordValid = isPassword(password, {
    minLength: 1, // Just check if it exists
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    forbidCommonPasswords: false
  });
  
  return emailValid && passwordValid;
}
```

### Password Reset
```javascript
function validateNewPassword(newPassword, oldPassword) {
  // Ensure new password meets requirements
  const result = isPassword(newPassword, {
    minLength: 12,
    requireSymbols: true,
    details: true
  });
  
  // Optionally check if new password is different from old
  if (result.valid && newPassword === oldPassword) {
    return {
      valid: false,
      errors: ['New password must be different from old password']
    };
  }
  
  return result;
}
```

### Newsletter Signups
```javascript
function validateNewsletter(email) {
  // Allow plus addressing for filtering
  return isEmail(email, {
    allowPlusAddressing: true,
    details: true
  });
}
```

### Internal/Development Environments
```javascript
function validateInternalEmail(email) {
  // Allow emails without TLD (admin@localhost)
  return isEmail(email, {
    requireTLD: false
  });
}
```

## 🎯 Why validauth?

### Before validauth:
```javascript
// Complex regex, hard to maintain
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return 'Invalid email';
}

// Manual password checks
if (password.length < 8) return 'Too short';
if (!/[A-Z]/.test(password)) return 'Need uppercase';
if (!/[0-9]/.test(password)) return 'Need numbers';
// ... and so on

// No protection against common passwords
// No customization, no detailed errors
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

if (!emailResult.valid) {
  return emailResult.errors; // Clear, detailed error messages
}

if (!passwordResult.valid) {
  return passwordResult.errors; // Comprehensive security feedback
}
```

## 🏗️ Project Status

validauth is actively developed and maintained. We're working on adding more validators and features based on community feedback.

**Current version:** 1.1.0  
**Status:** ✅ Stable

### Roadmap

- [x] Email validation
- [x] Password validation
- [x] Password strength calculator
- [ ] Username validation
- [ ] Phone number validation
- [ ] PIN/OTP validation
- [ ] TypeScript definitions
- [ ] React hooks
- [ ] Vue composables
- [ ] Framework integrations (Express, Fastify)

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

## 📄 License

MIT © [Adiksuu]

See [LICENSE](MIT) for details.

## 🙏 Acknowledgments

- Inspired by the need for better authentication validation in modern web apps
- Built with ❤️ for the JavaScript community
- Common password list curated from security research and breach databases

## 📞 Support

- 📧 Email: codeadiksuu@gmail.com
- 💬 Issues: [GitHub Issues](https://github.com/Adiksuu/validauth/issues)

---

**Made with ❤️ by [Adiksuu]**

⭐ Star this repo if you find it useful!