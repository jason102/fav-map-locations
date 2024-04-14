import { GraphQLError } from "graphql";
import { db } from "db/dbSetup";

interface DatabaseAverageRating {
  place_id: string;
  average_rating: number;
}

const getAverageRatings = async (placeIds: readonly string[]) => {
  try {
    const dbAverageRatings = await db.query<DatabaseAverageRating>(
      `
      SELECT place_id, CAST(COALESCE(AVG(rating_value), 0) AS DOUBLE PRECISION) AS average_rating
      FROM ratings
      WHERE place_id = ANY($1)
      GROUP BY place_id
    `,
      [placeIds]
    );

    // Since the SQL query won't necessarily return the results in the same order as placeIds,
    // We need to ensure they're in the same order using TypeScript
    const ratingsMap = dbAverageRatings.rows.reduce<{ [id: string]: number }>(
      (map, rating) => {
        map[rating.place_id] = rating.average_rating;
        return map;
      },
      {}
    );

    return placeIds.map((id) => ratingsMap[id]);
  } catch (err) {
    const error = err as Error;

    console.log(error);
    throw new GraphQLError(error.message);
  }
};

export default getAverageRatings;
