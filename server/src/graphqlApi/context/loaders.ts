import DataLoader from "dataloader";

import getUserDetails, { UserDetails } from "graphqlApi/loaders/getUserDetails";

export const loaders = {
  userDetailsLoader: new DataLoader<string, UserDetails>(getUserDetails),
};
