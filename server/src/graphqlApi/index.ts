import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "graphqlApi/resolvers/resolvers";
import { readFileSync } from "fs";
import path from "path";
import { GraphQLError } from "graphql";
import express, { Express } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

import { corsMiddleware } from "middleware/headers";

export interface GraphQLContext {
  userToken?: JwtPayload & {
    userId: string;
  };
}

export const startGraphQLServer = (app: Express, callback: () => void) => {
  const typeDefs = gql(
    readFileSync(path.resolve(__dirname, "./schemas/schema.gql"), {
      encoding: "utf-8",
    })
  );

  const apolloServer = new ApolloServer<GraphQLContext>({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  apolloServer.start().then(() => {
    app.use(
      "/api/graphql",
      corsMiddleware,
      express.json(),
      expressMiddleware(apolloServer, {
        // JWT verification
        // If the JWT is valid, pass it to resolvers via context
        context: async ({ req }) => {
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
            const userToken = await new Promise((resolve, reject) => {
              jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as Secret,
                (error, validUserToken) => {
                  if (error) {
                    console.error(error);

                    return reject("UNAUTHENTICATED");
                  }

                  resolve(
                    validUserToken as JwtPayload & {
                      userId: string;
                    }
                  );
                }
              );
            });

            return { userToken };
          } catch (error) {
            throw new GraphQLError("Invalid access token", {
              extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 403 },
              },
            });
          }
        },
      })
    );

    callback();
  });
};
