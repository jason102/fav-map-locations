import React from "react";
import { useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

interface Props {
  onRightClickLongPress: (e: LeafletMouseEvent) => void;
}

const MapEvents: React.FC<Props> = ({ onRightClickLongPress }) => {
  useMapEvents({
    // contextmenu() can be used for right clicks and long-presses
    async contextmenu(e) {
      onRightClickLongPress(e);
    },
  });

  // useMapEvents() has to be in a child component of MapContainer
  // https://stackoverflow.com/a/71647394
  return null;
};

export default MapEvents;
