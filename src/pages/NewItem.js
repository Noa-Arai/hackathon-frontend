import React, { useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App";

export default function NewItem() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [isLuckyBag, setIsLuckyBag] = useState(false);
  
  // 🔥 修正: 配列ではなく、1枚のファイルとプレビュー用URLだけで管理
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
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

  // 🔥 画像選択時の処理（プレビュー作成）
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("title", title);
    form.append("price", price);
    form.append("description", description);
    form.append("category", category);
    form.append("is_lucky_bag", isLuckyBag);
    
    // 🔥 修正: ループ処理をやめて、シンプルに1枚だけ添付
    if (imageFile) {
      form.append("image1", imageFile);
    }

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

      <div style={{ margin: "10px 0 25px", padding: "15px", background: "#FFF0F5", borderRadius: "8px", border: "2px dashed #FF69B4" }}>
        <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontWeight: "bold", color: "#D63384" }}>
          <input 
            type="checkbox" 
            checked={isLuckyBag} 
            onChange={(e) => setIsLuckyBag(e.target.checked)} 
            style={{ marginRight: "10px", transform: "scale(1.5)" }}
          />
          🎁 福袋（ガチャ）モード
        </label>
        <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 25px" }}>
          画像にモザイクがかかります。中身を秘密にしてワクワクを届けましょう！
        </p>
      </div>

      <label style={labelStyle}>PRICE (¥)</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>DESCRIPTION</label>
      <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, fontFamily: theme.fonts.sans }} />

      {/* 🔥 修正: 画像選択エリア（プレビュー付き） */}
      <div style={{ marginBottom: "30px" }}>
        <label style={labelStyle}>IMAGE</label>
        
        {/* プレビュー表示エリア */}
        <div style={{ 
          width: "100%", height: "200px", background: "#f9f9f9", 
          borderRadius: theme.radius, overflow: "hidden", border: `2px dashed ${theme.colors.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px",
          position: "relative"
        }}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          ) : (
            <span style={{ color: "#aaa", fontSize: "14px" }}>No Image Selected</span>
          )}
          
          {/* 画像選択inputを全面に透明で配置して、どこ押しても反応するようにする小技 */}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageSelect} 
            style={{ 
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
              opacity: 0, cursor: "pointer" 
            }} 
          />
        </div>
        <p style={{ fontSize: "12px", color: "#888", textAlign: "center" }}>
          ↑ Click box to upload image
        </p>
      </div>

      <button onClick={handleSubmit} style={{ width: "100%", padding: "14px", background: theme.colors.text, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.1em" }}>
        PUBLISH
      </button>
    </div>
  );
}