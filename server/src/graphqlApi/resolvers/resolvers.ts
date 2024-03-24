import { getDatabase } from "db/dbSetup";
import { Resolvers } from "graphqlApi/types";
import getUserDetails from "./dbUserDetails";

const db = getDatabase();

const resolvers: Resolvers = {
  Query: {
    userDetails: async (_, { username }, { userToken }) => {
      return await getUserDetails(username!);
    },
  },
};

export default resolvers;
