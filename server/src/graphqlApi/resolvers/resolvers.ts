import { Resolvers, VisibleAreaPlaces } from "graphqlApi/types";
import getPlaceIdsWithinBounds from "graphqlApi/non-loaders/getPlaceIdsWithinBounds";
import { safeLoadMany } from "graphqlApi/loaders";

const resolvers: Resolvers = {
  Query: {
    userDetails: async (_, { username }, { loaders }) => {
      return await loaders.userDetailsLoader.load(username!);
    },
    placeDetails: async (_, { id }, { loaders, userToken }) => {
      const place = await loaders.placesLoader.load(id);
      const userRating = await loaders.placeRatingsByUsersLoader.load({
        userId: userToken!.userId,
        placeId: id,
      });
      const creatorUsername = await loaders.usernamesByUserIdsLoader.load(
        place.creatorUserId
      );
      const averageRating = await loaders.averageRatingsLoader.load(id);

      // If averageRating is undefined but the other data for the place exists, that means
      // the place hasn't been rated by anyone yet, and therefore has a value of 0
      return {
        place,
        averageRating: averageRating ?? 0,
        userRating,
        creatorUsername,
      };
    },
    visibleAreaPlaces: async (_, { bounds }, { loaders }) => {
      const placeIds = await getPlaceIdsWithinBounds(bounds); // Replace with a function to just get the IDs
      const places = await safeLoadMany(loaders.placesLoader, placeIds);
      const averageRatings = await safeLoadMany(
        loaders.averageRatingsLoader,
        placeIds
      );

      const combinedData = places.map<VisibleAreaPlaces>((place, index) => ({
        place,
        averageRating: averageRatings[index] ?? 0,
      }));

      const placesOrderedByAvgRating = [...combinedData].sort((a, b) => {
        // First order by rating (descending average rating)
        if (a.averageRating > b.averageRating) {
          return -1;
        } else if (a.averageRating < b.averageRating) {
          return 1;
        }

        // Then by place name in alphabetical order
        return a.place.name.localeCompare(b.place.name);
      });

      return placesOrderedByAvgRating;
    },
  },
};

export default resolvers;
