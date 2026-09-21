import crypto from "node:crypto";

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error(
    "Usage: node scripts/create-admin.mjs <username> <password>"
  );

  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");

const hash = crypto
  .pbkdf2Sync(
    password,
    salt,
    100000,
    32,
    "sha256"
  )
  .toString("hex");

console.log("\n=== ADMIN DATA ===\n");

console.log("Username:");
console.log(username);

console.log("\nPassword Hash:");
console.log(hash);

console.log("\nPassword Salt:");
console.log(salt);

console.log("\n==================\n");