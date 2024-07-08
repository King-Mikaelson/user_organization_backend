import express from "express";
const app = express();
const port = 6000;
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import organisationRoutes from "./routes/organisationRoutes.ts";

app.use(express.static("static"));
app.use(morgan("dev"));
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1gb" }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Use the router
app.use(`/auth`, authRoutes);
app.use(`/users`, userRoutes);
app.use(`/organisations`, organisationRoutes);

/**
 * app.[method]([route], [route handler])
 */
app.get("/api", (req, res) => {
  res.send("Hello, Vercel!");
});


// creates and starts a server for our API on a defined port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export { app };
