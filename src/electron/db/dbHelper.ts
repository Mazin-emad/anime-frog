import { RunResult } from "better-sqlite3";
import db from "./db.js";
import type { User, Favorite, List, ListItem } from "../../../types.d.ts";
import { updateListImages } from "./listImageHelper.js";

export const auth = {
  signup: (name: string, password: string) => {
    try {
      const stmt = db.prepare(
        "INSERT INTO users (name, password) VALUES (?, ?)"
      );
      return stmt.run(name, password);
    } catch (err) {
      // Re-throw with more context
      const error = err as { code?: string; message?: string };
      if (
        error?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
        error?.message?.includes("UNIQUE")
      ) {
        throw new Error("Username already exists");
      }
      throw err;
    }
  },

  login: (name: string, password: string): User | null => {
    try {
      const stmt = db.prepare(
        "SELECT * FROM users WHERE name = ? AND password = ?"
      );
      const result = stmt.get(name, password) as User | null;
      return result;
    } catch (err) {
      console.error("Login database error:", err);
      return null;
    }
  },

  getById: (id: number): User | null => {
    return db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(id) as User | null;
  },
  getAll: () => {
    return db.prepare("SELECT * FROM users").all() as User[] | null;
  },

  delete: (id: number) => {
    return db.prepare("DELETE FROM users WHERE id = ?").run(id);
  },

  update: (id: number, name: string, password: string) => {
    return db
      .prepare("UPDATE users SET name = ?, password = ? WHERE id = ?")
      .run(id, name, password);
  },

  isUserExists: (name: string): boolean => {
    const stmt = db.prepare("SELECT id FROM users WHERE name = ?");
    return !!stmt.get(name);
  },
};

export const sessions = {
  /**
   * Create a new session for a user
   */
  create: (user: User): number => {
    if (!user || typeof user.id !== "number" || !user.name || !user.password) {
      throw new Error("Invalid user object for session creation");
    }

    const expiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now
    const stmt = db.prepare(
      "INSERT INTO sessions (user_id, user_name, user_password, expires_at) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(user.id, user.name, user.password, expiresAt);

    if (!result.lastInsertRowid) {
      throw new Error("Failed to create session");
    }

    return result.lastInsertRowid as number;
  },

  /**
   * Get session by ID and return user if valid
   */
  get: (sessionId: number): User | null => {
    const now = Math.floor(Date.now() / 1000);
    const stmt = db.prepare(`
      SELECT user_id as id, user_name as name, user_password as password
      FROM sessions
      WHERE id = ? AND expires_at > ?
    `);
    const user = stmt.get(sessionId, now) as User | null;
    return user;
  },

  /**
   * Delete a session
   */
  delete: (sessionId: number): void => {
    const stmt = db.prepare("DELETE FROM sessions WHERE id = ?");
    stmt.run(sessionId);
  },

  /**
   * Delete all sessions for a user
   */
  deleteAllForUser: (userId: number): void => {
    const stmt = db.prepare("DELETE FROM sessions WHERE user_id = ?");
    stmt.run(userId);
  },

  /**
   * Clean up expired sessions
   */
  cleanupExpired: (): void => {
    const now = Math.floor(Date.now() / 1000);
    const stmt = db.prepare("DELETE FROM sessions WHERE expires_at <= ?");
    stmt.run(now);
  },
};

export const favorites = {
  add: (userId: number, animeId: number) => {
    db.prepare(
      "INSERT OR IGNORE INTO favorites (user_id, anime_id) VALUES (?, ?)"
    ).run(userId, animeId);
  },
  remove: (userId: number, animeId: number) => {
    db.prepare("DELETE FROM favorites WHERE user_id = ? AND anime_id = ?").run(
      userId,
      animeId
    );
  },
  getAll: (userId: number) => {
    return (
      db
        .prepare("SELECT anime_id FROM favorites WHERE user_id = ?")
        .all(userId) as Favorite[]
    ).map((r) => r.anime_id);
  },
  isFavorite: (userId: number, animeId: number) => {
    const row = db
      .prepare("SELECT 1 FROM favorites WHERE user_id = ? AND anime_id = ?")
      .get(userId, animeId);
    return !!row;
  },
};

export const lists = {
  create: (userId: number, name: string, description = ""): List | null => {
    const result: RunResult = db
      .prepare(
        "INSERT INTO custom_lists (user_id, name, description) VALUES (?, ?, ?)"
      )
      .run(userId, name, description);

    if (result.changes === 0) {
      throw new Error("Failed to create list");
    }

    const list = db
      .prepare("SELECT * FROM custom_lists WHERE id = ?")
      .get(result.lastInsertRowid) as List;

    return list;
  },
  getAll: (userId: number) => {
    return db
      .prepare(
        "SELECT * FROM custom_lists WHERE user_id = ? ORDER BY created_at DESC"
      )
      .all(userId);
  },
  addAnime: async (listId: number, animeId: number) => {
    db.prepare(
      "INSERT OR IGNORE INTO list_items (list_id, anime_id) VALUES (?, ?)"
    ).run(listId, animeId);
    // Update list images from the latest anime
    await updateListImages(listId);
  },
  removeAnime: async (listId: number, animeId: number) => {
    db.prepare("DELETE FROM list_items WHERE list_id = ? AND anime_id = ?").run(
      listId,
      animeId
    );
    // Update list images after removal
    await updateListImages(listId);
  },
  getAnimes: (listId: number) => {
    return (
      db
        .prepare("SELECT anime_id FROM list_items WHERE list_id = ?")
        .all(listId) as ListItem[]
    ).map((r) => r.anime_id);
  },
  get: (listId: number) => {
    const list = db
      .prepare("SELECT * FROM custom_lists WHERE id = ?")
      .get(listId);
    return list as List | null;
  },
  delete: (listId: number) => {
    return db.prepare("DELETE FROM custom_lists WHERE id = ?").run(listId);
  },
  update: (listId: number, name: string, description: string) => {
    return db
      .prepare("UPDATE custom_lists SET name = ?, description = ? WHERE id = ?")
      .run(listId, name, description);
  },
};
