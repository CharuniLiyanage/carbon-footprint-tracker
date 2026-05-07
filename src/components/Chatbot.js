import { useState } from "react";
import "./Chatbot.css";
import { carbonAssistant } from "../ai/carbonAssistant";

function Chatbot({ history, goal, total, score }) {
  const [answer, setAnswer] = useState(null);

  const data = { history, goal, total, score };

  const questions = [
    { key: "score", label: "📊 My Eco Score" },
    { key: "goal", label: "🎯 My Goal Status" },
    { key: "history", label: "📜 My History" },
    { key: "trend", label: "📈 My Progress Trend" },
    { key: "improve", label: "🌱 How to Improve" },
    { key: "overview", label: "ℹ️ What is this?" },
  ];

  const handleClick = (key) => {
    const res = carbonAssistant(key, data);
    setAnswer(res);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>CarbonTrack Assistant</h3>
        <p>Click a question to get insights</p>
      </div>

      <div className="chat-body">
        {/* QUESTIONS */}
        <div className="question-panel">
          {questions.map((q) => (
            <button
              key={q.key}
              className="question-btn"
              onClick={() => handleClick(q.key)}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* ANSWER */}
        <div className="answer-panel">
          {answer ? (
            <>
              <h4>{answer.title}</h4>
              <p>{answer.body}</p>
            </>
          ) : (
            <p className="placeholder">
              Select a question to see details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatbot;