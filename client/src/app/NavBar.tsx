import React from "react";
import { Link as RRDLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar/AppBar";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import Link from "@mui/material/Link/Link";
import Button from "@mui/material/Button/Button";

const NavBar: React.FC = () => (
  <AppBar
    position="static"
    color="default"
    elevation={0}
    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <Toolbar sx={{ flexWrap: "wrap" }}>
      <Link
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
        component={RRDLink}
        to={"/"}
        underline="none"
      >
        Favorite Map Locations!
      </Link>
      <nav>
        <Link
          variant="button"
          color="text.primary"
          sx={{ my: 1, mx: 1.5 }}
          component={RRDLink}
          to={"about"}
        >
          About
        </Link>
        <Link
          variant="button"
          color="text.primary"
          sx={{ my: 1, mx: 1.5 }}
          component={RRDLink}
          to={"profile"}
        >
          My Profile
        </Link>
      </nav>
      <Button
        variant="contained"
        sx={{ my: 1, mx: 1.5 }}
        component={RRDLink}
        to={"login"}
      >
        Login
      </Button>
    </Toolbar>
  </AppBar>
);

export default NavBar;
