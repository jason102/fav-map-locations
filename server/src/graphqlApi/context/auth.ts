import jwt, { Secret } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { Request } from "express";

import { UserToken } from "types";

// JWT verification
// If the JWT is valid, pass it to resolvers via context
export const getUserToken = async (req: Request) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new GraphQLError("Authorization header must be provided", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  try {
    const userToken = await new Promise<UserToken>((resolve, reject) => {
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as Secret,
        (error, validUserToken) => {
          if (error) {
            console.error(error);

            return reject("UNAUTHENTICATED");
          }

          resolve(validUserToken as UserToken);
        }
      );
    });

    return userToken;
  } catch (error) {
    throw new GraphQLError("Invalid access token", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 403 },
      },
    });
  }
};
