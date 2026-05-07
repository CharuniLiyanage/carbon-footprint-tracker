import { useState, useEffect } from "react";
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

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Progress() {
  const { dark } = useTheme();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubFirestore;

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setHistory([]);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const q = query(
        collection(db, "progress"),
        where("userId", "==", currentUser.uid)
      );

      unsubFirestore = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHistory(list);
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  const getScore = (item) => item.score || 0;
  const getCO2 = (item) => item.total || 0;

  const getDate = (item) => {
    if (!item.date) return new Date();
    return new Date(item.date);
  };

  const totalEntries = history.length;

  const avgScore =
    totalEntries > 0
      ? Math.round(
          history.reduce((sum, i) => sum + getScore(i), 0) /
            totalEntries
        )
      : 0;

  const avgCO2 =
    totalEntries > 0
      ? (
          history.reduce((sum, i) => sum + getCO2(i), 0) /
          totalEntries
        ).toFixed(2)
      : 0;

  const getLast7Days = () => {
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const filtered = history.filter((item) => {
        const itemDate = getDate(item);
        return itemDate.toDateString() === d.toDateString();
      });

      const avg =
        filtered.length > 0
          ? filtered.reduce((s, i) => s + getScore(i), 0) /
            filtered.length
          : 0;

      result.push({
        date: d.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        score: Math.round(avg),
      });
    }

    return result;
  };

  const chartData = getLast7Days();

  const insight =
    avgScore >= 75
      ? "Excellent 🌱 Your lifestyle is very eco-friendly!"
      : avgScore >= 40
      ? "Good 👍 Keep improving your habits."
      : "High emissions ⚠️ Try reducing transport & electricity usage.";

  return (
    <div className={`progress-page ${dark ? "dark" : ""}`}>
      <h1>📈 Your Progress</h1>

      {loading ? (
        <p>Loading your eco data...</p>
      ) : (
        <>
          <div className="summary">
            <div className="card">
              <h3>Total Entries</h3>
              <p>{totalEntries}</p>
            </div>

            <div className="card">
              <h3>Average Score</h3>
              <p>{avgScore} / 100</p>
            </div>

            <div className="card">
              <h3>Avg CO₂</h3>
              <p>{avgCO2} kg</p>
            </div>
          </div>

          <div className="chart-box">
            <h3>Last 7 Days Eco Score</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2e7d32"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="insight">
            <h3>💡 Insight</h3>
            <p>{insight}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Progress;