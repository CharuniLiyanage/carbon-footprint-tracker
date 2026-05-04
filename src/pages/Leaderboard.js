import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ecoScores"));

      const data = querySnapshot.docs.map((doc) => doc.data());

      // sort highest score first
      data.sort((a, b) => b.score - a.score);

      setUsers(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>🏆 Eco Leaderboard</h1>

      {users.map((u, i) => (
        <div key={i} style={{
          margin: "10px",
          padding: "10px",
          background: "#e8f5e9",
          borderRadius: "8px"
        }}>
          <h3>#{i + 1} {u.email}</h3>
          <p>Score: {u.score}</p>
          <p>CO₂: {u.totalCO2}</p>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;