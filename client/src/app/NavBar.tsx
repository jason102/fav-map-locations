import React from "react";
import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
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
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        Favorite Map Locations!
      </Typography>
      <nav>
        <NavLink to={"about"}>
          <Link variant="button" color="text.primary" sx={{ my: 1, mx: 1.5 }}>
            About
          </Link>
        </NavLink>
        <NavLink to={"profile"}>
          <Link variant="button" color="text.primary" sx={{ my: 1, mx: 1.5 }}>
            My Profile
          </Link>
        </NavLink>
      </nav>
      <NavLink to={"login"}>
        <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>
          Login
        </Button>
      </NavLink>
    </Toolbar>
  </AppBar>
);

export default NavBar;
