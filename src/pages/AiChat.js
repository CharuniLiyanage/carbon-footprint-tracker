import { useState } from "react";
import "./AiChat.css";

function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://us-central1-carbontrack-bc947.cloudfunctions.net/chatAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          score: 50,
        }),
});

      const data = await res.json();

      const botMessage = {
        role: "bot",
        text: data.reply || "No response",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting AI ❌" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">

      <div className="chat-header">
        🤖 AI Eco Advisor
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "msg user" : "msg bot"}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="msg bot">Typing...</div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          placeholder="Ask about your carbon footprint..."
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default AiChat;