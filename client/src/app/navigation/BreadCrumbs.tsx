import React from "react";
import { Link as RRDLink } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

interface Props {
  currentPage: string;
  [key: string]: any;
}

const BreadCrumbs: React.FC<Props> = ({ currentPage, ...restProps }) => (
  <Box sx={{ display: "flex", flexDirection: "row", mt: 1, ...restProps }}>
    <Link component={RRDLink} to="/" mr={0.8}>
      Home
    </Link>
    <Typography>{` > ${currentPage}`}</Typography>
  </Box>
);

export default BreadCrumbs;
