import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
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
    origin: process.env.URL || "http://localhost:5173",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, UserId",
  })
);

app.use(cookieParser());

// For serving the static files from the React build directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the path to the React application's build directory. This assumes that the production-ready frontend code
// is located in the 'client/dist' directory, which is a common convention for React applications.
const REACT_BUILD_DIR = path.join(__dirname, "..", "client", "dist");

// Serve the static files from the React build directory. This middleware enables the Express server to
// serve the optimized, production build of the React app, including HTML, CSS, JavaScript, and any other static assets.
app.use(express.static(REACT_BUILD_DIR));

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(REACT_BUILD_DIR, "index.html"));
});

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
