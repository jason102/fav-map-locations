import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import http from "http";

import { setupChatWebsockets } from "setupChatWebsockets";

import { errorHandler } from "middleware/errorHandler";

import registerRoute from "routes/auth/register";
import loginRoute from "routes/auth/login";
import logoutRoute from "routes/auth/logout";
import refreshTokenRoute from "routes/auth/refreshToken";

import userDetailsRoute from "routes/profile/user";

import addFavoriteRoute from "routes/places/addFavorite";
import getVisibleAreaPlacesRoute from "routes/places/getVisibleAreaPlaces";
import getPlaceDetailsRoute from "routes/places/getPlaceDetails";
import ratePlaceRoute from "routes/places/ratePlace";
import removePlaceRoute from "routes/places/removePlace";

import getPhotosRoute from "routes/photos/getPhotos";
import addPhotosRoute from "routes/photos/addPhotos";
import deletePhotoRoute from "routes/photos/deletePhoto";

dotenv.config();

const app = express();
app.use(express.json());

// Request header middleware
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: process.env.URL || "http://localhost:5173", // TODO: Replace with process.env.LOCALHOST_URL
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
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
  getVisibleAreaPlacesRoute,
  addFavoriteRoute,
  getPlaceDetailsRoute,
  ratePlaceRoute,
  removePlaceRoute,
]);

app.use("/api/photos", [getPhotosRoute, addPhotosRoute, deletePhotoRoute]);

app.use(errorHandler);

const server = http.createServer(app);

setupChatWebsockets(server);

server.listen(process.env.PORT, () => {
  console.log(`Hola, Server listening on ${process.env.PORT}`);
});
