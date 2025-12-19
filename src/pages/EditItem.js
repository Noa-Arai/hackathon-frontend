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
  
  // 入力フォームの状態
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [isLuckyBag, setIsLuckyBag] = useState(false);

  // 🔥 画像管理用: アップロードするファイル と 表示用プレビューURL
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    client.get("/users/me").then((res) => setMe(res.data));
    client.get("/items/list").then((res) => {
      const found = (res.data || []).find((it) => String(it.id) === String(id));
      if (found) {
        setItem(found); 
        setTitle(found.title); 
        setPrice(found.price); 
        setDescription(found.description);
        if (found.category) setCategory(found.category);
        if (found.is_lucky_bag) setIsLuckyBag(found.is_lucky_bag);

        // 🔥 初期画像がある場合、プレビューにセットする
        if (found.image1_url) {
          setPreviewUrl(`${BASE}${found.image1_url}`);
        } else {
          setPreviewUrl("/noimage.svg");
        }
      }
    });
  }, [id, BASE]);

  // 🔥 画像が選択されたら、プレビューを差し替える処理
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file); // 送信用に保存
      setPreviewUrl(URL.createObjectURL(file)); // 画面表示用にURL生成
    }
  };

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("id", id); 
    form.append("title", title); 
    form.append("price", price); 
    form.append("description", description);
    form.append("category", category);
    form.append("is_lucky_bag", isLuckyBag);

    // 🔥 新しい画像がある時だけ image1 として送信（2,3は無視）
    if (newImageFile) {
      form.append("image1", newImageFile);
    }

    await client.post("/items/update", form, { headers: { "Content-Type": "multipart/form-data" } });
    navigate(`/items/${id}`);
  };

  if (!item || !me) return <div>Loading...</div>;

  const inputStyle = { width: "100%", padding: "12px", borderRadius: theme.radius, border: `1px solid ${theme.colors.border}`, marginBottom: "20px" };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "8px", color: theme.colors.textLight };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", padding: "40px", borderRadius: theme.radius, boxShadow: theme.colors.shadow }}>
      <h2 style={{ fontFamily: theme.fonts.serif, marginBottom: "30px", fontSize: "24px" }}>Edit Item</h2>
      
      {/* --- 画像プレビューエリア --- */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <p style={{ ...labelStyle, textAlign: "left" }}>IMAGE PREVIEW</p>
        <div style={{ 
          width: "100%", height: "250px", background: "#f9f9f9", 
          borderRadius: theme.radius, overflow: "hidden", border: `1px solid ${theme.colors.border}`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            onError={(e) => { e.target.src = "/noimage.svg"; }}
          />
        </div>
        
        {/* 画像選択ボタン */}
        <div style={{ marginTop: "10px", textAlign: "left" }}>
          <label style={{ 
            display: "inline-block", padding: "8px 16px", background: "#333", color: "#fff", 
            fontSize: "12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" 
          }}>
            📷 REPLACE IMAGE
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect} // 🔥 ここでプレビュー切り替え
              style={{ display: "none" }} 
            />
          </label>
          <span style={{ marginLeft: "10px", fontSize: "12px", color: "#888" }}>
            {newImageFile ? "New image selected!" : "Current image shown"}
          </span>
        </div>
      </div>

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

      <div style={{ margin: "10px 0 20px", padding: "10px", background: "#FFF0F5", border: "1px dashed #FF69B4", borderRadius: "8px" }}>
        <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontWeight: "bold", color: "#D63384", fontSize:"14px" }}>
          <input 
            type="checkbox" 
            checked={isLuckyBag} 
            onChange={(e) => setIsLuckyBag(e.target.checked)} 
            style={{ marginRight: "10px" }}
          />
          🎁 福袋モード (SECRET)
        </label>
      </div>
      
      <label style={labelStyle}>PRICE</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
      
      <label style={labelStyle}>DESCRIPTION</label>
      <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />

      <button onClick={handleUpdate} style={{ width: "100%", padding: "14px", background: theme.colors.primary, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: "bold", cursor: "pointer" }}>
        SAVE CHANGES
      </button>
    </div>
  );
}