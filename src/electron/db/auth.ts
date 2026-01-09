import db from './database.js';
import type { User } from '../../../types.d.ts';

/**
 * Improved auth service with better error handling and validation
 */
export const authService = {
  /**
   * Create a new user account
   */
  signup(name: string, password: string): User {
    // Validate inputs
    const trimmedName = name.trim();
    
    if (!trimmedName || trimmedName.length === 0) {
      throw new Error('Username is required');
    }
    
    if (trimmedName.length < 2) {
      throw new Error('Username must be at least 2 characters');
    }
    
    if (!password || password.length < 3) {
      throw new Error('Password must be at least 3 characters');
    }
    
    // Check if user already exists
    if (authService.isUserExists(trimmedName)) {
      throw new Error('Username already exists');
    }
    
    try {
      const stmt = db.prepare('INSERT INTO users (name, password) VALUES (?, ?)');
      const result = stmt.run(trimmedName, password);
      
      if (!result.lastInsertRowid) {
        throw new Error('Failed to create user account');
      }
      
      const user = authService.getById(result.lastInsertRowid as number);
      if (!user) {
        throw new Error('Failed to retrieve created user');
      }
      
      return user;
    } catch (error) {
      const dbError = error as { code?: string; message?: string };
      
      if (dbError?.code === 'SQLITE_CONSTRAINT_UNIQUE' || 
          dbError?.message?.includes('UNIQUE')) {
        throw new Error('Username already exists');
      }
      
      console.error('Signup error:', error);
      throw new Error('Failed to create user account');
    }
  },

  /**
   * Login user with credentials
   */
  login(name: string, password: string): User | null {
    if (!name || !password) {
      return null;
    }
    
    try {
      const trimmedName = name.trim();
      const stmt = db.prepare(
        'SELECT * FROM users WHERE LOWER(name) = LOWER(?) AND password = ?'
      );
      const user = stmt.get(trimmedName, password) as User | undefined;
      
      return user || null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  /**
   * Get user by ID
   */
  getById(id: number): User | null {
    if (!id || typeof id !== 'number' || id <= 0) {
      return null;
    }
    
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      return (stmt.get(id) as User) || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  /**
   * Get all users
   */
  getAll(): User[] {
    try {
      const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
      return (stmt.all() as User[]) || [];
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  },

  /**
   * Delete user account
   */
  delete(id: number): void {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid user ID');
    }
    
    try {
      const stmt = db.prepare('DELETE FROM users WHERE id = ?');
      const result = stmt.run(id);
      
      if (result.changes === 0) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      throw new Error('Failed to delete user account');
    }
  },

  /**
   * Update user account
   */
  update(id: number, name: string, password: string): User {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const trimmedName = name.trim();
    
    if (!trimmedName || trimmedName.length < 2) {
      throw new Error('Username must be at least 2 characters');
    }
    
    if (!password || password.length < 3) {
      throw new Error('Password must be at least 3 characters');
    }
    
    // Check if new name conflicts with existing user
    const existingUser = authService.isUserExists(trimmedName);
    if (existingUser) {
      const currentUser = authService.getById(id);
      if (!currentUser || currentUser.name.toLowerCase() !== trimmedName.toLowerCase()) {
        throw new Error('Username already exists');
      }
    }
    
    try {
      const stmt = db.prepare('UPDATE users SET name = ?, password = ? WHERE id = ?');
      const result = stmt.run(trimmedName, password, id);
      
      if (result.changes === 0) {
        throw new Error('User not found');
      }
      
      const updatedUser = authService.getById(id);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user');
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error('Failed to update user account');
    }
  },

  /**
   * Check if user exists
   */
  isUserExists(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }
    
    try {
      const trimmedName = name.trim();
      const stmt = db.prepare('SELECT id FROM users WHERE LOWER(name) = LOWER(?)');
      return !!stmt.get(trimmedName);
    } catch (error) {
      console.error('Check user exists error:', error);
      return false;
    }
  },
};
