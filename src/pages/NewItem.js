// src/pages/NewItem.js
import React, { useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function NewItem() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  //  AI説明生成
  // =========================
  const generateAI = async () => {
    if (!title) {
      alert("先にタイトルを入力してください");
      return;
    }

    setAiLoading(true);
    try {
      const res = await client.post("/ai/describe", { title });
      setDescription(res.data.description || "");
    } catch (err) {
      console.error(err);
      alert("AI説明生成に失敗しました");
    }
    setAiLoading(false);
  };

  // =========================
  //  商品登録
  // =========================
  const handleSubmit = async () => {
    const form = new FormData();
    form.append("title", title);
    form.append("price", price);
    form.append("description", description);

    images.forEach((file) => form.append("images", file));

    await client.post("/items", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/items");
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "28px",
        borderRadius: "14px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        maxWidth: "680px",
        margin: "0 auto",
        fontFamily: "'Georgia', serif",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: 700 }}>
        商品を出品する
      </h2>

      {/* タイトル */}
      <label style={{ fontWeight: 600 }}>タイトル</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          marginTop: "4px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "12px",
        }}
      />

      {/* AI説明生成ボタン */}
      <button
        onClick={generateAI}
        disabled={aiLoading}
        style={{
          padding: "8px 14px",
          background: "#f4e3d8",
          borderRadius: "8px",
          border: "1px solid #d0b49f",
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "16px",
        }}
      >
        {aiLoading ? "生成中..." : "AIで説明文を作成する"}
      </button>

      {/* 価格 */}
      <label style={{ fontWeight: 600, display: "block", marginTop: "16px" }}>
        価格
      </label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {/* 説明文 */}
      <label style={{ fontWeight: 600, marginTop: "16px", display: "block" }}>
        説明文
      </label>
      <textarea
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "16px",
        }}
      />

      {/* 画像 */}
      <label style={{ fontWeight: 600 }}>画像（最大3枚）</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages([...e.target.files].slice(0, 3))}
      />

      {/* 出品ボタン */}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          background: "#d97757",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        出品する
      </button>
    </div>
  );
}
