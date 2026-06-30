// backend/db/index.js
//
// SQLite database layer using sql.js (a WASM build of SQLite).
// We use sql.js instead of native bindings (e.g. better-sqlite3) so the
// project installs and runs identically across any platform/host without
// needing a C++ build toolchain — this matters for free-tier deploy
// platforms like Render where native module builds can be flaky.
//
// sql.js keeps the whole DB in memory; we manually persist it to disk
// after every write so data survives server restarts.

const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, 'smartlab.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let SQL = null;
let db = null;
let ready = null;

function persist() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function init() {
  SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('Using existing database at', DB_PATH);
  } else {
    db = new SQL.Database();
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.run(schema);
    persist();
    console.log('Database initialized with schema + seed data at', DB_PATH);
  }
  return db;
}

ready = init();

// ---- Minimal query helpers mimicking a "prepare/run/get/all" feel ----

async function waitReady() {
  await ready;
}

function rowsFromStatement(stmt) {
  const out = [];
  while (stmt.step()) {
    out.push(stmt.getAsObject());
  }
  stmt.free();
  return out;
}

const api = {
  async all(sql, params = []) {
    await waitReady();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    return rowsFromStatement(stmt);
  },

  async get(sql, params = []) {
    await waitReady();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const row = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return row;
  },

  // For INSERT/UPDATE/DELETE. Returns { lastInsertRowid }
  async run(sql, params = []) {
    await waitReady();
    db.run(sql, params);
    let lastInsertRowid = null;
    if (/^\s*insert/i.test(sql)) {
      const stmt = db.prepare('SELECT last_insert_rowid() AS id');
      if (stmt.step()) {
        lastInsertRowid = stmt.getAsObject().id;
      }
      stmt.free();
    }
    persist();
    return { lastInsertRowid };
  },

  // Run multiple inserts inside a manual transaction for speed/atomicity.
  async transaction(fn) {
    await waitReady();
    db.run('BEGIN TRANSACTION');
    try {
      await fn();
      db.run('COMMIT');
      persist();
    } catch (err) {
      db.run('ROLLBACK');
      throw err;
    }
  },
};

module.exports = api;
