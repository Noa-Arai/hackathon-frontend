// src/pages/EditItem.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useParams, useNavigate } from "react-router-dom";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE = "https://hackathon-backend-563488838141.us-central1.run.app";

  const [item, setItem] = useState(null);
  const [me, setMe] = useState(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [newImages, setNewImages] = useState([]);

  // ----------------------------------
  // 自分の情報
  // ----------------------------------
  useEffect(() => {
    client.get("/users/me").then((res) => setMe(res.data));
  }, []);

  // ----------------------------------
  // 商品データロード
  // ----------------------------------
  useEffect(() => {
    client.get("/items/list").then((res) => {
      const list = res.data || [];
      const found = list.find((it) => String(it.id) === String(id));
      if (!found) {
        alert("商品が見つかりません");
        navigate("/items");
        return;
      }

      setItem(found);
      setTitle(found.title);
      setPrice(found.price);
      setDescription(found.description);
    });
  }, [id, navigate]);

  if (!item) return <div>読み込み中…</div>;
  if (!me) return <div>読み込み中…</div>;

  if (item.user_id !== me.id) {
    return <div style={{ fontSize: 18, textAlign: "center" }}>この商品は編集できません</div>;
  }

  // ----------------------------------
  // 保存処理
  // ----------------------------------
  const handleUpdate = async () => {
    try {
      const form = new FormData();

      // ⭐ バックエンドが要求するキー名
      form.append("id", id);
      form.append("title", title);
      form.append("price", price);
      form.append("description", description);

      // ⭐ バックエンド側は "image1" "image2" "image3" でしか受け取らない
      if (newImages[0]) form.append("image1", newImages[0]);
      if (newImages[1]) form.append("image2", newImages[1]);
      if (newImages[2]) form.append("image3", newImages[2]);

      await client.post("/items/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("保存しました！");
      navigate(`/items/${id}`);
    } catch (err) {
      console.error(err);
      alert("保存中にエラーが発生しました");
    }
  };

  const imageURLs = [
    item.image1_url ? BASE + item.image1_url : null,
    item.image2_url ? BASE + item.image2_url : null,
    item.image3_url ? BASE + item.image3_url : null,
  ].filter(Boolean);

  return (
    <div
      style={{
        background: "#fff",
        padding: "28px",
        borderRadius: "14px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        maxWidth: "680px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ marginBottom: 20, fontWeight: 700 }}>商品を編集</h2>

      <label style={{ fontWeight: 600 }}>タイトル</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          marginTop: 4,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <label style={{ fontWeight: 600, marginTop: 16, display: "block" }}>価格</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <label style={{ fontWeight: 600, marginTop: 16, display: "block" }}>説明文</label>
      <textarea
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      {/* 既存画像 */}
      <label style={{ fontWeight: 600, marginTop: 16, display: "block" }}>現在の画像</label>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {imageURLs.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={""}
            style={{
              width: 120,
              height: 120,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        ))}
      </div>

      <label style={{ fontWeight: 600, marginTop: 16, display: "block" }}>
        新しい画像（最大3枚）
      </label>
      <input type="file" multiple onChange={(e) => setNewImages([...e.target.files])} />

      <button
        onClick={handleUpdate}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 12,
          background: "#d97757",
          color: "#fff",
          borderRadius: 8,
          border: "none",
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        保存する
      </button>
    </div>
  );
}
