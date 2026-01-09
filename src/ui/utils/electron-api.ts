/**
 * Utility to safely access electronAPI
 * Throws a helpful error if electronAPI is not available
 */
function getElectronAPI(): Window['electronAPI'] {
  if (typeof window === 'undefined') {
    throw new Error('window is not defined. This code must run in a browser environment.');
  }

  if (!window.electronAPI) {
    // Log diagnostic information
    console.error('[electronAPI] electronAPI is not available');
    console.error('[electronAPI] window object:', window);
    console.error('[electronAPI] window.electronAPI:', window.electronAPI);
    console.error('[electronAPI] Check the Electron main process console for preload script errors');
    
    throw new Error(
      'electronAPI is not available. Make sure the preload script is loaded correctly. ' +
      'Check the Electron main process console for "[Preload]" messages. ' +
      'If you see this error, the Electron app may not be running correctly.'
    );
  }

  return window.electronAPI;
}

/**
 * Wait for electronAPI to be available (with timeout)
 */
function waitForElectronAPI(timeout = 5000): Promise<Window['electronAPI']> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('window is not defined'));
      return;
    }

    if (window.electronAPI) {
      resolve(window.electronAPI);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (window.electronAPI) {
        clearInterval(checkInterval);
        resolve(window.electronAPI);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('electronAPI did not become available within timeout'));
      }
    }, 100);
  });
}

/**
 * Safe wrapper for electronAPI that checks availability
 * Will wait for electronAPI to be available if it's not immediately ready
 */
export const electronAPI = new Proxy({} as Window['electronAPI'], {
  get(_target, prop) {
    // Try to get the API immediately
    try {
      const api = getElectronAPI();
      const value = api[prop as keyof typeof api];
      
      if (typeof value === 'function') {
        return value.bind(api);
      }
      
      return value;
    } catch (error) {
      // If not available, try waiting for it (for async operations)
      // Note: This won't work for synchronous access, but helps with timing issues
      console.warn('[electronAPI] electronAPI not immediately available, this may cause issues');
      throw error;
    }
  },
});

// Export a function to check if electronAPI is available
export function isElectronAPIAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.electronAPI;
}
