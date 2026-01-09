import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { app } from 'electron';
import { existsSync } from 'fs';
import { isDev } from './env.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Improved path resolution with better error handling
 */
export function getPreloadPath(): string {
  // Preload is compiled to dist-electron/preload/preload.cjs (CommonJS)
  // Use .cjs extension so Electron loads it as CommonJS even with "type": "module"
  const preloadPath = path.resolve(__dirname, '../preload/preload.cjs');
  
  // Fallback to .js if .cjs doesn't exist (for backwards compatibility)
  const preloadPathJs = path.resolve(__dirname, '../preload/preload.js');
  const finalPath = existsSync(preloadPath) ? preloadPath : preloadPathJs;
  
  // Verify the file exists
  if (!existsSync(finalPath)) {
    console.error(`[Paths] Preload script not found at: ${finalPath}`);
    console.error(`[Paths] Also checked: ${preloadPath}`);
    console.error(`[Paths] __dirname: ${__dirname}`);
    throw new Error(`Preload script not found at: ${finalPath}`);
  }
  
  console.log(`[Paths] Preload script found at: ${finalPath}`);
  return finalPath;
}

export function getUIPath(): string {
  if (isDev()) {
    // In dev, we load from Vite dev server
    const port = process.env.PORT || '5173';
    return `http://localhost:${port}`;
  }
  return path.join(app.getAppPath(), 'dist-react/index.html');
}

export function getIconPath(): string {
  const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  if (isDev()) {
    return path.join(__dirname, '../../assets', iconName);
  }
  return path.join(app.getAppPath(), 'assets', iconName);
}

export function getDatabasePath(): string {
  return path.join(app.getPath('userData'), 'anime-app.db');
}
