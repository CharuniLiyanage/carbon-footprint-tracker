import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (userCredential.user) {
      navigate("/dashboard");
    }
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🌱 Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;