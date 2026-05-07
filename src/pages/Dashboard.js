import { useState, useEffect } from "react";
import "./Dashboard.css";
import Chatbot from "../components/Chatbot";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [transport, setTransport] = useState("");
  const [electricity, setElectricity] = useState("");
  const [goal, setGoal] = useState("");
  const [history, setHistory] = useState([]);

  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // =========================
  // AUTH + FIRESTORE STREAM
  // =========================
  useEffect(() => {
    let unsubFirestore;

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setHistory([]);
        return;
      }

      setUser(currentUser);

      const q = query(
        collection(db, "progress"),
        where("userId", "==", currentUser.uid)
      );

      unsubFirestore = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setHistory(data);
      });
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  // =========================
  // 🧠 ENTERPRISE AI ENGINE (IMPROVED)
  // =========================
  const carbonAIEngine = ({ transport, electricity, goal }) => {
    const transportCO2 = transport * 0.2;
    const electricityCO2 = electricity * 0.4;

    const totalValue = transportCO2 + electricityCO2;

    // smooth SaaS scoring curve
    let score = 100 / (1 + totalValue / 120);

    // goal intelligence
    let goalFactor = 1;

    if (goal > 0) {
      const ratio = totalValue / goal;

      if (ratio <= 0.7) goalFactor = 1.25;
      else if (ratio <= 1) goalFactor = 1.1;
      else if (ratio <= 1.5) goalFactor = 0.9;
      else goalFactor = 0.6;
    }

    score *= goalFactor;

    // level system
    let level = "Bronze";
    if (score >= 85) level = "Platinum";
    else if (score >= 70) level = "Gold";
    else if (score >= 50) level = "Silver";

    return {
      total: totalValue,
      score: Math.max(5, Math.min(100, Math.round(score))),
      level,
    };
  };

  // =========================
  // CALCULATE
  // =========================
  const calculate = async () => {
    if (!auth.currentUser) return alert("Login required");

    const result = carbonAIEngine({
      transport: parseFloat(transport) || 0,
      electricity: parseFloat(electricity) || 0,
      goal: parseFloat(goal) || 0,
    });

    const entry = {
      userId: auth.currentUser.uid,
      date: new Date().toISOString(),
      total: result.total,
      score: result.score,
      level: result.level,
    };

    await addDoc(collection(db, "progress"), entry);

    setTotal(result.total);
    setScore(result.score);

    setTransport("");
    setElectricity("");
  };

  // =========================
  // DELETE ENTRY
  // =========================
  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, "progress", id));
  };

  // =========================
  // SAFE DATE PARSER
  // =========================
  const parseDate = (d) => {
    if (!d) return new Date();
    return new Date(d.seconds ? d.seconds * 1000 : d);
  };

  // =========================
  // HISTORY VIEW
  // =========================
  const visibleHistory = showAll ? history : history.slice(0, 5);

  // =========================
  // CHART DATA
  // =========================
  const chartData = history
    .slice(0, 10)
    .reverse()
    .map((h) => ({
      date: parseDate(h.date).toLocaleDateString(),
      score: h.score,
    }));

  // =========================
  // GOAL LOGIC
  // =========================
  const goalValue = parseFloat(goal) || 0;
  const remaining = goalValue - total;
  const progressPercent =
    goalValue > 0 ? Math.min((total / goalValue) * 100, 100) : 0;

  return (
    <div className="dashboard">
      <h1>🏢 CarbonTrack Dashboard</h1>

      {user && <p>Welcome, {user.email}</p>}

      {/* INPUT */}
      <div className="form">
        <input
          placeholder="Transport (km)"
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
        />

        <input
          placeholder="Electricity (kWh)"
          value={electricity}
          onChange={(e) => setElectricity(e.target.value)}
        />

        <input
          placeholder="CO₂ Goal (kg)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <button onClick={calculate}>Calculate</button>
      </div>

      {/* RESULT */}
      <div className="card">
        <h2>Total CO₂</h2>
        <p>{total.toFixed(2)} kg</p>
      </div>

      {score !== null && (
        <div className="card">
          <h3>Eco Score</h3>
          <p>{score}/100</p>
        </div>
      )}

      {/* GOAL */}
      {goalValue > 0 && (
        <div className="card">
          <h3>🎯 Goal Progress</h3>

          <div
            style={{
              background: "#ddd",
              height: "10px",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "10px",
                background:
                  progressPercent > 100 ? "red" : "#22c55e",
                borderRadius: "10px",
              }}
            />
          </div>

          <p>
            {progressPercent.toFixed(1)}% used | Remaining:{" "}
            {remaining > 0 ? remaining.toFixed(2) : 0} kg
          </p>
        </div>
      )}

      {/* HISTORY */}
      <div className="card">
        <h3>📜 History</h3>

        {history.length === 0 ? (
          <p>No data yet</p>
        ) : (
          <>
            {visibleHistory.map((h) => (
              <div
                key={h.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>
                  {parseDate(h.date).toLocaleDateString()} → {h.score}
                </span>

                <button onClick={() => deleteEntry(h.id)}>
                  Delete
                </button>
              </div>
            ))}

            {history.length > 5 && (
              <button onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        )}
      </div>

      {/* CHART */}
      <div className="card">
        <h3>📊 Trend</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CHATBOT */}
      <Chatbot
        history={history}
        goal={goal}
        total={total}
        score={score}
      />
    </div>
  );
}

export default Dashboard;