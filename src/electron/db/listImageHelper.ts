import db from "./db.js";
import { request, gql } from "graphql-request";

const ANILIST_API = "https://graphql.anilist.co";

/**
 * Get anime cover and banner images by ID
 */
async function getAnimeImages(animeId: number): Promise<{
  coverImage: string | null;
  bannerImage: string | null;
}> {
  try {
    const gqlQuery = gql`
      query ($id: Int) {
        Media(id: $id) {
          coverImage {
            extraLarge
          }
          bannerImage
        }
      }
    `;
    const data = await request(ANILIST_API, gqlQuery, { id: animeId });
    return {
      coverImage: data.Media.coverImage?.extraLarge || null,
      bannerImage: data.Media.bannerImage || null,
    };
  } catch (error) {
    console.error(`Failed to fetch images for anime ${animeId}:`, error);
    return { coverImage: null, bannerImage: null };
  }
}

/**
 * Update list images from the latest anime in the list
 */
export async function updateListImages(listId: number): Promise<void> {
  // Get the latest anime ID (most recently added)
  const latestAnime = db
    .prepare(
      "SELECT anime_id FROM list_items WHERE list_id = ? ORDER BY rowid DESC LIMIT 1"
    )
    .get(listId) as { anime_id: number } | undefined;

  if (latestAnime) {
    const images = await getAnimeImages(latestAnime.anime_id);
    db.prepare(
      "UPDATE custom_lists SET cover_image = ?, banner_image = ? WHERE id = ?"
    ).run(images.coverImage, images.bannerImage, listId);
  } else {
    // No anime in list, clear images
    db.prepare(
      "UPDATE custom_lists SET cover_image = NULL, banner_image = NULL WHERE id = ?"
    ).run(listId);
  }
}

