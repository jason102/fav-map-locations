import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "graphqlApi/resolvers/resolvers";
import { readFileSync } from "fs";
import path from "path";
import express, { Express } from "express";

import { corsMiddleware } from "middleware/headers";

import { getUserToken } from "graphqlApi/context/auth";
import { getLoaders } from "graphqlApi/context/loaders";

import { UserToken } from "types";

export interface GraphQLContext {
  userToken: UserToken;
  loaders: ReturnType<typeof getLoaders>;
}

export const startGraphQLServer = (app: Express, callback: () => void) => {
  const typeDefs = gql(
    readFileSync(path.resolve(__dirname, "./schemas/schema.gql"), {
      encoding: "utf-8",
    })
  );

  const apolloServer = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  apolloServer.start().then(() => {
    app.use(
      "/api/graphql",
      corsMiddleware,
      express.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }): Promise<GraphQLContext> => {
          const userToken = await getUserToken(req);
          const loaders = getLoaders();

          return { userToken, loaders };
        },
      })
    );

    callback();
  });
};
