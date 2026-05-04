import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

function Progress() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "ecoScores"), (snapshot) => {
      const userData = snapshot.docs
        .map(doc => doc.data())
        .filter(d => d.email === auth.currentUser?.email);

      setData(userData);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>📈 Progress</h1>

      {data.length === 0 ? (
        <p>No data yet</p>
      ) : (
        data.map((item, i) => (
          <div key={i} style={{
            margin: "10px",
            padding: "10px",
            background: "#f1f8e9"
          }}>
            <p>Score: {item.score}</p>
            <p>CO₂: {item.totalCO2}</p>
            <p>Date: {item.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Progress;