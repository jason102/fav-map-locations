import { GraphQLError } from "graphql";
import { DatabaseUser } from "routes/auth/types";
import { db } from "db/dbSetup";

export interface UserDetails {
  username: string;
  email: string;
  memberSince: string;
}

const getUserDetails = async (usernames: readonly string[]) => {
  const placeholders = usernames.map((_, index) => `$${index + 1}`).join(",");

  try {
    const users = await db.query<DatabaseUser>(
      `SELECT * FROM users WHERE username IN (${placeholders})`,
      [...usernames]
    );

    if (users.rowCount === 0) {
      throw new Error("User(s) not found");
    }

    // Users exists, return the needed info
    const detailsOfUsers = users.rows.map<UserDetails>(
      ({ username, email, created_at }) => ({
        username,
        email,
        memberSince: created_at.toISOString(),
      })
    );

    return detailsOfUsers;
  } catch (err) {
    const error = err as Error;

    console.log(error);
    throw new GraphQLError(error.message);
  }
};

export default getUserDetails;
