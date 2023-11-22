import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/db-connection";
import dotenv from "dotenv";

dotenv.config();
const db = setupDatabase();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hola, from My template ExpressJS with React-Vite" });
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
