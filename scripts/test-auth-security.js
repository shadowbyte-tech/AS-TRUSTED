/**
 * Auth Security Test Script
 * Verifies that bcrypt hashing and rate-limiting work correctly.
 *
 * Run: node scripts/test-auth-security.js
 */

const bcrypt = require('bcryptjs');
// Load .env.local if present (for JWT_SECRET check)
try { require('dotenv').config({ path: '.env.local' }); } catch {}

const SALT_ROUNDS = 12;

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  console.log('\n🔐 ── BCRYPT HASH TESTS ──────────────────────────────────\n');

  // Test 1: bcrypt creates a hash that starts with $2b$
  const testPassword = 'TestPassword@123';
  const hash = await bcrypt.hash(testPassword, SALT_ROUNDS);
  // bcryptjs uses $2a$ prefix (valid bcrypt variant, equivalent to $2b$)
  assert(/^\$2[aby]\$/.test(hash), 'bcrypt hash uses valid $2a/$2b/$2y prefix');
  assert(hash.length === 60, 'bcrypt hash is exactly 60 characters');

  // Test 2: Correct password verifies successfully
  const correctMatch = await bcrypt.compare(testPassword, hash);
  assert(correctMatch === true, 'Correct password verifies against bcrypt hash');

  // Test 3: Wrong password fails
  const wrongMatch = await bcrypt.compare('WrongPassword!', hash);
  assert(wrongMatch === false, 'Wrong password rejected by bcrypt');

  // Test 4: Plain-text detection (migration guard)
  function isBcryptHash(value) {
    return /^\$2[aby]\$/.test(value);
  }
  assert(isBcryptHash(hash) === true, 'isBcryptHash correctly identifies bcrypt hash');
  assert(isBcryptHash('MyPlainPassword') === false, 'isBcryptHash correctly rejects plain-text');
  assert(isBcryptHash('123456') === false, 'isBcryptHash rejects short plain text');

  // Test 5: Salt rounds are enforced
  const saltPart = hash.split('$')[2];
  assert(parseInt(saltPart) === SALT_ROUNDS, `bcrypt uses exactly ${SALT_ROUNDS} salt rounds`);

  console.log('\n🚦 ── RATE LIMITER TESTS ─────────────────────────────────\n');

  // Simple rate limiter simulation (mirrors auth limit: 5 attempts/15min)
  const store = new Map();
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 900000; // 15 min

  function checkLimit(ip) {
    const now = Date.now();
    let rec = store.get(ip);
    if (!rec || now > rec.resetAt) {
      store.set(ip, { count: 1, resetAt: now + WINDOW_MS, blocked: false });
      return true;
    }
    rec.count++;
    if (rec.count > MAX_ATTEMPTS) {
      rec.blocked = true;
      return false;
    }
    return true;
  }

  const testIP = '192.168.1.100';
  let allowedCount = 0;
  let blockedCount = 0;

  for (let i = 0; i < 8; i++) {
    const allowed = checkLimit(testIP);
    if (allowed) allowedCount++;
    else blockedCount++;
  }

  assert(allowedCount === MAX_ATTEMPTS, `Rate limiter allows exactly ${MAX_ATTEMPTS} attempts`);
  assert(blockedCount === 3, 'Rate limiter blocks excess attempts beyond limit');

  const differentIP = '10.0.0.1';
  assert(checkLimit(differentIP) === true, 'Rate limiter allows different IP independently');

  console.log('\n🔑 ── JWT SECRET STRENGTH CHECK ──────────────────────────\n');

  const jwtSecret = process.env.JWT_SECRET || '';
  const isDefaultSecret = jwtSecret === 'your-secret-key-change-in-production';
  const isStrongSecret = jwtSecret.length >= 32;

  if (isDefaultSecret) {
    console.warn('  ⚠️  WARNING: JWT_SECRET is set to the default insecure value!');
    failed++;
  } else if (!isStrongSecret) {
    console.warn(`  ⚠️  WARNING: JWT_SECRET is too short (${jwtSecret.length} chars). Minimum: 32.`);
    failed++;
  } else {
    console.log(`  ✅ PASS: JWT_SECRET is set and strong (${jwtSecret.length} chars)`);
    passed++;
  }

  console.log('\n───────────────────────────────────────────────────────');
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.error('\n❌ Some tests failed. Please review the output above.');
    process.exit(1);
  } else {
    console.log('\n✅ All auth security tests passed!');
  }
}

runTests().catch(err => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
