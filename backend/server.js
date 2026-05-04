const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("AI Backend Running ✅");
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Chat API
app.post("/chat", async (req, res) => {
  try {
    const { message, score } = req.body;

    const prompt = `
You are an eco-friendly AI assistant.

User carbon score: ${score}

User question: ${message}

Give short, clear, practical eco advice.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI failed",
    });
  }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});