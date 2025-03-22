import { GraphQLError } from "graphql";
import { db } from "db/dbSetup";

interface DatabaseRating {
  rating_id: string;
  user_id: string;
  place_id: string;
  rating_value: number;
}

export interface UserAndPlaceId {
  userId: string;
  placeId: string;
}

const getPlaceRatingsByUsers = async (
  userAndPlaceIds: readonly UserAndPlaceId[]
) => {
  const placeholders = userAndPlaceIds
    .map((_, index) => `($${2 * index + 1}::uuid, $${2 * index + 2})`)
    .join(", ");

  const queryParams = userAndPlaceIds.flatMap(({ userId, placeId }) => [
    userId,
    placeId,
  ]);

  try {
    const dbRatings = await db.query<DatabaseRating>(
      `SELECT * FROM ratings WHERE (user_id, place_id) IN (VALUES ${placeholders})`,
      queryParams
    );

    // Return the ratings in the same order as userAndPlaceIds
    const userRatings = userAndPlaceIds.map(
      (userAndPlaceId) =>
        dbRatings.rows.find(
          (rating) =>
            rating.user_id === userAndPlaceId.userId &&
            rating.place_id === userAndPlaceId.placeId
        )?.rating_value ?? 0
    );

    return userRatings;
  } catch (err) {
    const error = err as Error;

    console.log(error);
    throw new GraphQLError(error.message);
  }
};

export default getPlaceRatingsByUsers;
