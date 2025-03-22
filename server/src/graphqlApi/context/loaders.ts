import DataLoader from "dataloader";

import getUserDetails, { UserDetails } from "graphqlApi/loaders/getUserDetails";
import getPlaces, { Place } from "graphqlApi/loaders/places";
import getAverageRating from "graphqlApi/loaders/averageRatings";
import getPlaceRatingsByUsers, {
  UserAndPlaceId,
} from "graphqlApi/loaders/placeRatingsByUsers";
import getUsernamesByUserIds from "graphqlApi/loaders/usernamesByUserIds";

// We need to make new DataLoader instances per incoming request according to what
// is recommended by the docs for this library
export const getLoaders = () => ({
  userDetailsLoader: new DataLoader<string, UserDetails>(getUserDetails),
  placesLoader: new DataLoader<string, Place>(getPlaces),
  averageRatingsLoader: new DataLoader<string, number>(getAverageRating),
  placeRatingsByUsersLoader: new DataLoader<UserAndPlaceId, number>(
    getPlaceRatingsByUsers
  ),
  usernamesByUserIdsLoader: new DataLoader<string, string>(
    getUsernamesByUserIds
  ),
});
