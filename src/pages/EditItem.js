// src/pages/EditItem.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { theme } from "../App";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE = process.env.NODE_ENV === "production" ? "https://hackathon-backend-563488838141.us-central1.run.app" : "http://localhost:8080";

  const [item, setItem] = useState(null);
  const [me, setMe] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    client.get("/users/me").then((res) => setMe(res.data));
    client.get("/items/list").then((res) => {
      const found = (res.data || []).find((it) => String(it.id) === String(id));
      if (found) {
        setItem(found); setTitle(found.title); setPrice(found.price); setDescription(found.description);
        if (found.category) setCategory(found.category);
      }
    });
  }, [id]);

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("id", id); form.append("title", title); form.append("price", price); form.append("description", description);
    if (newImages[0]) form.append("image1", newImages[0]);
    if (newImages[1]) form.append("image2", newImages[1]);
    if (newImages[2]) form.append("image3", newImages[2]);
    form.append("category", category);
    await client.post("/items/update", form, { headers: { "Content-Type": "multipart/form-data" } });
    navigate(`/items/${id}`);
  };

  if (!item || !me) return <div>Loading...</div>;

  const inputStyle = { width: "100%", padding: "12px", borderRadius: theme.radius, border: `1px solid ${theme.colors.border}`, marginBottom: "20px" };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "8px", color: theme.colors.textLight };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", padding: "40px", borderRadius: theme.radius, boxShadow: theme.colors.shadow }}>
      <h2 style={{ fontFamily: theme.fonts.serif, marginBottom: "30px", fontSize: "24px" }}>Edit Item</h2>
      
      <label style={labelStyle}>TITLE</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>CATEGORY</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
        <option value="other">その他</option>
        <option value="fashion">ファッション</option>
        <option value="gadget">家電・スマホ</option>
        <option value="interior">家具・インテリア</option>
        <option value="hobby">ホビー・ゲーム</option>
      </select>
      
      <label style={labelStyle}>PRICE</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
      
      <label style={labelStyle}>DESCRIPTION</label>
      <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[item.image1_url, item.image2_url, item.image3_url].filter(Boolean).map((url, i) => (
          <img key={i} src={BASE + url} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }} />
        ))}
      </div>

      <label style={labelStyle}>NEW IMAGES</label>
      <input type="file" multiple onChange={(e) => setNewImages([...e.target.files])} style={{ marginBottom: 30 }} />

      <button onClick={handleUpdate} style={{ width: "100%", padding: "14px", background: theme.colors.primary, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: "bold", cursor: "pointer" }}>
        SAVE CHANGES
      </button>
    </div>
  );
}