/**
 * URL shortcode generation utilities
 */

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const CODE_LENGTH = 6;

/**
 * Generate a random alphanumeric short code
 * @param length Length of the code (default: 6)
 * @returns Random alphanumeric string
 */
export function generateShortCode(length: number = CODE_LENGTH): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHABET.length);
    code += ALPHABET[randomIndex];
  }
  return code;
}

/**
 * Generate a unique short code by checking against existing codes
 * @param existingCodes Set of existing codes to check against
 * @param maxAttempts Maximum number of generation attempts
 * @returns Unique short code
 * @throws Error if unable to generate unique code after maxAttempts
 */
export function generateUniqueShortCode(
  existingCodes: Set<string>,
  maxAttempts: number = 10
): string {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateShortCode();
    if (!existingCodes.has(code)) {
      return code;
    }
  }
  throw new Error('Unable to generate unique short code after multiple attempts');
}

/**
 * Validate short code format (alphanumeric, correct length)
 * @param code Short code to validate
 * @returns True if valid
 */
export function validateShortCode(code: string): boolean {
  if (!code || code.length !== CODE_LENGTH) {
    return false;
  }
  return /^[0-9A-Za-z]+$/.test(code);
}

