// src/pages/NewItem.js
import React, { useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App";

export default function NewItem() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [images, setImages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  const generateAI = async () => {
    if (!title) return alert("タイトルを入力してください");
    setAiLoading(true);
    try {
      const res = await client.post("/ai/describe", { title });
      setDescription(res.data.description || "");
    } catch (err) { console.error(err); }
    setAiLoading(false);
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("title", title);
    form.append("price", price);
    form.append("description", description);
    form.append("category", category);
    images.forEach((file) => form.append("images", file));
    await client.post("/items", form, { headers: { "Content-Type": "multipart/form-data" } });
    navigate("/items");
  };

  const inputStyle = { width: "100%", padding: "12px", borderRadius: theme.radius, border: `1px solid ${theme.colors.border}`, marginBottom: "20px", background: "#fff" };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "8px", color: theme.colors.textLight };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", padding: "40px", borderRadius: theme.radius, boxShadow: theme.colors.shadow }}>
      <h2 style={{ fontFamily: theme.fonts.serif, marginBottom: "30px", fontSize: "24px", borderBottom:`1px solid ${theme.colors.border}`, paddingBottom:15 }}>Listing Item</h2>

      <label style={labelStyle}>TITLE</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="商品名" />

      <button onClick={generateAI} disabled={aiLoading} style={{ marginBottom: "20px", padding: "8px 16px", background: "#f0f0f0", border: "none", borderRadius: theme.radius, fontSize: "12px", cursor: "pointer", color: theme.colors.text }}>
        {aiLoading ? "GENERATING..." : "✨ AI AUTO DESCRIBE"}
      </button>

      <label style={labelStyle}>CATEGORY</label>
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)} 
        style={inputStyle}
      >
        <option value="other">その他</option>
        <option value="fashion">ファッション</option>
        <option value="gadget">家電・スマホ</option>
        <option value="interior">家具・インテリア</option>
        <option value="hobby">ホビー・ゲーム</option>
      </select>

      <label style={labelStyle}>PRICE (¥)</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>DESCRIPTION</label>
      <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, fontFamily: theme.fonts.sans }} />

      <label style={labelStyle}>IMAGES (Max 3)</label>
      <input type="file" multiple accept="image/*" onChange={(e) => setImages([...e.target.files].slice(0, 3))} style={{ marginBottom: "30px" }} />

      <button onClick={handleSubmit} style={{ width: "100%", padding: "14px", background: theme.colors.text, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.1em" }}>
        PUBLISH
      </button>
    </div>
  );
}