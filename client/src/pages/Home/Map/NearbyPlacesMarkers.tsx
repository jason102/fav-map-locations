import React, { useEffect } from "react";
import { useMapEvent, useMap } from "react-leaflet";
import { useLazyGetPlacesNearbyQuery } from "src/app/api";
// const markerIcon = L.icon({
//   iconSize: [25, 41],
//   iconAnchor: [10, 41],
//   popupAnchor: [2, -40],
//   iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
// });

const NearbyPlacesMarkers: React.FC = () => {
  const [dispatchGetPlacesNearby, { data, error, isError, isFetching }] =
    useLazyGetPlacesNearbyQuery();

  const map = useMap();

  const loadPlaces = async () => {
    const { lat, lng } = map.getCenter();
    await dispatchGetPlacesNearby({ lat, lng });
  };

  useEffect(() => {
    if (map) {
      loadPlaces();
    }
  }, [map]);

  useMapEvent("moveend", loadPlaces);

  return null;
};

export default NearbyPlacesMarkers;
