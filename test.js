import { isPassword } from "./src/validators/password.js";

console.log(isPassword("Password123!")); // true
console.log(isPassword("Password123!")); // false
console.log(isPassword("Password123!")); // false

console.log(isPassword("Qwerty123!", { details: true }));