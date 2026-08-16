// Generate PBKDF2 password hash for admin user
// This uses Web Crypto API compatible with our auth system

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashArray = new Uint8Array(hashBuffer);
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');

  return `pbkdf2:100000:${saltHex}:${hashHex}`;
}

// Generate hash for default password
const password = 'Somaya2024!';
const hash = await hashPassword(password);

console.log('Admin credentials for SO\'MAYA:\n');
console.log('Email: admin@somaya.ci');
console.log('Password: Somaya2024!');
console.log('\nPassword hash (for database):');
console.log(hash);
console.log('\n---\nSQL INSERT statement:\n');
console.log(`INSERT INTO admin_users (email, password_hash, name, is_active)
VALUES ('admin@somaya.ci', '${hash}', 'Admin SO''MAYA', true);`);
