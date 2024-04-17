import DataLoader from "dataloader";
import { GraphQLError } from "graphql";

// DataLoader's loadMany() returns an array of either the successfully resolved
// value or an Error if a value failed to resolve. So need to throw any encountered
// errors.
export const safeLoadMany = async <K, V>(
  loader: DataLoader<K, V>,
  keys: K[]
): Promise<V[]> => {
  const results = await loader.loadMany(keys);

  return results.map((result) => {
    if (result instanceof Error) {
      // Log the error or handle it as needed
      console.error("Error loading data:", result);
      throw new GraphQLError(result.message);
    }
    return result;
  });
};
