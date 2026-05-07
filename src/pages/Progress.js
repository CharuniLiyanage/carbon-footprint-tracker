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
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);

  // 🧠 Convert date → weekday
  const getDayName = (date) => {
    const d = new Date(date?.seconds ? date.seconds * 1000 : date);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  };

  // 🔥 Load grouped progress data
  useEffect(() => {
    let unsub;

    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setData([]);
        setHistory([]);
        return;
      }

      // 🔹 Progress collection (bar chart data)
      const q1 = query(
        collection(db, "progress"),
        where("userId", "==", user.uid)
      );

      unsub = onSnapshot(q1, (snapshot) => {
        const raw = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const grouped = {};

        raw.forEach((item) => {
          const day = getDayName(item.date);

          if (!grouped[day]) {
            grouped[day] = { total: 0, count: 0 };
          }

          grouped[day].total += item.score || 0;
          grouped[day].count += 1;
        });

        const formatted = Object.keys(grouped).map((day) => ({
          day,
          score: Math.round(grouped[day].total / grouped[day].count),
        }));

        setData(formatted);
      });

      // 🔹 Eco scores (history data)
      const q2 = query(
        collection(db, "ecoScores"),
        where("email", "==", user.email)
      );

      onSnapshot(q2, (snapshot) => {
        const list = snapshot.docs.map((doc) => doc.data());
        setHistory(list);
      });
    });

    return () => {
      authUnsub();
      if (unsub) unsub();
    };
  }, []);

  // 📊 CALCULATIONS
  const totalEntries = history.length;

  const avgScore =
    totalEntries > 0
      ? Math.round(
          history.reduce((sum, item) => sum + (item.score || 0), 0) /
            totalEntries
        )
      : 0;

  const avgCO2 =
    totalEntries > 0
      ? (
          history.reduce(
            (sum, item) => sum + (parseFloat(item.totalCO2) || 0),
            0
          ) / totalEntries
        ).toFixed(2)
      : 0;

  // 📈 LAST 7 DAYS
  const getLast7Days = () => {
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dateStr = d.toLocaleDateString();

      const dayItems = history.filter(
        (item) => item.date && item.date.startsWith(dateStr)
      );

      const avg =
        dayItems.length > 0
          ? dayItems.reduce((sum, item) => sum + item.score, 0) /
            dayItems.length
          : 0;

      result.push({
        date: dateStr,
        score: Math.round(avg),
      });
    }

    return result;
  };

  const chartData = getLast7Days();

  return (
    <div className={dark ? "progress dark" : "progress-page"}>
      <h1>📈 Your Progress</h1>

      {/* SUMMARY */}
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

      {/* CHART */}
      <div className="chart-box">
        <h3>Last 7 Days Eco Score</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHT */}
      <div className="insight">
        <h3>💡 Insight</h3>
        <p>
          {avgScore > 70
            ? "Great job! Your lifestyle is eco-friendly 🌱"
            : avgScore > 40
            ? "You're doing okay, but there’s room to improve."
            : "Your emissions are high. Try reducing transport and electricity usage."}
        </p>
      </div>
    </div>
  );
}

export default Progress;