import { GraphQLError } from "graphql";
import { db } from "db/dbSetup";
import { Bounds } from "graphqlApi/types";

const PLACES_QUERY_LIMIT = 20;

interface DatabasePlaceIdAndDistance {
  place_id: string;
  distance_from_center: number;
}

const getPlaceIdsWithinBounds = async (bounds: Bounds) => {
  const { neLat, neLng, swLat, swLng } = bounds;

  const boundsCenterLat = (neLat + swLat) / 2;
  const boundsCenterLng = (neLng + swLng) / 2;

  try {
    const dbPlaces = await db.query<DatabasePlaceIdAndDistance>(
      `
      SELECT 
        p.place_id,
        ABS(p.latitude - $1) + ABS(p.longitude - $2) AS distance_from_center
      FROM
        places p
      WHERE
        p.latitude BETWEEN $3 AND $4
        AND p.longitude BETWEEN $5 AND $6
      ORDER BY
        distance_from_center
      LIMIT $7
    `,
      [
        boundsCenterLat,
        boundsCenterLng,
        swLat,
        neLat,
        swLng,
        neLng,
        PLACES_QUERY_LIMIT,
      ]
    );

    return dbPlaces.rows.map(({ place_id }) => place_id);
  } catch (err) {
    const error = err as Error;

    console.log(error);
    throw new GraphQLError(error.message);
  }
};

export default getPlaceIdsWithinBounds;
