import db from './database.js';
import type { List } from '../../../types.d.ts';
import { updateListImages } from './listImages.js';

/**
 * Lists service with improved error handling
 */
export const listsService = {
  create(userId: number, name: string, description = ''): List {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length === 0) {
      throw new Error('List name is required');
    }
    
    try {
      const stmt = db.prepare(
        'INSERT INTO custom_lists (user_id, name, description) VALUES (?, ?, ?)'
      );
      const result = stmt.run(userId, trimmedName, description);
      
      if (!result.lastInsertRowid) {
        throw new Error('Failed to create list');
      }
      
      const list = listsService.get(result.lastInsertRowid as number);
      if (!list) {
        throw new Error('Failed to retrieve created list');
      }
      
      return list;
    } catch (error) {
      console.error('Create list error:', error);
      throw new Error('Failed to create list');
    }
  },

  getAll(userId: number): List[] {
    if (!userId) {
      return [];
    }
    
    try {
      const stmt = db.prepare(
        'SELECT * FROM custom_lists WHERE user_id = ? ORDER BY created_at DESC'
      );
      return (stmt.all(userId) as List[]) || [];
    } catch (error) {
      console.error('Get lists error:', error);
      return [];
    }
  },

  get(listId: number): List | null {
    if (!listId) {
      return null;
    }
    
    try {
      const stmt = db.prepare('SELECT * FROM custom_lists WHERE id = ?');
      return (stmt.get(listId) as List) || null;
    } catch (error) {
      console.error('Get list error:', error);
      return null;
    }
  },

  update(listId: number, name: string, description: string): void {
    if (!listId) {
      throw new Error('List ID is required');
    }
    
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length === 0) {
      throw new Error('List name is required');
    }
    
    try {
      const stmt = db.prepare('UPDATE custom_lists SET name = ?, description = ? WHERE id = ?');
      const result = stmt.run(trimmedName, description, listId);
      
      if (result.changes === 0) {
        throw new Error('List not found');
      }
    } catch (error) {
      console.error('Update list error:', error);
      throw new Error('Failed to update list');
    }
  },

  delete(listId: number): void {
    if (!listId) {
      throw new Error('List ID is required');
    }
    
    try {
      const stmt = db.prepare('DELETE FROM custom_lists WHERE id = ?');
      const result = stmt.run(listId);
      
      if (result.changes === 0) {
        throw new Error('List not found');
      }
    } catch (error) {
      console.error('Delete list error:', error);
      throw new Error('Failed to delete list');
    }
  },

  async addAnime(listId: number, animeId: number): Promise<void> {
    if (!listId || !animeId) {
      throw new Error('List ID and anime ID are required');
    }
    
    try {
      const stmt = db.prepare('INSERT OR IGNORE INTO list_items (list_id, anime_id) VALUES (?, ?)');
      stmt.run(listId, animeId);
      
      // Update list images asynchronously
      await updateListImages(listId);
    } catch (error) {
      console.error('Add anime to list error:', error);
      throw new Error('Failed to add anime to list');
    }
  },

  async removeAnime(listId: number, animeId: number): Promise<void> {
    if (!listId || !animeId) {
      throw new Error('List ID and anime ID are required');
    }
    
    try {
      const stmt = db.prepare('DELETE FROM list_items WHERE list_id = ? AND anime_id = ?');
      stmt.run(listId, animeId);
      
      // Update list images asynchronously
      await updateListImages(listId);
    } catch (error) {
      console.error('Remove anime from list error:', error);
      throw new Error('Failed to remove anime from list');
    }
  },

  getAnimes(listId: number): number[] {
    if (!listId) {
      return [];
    }
    
    try {
      const stmt = db.prepare('SELECT anime_id FROM list_items WHERE list_id = ?');
      const results = stmt.all(listId) as Array<{ anime_id: number }>;
      return results.map((r) => r.anime_id);
    } catch (error) {
      console.error('Get list animes error:', error);
      return [];
    }
  },
};
