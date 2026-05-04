const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY",
});

exports.chatAI = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const {message, score} = req.body;

      const prompt = `
You are an eco AI assistant.
Eco Score: ${score}
User: ${message}
Give short eco advice.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{role: "user", content: prompt}],
      });

      res.json({
        reply: response.choices[0].message.content,
      });
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  });
});
