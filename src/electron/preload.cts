/// <reference path="../../types.d.ts" />
import electron from "electron";

electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Auth
  signup: (name: string, password: string) =>
    ipcInvoke("auth:signup", name, password),

  login: (name: string, password: string) =>
    ipcInvoke("auth:login", name, password),

  validateSession: (sessionId: number) =>
    ipcInvoke("auth:validate-session", sessionId),

  logout: (sessionId: number) =>
    ipcInvoke("auth:logout", sessionId),

  deleteUser: (userId: number) => ipcInvoke("auth:delete-user", userId),

  updateUser: (userId: number, name: string, password: string) =>
    ipcInvoke("auth:update-user", userId, name, password),

  getUser: (userId: number) => ipcInvoke("auth:get-user", userId),

  getAllUsers: () => ipcInvoke("auth:get-all-users"),

  isUserExists: (name: string) => ipcInvoke("auth:is-user-exists", name),

  // Favorites
  addFavorite: (userId: number, animeId: number) =>
    ipcInvoke("favorites:add", userId, animeId),
  removeFavorite: (userId: number, animeId: number) =>
    ipcInvoke("favorites:remove", userId, animeId),

  isFavorite: (userId: number, animeId: number) =>
    ipcInvoke("favorites:is", userId, animeId),

  getFavorites: (userId: number) => ipcInvoke("favorites:get", userId),

  // Lists
  createList: (userId: number, name: string, description = "") =>
    ipcInvoke("lists:create", userId, name, description),

  getLists: (userId: number) => ipcInvoke("lists:get", userId),

  addToList: (listId: number, animeId: number) =>
    ipcInvoke("lists:add-anime", listId, animeId),

  removeFromList: (listId: number, animeId: number) =>
    ipcInvoke("lists:remove-anime", listId, animeId),

  getListAnimes: (listId: number) => ipcInvoke("lists:get-animes", listId),
  deleteList: (listId: number) => ipcInvoke("lists:delete", listId),
  updateList: (listId: number, name: string, description: string) =>
    ipcInvoke("lists:update", listId, name, description),

  getList: (listId: number) => ipcInvoke("lists:get-one", listId),
} satisfies Window["electronAPI"]);

function ipcInvoke(channel: string, ...args: any[]): Promise<any> {
  return electron.ipcRenderer.invoke(channel, ...args);
}

function ipcOn(channel: string, callback: (payload: any) => void) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(channel, cb);
  return () => electron.ipcRenderer.off(channel, cb);
}
