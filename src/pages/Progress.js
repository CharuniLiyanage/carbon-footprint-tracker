import { useState } from "react";
import "./Progress.css";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Progress() {
  const [data] = useState([
    { day: "Mon", score: 60 },
    { day: "Tue", score: 70 },
    { day: "Wed", score: 50 },
    { day: "Thu", score: 80 },
    { day: "Fri", score: 65 },
    { day: "Sat", score: 75 },
    { day: "Sun", score: 85 },
  ]);

  const avg =
    Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length);

  return (
    <div className="progress">

      <h1>📈 Progress</h1>

      <div className="summary">
        <h3>Average Score</h3>
        <p>{avg} / 100</p>
      </div>

      <div className="list">
        {data.map((d, i) => (
          <div key={i} className="item">
            <span>{d.day}</span>
            <span>{d.score}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Progress;