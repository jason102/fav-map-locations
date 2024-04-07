import DataLoader from "dataloader";

import getUserDetails, { UserDetails } from "graphqlApi/loaders/getUserDetails";

// We need to make new DataLoader instances per incoming request according to what
// is recommended by the docs for this library
export const getLoaders = () => ({
  userDetailsLoader: new DataLoader<string, UserDetails>(getUserDetails),
});
