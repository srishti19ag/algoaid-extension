import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoutes from "./routes/gemini.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/gemini", geminiRoutes);

app.listen(5000, () => console.log("Server is running on port 5000"));
