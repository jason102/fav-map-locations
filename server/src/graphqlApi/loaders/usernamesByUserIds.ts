import { GraphQLError } from "graphql";
import { db } from "db/dbSetup";

interface DatabaseUser {
  user_id: string;
  username: string;
}

const getUsernamesByUserIds = async (userIds: readonly string[]) => {
  try {
    const dbUsers = await db.query<DatabaseUser>(
      "SELECT user_id, username FROM users WHERE user_id = ANY($1)",
      [userIds]
    );

    const usersMap = dbUsers.rows.reduce<{ [id: string]: string }>(
      (map, user) => {
        map[user.user_id] = user.username;
        return map;
      },
      {}
    );

    return userIds.map((id) => usersMap[id]);
  } catch (err) {
    const error = err as Error;

    console.log(error);
    throw new GraphQLError(error.message);
  }
};

export default getUsernamesByUserIds;
