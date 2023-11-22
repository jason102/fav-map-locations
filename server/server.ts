import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/db-connection";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const db = setupDatabase();
const app = express();
app.use(cors());
app.use(express.json());

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

// app.post("/addContact", async (req, res) => {
//   try {
//     const newContact = {
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//       notes: req.body.notes,
//     };

//     const result = await db.query(
//       "INSERT INTO contacts(name, email, phone, notes) VALUES($1, $2, $3, $4) RETURNING *",
//       [newContact.name, newContact.email, newContact.phone, newContact.notes]
//     );

//     res.json(result.rows[0]);
//   } catch (e) {
//     console.log(e);

//     return res.status(400).json({ e });
//   }
// });

app.listen(process.env.PORT, () => {
  console.log(`Hola, Server listening on ${process.env.PORT}`);
});
