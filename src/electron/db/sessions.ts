import db from './database.js';
import type { User } from '../../../types.d.ts';

/**
 * Improved session management with better expiration handling
 */
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const sessionService = {
  /**
   * Create a new session for a user
   */
  create(user: User): number {
    if (!user || typeof user.id !== 'number' || !user.name || !user.password) {
      throw new Error('Invalid user object for session creation');
    }
    
    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
    
    try {
      const stmt = db.prepare(
        'INSERT INTO sessions (user_id, user_name, user_password, expires_at) VALUES (?, ?, ?, ?)'
      );
      const result = stmt.run(user.id, user.name, user.password, expiresAt);
      
      if (!result.lastInsertRowid) {
        throw new Error('Failed to create session');
      }
      
      return result.lastInsertRowid as number;
    } catch (error) {
      console.error('Create session error:', error);
      throw new Error('Failed to create session');
    }
  },

  /**
   * Get session and return user if valid
   */
  get(sessionId: number): User | null {
    if (!sessionId || typeof sessionId !== 'number' || sessionId <= 0) {
      return null;
    }
    
    try {
      const now = Math.floor(Date.now() / 1000);
      const stmt = db.prepare(`
        SELECT user_id as id, user_name as name, user_password as password
        FROM sessions
        WHERE id = ? AND expires_at > ?
      `);
      
      const user = stmt.get(sessionId, now) as User | undefined;
      
      if (!user || typeof user.id !== 'number' || !user.name) {
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  /**
   * Delete a session
   */
  delete(sessionId: number): void {
    if (!sessionId || typeof sessionId !== 'number' || sessionId <= 0) {
      return;
    }
    
    try {
      const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
      stmt.run(sessionId);
    } catch (error) {
      console.error('Delete session error:', error);
    }
  },

  /**
   * Delete all sessions for a user
   */
  deleteAllForUser(userId: number): void {
    if (!userId || typeof userId !== 'number' || userId <= 0) {
      return;
    }
    
    try {
      const stmt = db.prepare('DELETE FROM sessions WHERE user_id = ?');
      stmt.run(userId);
    } catch (error) {
      console.error('Delete all sessions error:', error);
    }
  },

  /**
   * Clean up expired sessions
   */
  cleanupExpired(): void {
    try {
      const now = Math.floor(Date.now() / 1000);
      const stmt = db.prepare('DELETE FROM sessions WHERE expires_at <= ?');
      const result = stmt.run(now);
      
      if (result.changes > 0) {
        console.log(`Cleaned up ${result.changes} expired sessions`);
      }
    } catch (error) {
      console.error('Cleanup expired sessions error:', error);
    }
  },

  /**
   * Extend session expiration
   */
  extend(sessionId: number): void {
    if (!sessionId || typeof sessionId !== 'number' || sessionId <= 0) {
      return;
    }
    
    try {
      const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
      const stmt = db.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?');
      stmt.run(expiresAt, sessionId);
    } catch (error) {
      console.error('Extend session error:', error);
    }
  },
};
