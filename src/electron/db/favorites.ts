import db from './database.js';

/**
 * Favorites service with improved error handling
 */
export const favoritesService = {
  add(userId: number, animeId: number): void {
    if (!userId || !animeId) {
      throw new Error('Invalid user ID or anime ID');
    }
    
    try {
      const stmt = db.prepare(
        'INSERT OR IGNORE INTO favorites (user_id, anime_id) VALUES (?, ?)'
      );
      stmt.run(userId, animeId);
    } catch (error) {
      console.error('Add favorite error:', error);
      throw new Error('Failed to add favorite');
    }
  },

  remove(userId: number, animeId: number): void {
    if (!userId || !animeId) {
      throw new Error('Invalid user ID or anime ID');
    }
    
    try {
      const stmt = db.prepare('DELETE FROM favorites WHERE user_id = ? AND anime_id = ?');
      stmt.run(userId, animeId);
    } catch (error) {
      console.error('Remove favorite error:', error);
      throw new Error('Failed to remove favorite');
    }
  },

  toggle(userId: number, animeId: number): boolean {
    if (favoritesService.isFavorite(userId, animeId)) {
      favoritesService.remove(userId, animeId);
      return false;
    } else {
      favoritesService.add(userId, animeId);
      return true;
    }
  },

  getAll(userId: number): number[] {
    if (!userId) {
      return [];
    }
    
    try {
      const stmt = db.prepare('SELECT anime_id FROM favorites WHERE user_id = ?');
      const results = stmt.all(userId) as Array<{ anime_id: number }>;
      return results.map((r) => r.anime_id);
    } catch (error) {
      console.error('Get favorites error:', error);
      return [];
    }
  },

  isFavorite(userId: number, animeId: number): boolean {
    if (!userId || !animeId) {
      return false;
    }
    
    try {
      const stmt = db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND anime_id = ?');
      return !!stmt.get(userId, animeId);
    } catch (error) {
      console.error('Check favorite error:', error);
      return false;
    }
  },
};
