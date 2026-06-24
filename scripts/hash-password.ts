/**
 * Generate SHA-256 hash for a password input.
 * Run: npx tsx scripts/hash-password.ts "PASSWORD"
 */

import crypto from "crypto"

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex")
}

const raw = process.argv[2]
if (!raw) {
  console.error('Usage: npx tsx scripts/hash-password.ts "PASSWORD"')
  process.exit(1)
}

const password = raw.trim()
if (!password) {
  console.error("Password cannot be empty")
  process.exit(1)
}

const hash = sha256(password)
console.log(hash)
