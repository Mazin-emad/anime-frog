# Project File Structure

```
electron_anime/
├── barca_lite.png
├── components.json
├── electron-builder.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── pagination.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       └── tooltip.tsx
│   ├── electron/
│   │   ├── main.ts
│   │   ├── pathResolver.ts
│   │   ├── preload.cts
│   │   ├── test.ts
│   │   ├── tsconfig.json
│   │   └── util.ts
│   ├── hooks/
│   │   └── use-mobile.ts
│   ├── lib/
│   │   └── utils.ts
│   └── ui/
│       ├── App.css
│       ├── App.tsx
│       ├── assets/
│       ├── components/
│       │   ├── global/
│       │   │   ├── theme-provider.tsx
│       │   │   └── ThemeToggle.tsx
│       ├── main.tsx
│       ├── pages/
│       │   ├── favorites/
│       │   │   └── Favorites.tsx
│       │   ├── home/
│       │   │   ├── anime/
│       │   │   │   └── Anime.tsx
│       │   │   └── Home.tsx
│       │   └── lists/
│       │       ├── list-page/
│       │       │   └── ListPage.tsx
│       │       └── Lists.tsx
│       ├── routers/
│       │   └── MainRouter.tsx
│       └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── types.d.ts
└── vite.config.ts
```

## Summary

**Root Level Files:**

- Configuration: `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `eslint.config.js`, `electron-builder.json`, `components.json`
- Entry: `index.html`
- Documentation: `README.md`
- Assets: `barca_lite.png`
- Types: `types.d.ts`

**Source Code (`src/`):**

- **`electron/`**: Electron main process code (TypeScript)
- **`ui/`**: React UI application code
  - Pages: `pages/` (Home, Favorites, Lists)
  - Components: `components/` (global, home)
  - Routing: `routers/`
- **`components/ui/`**: Reusable UI components (shadcn/ui style)
- **`hooks/`**: React hooks
- **`lib/`**: Utility libraries

**Build Output (`dist-electron/`):**

- Compiled JavaScript files from Electron source code
