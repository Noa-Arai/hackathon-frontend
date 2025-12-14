// src/pages/SignUp.js
import React, { useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert("全て入力してください");
      return;
    }

    try {
      await client.post("/user", { name, email, password });
      alert("登録が完了しました！ログインしてください。");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("ユーザー登録に失敗しました");
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

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "bold",
    display: "block",
    marginBottom: "6px",
    color: theme.colors.textLight,
    letterSpacing: "0.05em"
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: theme.radius,
        boxShadow: theme.colors.shadow,
      }}
    >
      <h2
        style={{
          fontFamily: theme.fonts.serif,
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "24px",
          letterSpacing: "0.05em"
        }}
      >
        CREATE ACCOUNT
      </h2>

      <div style={{ marginBottom: "10px" }}>
        <label style={labelStyle}>NAME</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label style={labelStyle}>EMAIL</label>
        <input
          type="email"
          style={inputStyle}
          placeholder="example@xxxx.xx"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label style={labelStyle}>PASSWORD</label>
        <input
          type="password"
          style={inputStyle}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleSignUp}
        style={{
          width: "100%",
          padding: "14px",
          background: theme.colors.text, // 黒ボタンで引き締め
          color: "#fff",
          border: "none",
          borderRadius: theme.radius,
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "10px",
          letterSpacing: "0.1em",
          transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => e.target.style.opacity = 0.8}
        onMouseLeave={(e) => e.target.style.opacity = 1}
      >
        REGISTER
      </button>
    </div>
  );
};

export default SignUp;