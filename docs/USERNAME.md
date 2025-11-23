# 👤 Username Validation

Validate usernames with customizable rules for length, characters, and restrictions.

## Installation
```bash
npm install validauth
```

## Basic Usage
```javascript
const { isUsername } = require('validauth');

// Simple validation with default rules
console.log(isUsername('johndoe')); // true
console.log(isUsername('ab')); // false (too short)
console.log(isUsername('user@name')); // false (special chars not allowed)
```

## API

### `isUsername(username, options)`

Validates a username against configurable rules.

**Parameters:**
- `username` (string) - Username to validate
- `options` (object) - Optional validation options
  - `minLength` (number) - Minimum username length. Default: `3`
  - `maxLength` (number) - Maximum username length. Default: `30`
  - `allowSpecialChars` (boolean) - Allow special characters. Default: `false`
  - `forbidSpaces` (boolean) - Forbid spaces in username. Default: `true`
  - `forbidStartingNumber` (boolean) - Forbid usernames starting with a number. Default: `true`
  - `blockedUsernames` (array) - List of blocked/reserved usernames. Default: `[]`
  - `details` (boolean) - Return detailed validation result. Default: `false`

**Returns:** 
- `boolean` - When `details: false` (default)
- `object` - When `details: true`:
```javascript
  {
    valid: boolean,
    errors: string[] | null,
    username: string
  }
```

## Examples

### Option: `minLength`

Sets the minimum required username length.
```javascript
// Default: 3 characters minimum
console.log(isUsername('ab')); // false (only 2 chars)
console.log(isUsername('abc')); // true (3 chars)

// Custom minimum length
console.log(isUsername('jo', {
  minLength: 2
})); // true

// Stricter requirement
console.log(isUsername('john', {
  minLength: 5
})); // false (only 4 chars)

console.log(isUsername('johnny', {
  minLength: 5
})); // true (6 chars)
```

### Option: `maxLength`

Sets the maximum allowed username length.
```javascript
// Default: 30 characters maximum
const longUsername = 'a'.repeat(31);
console.log(isUsername(longUsername)); // false

// Custom maximum length
console.log(isUsername('verylongusername123', {
  maxLength: 15
})); // false (19 chars)

console.log(isUsername('shortname', {
  maxLength: 15
})); // true (9 chars)

// Allow longer usernames
console.log(isUsername('this_is_a_very_long_username_12345', {
  maxLength: 50
})); // true (35 chars)
```

### Option: `allowSpecialChars`

Controls whether special characters are allowed in usernames.
```javascript
// Default: false (special chars not allowed)
console.log(isUsername('user@name')); // false
console.log(isUsername('user#123')); // false
console.log(isUsername('user.name')); // false
console.log(isUsername('username')); // true

// Allow special characters
console.log(isUsername('user@name', {
  allowSpecialChars: true
})); // true

console.log(isUsername('cool#user!', {
  allowSpecialChars: true
})); // true

console.log(isUsername('user.name@123', {
  allowSpecialChars: true
})); // true

// Note: Underscores and hyphens are always allowed
console.log(isUsername('user_name')); // true
console.log(isUsername('user-name')); // true
```

### Option: `forbidSpaces`

Controls whether spaces are forbidden in usernames.
```javascript
// Default: true (spaces forbidden)
console.log(isUsername('john doe')); // false
console.log(isUsername('my username')); // false
console.log(isUsername('johndoe')); // true

// Allow spaces (not recommended for most applications)
console.log(isUsername('john doe', {
  forbidSpaces: false
})); // true

console.log(isUsername('my cool username', {
  forbidSpaces: false
})); // true

// Leading/trailing spaces are always trimmed
console.log(isUsername('  username  ', {
  forbidSpaces: false
})); // true (trimmed to 'username')
```

### Option: `forbidStartingNumber`

Controls whether usernames can start with a number.
```javascript
// Default: true (cannot start with number)
console.log(isUsername('123user')); // false
console.log(isUsername('1stplace')); // false
console.log(isUsername('user123')); // true (numbers allowed elsewhere)

// Allow starting with number
console.log(isUsername('123user', {
  forbidStartingNumber: false
})); // true

console.log(isUsername('99problems', {
  forbidStartingNumber: false
})); // true

console.log(isUsername('2cool4school', {
  forbidStartingNumber: false
})); // true
```

### Option: `blockedUsernames`

Blocks specific usernames from being considered valid (case-insensitive).
```javascript
// Block reserved/system usernames
console.log(isUsername('admin', {
  blockedUsernames: ['admin', 'root', 'system', 'moderator']
})); // false

console.log(isUsername('ADMIN', {
  blockedUsernames: ['admin', 'root', 'system']
})); // false (case-insensitive)

console.log(isUsername('user123', {
  blockedUsernames: ['admin', 'root', 'system']
})); // true

// Block offensive/inappropriate usernames
console.log(isUsername('offensive', {
  blockedUsernames: ['offensive', 'inappropriate', 'spam']
})); // false

// Block competitor names
console.log(isUsername('competitor', {
  blockedUsernames: ['competitor', 'rival', 'other-brand']
})); // false

console.log(isUsername('myusername', {
  blockedUsernames: ['competitor', 'rival']
})); // true
```

### Option: `details`

Returns detailed validation information.
```javascript
// Get detailed validation result
const result = isUsername('ab', { details: true });
console.log(result);
// Output:
// {
//   valid: false,
//   errors: ['Username must be at least 3 characters long'],
//   username: 'ab'
// }

// Check special characters
const result2 = isUsername('user@name', { details: true });
console.log(result2);
// Output:
// {
//   valid: false,
//   errors: ['Username cannot contain special characters'],
//   username: 'user@name'
// }

// Check starting with number
const result3 = isUsername('123user', { details: true });
console.log(result3);
// Output:
// {
//   valid: false,
//   errors: ['Username cannot start with a number'],
//   username: '123user'
// }

// Check blocked username
const result4 = isUsername('admin', {
  blockedUsernames: ['admin', 'root'],
  details: true
});
console.log(result4);
// Output:
// {
//   valid: false,
//   errors: ['This username is not allowed'],
//   username: 'admin'
// }

// Valid username with details
const result5 = isUsername('johndoe', { details: true });
console.log(result5);
// Output:
// {
//   valid: true,
//   errors: null,
//   username: 'johndoe'
// }
```

### Combining Multiple Options
```javascript
// Strict validation for professional platforms
const strictResult = isUsername('123@user!', {
  minLength: 5,
  maxLength: 20,
  allowSpecialChars: false,
  forbidSpaces: true,
  forbidStartingNumber: true,
  blockedUsernames: ['admin', 'root', 'system', 'moderator'],
  details: true
});
console.log(strictResult);
// Output:
// {
//   valid: false,
//   errors: ['Username cannot start with a number'],
//   username: '123@user!'
// }

// Lenient validation for casual platforms
const lenientResult = isUsername('cool_user_99', {
  minLength: 3,
  maxLength: 50,
  allowSpecialChars: true,
  forbidSpaces: true,
  forbidStartingNumber: false,
  blockedUsernames: [],
  details: false
});
console.log(lenientResult); // true

// Gaming platform validation
const gamingResult = isUsername('Player_1', {
  minLength: 3,
  maxLength: 16,
  allowSpecialChars: false,
  forbidSpaces: true,
  forbidStartingNumber: false, // Allow Player1, Player2, etc.
  blockedUsernames: ['admin', 'moderator', 'bot'],
  details: true
});
console.log(gamingResult);
// Output:
// {
//   valid: true,
//   errors: null,
//   username: 'Player_1'
// }

// Social media validation
const socialResult = isUsername('john.doe_2024', {
  minLength: 4,
  maxLength: 30,
  allowSpecialChars: false, // Only underscores and hyphens
  forbidSpaces: true,
  forbidStartingNumber: true,
  blockedUsernames: ['admin', 'support', 'help', 'official'],
  details: true
});
console.log(socialResult);
// Output:
// {
//   valid: true,
//   errors: null,
//   username: 'john.doe_2024'
// }
```

## Real-World Examples

### Registration Form
```javascript
const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system',
  'moderator', 'mod', 'support', 'help',
  'staff', 'official', 'team', 'bot',
  'api', 'www', 'ftp', 'mail'
];

function validateRegistrationUsername(username) {
  return isUsername(username, {
    minLength: 4,
    maxLength: 20,
    allowSpecialChars: false,
    forbidSpaces: true,
    forbidStartingNumber: true,
    blockedUsernames: RESERVED_USERNAMES,
    details: true
  });
}

const result = validateRegistrationUsername('admin');
if (!result.valid) {
  console.log('Username not available:');
  result.errors.forEach(error => console.log('- ' + error));
}
// Output:
// Username not available:
// - This username is not allowed
```

### Username Availability Check
```javascript
async function checkUsernameAvailability(username) {
  // First, validate format
  const validation = isUsername(username, {
    minLength: 3,
    maxLength: 30,
    forbidStartingNumber: true,
    blockedUsernames: ['admin', 'root', 'system'],
    details: true
  });
  
  if (!validation.valid) {
    return {
      available: false,
      reason: 'invalid',
      errors: validation.errors
    };
  }
  
  // Then check if already taken (pseudo-code)
  const isTaken = await db.users.exists({ username });
  
  if (isTaken) {
    return {
      available: false,
      reason: 'taken',
      suggestion: username + Math.floor(Math.random() * 1000)
    };
  }
  
  return { available: true };
}

// Usage
const result = await checkUsernameAvailability('johndoe');
if (!result.available) {
  if (result.reason === 'invalid') {
    console.log('Invalid username:', result.errors);
  } else {
    console.log('Username taken. Try:', result.suggestion);
  }
}
```

### Gaming Platform
```javascript
function validateGamerTag(gamerTag) {
  return isUsername(gamerTag, {
    minLength: 3,
    maxLength: 16,
    allowSpecialChars: false,
    forbidSpaces: true,
    forbidStartingNumber: false, // Allow Player1, xXx420, etc.
    blockedUsernames: [
      'admin', 'mod', 'moderator', 'bot',
      'official', 'system', 'server'
    ],
    details: true
  });
}

console.log(validateGamerTag('xXx_Sniper_420')); // Valid
console.log(validateGamerTag('Player_1')); // Valid
console.log(validateGamerTag('admin')); // Invalid (blocked)
```

### Social Media Handle
```javascript
function validateSocialHandle(handle) {
  // Remove @ if present
  if (handle.startsWith('@')) {
    handle = handle.substring(1);
  }
  
  return isUsername(handle, {
    minLength: 3,
    maxLength: 30,
    allowSpecialChars: false, // Only letters, numbers, underscore, hyphen
    forbidSpaces: true,
    forbidStartingNumber: true,
    blockedUsernames: [
      'admin', 'support', 'help', 'official',
      'news', 'team', 'staff', 'verified'
    ],
    details: true
  });
}

console.log(validateSocialHandle('@john_doe')); // Valid
console.log(validateSocialHandle('jane.smith')); // Valid
console.log(validateSocialHandle('official')); // Invalid (blocked)
```

### Professional Platform (LinkedIn-style)
```javascript
function validateProfessionalUsername(username) {
  return isUsername(username, {
    minLength: 5,
    maxLength: 30,
    allowSpecialChars: false,
    forbidSpaces: true,
    forbidStartingNumber: true,
    blockedUsernames: [
      'admin', 'administrator', 'support',
      'help', 'team', 'official', 'staff',
      'linkedin', 'company', 'recruiter'
    ],
    details: true
  });
}

const result = validateProfessionalUsername('john-doe-2024');
if (result.valid) {
  console.log('Professional username accepted!');
}
```

### API Integration
```javascript
// Express.js middleware
function validateUsernameMiddleware(req, res, next) {
  const { username } = req.body;
  
  const result = isUsername(username, {
    minLength: 4,
    maxLength: 20,
    forbidStartingNumber: true,
    blockedUsernames: ['admin', 'root', 'system', 'moderator'],
    details: true
  });
  
  if (!result.valid) {
    return res.status(400).json({
      error: 'Invalid username',
      details: result.errors
    });
  }
  
  req.validatedUsername = result.username;
  next();
}

app.post('/register', validateUsernameMiddleware, async (req, res) => {
  // Username is valid, proceed with registration
  const { validatedUsername } = req;
  // ...
});
```

## Error Messages

When using `details: true`, you may receive the following error messages:

- `'Username must be a non-empty string'`
- `'Username must be at least X characters long'`
- `'Username must be no more than X characters long'`
- `'Username cannot contain spaces'`
- `'Username cannot contain special characters'`
- `'Username cannot start with a number'`
- `'This username is not allowed'`

## Validation Rules

### Always Allowed Characters

- Letters (A-Z, a-z)
- Numbers (0-9) - except at the start if `forbidStartingNumber: true`
- Underscore (_)
- Hyphen (-)

### Special Characters

When `allowSpecialChars: true`, these are also allowed:
- `!@#$%^&*(),.?":{}|<>`

### Automatic Trimming

Leading and trailing whitespace is automatically removed before validation.

## Common Username Patterns

### Recommended Blocked List
```javascript
const COMMON_BLOCKED_USERNAMES = [
  // System/Admin
  'admin', 'administrator', 'root', 'system', 'sysadmin',
  'superuser', 'su', 'sudo',
  
  // Staff/Moderation
  'moderator', 'mod', 'staff', 'team', 'support',
  'help', 'helpdesk', 'service',
  
  // Official/Verified
  'official', 'verified', 'authentic', 'real',
  
  // Technical
  'api', 'bot', 'webhook', 'service', 'system',
  'null', 'undefined', 'test', 'demo',
  
  // Common Services
  'www', 'ftp', 'mail', 'email', 'smtp',
  'pop', 'imap', 'webmail',
  
  // Brand Protection
  'yourcompany', 'yourbrand', 'yourapp',
  
  // Reserved for Features
  'settings', 'profile', 'account', 'dashboard',
  'home', 'about', 'contact', 'privacy', 'terms'
];
```

### Platform-Specific Configurations

**Gaming Platform:**
```javascript
{
  minLength: 3,
  maxLength: 16,
  allowSpecialChars: false,
  forbidSpaces: true,
  forbidStartingNumber: false
}
```

**Professional Network:**
```javascript
{
  minLength: 5,
  maxLength: 30,
  allowSpecialChars: false,
  forbidSpaces: true,
  forbidStartingNumber: true
}
```

**Social Media:**
```javascript
{
  minLength: 3,
  maxLength: 30,
  allowSpecialChars: false,
  forbidSpaces: true,
  forbidStartingNumber: true
}
```

**Forum/Community:**
```javascript
{
  minLength: 4,
  maxLength: 25,
  allowSpecialChars: true,
  forbidSpaces: true,
  forbidStartingNumber: true
}
```

## Best Practices

### ✅ Recommended

1. **Use reasonable length limits** - 3-30 characters works for most platforms
2. **Block reserved/system names** - Prevent confusion and security issues
3. **Forbid starting with numbers** - Improves readability and prevents issues
4. **Keep it simple** - Avoid allowing too many special characters
5. **Case-insensitive checking** - Blocked usernames are checked case-insensitively
6. **Provide clear feedback** - Use `details: true` to show specific errors

### ❌ Not Recommended

1. **Too short minimum** - Avoid minLength < 3
2. **Too long maximum** - Avoid maxLength > 50
3. **Allowing spaces** - Creates display and technical issues
4. **Empty blocked list** - Always block at least 'admin', 'root', 'system'
5. **Too many special chars** - Makes usernames hard to remember and share

## Performance

- **Fast validation**: < 1ms for most usernames
- **Case-insensitive blocked check**: O(n) where n = blocked list size
- **Memory efficient**: Minimal overhead
- **No external dependencies**: Pure JavaScript implementation

## Security Considerations

1. **Always validate server-side** - Client-side validation is not enough
2. **Use HTTPS** - Protect usernames in transit
3. **Check availability separately** - Validation doesn't check if username exists
4. **Sanitize before storage** - Always trim and normalize before saving
5. **Consider display vs login** - Allow different display names vs login usernames
6. **Rate limit checks** - Prevent username enumeration attacks

## License

MIT © [Adiksuu]