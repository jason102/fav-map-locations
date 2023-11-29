import { createBrowserRouter } from "react-router-dom";
import App from "src/App";
import ErrorPage from "src/pages/Error";
import HomePage from "src/pages/Home";
import AboutPage from "src/pages/About";
import LoginPage from "src/pages/logged-out-pages/Login";
import RegisterPage from "src/pages/logged-out-pages/Register";
import ProfilePage from "src/pages/logged-in-pages/Profile";
import LocationPage from "src/pages/logged-in-pages/Location";
import UnAuthenticatedRoute from "src/app/navigation/UnAuthenticatedRoute";
import PrivateRoute from "src/app/navigation/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "login",
            element: (
              <UnAuthenticatedRoute>
                <LoginPage />
              </UnAuthenticatedRoute>
            ),
          },
          {
            path: "register",
            element: (
              <UnAuthenticatedRoute>
                <RegisterPage />
              </UnAuthenticatedRoute>
            ),
          },
          {
            path: "location/:locationId",
            element: (
              <PrivateRoute>
                <LocationPage />
              </PrivateRoute>
            ),
          },
          {
            path: "profile/:username",
            element: (
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            ),
          },
          {
            path: "profile/:username/edit",
            element: (
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            ),
          },
          {
            path: "about",
            element: <AboutPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
