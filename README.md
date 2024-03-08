# Favorite Map Locations

This is a fullstack PERN (PostgreSQL Express.js React Node.js) TypeScript app that allows users to register accounts to favorite places on the map, upload pictures for them, and leave comments about the places.

View the project deployed online here: [https://favmaplocations.click/](https://favmaplocations.click/)

It is hosted using Amazon Web Services (AWS), including:

- Elastic Beanstalk/EC2 for the backend server, load balancing and monitoring
- RDS for the backend database
- S3 for storing frontend project code and place photo image files
- CloudFront for hosting the frontend code in S3
- Route 53 for domain name registration
- ACM Certificate Manager for HTTPS certificates
- IAM for security rules among AWS services

### Frontend libraries and services:

| Dependency                                                               | Description                                                                                              |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| [Vite](https://vitejs.dev/)                                              | Frontend project tooling                                                                                 |
| [Material UI (MUI)](https://mui.com/)                                    | Gives the app its look and feel                                                                          |
| [Redux Toolkit and RTK Query](https://redux-toolkit.js.org/)             | Global state management and API/caching management                                                       |
| [React Router](https://reactrouter.com/en/main)                          | Client-side routing and navigation                                                                       |
| [React Hook Form](https://react-hook-form.com/)                          | Form management and field validation                                                                     |
| [Leaflet.js](https://leafletjs.com/)                                     | Renders an interactive [OpenStreetMap.org (OSM)](https://www.openstreetmap.org/) map                     |
| [OSM Nominatim](https://nominatim.org/release-docs/develop/api/Reverse/) | Reverse geocoding service to get place info when the user right-clicks on the map                        |
| [Client Socket.IO](https://socket.io/)                                   | Client side WebSocket connection management for the place details page chat widget                       |
| [Chatscope](https://chatscope.io/)                                       | UI chat widget building block components and client side "engine" for the place details page chat widget |
| [Compressor.js](https://fengyuanchen.github.io/compressorjs/)            | Helps resize and compress place image files for upload                                                   |
| [React Slick](https://react-slick.neostack.com/)                         | Image carousel widget to display place photos                                                            |

### Backend libraries and services:

| Dependency                                                    | Description                                                                                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js)          | Hashes account passwords for being securely stored in the database                                                     |
| [express-validator](https://express-validator.github.io/docs) | Express.js route validation and sanitization                                                                           |
| [helmet.js](https://helmetjs.github.io/)                      | Helps with setting secure HTTP response headers                                                                        |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)    | JSON web token creation and validation for secure login sessions                                                       |
| [multer](https://github.com/expressjs/multer)                 | Multipart/form data handling for image file uploads to AWS S3 using [multer-s3](https://github.com/anacronw/multer-s3) |
| [Server Socket.IO](https://socket.io/)                        | Server side WebSocket connection management for the place details page chat widget                                     |
| [Knex.js](https://knexjs.org/)                                | Database migrations management                                                                                         |

## Designs

Some preliminary designs for the app can be found in the `designs` folder.

## Run the project locally

The app is divided into two sub projects: the client (frontend) and the server (backend). Originally both projects used `pnpm` for improved dependency management efficiency but later `pnpm` was switched out for `npm` in the backend project for streamlined use with AWS Elastic Beanstalk deployments, which as of this writing didn't support `pnpm` out of the box. Download and install `pnpm` for the frontend project here: [https://pnpm.io/installation](https://pnpm.io/installation)

This project was developed using Node version 20.5.0.

1. Clone the project.
2. Install dependencies: `cd` into the `client` folder and run `pnpm install` and then in the `server` folder run `npm install`.
3. Register or set up an AWS account with a private access control list (ACL) S3 bucket available for storing the place photos.
4. Set up the database in Postgres. Create a database named `fav_map_locations`, connect to it, and then create an extension for `uuid-ossp`:

```
CREATE DATABASE fav_map_locations;

-- Enable the uuid_generate_v4() function
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

5. Configure the backend project environment variables by creating a `.env` file at the top level of the `server` folder and adding to it the following:

```
LOCALHOST_DATABASE_URL=<Postgres database URL including the Postgres username, password, domain, port, and database name in the localhost environment>
DATABASE_USERNAME=<Database username>
DATABASE_PASSWORD=<Database password (leave blank if none)>
PORT=<Port the server should listen to requests on like 8080>
LOCALHOST_URL=<URL where the frontend is hosted for the CORS configuration, such as http://localhost:5173/>
ACCESS_TOKEN_SECRET=<JSON web token access token secret. For development purposes you can provide any string here.>
REFRESH_TOKEN_SECRET=<JSON web token refresh token secret. For development purposes you can provide any string here.>
AWS_ACCESS_KEY_ID=<AWS account access key ID>
AWS_SECRET_ACCESS_KEY=<AWS account secret access key>
AWS_REGION=<As named like us-east-1>
AWS_S3_BUCKET_NAME=<As named like fav-map-locations-photos>
```

Replace all items above in `<>` tags with your own information.

6. Configure the frontend environment variables. Create two files at the top level of the `client` folder called `.env.local` and `.env.production` and add to them the following:

```
VITE_BASE_URL=<URL where the backend is hosted like http://localhost:8080 for the .env.local environment>
```

Replace the content with `<>` tags with your own information. `.env.local` is for the localhost environment and `.env.production` is for the production environment.

7. Set up the backend database tables using Knex for migrations by running `npx knex migrate:latest` at the top level of the server folder. The migration scripts located at `server/migrations` will be run. This command must be run anytime there are new commits that change the database to keep everyone's databases in sync.

8. Both backend and frontend projects are run at the same time using [concurrently](https://github.com/open-cli-tools/concurrently). At the top level of the `server` folder, run `pnpm run dev` to run both projects. You should then be able to open the app in a new web browser tab or window with the `LOCALHOST_URL` configured above.
