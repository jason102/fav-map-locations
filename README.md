# Favorite Map Locations

This is a fullstack PERN (PostgreSQL Express.js React Node.js) TypeScript app that allows users to favorite places on the map, upload pictures for them, and leave comments about the places. The app uses JSON web tokens and cookies for secure login user sessions and authentication.

The frontend uses [Material UI](https://mui.com/), [Redux Toolkit and RTK Query](https://redux-toolkit.js.org/) for state and API/caching management, [React Router](https://reactrouter.com/en/main) for client side routing, and [Leaflet](https://leafletjs.com/) to render an [OpenStreetMap.org](https://www.openstreetmap.org/) map.

The backend connects to Amazon Web Services (AWS) for hosting purposes including using an S3 bucket to store place image files. It uses [bcrypt](https://github.com/dcodeIO/bcrypt.js) to hash user account passwords in the database securely as well as has API route middleware that manages JSON web tokens and cookies. [Knex](https://knexjs.org/) is used for database migrations.

Some preliminary designs for the app can be found in the `designs` folder.

## Run the project locally

The app is divided into two sub projects: the client (frontend) using [Vite](https://vitejs.dev/) and the server (backend). Both have their own set of dependencies that are managed using `pnpm` for improved efficiency. Download and install it here: https://pnpm.io/installation

As of the time of this writing, I developed this project using Node version 20.5.0.

1. Clone the project.
2. `cd` into both the `client` and `server` folders and run `pnpm install` to install the dependencies.
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
