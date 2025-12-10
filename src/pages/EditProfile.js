// src/pages/EditProfile.js
import React, { useState, useEffect } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";

const BASE = "https://hackathon-backend-563488838141.us-central1.run.app";

export default function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // ================================
  // 初期データ読込
  // ================================
  useEffect(() => {
    async function loadProfile() {
      const res = await client.get("/users/me");
      setName(res.data.name);
      setBio(res.data.bio);
      setBirthday(res.data.birthday);
      setAvatarPreview(res.data.avatarURL);
    }
    loadProfile();
  }, []);

  // ================================
  // プロフィール保存（テキスト）
  // ================================
  async function saveProfile() {
    try {
      await client.post("/users/me/update", {
        name,
        bio,
        birthday,
      });

      alert("プロフィールを更新しました！");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("プロフィール更新に失敗しました。");
    }
  }

  // ================================
  // アバター保存
  // ================================
  async function saveAvatar() {
    if (!avatarFile) {
      alert("画像を選択してください");
      return;
    }

    const form = new FormData();
    form.append("avatar", avatarFile);

    try {
      await client.post("/users/me/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("アイコンを更新しました！");
      navigate("/profile");
    } catch (e) {
      console.error(e);
      alert("アイコンの更新に失敗しました。");
    }
  }

  if (!name) return <div style={{ padding: 20 }}>読み込み中...</div>;

  // ================================
  // UI（Etsy風カード）
  // ================================
  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "30px 18px",
        fontFamily: "'Georgia', serif",
      }}
    >
      <h2 style={{ fontWeight: 800, marginBottom: 20 }}>プロフィール編集</h2>

      <div
        style={{
          background: "#fff",
          padding: "26px",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        }}
      >
        {/* ======== アイコン編集 ======== */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <img
            src={avatarPreview || "/noimage.png"}
            alt="avatar"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #eee",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />

          <div style={{ marginTop: 12 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <button
            onClick={saveAvatar}
            style={{
              marginTop: 10,
              background: "#d97757",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            アイコンを更新
          </button>
        </div>

        {/* ======== 名前 ======== */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 600 }}>名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              marginTop: 6,
            }}
          />
        </div>

        {/* ======== Bio ======== */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 600 }}>自己紹介</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              marginTop: 6,
            }}
          />
        </div>

        {/* ======== 誕生日 ======== */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 600 }}>誕生日</label>
          <input
            type="date"
            value={birthday || ""}
            onChange={(e) => setBirthday(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              marginTop: 6,
            }}
          />
        </div>

        {/* ======== 保存ボタン ======== */}
        <button
          onClick={saveProfile}
          style={{
            width: "100%",
            padding: "12px",
            background: "#3f3a38",
            color: "#fff",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          プロフィールを保存
        </button>
      </div>

      <button
        onClick={() => navigate("/profile")}
        style={{
          marginTop: 18,
          background: "transparent",
          border: "none",
          color: "#d97757",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        ← マイページに戻る
      </button>
    </div>
  );
}
