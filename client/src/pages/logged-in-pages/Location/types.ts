export type GooglePlacePhoto = {
  name: string;
  heightPx: number;
  widthPx: number;
  authorAttributions: {
    displayName: string;
    photoUri: string;
    uri: string;
  };
  url: string;
};

export type GooglePlace = {
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  iconMaskBaseUri: string;
  placeId: string;
  icon: string;
  photos: GooglePlacePhoto[];
  error?: { code: number; message: string; status: string };
};

export type LocationLoaderData = {
  googlePlaceID: string;
};
