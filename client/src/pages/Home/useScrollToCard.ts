import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "src/app/store";
import { Place } from "src/pages/logged-in-pages/Location/types";

export const useScrollToCard = (places?: Place[]) => {
  const selectedPlace = useAppSelector((state) => state.location.selectedPlace);

  const cardRefs = useMemo(
    () =>
      (places ?? []).reduce<{ [id: string]: React.RefObject<HTMLDivElement> }>(
        (accumulated, { id }) => ({ ...accumulated, [id]: React.createRef() }),
        {}
      ),
    [places]
  );

  useEffect(() => {
    if (selectedPlace && cardRefs[selectedPlace.id]) {
      cardRefs[selectedPlace.id].current!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedPlace]);

  return cardRefs;
};
