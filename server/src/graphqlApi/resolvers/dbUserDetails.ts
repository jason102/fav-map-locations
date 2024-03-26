import { GraphQLError } from "graphql";
import { DatabaseUser } from "routes/auth/types";
import { db } from "db/dbSetup";

const getUserDetails = async (username: string) => {
  try {
    const users = await db.query<DatabaseUser>(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (users.rowCount === 0) {
      throw new Error("User not found");
    }

    // User exists, return the needed info
    const user = users.rows[0];

    const userDetails = {
      username: user.username,
      email: user.email,
      memberSince: user.created_at.toISOString(),
    };

    return userDetails;
  } catch (err) {
    const error = err as Error;

    console.log(error);
    throw new GraphQLError(error.message);
  }
};

export default getUserDetails;
