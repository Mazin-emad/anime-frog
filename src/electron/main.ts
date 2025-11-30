// src/electron/main.ts

import { app, BrowserWindow, ipcMain } from "electron";
import { getPreloadPath, getUIPath, getIconPath } from "./pathResolver.js";
import { isDev } from "./util.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || "5173";
if (!PORT) throw new Error("PORT env variable is not set");

import { auth, favorites, lists, sessions } from "./db/dbHelper.js";
import type { List } from "../../types.d.ts";

// Clean up expired sessions on startup
sessions.cleanupExpired();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "Anime Frog",

    frame: true,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",

    icon: getIconPath(),
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.setMenu(null);

  if (process.platform === "win32") {
    mainWindow.setMenuBarVisibility(false);
  }

  if (isDev()) {
    mainWindow.loadURL(`http://localhost:${PORT}`);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(getUIPath());
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Auth
ipcMain.handle(
  "auth:signup",
  async (_event, name: string, password: string) => {
    try {
      // Validate inputs
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        throw new Error("Username is required");
      }
      if (!password || typeof password !== "string" || password.length < 3) {
        throw new Error("Password must be at least 3 characters");
      }

      const trimmedName = name.trim();

      // Check if user already exists first
      if (auth.isUserExists(trimmedName)) {
        throw new Error("Username already exists");
      }

      // Create the user
      try {
        auth.signup(trimmedName, password);
      } catch (dbErr) {
        // Handle database constraint violations
        const error = dbErr as { code?: string; message?: string };
        if (
          error?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
          error?.message?.includes("UNIQUE")
        ) {
          throw new Error("Username already exists");
        }
        console.error("Database error during signup:", dbErr);
        throw new Error("Failed to create user account");
      }

      // Login to get the user object
      const user = auth.login(trimmedName, password);
      if (!user) {
        throw new Error("Failed to retrieve created user account");
      }

      // Create session
      const sessionId = sessions.create(user);
      return { user, sessionId };
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("Failed to create account");
    }
  }
);

ipcMain.handle("auth:login", async (_event, name: string, password: string) => {
  try {
    // Validate inputs
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Username is required");
    }
    if (!password || typeof password !== "string") {
      throw new Error("Password is required");
    }

    const trimmedName = name.trim();
    const user = auth.login(trimmedName, password);

    if (!user) {
      // Return null instead of throwing to allow UI to show "Invalid credentials"
      return null;
    }

    // Create session
    const sessionId = sessions.create(user);
    return { user, sessionId };
  } catch (err) {
    console.error("Login error:", err);
    // Only throw if it's a real error, not just "user not found"
    if (err instanceof Error && err.message.includes("required")) {
      throw err;
    }
    throw new Error("Failed to login");
  }
});

ipcMain.handle("auth:validate-session", async (_event, sessionId: number) => {
  try {
    if (!sessionId || typeof sessionId !== "number") {
      return { user: null, valid: false };
    }

    const user = sessions.get(sessionId);
    if (user && typeof user.id === "number" && user.name) {
      return { user, valid: true };
    }
    return { user: null, valid: false };
  } catch (err) {
    console.error("Session validation error:", err);
    return { user: null, valid: false };
  }
});

ipcMain.handle("auth:logout", async (_event, sessionId: number) => {
  try {
    if (sessionId && typeof sessionId === "number") {
      sessions.delete(sessionId);
    }
  } catch (err) {
    console.error("Logout error:", err);
    // Don't throw - logout should always succeed from user's perspective
  }
});

ipcMain.handle("auth:delete-user", async (_event, userId: number) => {
  auth.delete(userId);
});

ipcMain.handle(
  "auth:update-user",
  async (_event, userId: number, name: string, password: string) => {
    auth.update(userId, name, password);
  }
);

ipcMain.handle("auth:get-user", async (_event, userId: number) => {
  return auth.getById(userId);
});

ipcMain.handle("auth:get-all-users", async () => {
  return auth.getAll() || [];
});

ipcMain.handle("auth:is-user-exists", async (_event, name: string) => {
  return auth.isUserExists(name);
});

// Favorites
ipcMain.handle(
  "favorites:add",
  async (_event, userId: number, animeId: number) => {
    if (!userId) throw new Error("Not logged in");
    if (favorites.isFavorite(userId, animeId)) {
      favorites.remove(userId, animeId);
    } else {
      favorites.add(userId, animeId);
    }
  }
);

ipcMain.handle(
  "favorites:remove",
  async (_event, userId: number, animeId: number) => {
    if (!userId) throw new Error("Not logged in");
    favorites.remove(userId, animeId);
  }
);

ipcMain.handle(
  "favorites:is",
  async (_event, userId: number, animeId: number) => {
    if (!userId) return false;
    return favorites.isFavorite(userId, animeId);
  }
);

ipcMain.handle("favorites:get", async (_event, userId: number) => {
  if (!userId) return [];
  return favorites.getAll(userId);
});

// Custom Lists
ipcMain.handle(
  "lists:create",
  async (_event, userId: number, name: string, description = "") => {
    if (!userId) throw new Error("Not logged in");
    const list = lists.create(userId, name, description);
    if (!list) throw new Error("Failed to create list");
    return list.id;
  }
);

ipcMain.handle("lists:get", async (_event, userId: number) => {
  if (!userId) return [];
  const allLists = lists.getAll(userId) as List[];
  return allLists.map((list) => ({
    id: list.id,
    name: list.name,
    description: list.description || null,
    coverImage: list.cover_image || null,
    bannerImage: list.banner_image || null,
  }));
});

ipcMain.handle(
  "lists:add-anime",
  async (_event, listId: number, animeId: number) => {
    // Optional: verify list belongs to user (security)
    lists.addAnime(listId, animeId);
  }
);

ipcMain.handle(
  "lists:remove-anime",
  async (_event, listId: number, animeId: number) => {
    lists.removeAnime(listId, animeId);
  }
);

ipcMain.handle("lists:get-animes", async (_event, listId: number) => {
  return lists.getAnimes(listId);
});

ipcMain.handle("lists:delete", async (_event, listId: number) => {
  lists.delete(listId);
});

ipcMain.handle(
  "lists:update",
  async (_event, listId: number, name: string, description: string) => {
    lists.update(listId, name, description);
  }
);

ipcMain.handle("lists:get-one", async (_event, listId: number) => {
  const list = lists.get(listId);
  if (!list) return null;
  return {
    id: list.id,
    name: list.name,
    description: list.description || null,
    coverImage: list.cover_image || null,
    bannerImage: list.banner_image || null,
  };
});
