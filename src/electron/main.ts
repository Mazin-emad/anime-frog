import { app, BrowserWindow, ipcMain } from 'electron';
import { getPreloadPath, getUIPath, getIconPath } from './utils/paths.js';
import path from 'path';
import { isDev, getPort } from './utils/env.js';
import { sessionService } from './db/sessions.js';
import { authService } from './db/auth.js';
import { favoritesService } from './db/favorites.js';
import { listsService } from './db/lists.js';
import type { List } from '../../types.d.ts';

// Initialize database (this will create tables if needed)
import './db/database.js';

// Clean up expired sessions on startup
sessionService.cleanupExpired();

// Clean up expired sessions periodically (every hour)
setInterval(() => {
  sessionService.cleanupExpired();
}, 60 * 60 * 1000);

/**
 * Create the main application window
 */
function createWindow(): void {
  const preloadPath = getPreloadPath();
  console.log('Preload script path:', preloadPath);
  
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Anime App',
    frame: true,
    autoHideMenuBar: true,
    icon: getIconPath(),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Log when preload script fails to load
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
  });

  // Log preload script errors
  mainWindow.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('Preload script error:', preloadPath, error);
  });

  mainWindow.setMenu(null);

  if (process.platform === 'win32') {
    mainWindow.setMenuBarVisibility(false);
  }

  // Load the UI
  if (isDev()) {
    const port = getPort();
    mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const uiPath = getUIPath();
    if (typeof uiPath === 'string' && uiPath.startsWith('http')) {
      mainWindow.loadURL(uiPath);
    } else {
      mainWindow.loadFile(uiPath);
    }
  }
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ──────────────────────────────────────
// IPC Handlers - Auth
// ──────────────────────────────────────

ipcMain.handle('auth:signup', async (_event, name: string, password: string) => {
  try {
    const user = authService.signup(name, password);
    const sessionId = sessionService.create(user);
    return { user, sessionId };
  } catch (error) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create account';
    throw new Error(message);
  }
});

ipcMain.handle('auth:login', async (_event, name: string, password: string) => {
  try {
    const user = authService.login(name, password);
    
    if (!user) {
      return null; // Return null for invalid credentials (not an error)
    }
    
    const sessionId = sessionService.create(user);
    return { user, sessionId };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Failed to login');
  }
});

ipcMain.handle('auth:validate-session', async (_event, sessionId: number) => {
  try {
    if (!sessionId || typeof sessionId !== 'number') {
      return { user: null, valid: false };
    }
    
    const user = sessionService.get(sessionId);
    
    if (user && typeof user.id === 'number' && user.name) {
      // Extend session on validation
      sessionService.extend(sessionId);
      return { user, valid: true };
    }
    
    return { user: null, valid: false };
  } catch (error) {
    console.error('Session validation error:', error);
    return { user: null, valid: false };
  }
});

ipcMain.handle('auth:logout', async (_event, sessionId: number) => {
  try {
    if (sessionId && typeof sessionId === 'number') {
      sessionService.delete(sessionId);
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Don't throw - logout should always succeed from user's perspective
  }
});

ipcMain.handle('auth:delete-user', async (_event, userId: number) => {
  try {
    authService.delete(userId);
    sessionService.deleteAllForUser(userId);
  } catch (error) {
    console.error('Delete user error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    throw new Error(message);
  }
});

ipcMain.handle('auth:update-user', async (_event, userId: number, name: string, password: string) => {
  try {
    return authService.update(userId, name, password);
  } catch (error) {
    console.error('Update user error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update user';
    throw new Error(message);
  }
});

ipcMain.handle('auth:get-user', async (_event, userId: number) => {
  try {
    return authService.getById(userId);
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
});

ipcMain.handle('auth:get-all-users', async () => {
  try {
    return authService.getAll();
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
});

ipcMain.handle('auth:is-user-exists', async (_event, name: string) => {
  try {
    return authService.isUserExists(name);
  } catch (error) {
    console.error('Check user exists error:', error);
    return false;
  }
});

// ──────────────────────────────────────
// IPC Handlers - Favorites
// ──────────────────────────────────────

ipcMain.handle('favorites:add', async (_event, userId: number, animeId: number) => {
  try {
    if (!userId) throw new Error('Not logged in');
    favoritesService.add(userId, animeId);
  } catch (error) {
    console.error('Add favorite error:', error);
    const message = error instanceof Error ? error.message : 'Failed to add favorite';
    throw new Error(message);
  }
});

ipcMain.handle('favorites:remove', async (_event, userId: number, animeId: number) => {
  try {
    if (!userId) throw new Error('Not logged in');
    favoritesService.remove(userId, animeId);
  } catch (error) {
    console.error('Remove favorite error:', error);
    const message = error instanceof Error ? error.message : 'Failed to remove favorite';
    throw new Error(message);
  }
});

ipcMain.handle('favorites:toggle', async (_event, userId: number, animeId: number) => {
  try {
    if (!userId) throw new Error('Not logged in');
    return favoritesService.toggle(userId, animeId);
  } catch (error) {
    console.error('Toggle favorite error:', error);
    const message = error instanceof Error ? error.message : 'Failed to toggle favorite';
    throw new Error(message);
  }
});

ipcMain.handle('favorites:is', async (_event, userId: number, animeId: number) => {
  try {
    if (!userId) return false;
    return favoritesService.isFavorite(userId, animeId);
  } catch (error) {
    console.error('Check favorite error:', error);
    return false;
  }
});

ipcMain.handle('favorites:get', async (_event, userId: number) => {
  try {
    if (!userId) return [];
    return favoritesService.getAll(userId);
  } catch (error) {
    console.error('Get favorites error:', error);
    return [];
  }
});

// ──────────────────────────────────────
// IPC Handlers - Lists
// ──────────────────────────────────────

ipcMain.handle('lists:create', async (_event, userId: number, name: string, description = '') => {
  try {
    if (!userId) throw new Error('Not logged in');
    const list = listsService.create(userId, name, description);
    return list.id;
  } catch (error) {
    console.error('Create list error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create list';
    throw new Error(message);
  }
});

ipcMain.handle('lists:get', async (_event, userId: number) => {
  try {
    if (!userId) return [];
    const allLists = listsService.getAll(userId) as List[];
    return allLists.map((list) => ({
      id: list.id,
      name: list.name,
      description: list.description || null,
      coverImage: list.cover_image || null,
      bannerImage: list.banner_image || null,
    }));
  } catch (error) {
    console.error('Get lists error:', error);
    return [];
  }
});

ipcMain.handle('lists:add-anime', async (_event, listId: number, animeId: number) => {
  try {
    await listsService.addAnime(listId, animeId);
  } catch (error) {
    console.error('Add anime to list error:', error);
    const message = error instanceof Error ? error.message : 'Failed to add anime to list';
    throw new Error(message);
  }
});

ipcMain.handle('lists:remove-anime', async (_event, listId: number, animeId: number) => {
  try {
    await listsService.removeAnime(listId, animeId);
  } catch (error) {
    console.error('Remove anime from list error:', error);
    const message = error instanceof Error ? error.message : 'Failed to remove anime from list';
    throw new Error(message);
  }
});

ipcMain.handle('lists:get-animes', async (_event, listId: number) => {
  try {
    return listsService.getAnimes(listId);
  } catch (error) {
    console.error('Get list animes error:', error);
    return [];
  }
});

ipcMain.handle('lists:delete', async (_event, listId: number) => {
  try {
    listsService.delete(listId);
  } catch (error) {
    console.error('Delete list error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete list';
    throw new Error(message);
  }
});

ipcMain.handle('lists:update', async (_event, listId: number, name: string, description: string) => {
  try {
    listsService.update(listId, name, description);
  } catch (error) {
    console.error('Update list error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update list';
    throw new Error(message);
  }
});

ipcMain.handle('lists:get-one', async (_event, listId: number) => {
  try {
    const list = listsService.get(listId);
    if (!list) return null;
    return {
      id: list.id,
      name: list.name,
      description: list.description || null,
      coverImage: list.cover_image || null,
      bannerImage: list.banner_image || null,
    };
  } catch (error) {
    console.error('Get list error:', error);
    return null;
  }
});
