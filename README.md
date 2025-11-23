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
const { isEmail } = require('validauth');

// Simple email validation
if (isEmail('user@example.com')) {
  console.log('Valid email!');
}

// Advanced validation with options
const result = isEmail('user@example.com', {
  blockedDomains: ['tempmail.com'],
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

### 🔜 Coming Soon

- 🔑 **Password Validation** - Strength checking, common password detection
- 👤 **Username Validation** - Length, character, and reserved name checks
- 📱 **Phone Number Validation** - International format support
- 🔢 **PIN/OTP Validation** - Verification code validation
- 🛡️ **Security Helpers** - Breach detection, entropy calculation

<!-- [See full documentation →](https://github.com/yourusername/validauth/wiki) -->

## 💡 Use Cases

### Registration Forms
```javascript
const { isEmail } = require('validauth');

function validateRegistration(email, password) {
  // Validate email
  const emailResult = isEmail(email, {
    allowPlusAddressing: false,
    blockedDomains: ['tempmail.com', 'throwaway.email'],
    details: true
  });
  
  if (!emailResult.valid) {
    return { success: false, errors: emailResult.errors };
  }
  
  // More validation...
  return { success: true };
}
```

### Login Forms
```javascript
function validateLogin(email) {
  // Quick validation without strict rules
  return isEmail(email);
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

// No customization, no detailed errors
// Security checks done manually
if (email.includes('tempmail.com')) {
  return 'Temporary emails not allowed';
}
```

### After validauth:
```javascript
const result = isEmail(email, {
  blockedDomains: ['tempmail.com'],
  details: true
});

if (!result.valid) {
  return result.errors; // Clear, detailed error messages
}
```

## 🏗️ Project Status

validauth is actively developed and maintained. We're working on adding more validators and features based on community feedback.

**Current version:** 1.0.0  
**Status:** ✅ Stable

### Roadmap

- [x] Email validation
- [ ] Password validation
- [ ] Username validation
- [ ] Phone number validation
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

<!-- Please read our [Contributing Guide](CONTRIBUTING.md) to get started. -->

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

## 📞 Support

- 📧 Email: codeadiksuu@gmail.com
- 💬 Issues: [GitHub Issues](https://github.com/Adiksuu/validauth/issues)

---

**Made with ❤️ by [Adiksuu]**

⭐ Star this repo if you find it useful!