// Uses Node's built-in SQLite (Node 22.13+), so there is nothing to npm install.
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'skillexchange.db'));
db.exec('PRAGMA foreign_keys = ON;');

// Salted password hashing (built into Node)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'));
}

module.exports = { db, hashPassword, verifyPassword };
