# Anime Frog

<h2 align="center">Electron + Vite + React + TypeScript + TailwindCSS + ShadCN</h2>

A modern desktop anime application built with Electron, featuring user authentication, favorites, custom lists, and anime browsing powered by the AniList API.

## Features

- 🔐 **User Authentication** - Secure signup/login with database-backed sessions
- ⭐ **Favorites** - Save your favorite anime for quick access
- 📋 **Custom Lists** - Create and manage custom anime lists with descriptions
- 🔍 **Anime Browsing** - Browse anime sorted by popularity with pagination
- 📱 **Anime Details** - View detailed information about each anime
- 🎨 **Dark/Light Theme** - System-aware theme switching
- 💾 **Local Database** - SQLite database for offline data persistence
- 🚀 **Fast & Modern** - Built with React 19, Vite, and TypeScript

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Electron, Better-SQLite3
- **API**: AniList GraphQL API
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router
- **Build Tool**: Vite
- **Database**: SQLite (Better-SQLite3)

## Project Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd electron_anime
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   - Copy `.env.example` to `.env`
   - Update the `PORT` variable if needed (default: 5173)

4. Run the application
   ```bash
   npm run dev
   ```

## Development

### Starting the Application

Run `npm run dev` to start both the React development server and Electron app.

- The React dev server runs on port **5173** (or the port specified in `.env`)
- Hot reloading is enabled for both React and Electron processes

### Available Scripts

- `npm run dev` - Start development mode (React + Electron)
- `npm run dev:react` - Start only the React dev server
- `npm run dev:electron` - Start only Electron (requires pre-transpilation)
- `npm run build` - Build the React app for production
- `npm run transpile:electron` - Transpile Electron TypeScript files
- `npm run lint` - Run ESLint

### Project Structure

```
electron_anime/
├── src/
│   ├── electron/          # Electron main process
│   │   ├── main.ts        # Main Electron process
│   │   ├── preload.cts    # Preload script (IPC bridge)
│   │   └── db/            # Database files
│   │       ├── db.ts      # Database schema
│   │       └── dbHelper.ts # Database operations
│   └── ui/                 # React application
│       ├── components/    # React components
│       ├── pages/          # Page components
│       ├── hooks/          # Custom React hooks
│       ├── contexts/       # React contexts (Auth, etc.)
│       ├── api/            # API functions (AniList)
│       └── routers/        # React Router setup
├── types.d.ts              # TypeScript type definitions
└── package.json
```

## Production Build

### Windows
```bash
npm run dist:win
```

### Linux
```bash
npm run dist:linux
```

### macOS
```bash
npm run dist:mac
```

Built applications will be in the `dist` directory.

## Database

The application uses SQLite (Better-SQLite3) for local data storage. The database file is created automatically in the Electron user data directory:

- **Windows**: `%APPDATA%/anime-frog/anime-app.db`
- **macOS**: `~/Library/Application Support/anime-frog/anime-app.db`
- **Linux**: `~/.config/anime-frog/anime-app.db`

### Database Schema

- **users** - User accounts (id, name, password)
- **sessions** - Active user sessions (id, user_id, expires_at)
- **favorites** - User favorite anime (user_id, anime_id)
- **custom_lists** - User-created lists (id, user_id, name, description)
- **list_items** - Anime items in lists (list_id, anime_id)

## Authentication

The application uses database-backed session management:

- Users can sign up with a username and password
- Sessions are stored in the database with expiration (7 days)
- Session validation happens on app startup
- Logout clears the session from the database

## API Integration

The app integrates with the [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/) using GraphQL to fetch:
- Anime listings and details
- Search functionality
- Genre filtering
- Popularity sorting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

---

**Note**: This application has been tested on Windows. Linux and macOS compatibility may vary.
