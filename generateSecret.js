import { randomBytes } from 'crypto';

// Generate a strong random string of 64 bytes and convert it to a hexadecimal string
const secretKey = randomBytes(64).toString('hex');

console.log(`Generated secret key: ${secretKey}`);
