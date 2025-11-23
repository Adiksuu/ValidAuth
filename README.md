# ValidAuth package

Authentication validators for email, password, username and more.

## Installation
```bash
npm install validauth
```

## Usage

### Email Validation

#### Basic validation
```javascript
const { isEmail } = require('validauth');

console.log(isEmail('user@example.com')); // true
console.log(isEmail('invalid@')); // false
console.log(isEmail('no-at-sign.com')); // false
console.log(isEmail('user@domain.co.uk')); // true
```

#### Option: `allowPlusAddressing`

Controls whether email addresses with plus signs (e.g., `user+tag@example.com`) are allowed.
```javascript
// Default: true (plus addressing allowed)
console.log(isEmail('user+newsletter@example.com')); // true

// Disable plus addressing
console.log(isEmail('user+newsletter@example.com', {
  allowPlusAddressing: false
})); // false

console.log(isEmail('user@example.com', {
  allowPlusAddressing: false
})); // true (no plus sign, so it's valid)
```

#### Option: `requireTLD`

Controls whether a top-level domain (like `.com`, `.org`) is required.
```javascript
// Default: true (TLD required)
console.log(isEmail('user@localhost')); // false

// Allow emails without TLD (useful for local development)
console.log(isEmail('user@localhost', {
  requireTLD: false
})); // true

console.log(isEmail('admin@server', {
  requireTLD: false
})); // true
```

#### Option: `blockedDomains`

Blocks specific domains from being considered valid.
```javascript
// Block temporary email providers
console.log(isEmail('user@tempmail.com', {
  blockedDomains: ['tempmail.com', '10minutemail.com']
})); // false

console.log(isEmail('user@gmail.com', {
  blockedDomains: ['tempmail.com', '10minutemail.com']
})); // true

// Block multiple domains
console.log(isEmail('test@spam.org', {
  blockedDomains: ['spam.org', 'trash.com', 'throwaway.email']
})); // false
```

#### Option: `details`

Returns detailed validation information instead of just true/false.
```javascript
// Get detailed validation result
const result = isEmail('user@example.com', { details: true });
console.log(result);
// Output:
// {
//   valid: true,
//   errors: null,
//   email: 'user@example.com',
//   localPart: 'user',
//   domain: 'example.com'
// }

// Detailed result for invalid email
const invalid = isEmail('invalid@', { details: true });
console.log(invalid);
// Output:
// {
//   valid: false,
//   errors: ['Domain cannot be empty'],
//   email: 'invalid@',
//   localPart: 'invalid',
//   domain: ''
// }

// Multiple errors example
const multiError = isEmail('..user@-example-.com', { details: true });
console.log(multiError);
// Output:
// {
//   valid: false,
//   errors: [
//     'Local part cannot start or end with a dot',
//     'Local part cannot contain consecutive dots',
//     'Domain cannot start or end with a dot or hyphen'
//   ],
//   email: '..user@-example-.com',
//   localPart: '..user',
//   domain: '-example-.com'
// }
```

#### Combining multiple options
```javascript
// Strict validation for production
const strictResult = isEmail('user+test@tempmail.com', {
  allowPlusAddressing: false,
  requireTLD: true,
  blockedDomains: ['tempmail.com', '10minutemail.com'],
  details: true
});
console.log(strictResult);
// Output:
// {
//   valid: false,
//   errors: [
//     'Plus addressing is not allowed',
//     'This domain is not allowed'
//   ],
//   email: 'user+test@tempmail.com',
//   localPart: 'user+test',
//   domain: 'tempmail.com'
// }

// Lenient validation for development
console.log(isEmail('admin@localhost', {
  allowPlusAddressing: true,
  requireTLD: false,
  blockedDomains: []
})); // true
```

#### Real-world examples
```javascript
// Registration form validation
function validateRegistrationEmail(email) {
  return isEmail(email, {
    allowPlusAddressing: false, // Prevent abuse
    requireTLD: true,
    blockedDomains: [
      'tempmail.com',
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com'
    ],
    details: true
  });
}

const registration = validateRegistrationEmail('user+spam@tempmail.com');
if (!registration.valid) {
  console.log('Registration failed:', registration.errors);
  // Output: Registration failed: ['Plus addressing is not allowed', 'This domain is not allowed']
}

// Newsletter signup (more lenient)
function validateNewsletterEmail(email) {
  return isEmail(email, {
    allowPlusAddressing: true, // Allow users to filter emails
    requireTLD: true,
    details: false
  });
}

console.log(validateNewsletterEmail('user+newsletter@gmail.com')); // true

// Internal email validation (local network)
function validateInternalEmail(email) {
  return isEmail(email, {
    requireTLD: false, // Allow @localhost, @server, etc.
    details: false
  });
}

console.log(validateInternalEmail('admin@localhost')); // true
console.log(validateInternalEmail('user@mailserver')); // true
```

## API

### `isEmail(email, options)`

Validates an email address.

**Parameters:**
- `email` (string) - Email address to validate
- `options` (object) - Optional validation options
  - `allowPlusAddressing` (boolean) - Allow + in email addresses. Default: `true`
  - `requireTLD` (boolean) - Require top-level domain (.com, .org, etc.). Default: `true`
  - `blockedDomains` (array) - List of domain names to block. Default: `[]`
  - `details` (boolean) - Return detailed validation result object. Default: `false`

**Returns:** 
- `boolean` - When `details: false` (default)
- `object` - When `details: true`:
```javascript
  {
    valid: boolean,
    errors: string[] | null,
    email: string,
    localPart: string,
    domain: string
  }
```

## Error Messages

When using `details: true`, you may receive the following error messages:

- `'Email must be a non-empty string'`
- `'Email cannot be empty'`
- `'Email is too long (max 254 characters)'`
- `'Email must contain @ symbol'`
- `'Email must contain exactly one @ symbol'`
- `'Local part cannot be empty'`
- `'Local part is too long (max 64 characters)'`
- `'Local part cannot start or end with a dot'`
- `'Local part cannot contain consecutive dots'`
- `'Plus addressing is not allowed'`
- `'Local part contains invalid characters'`
- `'Domain cannot be empty'`
- `'Domain is too long (max 253 characters)'`
- `'Domain must have a TLD (e.g., .com, .org)'`
- `'Domain cannot start or end with a dot or hyphen'`
- `'Domain cannot contain consecutive dots'`
- `'Domain contains invalid characters'`
- `'This domain is not allowed'`

## License

MIT