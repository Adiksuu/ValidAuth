# 🔑 Password Validation

Comprehensive password validation with security-first design.

## Installation
```bash
npm install validauth
```

## Basic Usage
```javascript
const { isPassword } = require('validauth');

// Simple validation with default rules
console.log(isPassword('MyP@ssw0rd123')); // true
console.log(isPassword('weak')); // false
```

## API

### `isPassword(password, options)`

Validates a password against configurable security requirements.

**Parameters:**
- `password` (string) - Password to validate
- `options` (object) - Optional validation options
  - `minLength` (number) - Minimum password length. Default: `8`
  - `maxLength` (number) - Maximum password length. Default: `128`
  - `requireUppercase` (boolean) - Require at least one uppercase letter. Default: `true`
  - `requireLowercase` (boolean) - Require at least one lowercase letter. Default: `true`
  - `requireNumbers` (boolean) - Require at least one number. Default: `true`
  - `requireSymbols` (boolean) - Require at least one special character. Default: `true`
  - `forbidCommonPasswords` (boolean) - Block common/leaked passwords. Default: `true`
  - `details` (boolean) - Return detailed validation result. Default: `false`

**Returns:** 
- `boolean` - When `details: false` (default)
- `object` - When `details: true`:
```javascript
  {
    valid: boolean,
    errors: string[] | null,
    password: string
  }
```

## Examples

### Option: `minLength`

Sets the minimum required password length.
```javascript
// Default: 8 characters minimum
console.log(isPassword('Short1!')); // false (only 7 chars)
console.log(isPassword('LongPass1!')); // true (10 chars)

// Custom minimum length
console.log(isPassword('Pass1!', {
  minLength: 6
})); // true

// Stricter requirement
console.log(isPassword('MyP@ssw0rd', {
  minLength: 12
})); // false (only 10 chars)

console.log(isPassword('MyP@ssw0rd123', {
  minLength: 12
})); // true (13 chars)
```

### Option: `maxLength`

Sets the maximum allowed password length.
```javascript
// Default: 128 characters maximum
const longPassword = 'a'.repeat(130);
console.log(isPassword(longPassword)); // false

// Custom maximum length
console.log(isPassword('ThisIsAVeryLongPassword123!@#', {
  maxLength: 20
})); // false (29 chars)

console.log(isPassword('Short123!', {
  maxLength: 20
})); // true (9 chars)
```

### Option: `requireUppercase`

Controls whether at least one uppercase letter is required.
```javascript
// Default: true (uppercase required)
console.log(isPassword('password123!')); // false (no uppercase)
console.log(isPassword('Password123!')); // true

// Disable uppercase requirement
console.log(isPassword('password123!', {
  requireUppercase: false
})); // true

console.log(isPassword('ALLUPPERCASE123!', {
  requireUppercase: false
})); // true (uppercase allowed, just not required)
```

### Option: `requireLowercase`

Controls whether at least one lowercase letter is required.
```javascript
// Default: true (lowercase required)
console.log(isPassword('PASSWORD123!')); // false (no lowercase)
console.log(isPassword('Password123!')); // true

// Disable lowercase requirement
console.log(isPassword('PASSWORD123!', {
  requireLowercase: false
})); // true
```

### Option: `requireNumbers`

Controls whether at least one number is required.
```javascript
// Default: true (numbers required)
console.log(isPassword('Password!')); // false (no numbers)
console.log(isPassword('Password1!')); // true

// Disable number requirement
console.log(isPassword('Password!', {
  requireNumbers: false
})); // true

console.log(isPassword('OnlyLetters', {
  requireNumbers: false,
  requireSymbols: false
})); // true
```

### Option: `requireSymbols`

Controls whether at least one special character is required.
```javascript
// Default: true (symbols required)
console.log(isPassword('Password123')); // false (no symbols)
console.log(isPassword('Password123!')); // true

// Disable symbol requirement
console.log(isPassword('Password123', {
  requireSymbols: false
})); // true

// Accepted symbols: !@#$%^&*()_+-=[]{};':"\\|,.<>/?
console.log(isPassword('Pass@word1')); // true
console.log(isPassword('Pass#word1')); // true
console.log(isPassword('Pass$word1')); // true
```

### Option: `forbidCommonPasswords`

Checks password against a database of 10,000+ common and leaked passwords.
```javascript
// Default: true (common passwords blocked)
console.log(isPassword('password123', {
  forbidCommonPasswords: true
})); // false (very common)

console.log(isPassword('123456', {
  forbidCommonPasswords: true
})); // false (extremely common)

console.log(isPassword('qwerty', {
  forbidCommonPasswords: true
})); // false (common keyboard pattern)

// Disable common password check (not recommended for production)
console.log(isPassword('password123', {
  forbidCommonPasswords: false,
  minLength: 8,
  requireUppercase: false,
  requireSymbols: false
})); // true (but very insecure!)

// Strong, unique password
console.log(isPassword('MyUn1qu3P@ssw0rd!', {
  forbidCommonPasswords: true
})); // true
```

### Option: `details`

Returns detailed validation information.
```javascript
// Get detailed validation result
const result = isPassword('short', { details: true });
console.log(result);
// Output:
// {
//   valid: false,
//   errors: ['Password must be at least 8 characters long'],
//   password: 'short'
// }

// Multiple validation errors
const result2 = isPassword('weak', { details: true });
console.log(result2);
// Output:
// {
//   valid: false,
//   errors: [
//     'Password must be at least 8 characters long'
//   ],
//   password: 'weak'
// }

// Check each requirement
const result3 = isPassword('password', { details: true });
console.log(result3);
// Output:
// {
//   valid: false,
//   errors: [
//     'Password must contain at least one uppercase letter'
//   ],
//   password: 'password'
// }

// Valid password with details
const result4 = isPassword('MyP@ssw0rd123', { details: true });
console.log(result4);
// Output:
// {
//   valid: true,
//   errors: null,
//   password: 'MyP@ssw0rd123'
// }
```

### Combining Multiple Options
```javascript
// Strict validation for high-security applications
const strictResult = isPassword('Weak1!', {
  minLength: 12,
  maxLength: 64,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  forbidCommonPasswords: true,
  details: true
});
console.log(strictResult);
// Output:
// {
//   valid: false,
//   errors: ['Password must be at least 12 characters long'],
//   password: 'Weak1!'
// }

// Lenient validation for low-risk applications
const lenientResult = isPassword('simplepass', {
  minLength: 6,
  requireUppercase: false,
  requireNumbers: false,
  requireSymbols: false,
  forbidCommonPasswords: false
});
console.log(lenientResult); // true

// Balanced validation (recommended for most applications)
const balancedResult = isPassword('MyPassword123!', {
  minLength: 10,
  requireSymbols: true,
  forbidCommonPasswords: true,
  details: true
});
console.log(balancedResult);
// Output:
// {
//   valid: true,
//   errors: null,
//   password: 'MyPassword123!'
// }
```

## Real-World Examples

### Registration Form
```javascript
function validateRegistrationPassword(password) {
  return isPassword(password, {
    minLength: 10,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true
  });
}

const result = validateRegistrationPassword('MyP@ssw0rd2024');
if (!result.valid) {
  console.log('Password requirements not met:');
  result.errors.forEach(error => console.log('- ' + error));
}
```

### Password Reset
```javascript
function validateNewPassword(newPassword, oldPassword) {
  const result = isPassword(newPassword, {
    minLength: 12,
    forbidCommonPasswords: true,
    details: true
  });
  
  if (!result.valid) {
    return result;
  }
  
  // Additional check: new password different from old
  if (newPassword === oldPassword) {
    return {
      valid: false,
      errors: ['New password must be different from old password'],
      password: newPassword
    };
  }
  
  return { valid: true, errors: null };
}
```

### Password Strength Indicator
```javascript
function getPasswordStrength(password) {
  // Try increasingly strict requirements
  const checks = [
    { level: 'Very Weak', opts: { minLength: 1, requireUppercase: false, requireLowercase: false, requireNumbers: false, requireSymbols: false, forbidCommonPasswords: false } },
    { level: 'Weak', opts: { minLength: 6, requireUppercase: false, requireNumbers: false, requireSymbols: false, forbidCommonPasswords: true } },
    { level: 'Fair', opts: { minLength: 8, requireUppercase: true, requireNumbers: true, requireSymbols: false, forbidCommonPasswords: true } },
    { level: 'Good', opts: { minLength: 10, requireUppercase: true, requireNumbers: true, requireSymbols: true, forbidCommonPasswords: true } },
    { level: 'Strong', opts: { minLength: 12, requireUppercase: true, requireNumbers: true, requireSymbols: true, forbidCommonPasswords: true } },
  ];
  
  for (let i = checks.length - 1; i >= 0; i--) {
    if (isPassword(password, checks[i].opts)) {
      return checks[i].level;
    }
  }
  
  return 'Very Weak';
}

console.log(getPasswordStrength('12345')); // Very Weak
console.log(getPasswordStrength('password')); // Very Weak (common)
console.log(getPasswordStrength('MyPass1')); // Weak
console.log(getPasswordStrength('MyPass123')); // Fair
console.log(getPasswordStrength('MyP@ss123')); // Good
console.log(getPasswordStrength('MyP@ssw0rd123')); // Strong
```

### API Integration
```javascript
// Express.js middleware
function validatePasswordMiddleware(req, res, next) {
  const { password } = req.body;
  
  const result = isPassword(password, {
    minLength: 10,
    forbidCommonPasswords: true,
    details: true
  });
  
  if (!result.valid) {
    return res.status(400).json({
      error: 'Invalid password',
      details: result.errors
    });
  }
  
  next();
}

app.post('/register', validatePasswordMiddleware, (req, res) => {
  // Password is valid, proceed with registration
});
```

## Error Messages

When using `details: true`, you may receive the following error messages:

- `'Password must be a non-empty string'`
- `'Password must be at least X characters long'`
- `'Password must be at most X characters long'`
- `'Password must contain at least one uppercase letter'`
- `'Password must contain at least one lowercase letter'`
- `'Password must contain at least one number'`
- `'Password must contain at least one symbol'`
- `'Password cannot be a common password'`

## Security Best Practices

### ✅ Recommended Settings

For most applications:
```javascript
{
  minLength: 10,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  forbidCommonPasswords: true
}
```

For high-security applications (banking, healthcare):
```javascript
{
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  forbidCommonPasswords: true
}
```

### ❌ Not Recommended

Overly lenient settings:
```javascript
{
  minLength: 4,
  requireUppercase: false,
  requireNumbers: false,
  requireSymbols: false,
  forbidCommonPasswords: false
}
```

### 🔒 Additional Security Tips

1. **Always hash passwords** - Never store plain text passwords
2. **Use HTTPS** - Protect passwords in transit
3. **Implement rate limiting** - Prevent brute force attacks
4. **Add 2FA** - Multi-factor authentication adds extra security
5. **Educate users** - Teach users about password managers
6. **Regular updates** - Keep the common password list updated

## Common Password Database

The library includes a curated list of 10,000+ common and leaked passwords, including:

- Simple sequences (`123456`, `abcdef`)
- Common words (`password`, `welcome`)
- Keyboard patterns (`qwerty`, `asdfgh`)
- Popular names and dates
- Previously breached passwords

This database is regularly updated to include newly discovered common passwords.

## Performance

- **Fast validation**: < 1ms for most passwords
- **Common password check**: O(1) lookup using hash set
- **Memory efficient**: Common password list optimized for size
- **No external dependencies**: Pure JavaScript implementation

## License

MIT © [Adiksuu]