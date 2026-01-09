import { contextBridge, ipcRenderer } from 'electron';
import type { 
  AuthResponse, 
  User, 
  List 
} from '../../../types.d.ts';

// Debug: Log that preload script is loading
console.log('[Preload] Preload script is loading...');

/**
 * Improved preload script with better type safety
 */
const electronAPI = {
  // Auth
  signup: (name: string, password: string): Promise<AuthResponse> =>
    ipcRenderer.invoke('auth:signup', name, password),

  login: (name: string, password: string): Promise<AuthResponse | null> =>
    ipcRenderer.invoke('auth:login', name, password),

  validateSession: (sessionId: number): Promise<{ user: User | null; valid: boolean }> =>
    ipcRenderer.invoke('auth:validate-session', sessionId),

  logout: (sessionId: number): Promise<void> =>
    ipcRenderer.invoke('auth:logout', sessionId),

  deleteUser: (userId: number): Promise<void> =>
    ipcRenderer.invoke('auth:delete-user', userId),

  updateUser: (userId: number, name: string, password: string): Promise<User> =>
    ipcRenderer.invoke('auth:update-user', userId, name, password),

  getUser: (userId: number): Promise<User | null> =>
    ipcRenderer.invoke('auth:get-user', userId),

  getAllUsers: (): Promise<User[]> =>
    ipcRenderer.invoke('auth:get-all-users'),

  isUserExists: (name: string): Promise<boolean> =>
    ipcRenderer.invoke('auth:is-user-exists', name),

  // Favorites
  addFavorite: (userId: number, animeId: number): Promise<void> =>
    ipcRenderer.invoke('favorites:add', userId, animeId),

  removeFavorite: (userId: number, animeId: number): Promise<void> =>
    ipcRenderer.invoke('favorites:remove', userId, animeId),

  toggleFavorite: (userId: number, animeId: number): Promise<boolean> =>
    ipcRenderer.invoke('favorites:toggle', userId, animeId),

  isFavorite: (userId: number, animeId: number): Promise<boolean> =>
    ipcRenderer.invoke('favorites:is', userId, animeId),

  getFavorites: (userId: number): Promise<number[]> =>
    ipcRenderer.invoke('favorites:get', userId),

  // Lists
  createList: (userId: number, name: string, description?: string): Promise<number> =>
    ipcRenderer.invoke('lists:create', userId, name, description),

  getLists: (userId: number): Promise<Array<{
    id: number;
    name: string;
    description: string | null;
    coverImage: string | null;
    bannerImage: string | null;
  }>> =>
    ipcRenderer.invoke('lists:get', userId),

  addToList: (listId: number, animeId: number): Promise<void> =>
    ipcRenderer.invoke('lists:add-anime', listId, animeId),

  removeFromList: (listId: number, animeId: number): Promise<void> =>
    ipcRenderer.invoke('lists:remove-anime', listId, animeId),

  getListAnimes: (listId: number): Promise<number[]> =>
    ipcRenderer.invoke('lists:get-animes', listId),

  deleteList: (listId: number): Promise<void> =>
    ipcRenderer.invoke('lists:delete', listId),

  updateList: (listId: number, name: string, description: string): Promise<void> =>
    ipcRenderer.invoke('lists:update', listId, name, description),

  getList: (listId: number): Promise<{
    id: number;
    name: string;
    description: string | null;
    coverImage: string | null;
    bannerImage: string | null;
  } | null> =>
    ipcRenderer.invoke('lists:get-one', listId),
};

// Expose API to renderer
try {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI);
  console.log('[Preload] electronAPI exposed successfully');
} catch (error) {
  console.error('[Preload] Failed to expose electronAPI:', error);
}

// Type declaration for window.electronAPI
declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}
