import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";

import { setupChatWebsockets } from "websockets/setupChatWebsockets";
import getPaginatedChatMessagesRoute from "routes/getPaginatedChatMessages";

import { startGraphQLServer } from "graphqlApi";

import { errorHandler } from "middleware/errorHandler";
import { configureRequestHeaders } from "middleware/headers";

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

configureRequestHeaders(app);

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

app.use("/api/chatMessages", getPaginatedChatMessagesRoute);

app.use(errorHandler);

// TODO: Enable async await in this top level code, for now have to use callbacks
startGraphQLServer(app, () => {
  const server = http.createServer(app);

  setupChatWebsockets(server);

  server.listen(process.env.PORT, () => {
    console.log(`Hola, Server listening on ${process.env.PORT}`);
  });
});
