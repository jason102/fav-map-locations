import { GraphQLError, parse } from "graphql";
import { getOperationAST } from "graphql/utilities";
import { Request } from "express";

const PUBLIC_QUERY_NAMES = ["GetVisibleAreaPlaces"];

export const queryRequiresAuthentication = (req: Request) => {
  try {
    const requestQuery = (req.body as any)?.query;

    if (requestQuery) {
      // Convert the raw incoming GraphQL query string into a data type GraphQL can parse
      const parsedQuery = parse(requestQuery);

      // Further parse the query by converting it to an Operation Abstract Syntax Tree
      // object for extracting the specific query name
      const operationAST = getOperationAST(parsedQuery, null);

      if (operationAST && operationAST.name) {
        return !PUBLIC_QUERY_NAMES.includes(operationAST.name.value);
      }

      throw new Error("GraphQL query does not have a name");
    }
  } catch (error) {
    console.error(error);
    throw new GraphQLError("Could not parse GraphQL query");
  }
};
