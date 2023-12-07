type GooglePlaceResultPhoto = {
  name: string;
  heightPx: number;
  widthPx: number;
  authorAttributions: {
    displayName: string;
    photoUri: string;
    uri: string;
  };
};

export type GooglePlaceResult = {
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  iconMaskBaseUri: string;
  photos?: GooglePlaceResultPhoto[];
  error?: { code: number; message: string; status: string };
};

type GooglePlacePhoto = GooglePlaceResultPhoto & { url: string };

export type GooglePlace = GooglePlaceResult & {
  placeId: string;
  icon: string;
  photos: GooglePlacePhoto[];
};

export type LocationLoaderData = {
  googlePlaceID: string;
};
