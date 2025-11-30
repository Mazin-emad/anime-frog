// src/electron/util.ts

import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || "5173"; // fallback for safety

if (!PORT) throw new Error("PORT env variable is not set");

// ──────────────────────────────────────
// 1. Dev mode check
//─────────────────────────────────────
export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

//─────────────────────────────────────
// 2. Type-safe ipcMain.handle (now supports arguments!)
//─────────────────────────────────────
export function ipcMainHandle<
  Channel extends string,
  Handler extends (...args: unknown[]) => unknown
>(
  channel: Channel,
  handler: (
    event: Electron.IpcMainInvokeEvent,
    ...args: Parameters<Handler>
  ) => ReturnType<Handler>
) {
  ipcMain.handle(channel, (event, ...args) => {
    // Security: only allow calls from our real UI
    if (event.senderFrame) validateEventFrame(event.senderFrame);

    // @ts-expect-error we trust the typing from the caller
    return handler(event, ...args);
  });
}

//─────────────────────────────────────
// 3. Type-safe send (for push from main → renderer)
//─────────────────────────────────────
export function ipcWebContentsSend<Channel extends string>(
  channel: Channel,
  webContents: WebContents,
  payload: unknown
) {
  webContents.send(channel, payload);
}

//─────────────────────────────────────
// 4. Security: prevent malicious iframe/renderer attacks
//─────────────────────────────────────
export function validateEventFrame(frame: WebFrameMain) {
  const origin = frame.url;

  // Allow dev server
  if (isDev()) {
    const devUrl = `http://localhost:${PORT}`;
    if (origin.startsWith(devUrl)) return;
  }

  // Allow only our built index.html
  const expected = pathToFileURL(getUIPath()).toString();
  if (origin !== expected) {
    console.error("Blocked malicious IPC from:", origin);
    throw new Error("Malicious IPC event blocked");
  }
}
