import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import registerRoute from "routes/auth/register";
import loginRoute from "routes/auth/login";
import logoutRoute from "routes/auth/logout";
import refreshTokenRoute from "routes/auth/refreshToken";
import userDetailsRoute from "routes/profile/user";
import addFavoriteRoute from "routes/places/addFavorite";
import getPlacesNearbyRoute from "routes/places/getPlacesNearby";
import getPlaceDetailsRoute from "routes/places/getPlaceDetails";
import addPhotosRoute from "routes/places/addPhotos";
import getPhotosRoute from "routes/places/getPhotos";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.URL || "http://localhost:5173", // TODO: Replace with process.env.LOCALHOST_URL
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, UserId",
  })
);

app.use(cookieParser());

app.use("/api/auth", [
  registerRoute,
  loginRoute,
  logoutRoute,
  refreshTokenRoute,
]);

app.use("/api/user", [userDetailsRoute]);

app.use("/api/places", [
  addFavoriteRoute,
  getPlacesNearbyRoute,
  getPlaceDetailsRoute,
  addPhotosRoute,
  getPhotosRoute,
]);

app.listen(process.env.PORT, () => {
  console.log(`Hola, Server listening on ${process.env.PORT}`);
});
