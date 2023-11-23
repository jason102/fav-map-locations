import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "src/app/store";
import theme from "src/theme";
import router from "src/app/navigation/clientRouter";
import RefreshTokensProvider from "src/app/RefreshTokensContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RefreshTokensProvider>
          <RouterProvider router={router} />
        </RefreshTokensProvider>
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>
);
