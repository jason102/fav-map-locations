import React from "react";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";

import PageHeader from "src/components/PageHeader";

const About: React.FC = () => {
  const ListRow = ({ children }: { children: React.ReactNode }) => (
    <ListItem sx={{ display: "list-item", py: 0, px: 0.5 }}>
      <ListItemText>{children}</ListItemText>
    </ListItem>
  );

  const DependencyTable = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <>
      <Typography sx={{ mt: 3, mb: 1 }}>{title}</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Dependency</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const DependencyRow = ({
    href,
    name,
    children,
  }: {
    href: string;
    name: string;
    children: React.ReactNode;
  }) => (
    <TableRow>
      <TableCell>
        <Link target="_blank" href={href}>
          {name}
        </Link>
      </TableCell>
      <TableCell>{children}</TableCell>
    </TableRow>
  );

  return (
    <Container component="main">
      <Paper variant="elevation" elevation={16} sx={{ mt: 3, borderRadius: 2 }}>
        <PageHeader title="About Favorite Map Locations" />
        <Box sx={{ px: 3, pb: 3 }}>
          <Divider variant="fullWidth" sx={{ mb: 5 }} />
          <Typography>
            Welcome to my GitHub portfolio project demo app Favorite Map
            Locations!
          </Typography>
          <Typography sx={{ pt: 2 }}>
            This is a fullstack PERN (<b>PostgreSQL Express.js React Node.js</b>
            ) <b>TypeScript</b> app that allows users to register accounts to
            favorite places on the map, upload pictures for them, and leave
            comments about the places.
          </Typography>
          <Typography sx={{ pt: 2 }}>
            View the project source code here:{" "}
            <Link
              target="_blank"
              href="https://github.com/jason102/fav-map-locations/tree/feature/code-for-review"
            >
              https://github.com/jason102/fav-map-locations/tree/feature/code-for-review
            </Link>
          </Typography>
          <Typography sx={{ pt: 2 }}>
            My name is <b>Jason Stine</b> and you can contact me by email:{" "}
            <Link href="mailto:jason102@gmail.com">jason102@gmail.com</Link>
          </Typography>
          <Typography sx={{ pt: 2 }}>
            My GitHub page:{" "}
            <Link target="_blank" href="https://github.com/jason102">
              https://github.com/jason102
            </Link>
          </Typography>
          <Typography sx={{ pt: 2 }}>
            My LinkedIn profile:{" "}
            <Link target="_blank" href="https://www.linkedin.com/in/jstine/">
              https://www.linkedin.com/in/jstine/
            </Link>
          </Typography>
          <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>
            Remaining tasks to make the project more complete:
          </Typography>
          <List sx={{ listStyleType: "disc", mx: 3 }}>
            <ListRow>{"The My Profile page (current user's profile)"}</ListRow>
            <ListRow>
              {
                "Error pages (for example if you try to load the profile of a user that does not exist)"
              }
            </ListRow>
            <ListRow>
              {
                "Responsive design for mobile screen layouts (currently UX is best on desktop screens)"
              }
            </ListRow>
            <ListRow>
              {
                "Improve the UI appearance (most of it is still using MUI default styling)"
              }
            </ListRow>
            <ListRow>
              {
                "Unit tests for testing the code using Vitest and React Testing Library (frontend) and Jest/supertest (backend) (other projects on my GitHub page demonstrate this)"
              }
            </ListRow>
          </List>
          <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>
            Tech stack:
          </Typography>
          <Typography sx={{ pt: 2 }}>
            The app is hosted using <b>Amazon Web Services (AWS)</b>, including:
          </Typography>
          <List sx={{ listStyleType: "disc", mx: 3 }}>
            <ListRow>
              <b>Elastic Beanstalk/EC2</b> for the backend server, load
              balancing and monitoring
            </ListRow>
            <ListRow>
              <b>RDS</b> for the backend database
            </ListRow>
            <ListRow>
              <b>S3</b> for storing frontend project code and place photo image
              files
            </ListRow>
            <ListRow>
              <b>CloudFront</b> for hosting the frontend code in S3
            </ListRow>
            <ListRow>
              <b>Route 53</b> for domain name registration
            </ListRow>
            <ListRow>
              <b>ACM Certificate Manager</b> for HTTPS certificates
            </ListRow>
            <ListRow>
              <b>IAM</b> for security rules among AWS services
            </ListRow>
          </List>
          <DependencyTable title="Frontend libraries and services:">
            <DependencyRow href="https://vitejs.dev/" name="Vite">
              Frontend project tooling
            </DependencyRow>
            <DependencyRow href="https://mui.com/" name="Material UI (MUI)">
              Gives the app its look and feel
            </DependencyRow>
            <DependencyRow
              href="https://redux-toolkit.js.org/"
              name="Redux Toolkit and RTK Query"
            >
              Global state management and API/caching management
            </DependencyRow>
            <DependencyRow
              href="https://reactrouter.com/en/main"
              name="React Router"
            >
              Client-side routing and navigation
            </DependencyRow>
            <DependencyRow
              href="https://react-hook-form.com/"
              name="React Hook Form"
            >
              Form management and field validation
            </DependencyRow>
            <DependencyRow href="https://leafletjs.com/" name="Leaflet.js">
              Renders an interactive{" "}
              <Link target="_blank" href="https://www.openstreetmap.org/">
                OpenStreetMap.org (OSM)
              </Link>{" "}
              map
            </DependencyRow>
            <DependencyRow
              href="https://nominatim.org/release-docs/develop/api/Reverse/"
              name="OSM Nominatim"
            >
              Reverse geocoding service to get place info when the user
              right-clicks on the map
            </DependencyRow>
            <DependencyRow href="https://socket.io/" name="Client Socket.IO">
              Client side WebSocket connection management for the place details
              page chat widget
            </DependencyRow>
            <DependencyRow href="https://chatscope.io/" name="Chatscope">
              UI chat widget building block components and client side "engine"
              for the place details page chat widget
            </DependencyRow>
            <DependencyRow
              href="https://fengyuanchen.github.io/compressorjs/"
              name="Compressor.js"
            >
              Helps resize and compress place image files for upload
            </DependencyRow>
            <DependencyRow
              href="https://react-slick.neostack.com/"
              name="React Slick"
            >
              Image carousel widget to display place photos
            </DependencyRow>
          </DependencyTable>
          <DependencyTable title="Backend libraries and services:">
            <DependencyRow
              href="https://github.com/kelektiv/node.bcrypt.js"
              name="bcrypt"
            >
              Hashes account passwords for being securely stored in the database
            </DependencyRow>
            <DependencyRow
              href="https://express-validator.github.io/docs"
              name="express-validator"
            >
              Express.js route validation and sanitization
            </DependencyRow>
            <DependencyRow href="https://helmetjs.github.io/" name="helmet.js">
              Helps with setting secure HTTP response headers
            </DependencyRow>
            <DependencyRow
              href="https://github.com/auth0/node-jsonwebtoken"
              name="jsonwebtoken"
            >
              JSON web token creation and validation for secure login sessions
            </DependencyRow>
            <DependencyRow
              href="https://github.com/expressjs/multer"
              name="multer"
            >
              Multipart/form data handling for image file uploads to AWS S3
              using{" "}
              <Link
                target="_blank"
                href="https://github.com/anacronw/multer-s3"
              >
                multer-s3
              </Link>
            </DependencyRow>
            <DependencyRow href="https://socket.io/" name="Server Socket.IO">
              Server side WebSocket connection management for the place details
              page chat widget
            </DependencyRow>
            <DependencyRow href="https://knexjs.org/" name="Knex.js">
              Database migrations management
            </DependencyRow>
          </DependencyTable>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;
