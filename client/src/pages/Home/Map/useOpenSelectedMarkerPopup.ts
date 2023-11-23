import React, { useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import { Popup } from "leaflet";
import { useAppSelector } from "src/app/store";
import { Place } from "src/pages/logged-in-pages/Location/types";

export const useOpenSelectedMarkerPopup = (places?: Place[]) => {
  const selectedPlace = useAppSelector((state) => state.place.selectedPlace);

  const map = useMap();

  const popupRefs = useMemo(
    () =>
      (places ?? []).reduce<{ [id: string]: React.RefObject<Popup> }>(
        (accumulated, { id }) => ({ ...accumulated, [id]: React.createRef() }),
        {}
      ),
    [places]
  );

  useEffect(() => {
    if (selectedPlace && popupRefs[selectedPlace.id]) {
      popupRefs[selectedPlace.id].current!.openOn(map);
    }
  }, [selectedPlace]);

  return popupRefs;
};
