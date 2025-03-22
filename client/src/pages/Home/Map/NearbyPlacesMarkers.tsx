import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, useMap, Popup, useMapEvent } from "react-leaflet";
import L, { DivIconOptions } from "leaflet";
import "./marker.css";

import {
  useGetVisibleAreaPlacesGraphQLQuery,
  // useGetVisibleAreaPlacesQuery,
} from "src/app/api/places";
import { useAppDispatch, useAppSelector } from "src/app/store";
import {
  setSelectedPlace,
  setBoundingBoxCoordinates,
  setSelectedPlaceMovedOutOfView,
} from "src/pages/logged-in-pages/Location/placeSlice";
import { Place } from "src/pages/logged-in-pages/Location/types";
import { useOpenSelectedMarkerPopup } from "./useOpenSelectedMarkerPopup";
import SavedPlacePopup from "./SavedPlacePopup";
import { setZoomAndCenterPoint } from "src/pages/Home/Map/UserLocation/userLocationSlice";

import PlaceIcon from "@mui/icons-material/Place";

const NearbyPlacesMarkers: React.FC = () => {
  const dispatch = useAppDispatch();

  const selectedPlace = useAppSelector((state) => state.place.selectedPlace);
  const selectedPlaceMovedOutOfView = useAppSelector(
    (state) => state.place.selectedPlaceMovedOutOfView
  );
  const swBoundsCoordinate = useAppSelector(
    (state) => state.place.swBoundsCoordinate
  );
  const neBoundsCoordinate = useAppSelector(
    (state) => state.place.neBoundsCoordinate
  );

  // Note that in the case of an error, an error message is shown in
  // client/src/pages/Home/PlacesList.tsx as this hook is called at the
  // same time in the same way in both of these components
  // const { data: places } = useGetVisibleAreaPlacesQuery(
  //   { ne: neBoundsCoordinate!, sw: swBoundsCoordinate! },
  //   {
  //     skip: !neBoundsCoordinate || !swBoundsCoordinate,
  //   }
  // );

  const { data: places } = useGetVisibleAreaPlacesGraphQLQuery(
    { ne: neBoundsCoordinate!, sw: swBoundsCoordinate! },
    {
      skip: !neBoundsCoordinate || !swBoundsCoordinate,
    }
  );

  const map = useMap();
  const popupRefs = useOpenSelectedMarkerPopup(places);

  const loadPlaces = () => {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const zoom = map.getZoom();
    const { lat, lng } = map.getCenter();

    // Note that this triggers useGetVisibleAreaPlacesQuery() above
    dispatch(
      setBoundingBoxCoordinates({
        ne: { lat: ne.lat, lng: ne.lng },
        sw: { lat: sw.lat, lng: sw.lng },
      })
    );

    dispatch(setZoomAndCenterPoint({ zoom, centerPoint: { lat, lng } }));
  };

  useEffect(() => {
    if (map) {
      loadPlaces();
    }

    return () => {
      dispatch(setSelectedPlace(null));
      dispatch(setBoundingBoxCoordinates({ ne: null, sw: null }));
    };
  }, [map]);

  useMapEvent("moveend", loadPlaces);

  const onMarkerClick = (place: Place) => {
    if (place.id !== selectedPlace?.id) {
      dispatch(setSelectedPlaceMovedOutOfView(false));
    }

    dispatch(setSelectedPlace(place));
  };

  if (places) {
    const divIconProps: DivIconOptions = {
      iconSize: [45, 61],
      iconAnchor: [23, 45],
      popupAnchor: [2, -40],
      className: "place-icon",
      html: `<div class="place-icon-selected">${ReactDOMServer.renderToString(
        <PlaceIcon fontSize="large" />
      )}</div>`,
    };

    return (
      <>
        {selectedPlace && selectedPlaceMovedOutOfView && (
          <Marker
            key={selectedPlace.id}
            position={[selectedPlace.lat, selectedPlace.lng]}
            icon={L.divIcon(divIconProps)}
          >
            <Popup position={[selectedPlace.lat, selectedPlace.lng]}>
              <SavedPlacePopup place={selectedPlace} />
            </Popup>
          </Marker>
        )}
        {places.map((place) => {
          const markerIcon = L.divIcon({
            ...divIconProps,
            html: `<div class="${
              place.id === selectedPlace?.id
                ? "place-icon-selected"
                : "place-icon-not-selected"
            }">${ReactDOMServer.renderToString(
              <PlaceIcon fontSize="large" />
            )}</div>`,
          });

          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onMarkerClick(place),
              }}
            >
              <Popup
                position={[place.lat, place.lng]}
                ref={popupRefs[place.id]}
              >
                <SavedPlacePopup place={place} />
              </Popup>
            </Marker>
          );
        })}
      </>
    );
  }

  return null;
};

export default NearbyPlacesMarkers;
