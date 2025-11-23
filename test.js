import { isEmail } from './index.js';

console.log('Test 1:', isEmail('user@example.com')); // true
console.log('Test 2:', isEmail('invalid@')); // false
console.log('Test 3:', isEmail('user+tag@example.com')); // true
console.log('Test 4:', isEmail('user@example')); // false (brak TLD)

console.log('\nTest with details:');
console.log(isEmail('invalid@', { details: true }));