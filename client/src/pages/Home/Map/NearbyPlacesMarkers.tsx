import React, { useEffect } from "react";
import { useMapEvent, useMap } from "react-leaflet";
import { useGetPlacesNearbyQuery } from "src/app/api";
import { useAppDispatch, useAppSelector } from "src/app/store";
import { setMapCenter } from "src/pages/logged-in-pages/Location/locationSlice";
// const markerIcon = L.icon({
//   iconSize: [25, 41],
//   iconAnchor: [10, 41],
//   popupAnchor: [2, -40],
//   iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
// });

const NearbyPlacesMarkers: React.FC = () => {
  const dispatch = useAppDispatch();

  const mapCenter = useAppSelector((state) => state.location.mapCenter);
  const { data, error, isError, isFetching } = useGetPlacesNearbyQuery(
    mapCenter!,
    { skip: !mapCenter }
  );

  const map = useMap();

  const loadPlaces = () => {
    const { lat, lng } = map.getCenter();
    dispatch(setMapCenter({ lat, lng }));
  };

  useEffect(() => {
    if (map) {
      loadPlaces();
    }
  }, [map]);

  // useMapEvent("moveend", loadPlaces);

  return null;
};

export default NearbyPlacesMarkers;
