import { Resolvers } from "graphqlApi/types";

const resolvers: Resolvers = {
  Query: {
    userDetails: async (_, { username }, { loaders }) => {
      return await loaders.userDetailsLoader.load(username!);
    },
  },
};

export default resolvers;
