import { Resolvers } from "graphqlApi/types";

const resolvers: Resolvers = {
  Query: {
    userDetails: async (_, { username }, { loaders }) => {
      return await loaders.userDetailsLoader.load(username!);
    },
    placeDetails: async (_, { id }, { loaders, userToken }) => {
      const place = await loaders.placesLoader.load(id);
      const userRating = await loaders.placeRatingsByUsersLoader.load({
        userId: userToken.userId,
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
  },
};

export default resolvers;
