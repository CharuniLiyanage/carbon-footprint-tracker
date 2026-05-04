import { useState, useEffect } from "react";
import "./Dashboard.css";

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
  const [transport, setTransport] = useState("");
  const [electricity, setElectricity] = useState("");

  const [total, setTotal] = useState(null);
  const [score, setScore] = useState(null);
  const [data, setData] = useState([]);
  const [tips, setTips] = useState([]);
  const [history, setHistory] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

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

  // 🧮 CALCULATE
  const calculate = () => {
    const t = (parseFloat(transport) || 0) * 0.21;
    const e = (parseFloat(electricity) || 0) * 0.5;

    const totalValue = t + e;

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

      {/* INPUT */}
      <div className="form">
        <input
          type="number"
          placeholder="Transport (km)"
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
        />

        <input
          type="number"
          placeholder="Electricity (kWh)"
          value={electricity}
          onChange={(e) => setElectricity(e.target.value)}
        />

        <button onClick={calculate}>Calculate</button>
      </div>

      {/* RESULT */}
      {total && (
        <div className="result-card">
          <h2>Total CO₂ Emission</h2>
          <p className="value">{total} kg</p>
        </div>
      )}

      {/* SCORE */}
      {score !== null && (
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
        )}
      </div>

    </div>
  );
}

export default Dashboard;