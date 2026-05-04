import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

function AiAdvisor() {
  const [score, setScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "ecoScores"),
        where("email", "==", auth.currentUser.email)
      );

      const snap = await getDocs(q);
      const data = snap.docs.map(d => d.data());

      if (data.length === 0) {
        setAdvice("No data found. Start tracking your carbon footprint 🌱");
        return;
      }

      const latest = data[data.length - 1];
      setScore(latest.score);
      setHistory(data);

      generateSmartAdvice(latest.score, data);
    };

    loadData();
  }, []);

  // 🌱 SMART AI LOGIC (RULE ENGINE)
  const generateSmartAdvice = (score, data) => {
    const avg =
      data.reduce((sum, item) => sum + item.score, 0) / data.length;

    const trend = score - avg;

    let message = "";

    // 1. Score based logic
    if (score >= 80) {
      message = "🌟 Excellent! You are already a low-carbon lifestyle user.";
    } 
    else if (score >= 50) {
      message = "👍 Good progress! You can still reduce transport emissions.";
    } 
    else if (score >= 30) {
      message = "⚠ High carbon usage detected. Focus on electricity and transport.";
    } 
    else {
      message = "🚨 Critical impact! Immediate lifestyle changes are needed.";
    }

    // 2. Trend analysis (THIS MAKES IT FEEL LIKE AI)
    if (trend > 5) {
      message += "\n📈 Your score is improving recently. Keep going!";
    } 
    else if (trend < -5) {
      message += "\n📉 Your impact is increasing. Try reducing usage today.";
    } 
    else {
      message += "\n⚖ Your lifestyle is stable but can still improve.";
    }

    // 3. Extra intelligent rule
    if (data.length >= 5) {
      message += "\n🧠 Based on your history, small daily changes will give big improvement.";
    }

    setAdvice(message);
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>

      <h1>🤖 AI Eco Advisor</h1>

      {score !== null ? (
        <>
          <h2>🌍 Your Eco Score: {score}/100</h2>

          <div style={{
            marginTop: "20px",
            padding: "20px",
            background: "#e8f5e9",
            borderRadius: "12px",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            whiteSpace: "pre-line",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <p style={{ fontSize: "16px" }}>{advice}</p>
          </div>
        </>
      ) : (
        <p>Loading AI insights...</p>
      )}

    </div>
  );
}

export default AiAdvisor;