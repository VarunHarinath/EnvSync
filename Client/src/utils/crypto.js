/**
 * Generates a secure random string for API keys
 */
export function generateSecureKey(length = 32) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values).map((x) => charset[x % charset.length]).join('');
}

/**
 * Hashes a string using SHA-256 for secure storage
 */
export async function hashKey(key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
