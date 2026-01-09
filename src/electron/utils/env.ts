/**
 * Environment utilities with proper error handling
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

export function getPort(): number {
  const port = process.env.PORT || '5173';
  const portNum = parseInt(port, 10);
  
  if (isNaN(portNum) || portNum < 1024 || portNum > 65535) {
    console.warn(`Invalid PORT env variable: ${port}. Using default 5173`);
    return 5173;
  }
  
  return portNum;
}
