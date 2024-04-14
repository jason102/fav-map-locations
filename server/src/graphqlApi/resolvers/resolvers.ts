import { Resolvers } from "graphqlApi/types";

const resolvers: Resolvers = {
  Query: {
    userDetails: async (_, { username }, { loaders }) => {
      return await loaders.userDetailsLoader.load(username!);
    },
    placeDetails: async (_, { id }, { loaders, userToken }) => {
      const place = await loaders.placesLoader.load(id);
      const averageRating = await loaders.averageRatingsLoader.load(id);
      const userRating = await loaders.placeRatingsByUsersLoader.load({
        userId: userToken.userId,
        placeId: id,
      });
      const creatorUsername = await loaders.usernamesByUserIdsLoader.load(
        place.creatorUserId
      );

      return {
        place,
        averageRating,
        userRating,
        creatorUsername,
      };
    },
  },
};

export default resolvers;
