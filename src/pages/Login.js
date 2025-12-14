// src/pages/Login.js
import React, { useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("入力してください");
    try {
      const res = await client.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/items");
    } catch (err) {
      console.error(err);
      alert("ログイン失敗");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: theme.radius,
    border: `1px solid ${theme.colors.border}`,
    fontSize: "15px",
    outline: "none",
    background: "#FAFAFA",
    marginBottom: "20px",
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "40px", background: "#fff", borderRadius: theme.radius, boxShadow: theme.colors.shadow }}>
      <h2 style={{ fontFamily: theme.fonts.serif, textAlign: "center", marginBottom: "30px", fontSize: "24px" }}>LOGIN</h2>

      <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "6px", color: theme.colors.textLight }}>EMAIL</label>
      <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />

      <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "6px", color: theme.colors.textLight }}>PASSWORD</label>
      <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "14px",
          background: theme.colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: theme.radius,
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "10px",
          letterSpacing: "0.1em",
        }}
      >
        LOGIN
      </button>
    </div>
  );
};

export default Login;