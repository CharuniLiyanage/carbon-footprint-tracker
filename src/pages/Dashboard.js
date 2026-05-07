import { useState, useEffect } from "react";
import "./Dashboard.css";
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

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";

import jsPDF from "jspdf";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [transport, setTransport] = useState("");
  const [electricity, setElectricity] = useState("");
<<<<<<< HEAD

  const [total, setTotal] = useState(null);
  const [score, setScore] = useState(null);
  const [data, setData] = useState([]);
  const [tips, setTips] = useState([]);
=======
  const [goal, setGoal] = useState("");
>>>>>>> 97a84e5 (Update Files)
  const [history, setHistory] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

<<<<<<< HEAD
  // ✅ AUTH + LOAD HISTORY
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setUserEmail(user.email);

      const q = query(
        collection(db, "ecoScores"),
        where("email", "==", user.email)
      );

      const unsubscribeSnap = onSnapshot(q, (snapshot) => {
        const userHistory = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // ✅ Proper sorting
        userHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        setHistory(userHistory);
      });

      return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
  }, []);

  // 💾 SAVE
  const saveToFirebase = async (totalValue, ecoScore) => {
    if (!userEmail) {
      alert("Please login first");
      return;
    }

    try {
      await addDoc(collection(db, "ecoScores"), {
        email: userEmail,
        transport,
        electricity,
        totalCO2: totalValue,
        score: ecoScore,
        date: new Date().toISOString(), // ✅ FIXED DATE
      });
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  // 🗑 CLEAR HISTORY
  const clearHistory = async () => {
    if (!userEmail) return;

    if (!window.confirm("Delete all history?")) return;

    const q = query(
      collection(db, "ecoScores"),
      where("email", "==", userEmail)
    );

    const snapshot = await getDocs(q);
    const deletes = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletes);

    setHistory([]);
  };

  // ✏️ EDIT ENTRY
  const editEntry = async (id, oldData) => {
    const newTransport = prompt("New transport (km):", oldData.transport || "");
    const newElectricity = prompt("New electricity (kWh):", oldData.electricity || "");

    if (newTransport === null || newElectricity === null) return;

    const t = (parseFloat(newTransport) || 0) * 0.21;
    const e = (parseFloat(newElectricity) || 0) * 0.5;
    const totalValue = t + e;

    let ecoScore = 100 * Math.exp(-totalValue / 50);
    ecoScore = Math.round(ecoScore);

    try {
      await updateDoc(doc(db, "ecoScores", id), {
        transport: newTransport,
        electricity: newElectricity,
        totalCO2: totalValue,
        score: ecoScore,
      });
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  // 📄 DOWNLOAD PDF
  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("CarbonTrack History", 10, 10);

    let y = 20;

    history.forEach((item) => {
      pdf.text(`Date: ${new Date(item.date).toLocaleString()}`, 10, y);
      pdf.text(`CO2: ${item.totalCO2} kg`, 10, y + 6);
      pdf.text(`Score: ${item.score}/100`, 10, y + 12);
      y += 20;
    });

    pdf.save("carbon-history.pdf");
  };
=======
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // AUTH + DATA
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

        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(data);
      });
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  // CALCULATE
  const calculate = async () => {
    if (!auth.currentUser) return alert("Login required");
>>>>>>> 97a84e5 (Update Files)

    const t = (parseFloat(transport) || 0) * 0.21;
    const e = (parseFloat(electricity) || 0) * 0.5;

    const totalValue = t + e;

<<<<<<< HEAD
    setTotal(totalValue.toFixed(2));

    setData([
      { name: "Transport", value: t },
      { name: "Electricity", value: e },
    ]);

    let ecoScore = 100 * Math.exp(-totalValue / 50);
    ecoScore = Math.round(ecoScore);

    setScore(ecoScore);
    localStorage.setItem("ecoScore", ecoScore);

    // 🌱 TIPS
    if (totalValue < 10) {
      setTips([
        "Great job! 🌱 Low carbon footprint",
        "Keep using eco transport 🚶",
        "Maintain your habits 💡",
      ]);
    } else if (totalValue < 25) {
      setTips([
        "Reduce electricity usage 💡",
        "Use public transport 🚍",
        "Turn off unused devices 🔌",
      ]);
    } else {
      setTips([
        "High emissions detected 🚨",
        "Reduce car usage 🚗",
        "Switch to renewable energy 🌍",
      ]);
    }

    saveToFirebase(totalValue, ecoScore);
  };

  // 📊 LAST 7 DAYS GRAPH
  const getLast7DaysData = () => {
    const last7 = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dateStr = d.toISOString().split("T")[0];

      const dayItems = history.filter(item =>
        item.date && item.date.startsWith(dateStr)
      );

      const totalCO2 = dayItems.reduce(
        (sum, item) => sum + (parseFloat(item.totalCO2) || 0),
        0
      );

      last7.push({
        date: dateStr,
        CO2: Number(totalCO2.toFixed(2)),
      });
    }

    return last7;
  };

  const last7DaysData = getLast7DaysData();

  return (
    <div className="dashboard">

      <h1>📊 Carbon Dashboard</h1>
=======
    let ecoScore = 100 / (1 + totalValue / 100);
    ecoScore = Math.round(ecoScore);

    const entry = {
      userId: auth.currentUser.uid,
      date: new Date(),
      total: totalValue,
      score: ecoScore,
    };

    await addDoc(collection(db, "progress"), entry);

    setTotal(totalValue);
    setScore(ecoScore);

    setTransport("");
    setElectricity("");
  };

  // DELETE
  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, "progress", id));
  };

  // DATE FIX
  const parseDate = (d) =>
    new Date(d?.seconds ? d.seconds * 1000 : d);

  // LIMIT HISTORY
  const visibleHistory = showAll ? history : history.slice(0, 5);

  // CHART DATA
  const chartData = history
    .slice(0, 10)
    .reverse()
    .map((h) => ({
      date: parseDate(h.date).toLocaleDateString(),
      score: h.score,
    }));

  // GOAL LOGIC
  const goalValue = parseFloat(goal) || 0;
  const remaining = goalValue - total;
  const progressPercent =
    goalValue > 0 ? Math.min((total / goalValue) * 100, 100) : 0;

  return (
    <div className="dashboard">
      <h1>📊 Carbon SaaS Dashboard</h1>

      {user && <p>Welcome, {user.email}</p>}
>>>>>>> 97a84e5 (Update Files)

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

<<<<<<< HEAD
=======
        <input
          placeholder="CO₂ Goal (kg)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

>>>>>>> 97a84e5 (Update Files)
        <button onClick={calculate}>Calculate</button>
      </div>

      {/* RESULT */}
<<<<<<< HEAD
      {total && (
        <div className="result-card">
          <h2>Total CO₂ Emission</h2>
          <p className="value">{total} kg</p>
        </div>
      )}
=======
      <div className="card">
        <h2>Total CO₂</h2>
        <p>{total.toFixed(2)} kg</p>
      </div>
>>>>>>> 97a84e5 (Update Files)

      {score !== null && (
<<<<<<< HEAD
        <div className="score-card">
          <h3>🌍 Eco Score</h3>
          <p className="score">{score} / 100</p>
        </div>
      )}

      {/* BAR CHART */}
      {data.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 📈 LAST 7 DAYS */}
      {last7DaysData.length > 0 && (
        <div className="chart-container">
          <h3>📈 Last 7 Days CO₂ Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="CO2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* TIPS */}
      {tips.length > 0 && (
        <div className="tips-card">
          <h3>🌱 Eco Tips</h3>
          <ul>
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* HISTORY */}
      <div className="history-card">
        <h3>📅 Your History</h3>

        <button onClick={clearHistory}>🗑 Clear</button>
        <button onClick={downloadPDF}>📄 PDF</button>

        {history.length === 0 ? (
          <p>No history yet</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <p><b>Date:</b> {new Date(item.date).toLocaleString()}</p>
              <p><b>Total:</b> {item.totalCO2} kg CO₂</p>
              <p><b>Eco Score:</b> {item.score}/100</p>

              <button onClick={() => editEntry(item.id, item)}>✏️ Edit</button>
              <hr />
            </div>
          ))
=======
        <div className="card">
          <h3>Eco Score</h3>
          <p>{score}/100</p>
        </div>
      )}

      {/* GOAL PROGRESS */}
      {goalValue > 0 && (
        <div className="card">
          <h3>🎯 Goal Progress</h3>

          <div style={{ background: "#ddd", borderRadius: "10px", height: "10px" }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: "10px",
                background: progressPercent > 100 ? "red" : "#22c55e",
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

      {/* INSIGHT */}
      {goalValue > 0 && (
        <div className="card">
          <h3>🌱 Insight</h3>
          <p>
            {total > goalValue
              ? "⚠️ You exceeded your carbon goal!"
              : "✅ You are within your target. Good job!"}
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

                <button
                  onClick={() => deleteEntry(h.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}
                >
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
>>>>>>> 97a84e5 (Update Files)
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
    </div>
  );
}

export default Dashboard;