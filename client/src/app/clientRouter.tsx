import { createBrowserRouter } from "react-router-dom";
import App from "src/App";
import ErrorPage from "src/pages/Error";
import HomePage from "src/pages/Home";
import AboutPage from "src/pages/About";
import LoginPage from "src/pages/logged-out-pages/Login";
import RegisterPage from "src/pages/logged-out-pages/Register";
import ProfilePage from "src/pages/logged-in-pages/Profile";

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
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
          {
            path: "profile/:username",
            element: <ProfilePage />,
          },
          {
            path: "profile/:username/edit",
            element: <ProfilePage />,
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
