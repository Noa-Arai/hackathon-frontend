// src/pages/SignUp.js
import React, { useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";

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
      await client.post("/user", {
        name,
        email,
        password,
      });

      alert("登録が完了しました！ログインしてください。");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("ユーザー登録に失敗しました");
    }
  };

  const styles = {
    root: {
      maxWidth: "420px",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "18px",
      padding: "22px 24px",
      boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
    },
    title: {
      fontSize: "20px",
      fontWeight: 700,
      marginBottom: "16px",
    },
    field: {
      marginBottom: "12px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "13px",
      marginBottom: "4px",
      color: "#7a6c65",
    },
    input: {
      borderRadius: "999px",
      border: "1px solid #ddc5b2",
      padding: "8px 12px",
      fontSize: "14px",
      outline: "none",
    },
    button: {
      marginTop: "10px",
      borderRadius: "999px",
      border: "none",
      padding: "9px 16px",
      fontSize: "14px",
      fontWeight: 600,
      background: "#d97757",
      color: "#fff",
      cursor: "pointer",
      width: "100%",
    },
  };

  return (
    <div style={styles.root}>
      <h2 style={styles.title}>新規登録</h2>

      <div style={styles.field}>
        <label style={styles.label}>名前</label>
        <input
          type="text"
          style={styles.input}
          placeholder="山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>メールアドレス</label>
        <input
          type="email"
          style={styles.input}
          placeholder="example@xxxx.xx"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>パスワード</label>
        <input
          type="password"
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button style={styles.button} onClick={handleSignUp}>
        登録
      </button>
    </div>
  );
};

export default SignUp;
