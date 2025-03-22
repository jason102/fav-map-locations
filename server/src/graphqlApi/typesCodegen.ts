import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/graphqlApi/schemas/schema.gql",
  generates: {
    "src/graphqlApi/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true,
        contextType: ".#GraphQLContext",
      },
    },
  },
};

export default config;
