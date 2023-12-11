import React, { useState, useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import L, { LatLng } from "leaflet";

const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

const LocationMarker: React.FC = () => {
  const [position, setPosition] = useState<LatLng | null>(null);

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());

      const radius = e.accuracy;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
};

export default LocationMarker;
