import React, { useState, useEffect } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App";

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://hackathon-backend-563488838141.us-central1.run.app"
  : "http://localhost:8080";

export default function EditProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- State ---
  const [form, setForm] = useState({ name: "", bio: "", birthday: "" });
  const [avatar, setAvatar] = useState({ file: null, preview: null });
  const [imgHash, setImgHash] = useState(Date.now()); // キャッシュ対策

  // --- 初期データ取得 ---
  useEffect(() => {
    if (!token) return;
    client.get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setForm({
          name: res.data.name || "",
          bio: res.data.bio || "",
          birthday: res.data.birthday || ""
        });
        if (res.data.avatarURL) {
          setAvatar((prev) => ({ ...prev, preview: `${BASE_URL}${res.data.avatarURL}` }));
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

  // --- 保存処理 ---
  const saveProfile = async () => {
    try {
      await client.post("/users/me/update", form, { headers: { Authorization: `Bearer ${token}` } });
      alert("プロフィールを更新しました！");
      navigate("/profile");
    } catch (err) { alert("更新失敗"); }
  };

// src/pages/EditProfile.js の saveAvatar 関数だけこれに置き換えてください

  // src/pages/EditProfile.js 内の saveAvatar 関数

  const saveAvatar = async () => {
    if (!avatar.file) return alert("画像を選択してください");
    try {
      const formData = new FormData();
      // ⚠️ バックエンドのGoコードで、受取変数が "avatar" という名前になっているか確認が必要です
      // もし "image" なら、ここを "image" に変える必要があります
      formData.append("avatar", avatar.file);

      // 👇 修正: headers から "Content-Type" を削除しました！
      // これにより、ブラウザが自動的に正しい boundary を付けてくれます
      await client.post("/users/me/avatar", formData, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      alert("アイコンを更新しました！");
      window.location.href = "/profile"; 
    } catch (err) { 
      console.error(err);
      alert("アイコン更新失敗"); 
    }
  };

  // --- 表示用画像URL (キャッシュ対策 & Blob対応) ---
  const displayImage = avatar.preview
    ? (avatar.preview.startsWith("blob:") ? avatar.preview : `${avatar.preview}?t=${imgHash}`)
    : "/noimage.svg";

  // --- スタイル定義 (ここを分離してスッキリ！) ---
  const s = {
    container: { maxWidth: "600px", margin: "0 auto", padding: "40px", background: "#fff", borderRadius: theme.radius, boxShadow: theme.colors.shadow },
    title: { fontFamily: theme.fonts.serif, marginBottom: "30px", textAlign: "center" },
    avatarImg: { width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee", marginBottom: 10 },
    input: { width: "100%", padding: "12px", borderRadius: theme.radius, border: `1px solid ${theme.colors.border}`, marginBottom: "20px" },
    label: { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "8px", color: theme.colors.textLight },
    btnPrimary: { width: "100%", padding: "14px", background: theme.colors.text, color: "#fff", borderRadius: theme.radius, border: "none", cursor: "pointer", fontWeight: "bold" },
    btnSmall: { marginLeft: 10, padding: "6px 12px", background: theme.colors.primary, color: "#fff", border: "none", borderRadius: theme.radius, cursor: "pointer", fontSize: "12px" },
    linkBack: { marginTop: 18, background: "transparent", border: "none", color: theme.colors.primary, cursor: "pointer", display: "block", width: "100%" }
  };

  // --- UI ---
  return (
    <div style={s.container}>
      <h2 style={s.title}>Edit Profile</h2>

      {/* アイコン編集 */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img
          src={displayImage} alt="avatar" style={s.avatarImg}
          onError={(e) => { if(!e.target.src.includes("noimage")) e.target.src = "/noimage.svg"; }}
        />
        <div>
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            if (file) setAvatar({ file, preview: URL.createObjectURL(file) });
          }} />
          <button onClick={saveAvatar} style={s.btnSmall}>Update Icon</button>
        </div>
      </div>

      {/* テキスト編集 */}
      <label style={s.label}>NAME</label>
      <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={s.input} />

      <label style={s.label}>BIO</label>
      <textarea rows={4} value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} style={s.input} />

      <label style={s.label}>BIRTHDAY</label>
      <input type="date" value={form.birthday} onChange={(e) => setForm({...form, birthday: e.target.value})} style={s.input} />

      <button onClick={saveProfile} style={s.btnPrimary}>SAVE PROFILE</button>
      <button onClick={() => navigate("/profile")} style={s.linkBack}>← Return to Profile</button>
    </div>
  );
}