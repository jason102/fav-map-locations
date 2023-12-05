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

  const getInfoWindowContent = (place: google.maps.places.PlaceResult) => {
    const infoWindowContentDiv = document.createElement("div");
    infoWindowContentDiv.id = "infowindow-content";

    const placeIconImage = document.createElement("img");
    placeIconImage.id = "place-icon";
    placeIconImage.src = place.icon as string;
    placeIconImage.height = 16;
    placeIconImage.width = 16;
    infoWindowContentDiv.appendChild(placeIconImage);

    const placeNameSpan = document.createElement("span");
    placeNameSpan.id = "place-name";
    placeNameSpan.innerHTML = place.name as string;
    infoWindowContentDiv.appendChild(placeNameSpan);

    infoWindowContentDiv.appendChild(document.createElement("br"));

    const placeDescription = document.createElement("span");
    placeDescription.id = "place-description";
    placeDescription.innerHTML = place.formatted_address as string;
    infoWindowContentDiv.appendChild(placeDescription);

    infoWindowContentDiv.appendChild(document.createElement("br"));

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "place-details-button-container";
    buttonContainer.setAttribute(
      "style",
      "display: flex; justify-content: center; padding-top: 10px"
    );

    const placeDetailsButton = document.createElement("button");
    placeDetailsButton.id = "place-details-button";
    placeDetailsButton.innerHTML = "Details";
    placeDetailsButton.onclick = () => {
      console.log("clicked me!");
    };
    buttonContainer.appendChild(placeDetailsButton);

    infoWindowContentDiv.appendChild(buttonContainer);

    return infoWindowContentDiv;
  };

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
          infoWindow.current!.setContent(getInfoWindowContent(place));
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
