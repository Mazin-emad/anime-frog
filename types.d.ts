export interface AnimeTitle {
  romaji: string;
  english: string | null;
}

export interface CoverImage {
  medium: string;
  large: string;
  extraLarge: string;
}

export interface AnimeListItem {
  id: number;
  title: AnimeTitle;
  coverImage: CoverImage;
  averageScore: number | null;
  episodes: number | null;
  status: string | null;
}

export interface AnimeDetails extends AnimeListItem {
  duration: number | null;
  description: string | null;
  season: string | null;
  bannerImage: string | null;
  seasonYear: number | null;
  genres: string[];
  format: string | null;
  studios: {
    nodes: Array<{ name: string }>;
  };
  characters: {
    nodes: Array<{
      name: { full: string };
      image: { medium: string };
    }>;
  };
}

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface PaginatedAnimeResult {
  media: AnimeListItem[];
  pageInfo: PageInfo;
}

export type AnimeSort =
  | "POPULARITY_DESC"
  | "POPULARITY"
  | "TRENDING_DESC"
  | "TRENDING"
  | "UPDATED_AT_DESC"
  | "UPDATED_AT"
  | "START_DATE_DESC"
  | "START_DATE"
  | "END_DATE_DESC"
  | "END_DATE"
  | "FAVOURITES_DESC"
  | "FAVOURITES"
  | "SCORE_DESC"
  | "SCORE"
  | "TITLE_ROMAJI_DESC"
  | "TITLE_ROMAJI"
  | "TITLE_ENGLISH_DESC"
  | "TITLE_ENGLISH"
  | "TITLE_NATIVE_DESC"
  | "TITLE_NATIVE"
  | "EPISODES_DESC"
  | "EPISODES"
  | "ID"
  | "ID_DESC";

export type AnimeFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC"
  | "MANGA"
  | "NOVEL"
  | "ONE_SHOT";

export type AnimeStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type AnimeSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export interface AnimeFilters {
  search?: string;
  genre?: string[];
  tag?: string[];
  format?: AnimeFormat;
  status?: AnimeStatus;
  season?: AnimeSeason;
  seasonYear?: number;
  sort?: AnimeSort[];
  page?: number;
  perPage?: number;
  minScore?: number;
  maxScore?: number;
}

export interface UseAnimeResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UsePaginatedAnimeResult {
  data: AnimeListItem[] | null;
  pageInfo: PageInfo | null;
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasMore: boolean;
  currentPage: number;
  goToPage: (page: number) => void;
}

export interface User {
  id: number;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  sessionId: number;
}

export interface Favorite {
  user_id: number;
  anime_id: number;
}

export interface List {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: number;
  cover_image: string | null;
  banner_image: string | null;
}

export interface ListItem {
  list_id: number;
  anime_id: number;
}

declare global {
  interface Window {
    electronAPI: {
      signup: (name: string, password: string) => Promise<AuthResponse>;
      login: (name: string, password: string) => Promise<AuthResponse | null>;
      validateSession: (
        sessionId: number
      ) => Promise<{ user: User | null; valid: boolean }>;
      logout: (sessionId: number) => Promise<void>;
      deleteUser: (userId: number) => Promise<void>;
      updateUser: (
        userId: number,
        name: string,
        password: string
      ) => Promise<void>;
      getUser: (
        userId: number
      ) => Promise<{ id: number; name: string; password: string } | null>;
      getAllUsers: () => Promise<
        { id: number; name: string; password: string }[]
      >;
      isUserExists: (name: string) => Promise<boolean>;
      addFavorite: (userId: number, animeId: number) => Promise<void>;
      removeFavorite: (userId: number, animeId: number) => Promise<void>;
      isFavorite: (userId: number, animeId: number) => Promise<boolean>;
      getFavorites: (userId: number) => Promise<number[]>;
      createList: (
        userId: number,
        name: string,
        description?: string
      ) => Promise<number>;
      getLists: (userId: number) => Promise<
        Array<{
          id: number;
          name: string;
          description: string | null;
          coverImage: string | null;
          bannerImage: string | null;
        }>
      >;
      addToList: (listId: number, animeId: number) => Promise<void>;
      removeFromList: (listId: number, animeId: number) => Promise<void>;
      getListAnimes: (listId: number) => Promise<number[]>;
      deleteList: (listId: number) => Promise<void>;
      updateList: (
        listId: number,
        name: string,
        description: string
      ) => Promise<void>;
      getList: (listId: number) => Promise<{
        id: number;
        name: string;
        description: string | null;
        coverImage: string | null;
        bannerImage: string | null;
      } | null>;
    };
  }
}

export {};
