import { useState, useEffect, useRef } from "react";
import { PlaceId } from "./types";
import { useAppSelector } from "src/app/store";

// We shoudn't use RTK Query for downloading large files
// https://github.com/reduxjs/redux-toolkit/issues/1545
export const useDownloadPhotos = (placeId?: PlaceId) => {
  const userToken = useAppSelector((state) => state.auth.userToken);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [images, setImages] = useState<string[]>([]);
  const [isFetchingImages, setIsFetchingImages] = useState(false);

  // React.StrictMode rerenders the app twice in dev mode
  const firstRender = useRef(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsFetchingImages(true);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/places/getPhotos?placeId=${placeId}`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
              userid: userToken?.userId || "",
            },
          }
        );

        // TODO: Handle response.ok for all fetch requests

        const base64Images: string[] = await response.json();

        const images = base64Images.map(
          (base64) => `data:image/jpeg;base64,${base64}`
        );

        setImages(images);
      } catch (error) {
        // TODO: Better error handling
        console.log("useDownloadPhotos() error: ", error);
      } finally {
        setIsFetchingImages(false);
      }
    };

    if (firstRender.current && images.length === 0) {
      firstRender.current = false;
      fetchImages();
    }
  }, []);

  return { images, isFetchingImages };
};
