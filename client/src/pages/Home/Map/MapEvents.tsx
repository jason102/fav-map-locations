import React from "react";
import { useMapEvents } from "react-leaflet";
import { useAppDispatch } from "src/app/store";
import reverseGeocode from "src/pages/logged-in-pages/Location/reverseGeocode";

const MapEvents: React.FC = () => {
  const dispatch = useAppDispatch();

  useMapEvents({
    // contextmenu() can be used for right clicks and long-presses
    async contextmenu(e) {
      await dispatch(reverseGeocode(e.latlng));
    },
  });

  // useMapEvents() has to be in a child component of MapContainer
  // https://stackoverflow.com/a/71647394
  return null;
};

export default MapEvents;
