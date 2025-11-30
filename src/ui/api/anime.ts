import { request, gql } from "graphql-request";
import type {
  AnimeListItem,
  AnimeDetails,
  PaginatedAnimeResult,
  AnimeFilters,
  AnimeSort,
  AnimeSeason,
} from "../../../types.d.ts";

const ANILIST_API = "https://graphql.anilist.co";

/**
 * Search anime by query string
 */
export async function searchAnime(query: string): Promise<AnimeListItem[]> {
  const gqlQuery = gql`
    query ($search: String) {
      Page {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
            medium
          }
          status
          episodes
          averageScore
        }
      }
    }
  `;
  const variables = { search: query };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Page.media;
}

/**
 * Get anime details by ID
 */
export async function getAnimeById(id: number): Promise<AnimeDetails> {
  const gqlQuery = gql`
    query ($id: Int) {
      Media(id: $id) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
          extraLarge
          medium
        }
        bannerImage
        averageScore
        episodes
        duration
        description
        season
        seasonYear
        genres
        status
        format
        studios {
          nodes {
            name
          }
        }
        characters {
          nodes {
            name {
              full
            }
            image {
              medium
            }
          }
        }
      }
    }
  `;
  const variables = { id };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Media;
}

/**
 * Get all popular anime
 */
export async function getAllAnime(
  sort: AnimeSort = "POPULARITY_DESC",
  perPage: number = 50
): Promise<AnimeListItem[]> {
  const gqlQuery = gql`
    query ($sort: [MediaSort], $perPage: Int) {
      Page(perPage: $perPage) {
        media(type: ANIME, sort: $sort) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
            extraLarge
          }
          averageScore
          episodes
          status
        }
      }
    }
  `;
  const variables = { sort: [sort], perPage };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Page.media;
}

/**
 * Get trending anime
 */
export async function getTrendingAnime(
  perPage: number = 20
): Promise<AnimeListItem[]> {
  const gqlQuery = gql`
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
            extraLarge
          }
          averageScore
          episodes
          status
        }
      }
    }
  `;
  const variables = { perPage };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Page.media;
}

/**
 * Get seasonal anime
 */
export async function getSeasonalAnime(
  season: AnimeSeason,
  year: number,
  perPage: number = 50
): Promise<AnimeListItem[]> {
  const gqlQuery = gql`
    query ($season: MediaSeason, $seasonYear: Int, $perPage: Int) {
      Page(perPage: $perPage) {
        media(
          type: ANIME
          season: $season
          seasonYear: $seasonYear
          sort: POPULARITY_DESC
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
            extraLarge
          }
          averageScore
          episodes
          status
        }
      }
    }
  `;
  const variables = { season, seasonYear: year, perPage };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Page.media;
}

/**
 * Get anime by genre
 */
export async function getAnimeByGenre(
  genres: string[],
  sort: AnimeSort = "POPULARITY_DESC",
  perPage: number = 50
): Promise<AnimeListItem[]> {
  const gqlQuery = gql`
    query ($genres: [String], $sort: [MediaSort], $perPage: Int) {
      Page(perPage: $perPage) {
        media(type: ANIME, genre_in: $genres, sort: $sort) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
            extraLarge
          }
          averageScore
          episodes
          status
        }
      }
    }
  `;
  const variables = { genres, sort: [sort], perPage };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Page.media;
}

/**
 * Get anime with pagination
 */
export async function getPaginatedAnime(
  filters: AnimeFilters = {}
): Promise<PaginatedAnimeResult> {
  const {
    search,
    genre,
    tag,
    format,
    status,
    season,
    seasonYear,
    sort = ["POPULARITY_DESC"],
    page = 1,
    perPage = 20,
    minScore,
    maxScore,
  } = filters;

  const gqlQuery = gql`
    query (
      $search: String
      $genre: [String]
      $tag: [String]
      $format: MediaFormat
      $status: MediaStatus
      $season: MediaSeason
      $seasonYear: Int
      $sort: [MediaSort]
      $page: Int
      $perPage: Int
      $minScore: Int
      $maxScore: Int
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(
          type: ANIME
          search: $search
          genre_in: $genre
          tag_in: $tag
          format: $format
          status: $status
          season: $season
          seasonYear: $seasonYear
          sort: $sort
          averageScore_greater: $minScore
          averageScore_lesser: $maxScore
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
            extraLarge
          }
          averageScore
          episodes
          status
        }
      }
    }
  `;

  const variables: Record<string, unknown> = {
    sort,
    page,
    perPage,
  };

  if (search) variables.search = search;
  if (genre && genre.length > 0) variables.genre = genre;
  if (tag && tag.length > 0) variables.tag = tag;
  if (format) variables.format = format;
  if (status) variables.status = status;
  if (season) variables.season = season;
  if (seasonYear) variables.seasonYear = seasonYear;
  if (minScore !== undefined) variables.minScore = minScore;
  if (maxScore !== undefined) variables.maxScore = maxScore;

  const data = await request(ANILIST_API, gqlQuery, variables);
  return {
    media: data.Page.media,
    pageInfo: data.Page.pageInfo,
  };
}

/**
 * Get anime by multiple IDs
 */
export async function getAnimeByIds(ids: number[]): Promise<AnimeListItem[]> {
  const gqlQuery = gql`
    query ($ids: [Int]) {
      Page {
        media(type: ANIME, id_in: $ids) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
            extraLarge
          }
          averageScore
          episodes
          status
        }
      }
    }
  `;
  const variables = { ids };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Page.media;
}

/**
 * Get top rated anime
 */
export async function getTopRatedAnime(
  perPage: number = 50,
  minScore: number = 80
): Promise<AnimeListItem[]> {
  const gqlQuery = gql`
    query ($perPage: Int, $minScore: Int) {
      Page(perPage: $perPage) {
        media(type: ANIME, sort: SCORE_DESC, averageScore_greater: $minScore) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
            extraLarge
          }
          averageScore
          episodes
          status
        }
      }
    }
  `;
  const variables = { perPage, minScore };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Page.media;
}

/**
 * Get currently airing anime
 */
export async function getAiringAnime(
  perPage: number = 50
): Promise<AnimeListItem[]> {
  const gqlQuery = gql`
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
            extraLarge
          }
          averageScore
          episodes
          status
        }
      }
    }
  `;
  const variables = { perPage };
  const data = await request(ANILIST_API, gqlQuery, variables);
  return data.Page.media;
}
