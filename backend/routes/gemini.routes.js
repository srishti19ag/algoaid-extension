import express from "express";
import { getHints, getSolution } from "../controllers/gemini.controller.js";

const router = express.Router();
router.post("/hints", getHints);
router.post("/solution", getSolution);

export default router;
