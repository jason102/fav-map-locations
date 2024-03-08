import React, { useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "src/app/store";
import { Place } from "src/pages/logged-in-pages/Location/types";

export const useScrollToCard = (places?: Place[]) => {
  const selectedPlace = useAppSelector((state) => state.place.selectedPlace);
  const selectedPlaceMovedOutOfView = useAppSelector(
    (state) => state.place.selectedPlaceMovedOutOfView
  );

  const selectedPlaceAtTopOfList = useRef<HTMLDivElement | null>(null);

  const cardRefs = useMemo(
    () =>
      (places ?? []).reduce<{ [id: string]: React.RefObject<HTMLDivElement> }>(
        (accumulated, { id }) => ({ ...accumulated, [id]: React.createRef() }),
        {}
      ),
    [places]
  );

  // Scroll to a place selected in the list
  useEffect(() => {
    if (
      selectedPlace &&
      cardRefs[selectedPlace.id] &&
      !selectedPlaceMovedOutOfView
    ) {
      cardRefs[selectedPlace.id].current!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [cardRefs, selectedPlace, selectedPlaceMovedOutOfView]);

  // If the map is moved and the selected place's marker is no longer visible, it is moved to the top of the PlacesList
  // and therefore we should scroll to the top so it's still visible in the list.
  useEffect(() => {
    if (selectedPlaceMovedOutOfView) {
      selectedPlaceAtTopOfList.current!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedPlaceMovedOutOfView]);

  return { cardRefs, selectedPlaceAtTopOfList };
};
