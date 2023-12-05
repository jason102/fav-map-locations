import React, { useEffect, useRef } from "react";
import {
  Map as GoogleMap,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

const Map: React.FC = () => {
  // TODO: Change the position to be based on the user's location?
  const position = { lat: 37.65516454947692, lng: -122.49232708106909 };
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  // TODO: Figure out how to instead use the InfoWindow component from @vis.gl/react-google-maps
  // When I tried it originally, I couldn't get the info window to appear
  const infoWindow = useRef<google.maps.InfoWindow>();

  const onPoiClick = (
    placeId: string,
    placesService: google.maps.places.PlacesService
  ) => {
    placesService.getDetails(
      { placeId },
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === "OK" && place) {
          infoWindow.current!.setContent(
            `<div id="infowindow-content">
              <img id="place-icon" src="${place.icon}" height="16" width="16" />
              <span id="place-name">${place.name}</span>
              <br />
              <span id="place-description">${place.formatted_address}</span>
            </div>`
          );
        } else {
          infoWindow.current!.setContent(
            `<div id="infowindow-content">
              Something went wrong.
              <br />
              Please try clicking on the place again.
            </div>`
          );
        }
      }
    );
  };

  useEffect(() => {
    if (map && placesLibrary) {
      const placesService = new placesLibrary.PlacesService(map);

      infoWindow.current = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, -26),
      });

      map.addListener(
        "click",
        (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
          infoWindow.current!.close();

          if ("placeId" in event && event.placeId !== null) {
            event.stop();

            infoWindow.current!.setPosition(event.latLng);
            infoWindow.current!.setContent(
              `<div id="infowindow-content">
                Loading...
              </div>`
            );
            infoWindow.current!.open(map);

            onPoiClick(event.placeId, placesService);
          }
        }
      );
    }
  }, [map, placesLibrary]);

  return <GoogleMap center={position} zoom={15}></GoogleMap>;
};

export default Map;
