# Migration Notes - Clean App Version

## Key Improvements

### 1. Authentication System
- **Fixed**: Session validation now properly extends sessions on validation
- **Fixed**: Better error handling for invalid credentials
- **Fixed**: Improved session cleanup with automatic expiration handling
- **Improved**: Session storage with proper error handling
- **Added**: Automatic session extension on validation

### 2. Database Layer
- **Added**: Foreign key constraints for data integrity
- **Added**: Database indexes for better query performance
- **Improved**: Better error handling and validation
- **Fixed**: Proper transaction handling
- **Improved**: Cleaner service layer separation

### 3. Code Organization
- **Improved**: Better separation of concerns
- **Improved**: Type-safe IPC handlers
- **Improved**: Consistent error handling patterns
- **Improved**: Better path resolution for Electron
- **Fixed**: Environment variable handling

### 4. Error Handling
- **Improved**: Consistent error messages
- **Improved**: Better error boundaries
- **Improved**: Proper error propagation
- **Added**: User-friendly error messages

### 5. Path Resolution
- **Fixed**: Proper path resolution for dev and production
- **Fixed**: Preload script path handling
- **Improved**: Icon path resolution
- **Fixed**: Database path resolution

## Breaking Changes

1. **Preload Script**: Now located at `src/electron/preload/preload.ts` instead of `src/electron/preload.cts`
2. **Database Services**: Moved to separate service files (`auth.ts`, `sessions.ts`, `favorites.ts`, `lists.ts`)
3. **Utils**: Auth utilities moved to `src/ui/utils/auth.ts`

## Migration Steps

1. Copy your database file from the old app if you want to preserve data:
   - Old location: `%APPDATA%/anime-app/anime-app.db` (Windows)
   - New location: Same location (app name may differ)

2. Update any custom hooks or components that import from old paths

3. Environment variables remain the same (PORT, NODE_ENV)

## Testing Checklist

- [ ] Login/Signup works correctly
- [ ] Session persists across app restarts
- [ ] Favorites functionality works
- [ ] Lists functionality works
- [ ] UI loads correctly in dev and production
- [ ] Database operations work correctly
- [ ] Error messages are user-friendly

## Known Issues Fixed

1. ✅ Auth bugs with session validation
2. ✅ Running problems with path resolution
3. ✅ Database constraint violations
4. ✅ Session expiration handling
5. ✅ Error handling inconsistencies
