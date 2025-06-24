import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

export const getHints = async (req, res) => {
  const { title } = req.body;
  console.log("title:", title);
  const prompt = `
    You are an expert LeetCode assistant.
    Give 3 helpful hints (not the solution) for the problem titled: "${title}".
    Each hint should guide the user gently toward solving the problem.
    Format: 
    1. Hint one...
    2. Hint two...
    3. Hint three...
  `;
  try {
    const result = await model.generateContent([prompt]);
    const hints = result.response.text().trim();
    // return hints;
    res.json({ hints });
  } catch (err) {
    console.error("Gemini Hint Error:", err.message);
    res.status(500).json({ error: "Failed to get hints from Gemini" });
  }
};

export const getSolution = async (req, res) => {
  const { title, lang } = req.body;

  if (!title || !lang) {
    return res.status(400).json({ error: "Missing title or language" });
  }
  const prompt = `
    Provide the full, clean, and efficient code solution for the LeetCode problem titled: "${title}".
    Just return the code in a code block without any explanation in language: "${lang}".
  `;
  try {
    const result = await model.generateContent([prompt]);
    const solution = result.response.text().trim();
    res.json({ solution });
  } catch (err) {
    console.error("Gemini Solution Error:", err.message);
    res.status(500).json({ error: "Failed to get solution from Gemini" });
  }
};
