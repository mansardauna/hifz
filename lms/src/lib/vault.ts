import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT = 'ankabit-db-vault-salt-v1';

/**
 * Derives a consistent 256-bit encryption key from environment secret or platform seed
 */
export function getVaultKey(): Buffer {
  const secret =
    process.env.DB_ENCRYPTION_KEY ||
    process.env.SETUP_TOKEN ||
    process.env.SETUP_SECRET ||
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'ankabit-lms-secure-vault-key-seed-2026';
  return crypto.scryptSync(secret, SALT, 32);
}

/**
 * Encrypt a secret string using authenticated AES-256-GCM.
 * Format: enc:<ivHex>:<tagHex>:<cipherHex>
 */
export function encryptSecret(plainText?: string): string {
  if (!plainText) return '';
  if (plainText.startsWith('enc:')) return plainText;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getVaultKey(), iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `enc:${iv.toString('hex')}:${tag}:${encrypted}`;
  } catch (err) {
    console.error('[Vault] Encryption error:', err);
    return plainText;
  }
}

/**
 * Decrypt an AES-256-GCM formatted secret string.
 * If not encrypted (legacy or plain string), returns the string as-is.
 */
export function decryptSecret(cipherText?: string): string {
  if (!cipherText) return '';
  if (!cipherText.startsWith('enc:')) return cipherText;
  const parts = cipherText.split(':');
  if (parts.length !== 4) return cipherText;
  const [, ivHex, tagHex, encryptedHex] = parts;
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getVaultKey(), iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[Vault] Decryption failed (invalid auth tag or key):', err);
    return '';
  }
}
