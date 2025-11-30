// src/electron/database.ts
import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

const dbPath = path.join(app.getPath("userData"), "anime-app.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT NOT NULL,
    user_password TEXT NOT NULL,
    expires_at INTEGER DEFAULT (strftime('%s','now') + 7 * 24 * 60 * 60),
    created_at INTEGER DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER,
    anime_id INTEGER,
    PRIMARY KEY (user_id, anime_id)
  );

  CREATE TABLE IF NOT EXISTS custom_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    cover_image TEXT,
    banner_image TEXT
  );

  CREATE TABLE IF NOT EXISTS list_items (
    list_id INTEGER,
    anime_id INTEGER,
    PRIMARY KEY (list_id, anime_id)
  );
`);

db.exec(`
    ALTER TABLE custom_lists ADD COLUMN cover_image TEXT;
  `);

db.exec(`
    ALTER TABLE custom_lists ADD COLUMN banner_image TEXT;
  `);

export default db;
