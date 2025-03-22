import { GraphQLError } from "graphql";
import { db } from "db/dbSetup";

interface DatabasePlace {
  place_id: string;
  user_id: string;
  place_name: string;
  place_address: string;
  latitude: number;
  longitude: number;
  created_at: Date;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: string;
  creatorUserId: string;
}

const getPlaces = async (ids: readonly string[]) => {
  try {
    const dbPlaces = await db.query<DatabasePlace>(
      "SELECT * FROM places WHERE place_id = ANY($1)",
      [ids]
    );

    if (dbPlaces.rowCount === 0) {
      throw new Error("Place(s) not found");
    }

    const places = dbPlaces.rows.map<Place>(
      ({
        place_id,
        place_name,
        place_address,
        latitude,
        longitude,
        created_at,
        user_id,
      }) => ({
        id: place_id,
        name: place_name,
        address: place_address,
        lat: latitude,
        lng: longitude,
        createdAt: created_at.toISOString(),
        creatorUserId: user_id,
      })
    );

    return places;
  } catch (err) {
    const error = err as Error;

    console.log(error);
    throw new GraphQLError(error.message);
  }
};

export default getPlaces;
