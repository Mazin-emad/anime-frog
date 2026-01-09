# Anime App - Clean Version

A modern Electron application for browsing and managing anime lists, built with React, TypeScript, and SQLite.

## Features

- 🔐 Secure authentication with session management
- 📚 Custom anime lists
- ⭐ Favorites system
- 🎨 Modern UI with dark mode support
- 🚀 Fast and responsive

## Improvements Over Previous Version

- ✅ Fixed authentication bugs and improved session management
- ✅ Better error handling throughout the application
- ✅ Cleaner code structure and organization
- ✅ Improved path resolution for Electron
- ✅ Better database error handling
- ✅ Type-safe IPC communication
- ✅ Proper environment variable handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults are used):
```
PORT=5173
NODE_ENV=development
```

3. Run in development mode:
```bash
npm run dev
```

### Building

Build for production:
```bash
npm run build
```

Build distributable:
```bash
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

## Project Structure

```
electron_anime_clean/
├── src/
│   ├── electron/          # Electron main process
│   │   ├── db/            # Database services
│   │   ├── preload/       # Preload scripts
│   │   └── utils/         # Utilities
│   └── ui/                # React UI
│       ├── components/    # React components
│       ├── contexts/      # React contexts
│       ├── hooks/         # Custom hooks
│       ├── pages/         # Page components
│       └── api/           # API clients
├── dist-electron/         # Compiled Electron code
├── dist-react/           # Built React app
└── types.d.ts            # TypeScript type definitions
```

## Key Improvements

### Authentication
- Improved session validation
- Better error messages
- Automatic session extension
- Proper cleanup of expired sessions

### Database
- Foreign key constraints
- Better error handling
- Indexed queries for performance
- Proper transaction handling

### Code Quality
- Type-safe IPC handlers
- Better separation of concerns
- Improved error boundaries
- Consistent error handling patterns

## License

MIT
