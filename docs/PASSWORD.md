# 🔑 Password Validation

Comprehensive password validation with security-first design.

## Installation

```bash
npm install validauth
```

## Basic Usage

```javascript
const { isPassword, getPasswordStrength } = require("validauth");

// Simple validation with default rules
console.log(isPassword("MyP@ssw0rd123")); // true
console.log(isPassword("weak")); // false

// Check password strength
console.log(getPasswordStrength("MyP@ssw0rd123")); // 'strong'
console.log(getPasswordStrength("weak")); // 'weak'
```

## API

### `isPassword(password, options)`

Validates a password against configurable security requirements.

**Parameters:**

-   `password` (string) - Password to validate
-   `options` (object) - Optional validation options
    -   `minLength` (number) - Minimum password length. Default: `8`
    -   `maxLength` (number) - Maximum password length. Default: `128`
    -   `requireUppercase` (boolean) - Require at least one uppercase letter. Default: `true`
    -   `requireLowercase` (boolean) - Require at least one lowercase letter. Default: `true`
    -   `requireNumbers` (boolean) - Require at least one number. Default: `true`
    -   `requireSymbols` (boolean) - Require at least one special character. Default: `true`
    -   `forbidCommonPasswords` (boolean) - Block common/leaked passwords. Default: `true`
    -   `details` (boolean) - Return detailed validation result. Default: `false`

**Returns:**

-   `boolean` - When `details: false` (default)
-   `object` - When `details: true`:

```javascript
  {
    valid: boolean,
    errors: string[] | null,
    password: string
  }
```

### `getPasswordStrength(password, options)`

Calculates the strength of a password based on length, character variety, and complexity.

**Parameters:**

-   `password` (string) - Password to evaluate
-   `options` (object) - Optional evaluation options
    -   `details` (boolean) - Return detailed strength information. Default: `false`

**Returns:**

-   `string` - When `details: false` (default): `'weak'` | `'medium'` | `'strong'`
-   `object` - When `details: true`:

```javascript
  {
    strength: 'weak' | 'medium' | 'strong',
    score: number, // 0-100
    estimatedCrackTimeInYears: number,
    crackTimeDisplay: string // Human-readable format
  }
```

**Scoring System:**

-   **Length (0-40 points)**: 10 points each for passwords >=8, >=12, >=16, >=20 characters
-   **Character Variety (0-40 points)**: 10 points each for lowercase, uppercase, numbers, symbols
-   **Complexity Bonus (0-20 points)**: Bonus for longer passwords with multiple character types
-   **Common Password Penalty**: Common passwords automatically receive a score of 0

**Strength Levels:**

-   `weak`: Score < 40
-   `medium`: Score 40-69
-   `strong`: Score >= 70

## Examples

### Option: `minLength`

Sets the minimum required password length.

```javascript
// Default: 8 characters minimum
console.log(isPassword("Short1!")); // false (only 7 chars)
console.log(isPassword("LongPass1!")); // true (10 chars)

// Custom minimum length
console.log(
    isPassword("Pass1!", {
        minLength: 6,
    })
); // true

// Stricter requirement
console.log(
    isPassword("MyP@ssw0rd", {
        minLength: 12,
    })
); // false (only 10 chars)

console.log(
    isPassword("MyP@ssw0rd123", {
        minLength: 12,
    })
); // true (13 chars)
```

### Option: `maxLength`

Sets the maximum allowed password length.

```javascript
// Default: 128 characters maximum
const longPassword = "a".repeat(130);
console.log(isPassword(longPassword)); // false

// Custom maximum length
console.log(
    isPassword("ThisIsAVeryLongPassword123!@#", {
        maxLength: 20,
    })
); // false (29 chars)

console.log(
    isPassword("Short123!", {
        maxLength: 20,
    })
); // true (9 chars)
```

### Option: `requireUppercase`

Controls whether at least one uppercase letter is required.

```javascript
// Default: true (uppercase required)
console.log(isPassword("password123!")); // false (no uppercase)
console.log(isPassword("Password123!")); // true

// Disable uppercase requirement
console.log(
    isPassword("password123!", {
        requireUppercase: false,
    })
); // true

console.log(
    isPassword("ALLUPPERCASE123!", {
        requireUppercase: false,
    })
); // true (uppercase allowed, just not required)
```

### Option: `requireLowercase`

Controls whether at least one lowercase letter is required.

```javascript
// Default: true (lowercase required)
console.log(isPassword("PASSWORD123!")); // false (no lowercase)
console.log(isPassword("Password123!")); // true

// Disable lowercase requirement
console.log(
    isPassword("PASSWORD123!", {
        requireLowercase: false,
    })
); // true
```

### Option: `requireNumbers`

Controls whether at least one number is required.

```javascript
// Default: true (numbers required)
console.log(isPassword("Password!")); // false (no numbers)
console.log(isPassword("Password1!")); // true

// Disable number requirement
console.log(
    isPassword("Password!", {
        requireNumbers: false,
    })
); // true

console.log(
    isPassword("OnlyLetters", {
        requireNumbers: false,
        requireSymbols: false,
    })
); // true
```

### Option: `requireSymbols`

Controls whether at least one special character is required.

```javascript
// Default: true (symbols required)
console.log(isPassword("Password123")); // false (no symbols)
console.log(isPassword("Password123!")); // true

// Disable symbol requirement
console.log(
    isPassword("Password123", {
        requireSymbols: false,
    })
); // true

// Accepted symbols: !@#$%^&*()_+-=[]{};':"\\|,.<>/?
console.log(isPassword("Pass@word1")); // true
console.log(isPassword("Pass#word1")); // true
console.log(isPassword("Pass$word1")); // true
```

### Option: `forbidCommonPasswords`

Checks password against a database of 10,000+ common and leaked passwords.

```javascript
// Default: true (common passwords blocked)
console.log(
    isPassword("password123", {
        forbidCommonPasswords: true,
    })
); // false (very common)

console.log(
    isPassword("123456", {
        forbidCommonPasswords: true,
    })
); // false (extremely common)

console.log(
    isPassword("qwerty", {
        forbidCommonPasswords: true,
    })
); // false (common keyboard pattern)

// Disable common password check (not recommended for production)
console.log(
    isPassword("password123", {
        forbidCommonPasswords: false,
        minLength: 8,
        requireUppercase: false,
        requireSymbols: false,
    })
); // true (but very insecure!)

// Strong, unique password
console.log(
    isPassword("MyUn1qu3P@ssw0rd!", {
        forbidCommonPasswords: true,
    })
); // true
```

### Option: `details`

Returns detailed validation information.

```javascript
// Get detailed validation result
const result = isPassword("short", { details: true });
console.log(result);
// Output:
// {
//   valid: false,
//   errors: ['Password must be at least 8 characters long'],
//   password: 'short'
// }

// Multiple validation errors
const result2 = isPassword("weak", { details: true });
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
const result3 = isPassword("password", { details: true });
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
const result4 = isPassword("MyP@ssw0rd123", { details: true });
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
const strictResult = isPassword("Weak1!", {
    minLength: 12,
    maxLength: 64,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true,
});
console.log(strictResult);
// Output:
// {
//   valid: false,
//   errors: ['Password must be at least 12 characters long'],
//   password: 'Weak1!'
// }

// Lenient validation for low-risk applications
const lenientResult = isPassword("simplepass", {
    minLength: 6,
    requireUppercase: false,
    requireNumbers: false,
    requireSymbols: false,
    forbidCommonPasswords: false,
});
console.log(lenientResult); // true

// Balanced validation (recommended for most applications)
const balancedResult = isPassword("MyPassword123!", {
    minLength: 10,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true,
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
        details: true,
    });
}

const result = validateRegistrationPassword("MyP@ssw0rd2024");
if (!result.valid) {
    console.log("Password requirements not met:");
    result.errors.forEach((error) => console.log("- " + error));
}
```

### Password Reset

```javascript
function validateNewPassword(newPassword, oldPassword) {
    const result = isPassword(newPassword, {
        minLength: 12,
        forbidCommonPasswords: true,
        details: true,
    });

    if (!result.valid) {
        return result;
    }

    // Additional check: new password different from old
    if (newPassword === oldPassword) {
        return {
            valid: false,
            errors: ["New password must be different from old password"],
            password: newPassword,
        };
    }

    return { valid: true, errors: null };
}
```

### Using `getPasswordStrength`

The built-in `getPasswordStrength` function provides a comprehensive strength evaluation:

```javascript
const { getPasswordStrength } = require("validauth");

// Simple strength check
console.log(getPasswordStrength("12345")); // 'weak'
console.log(getPasswordStrength("password")); // 'weak' (common password)
console.log(getPasswordStrength("MyPass123")); // 'medium'
console.log(getPasswordStrength("MyP@ssw0rd123")); // 'strong'

// Get detailed strength information
const details = getPasswordStrength("MyP@ssw0rd123!@#", { details: true });
console.log(details);
// Output:
// {
//   strength: 'strong',
//   score: 90,
//   estimatedCrackTimeInYears: 31709791,
//   crackTimeDisplay: '31709791 years'
// }

// Weak password details
const weakDetails = getPasswordStrength("password", { details: true });
console.log(weakDetails);
// Output:
// {
//   strength: 'weak',
//   score: 0,
//   estimatedCrackTimeInYears: 0,
//   crackTimeDisplay: '10 seconds'
// }

// Medium strength password
const mediumDetails = getPasswordStrength("MyPassword123", { details: true });
console.log(mediumDetails);
// Output:
// {
//   strength: 'medium',
//   score: 50,
//   estimatedCrackTimeInYears: 31,
//   crackTimeDisplay: '31 years'
// }
```

### Password Strength Indicator (Custom Implementation)

You can also create a custom strength indicator using `isPassword`:

```javascript
function getPasswordStrengthLevel(password) {
    // Try increasingly strict requirements
    const checks = [
        {
            level: "Very Weak",
            opts: {
                minLength: 1,
                requireUppercase: false,
                requireLowercase: false,
                requireNumbers: false,
                requireSymbols: false,
                forbidCommonPasswords: false,
            },
        },
        {
            level: "Weak",
            opts: {
                minLength: 6,
                requireUppercase: false,
                requireNumbers: false,
                requireSymbols: false,
                forbidCommonPasswords: true,
            },
        },
        {
            level: "Fair",
            opts: {
                minLength: 8,
                requireUppercase: true,
                requireNumbers: true,
                requireSymbols: false,
                forbidCommonPasswords: true,
            },
        },
        {
            level: "Good",
            opts: {
                minLength: 10,
                requireUppercase: true,
                requireNumbers: true,
                requireSymbols: true,
                forbidCommonPasswords: true,
            },
        },
        {
            level: "Strong",
            opts: {
                minLength: 12,
                requireUppercase: true,
                requireNumbers: true,
                requireSymbols: true,
                forbidCommonPasswords: true,
            },
        },
    ];

    for (let i = checks.length - 1; i >= 0; i--) {
        if (isPassword(password, checks[i].opts)) {
            return checks[i].level;
        }
    }

    return "Very Weak";
}

console.log(getPasswordStrengthLevel("12345")); // Very Weak
console.log(getPasswordStrengthLevel("password")); // Very Weak (common)
console.log(getPasswordStrengthLevel("MyPass1")); // Weak
console.log(getPasswordStrengthLevel("MyPass123")); // Fair
console.log(getPasswordStrengthLevel("MyP@ss123")); // Good
console.log(getPasswordStrengthLevel("MyP@ssw0rd123")); // Strong
```

### API Integration with Strength Indicator

```javascript
// Express.js middleware with strength check
function validatePasswordMiddleware(req, res, next) {
    const { password } = req.body;

    const result = isPassword(password, {
        minLength: 10,
        forbidCommonPasswords: true,
        details: true,
    });

    if (!result.valid) {
        return res.status(400).json({
            error: "Invalid password",
            details: result.errors,
        });
    }

    // Check password strength
    const strength = getPasswordStrength(password, { details: true });

    // Optionally warn about weak passwords
    if (strength.strength === "weak") {
        return res.status(400).json({
            error: "Password is too weak",
            strength: strength,
        });
    }

    next();
}

app.post("/register", validatePasswordMiddleware, (req, res) => {
    // Password is valid and strong, proceed with registration
});

// Return strength information in response
app.post("/register", validatePasswordMiddleware, (req, res) => {
    const { password } = req.body;
    const strength = getPasswordStrength(password, { details: true });

    // Store user with password hash...

    res.json({
        message: "Registration successful",
        passwordStrength: strength,
    });
});
```

## Error Messages

### `isPassword` Error Messages

When using `isPassword` with `details: true`, you may receive the following error messages:

-   `'Password must be a non-empty string'`
-   `'Password must be at least X characters long'`
-   `'Password must be at most X characters long'`
-   `'Password must contain at least one uppercase letter'`
-   `'Password must contain at least one lowercase letter'`
-   `'Password must contain at least one number'`
-   `'Password must contain at least one symbol'`
-   `'Password cannot be a common password'`

### `getPasswordStrength` Error Messages

When using `getPasswordStrength` with `details: true` and an invalid password, you may receive:

-   `'Password must be a non-empty string'` (in the `errors` array)

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

-   Simple sequences (`123456`, `abcdef`)
-   Common words (`password`, `welcome`)
-   Keyboard patterns (`qwerty`, `asdfgh`)
-   Popular names and dates
-   Previously breached passwords

This database is regularly updated to include newly discovered common passwords.

## Performance

-   **Fast validation**: < 1ms for most passwords
-   **Common password check**: O(1) lookup using hash set
-   **Memory efficient**: Common password list optimized for size
-   **No external dependencies**: Pure JavaScript implementation

## License

MIT © [Adiksuu]
