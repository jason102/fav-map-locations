import React, { useEffect, useRef } from "react";
import { Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/app/store";
import getGooglePlace from "src/pages/logged-in-pages/Location/getGooglePlaceThunk";
import { GooglePlace } from "src/pages/logged-in-pages/Location/types";

const Map: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // TODO: Change the position to be based on the user's location?
  const position = { lat: 37.65516454947692, lng: -122.49232708106909 };
  const map = useMap();

  // TODO: Figure out how to instead use the InfoWindow component from @vis.gl/react-google-maps
  // When I tried it originally, I couldn't get the info window to appear
  const infoWindow = useRef<google.maps.InfoWindow>();

  const onDetailsButtonClick = ({ placeId }: GooglePlace) => {
    navigate(`location/${placeId}`);
  };

  const getInfoWindowContent = (place: GooglePlace) => {
    const infoWindowContentDiv = document.createElement("div");
    infoWindowContentDiv.id = "infowindow-content";

    const placeIconImage = document.createElement("img");
    placeIconImage.id = "place-icon";
    placeIconImage.src = place.icon;
    placeIconImage.height = 16;
    placeIconImage.width = 16;
    infoWindowContentDiv.appendChild(placeIconImage);

    const placeNameSpan = document.createElement("span");
    placeNameSpan.id = "place-name";
    placeNameSpan.innerHTML = place.displayName.text;
    infoWindowContentDiv.appendChild(placeNameSpan);

    infoWindowContentDiv.appendChild(document.createElement("br"));

    const placeDescription = document.createElement("span");
    placeDescription.id = "place-description";
    placeDescription.innerHTML = place.formattedAddress;
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
    placeDetailsButton.onclick = () => onDetailsButtonClick(place);
    buttonContainer.appendChild(placeDetailsButton);

    infoWindowContentDiv.appendChild(buttonContainer);

    return infoWindowContentDiv;
  };

  useEffect(() => {
    const setupMapClickListener = () => {
      if (map) {
        infoWindow.current = new google.maps.InfoWindow({
          pixelOffset: new google.maps.Size(0, -26),
        });

        map.addListener(
          "click",
          async (
            event: google.maps.MapMouseEvent | google.maps.IconMouseEvent
          ) => {
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

              const {
                meta: { requestStatus },
                payload,
              } = await dispatch(getGooglePlace({ placeId: event.placeId }));

              if (requestStatus === "fulfilled") {
                const place = payload as GooglePlace;
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
          }
        );
      }
    };

    setupMapClickListener();
  }, [map]);

  return <GoogleMap center={position} zoom={15}></GoogleMap>;
};

export default Map;
