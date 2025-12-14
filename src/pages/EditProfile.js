// src/pages/EditProfile.js
import React, { useState, useEffect } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App";

const BASE_URL = process.env.NODE_ENV === "production" ? "https://hackathon-backend-563488838141.us-central1.run.app" : "http://localhost:8080";

export default function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if(!token) return;
    client.get("/users/me", { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      setName(res.data.name); setBio(res.data.bio); setBirthday(res.data.birthday);
      if(res.data.avatarURL) setAvatarPreview(`${BASE_URL}${res.data.avatarURL}`);
    });
  }, [token]);

  const saveProfile = async () => {
    await client.post("/users/me/update", { name, bio, birthday }, { headers: { Authorization: `Bearer ${token}` } });
    navigate("/profile");
  };

  const saveAvatar = async () => {
    if (!avatarFile) return;
    const form = new FormData(); form.append("avatar", avatarFile);
    await client.post("/users/me/avatar", form, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } });
    navigate("/profile");
  };

  const inputStyle = { width: "100%", padding: "12px", borderRadius: theme.radius, border: `1px solid ${theme.colors.border}`, marginBottom: "20px" };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "8px", color: theme.colors.textLight };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px", background: "#fff", borderRadius: theme.radius, boxShadow: theme.colors.shadow }}>
      <h2 style={{ fontFamily: theme.fonts.serif, marginBottom: "30px" }}>Edit Profile</h2>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img src={avatarPreview || "/noimage.png"} alt="" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }} onError={(e)=>e.target.src="/noimage.png"} />
        <div style={{ marginTop: 10 }}>
            <input type="file" onChange={(e)=>{ const f=e.target.files[0]; if(f){ setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }}} />
            <button onClick={saveAvatar} style={{ marginLeft: 10, padding: "6px 12px", background: theme.colors.primary, color: "#fff", border: "none", borderRadius: theme.radius, cursor: "pointer", fontSize:"12px" }}>Update Icon</button>
        </div>
      </div>

      <label style={labelStyle}>NAME</label>
      <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>BIO</label>
      <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>BIRTHDAY</label>
      <input type="date" value={birthday || ""} onChange={(e) => setBirthday(e.target.value)} style={inputStyle} />

      <button onClick={saveProfile} style={{ width: "100%", padding: "14px", background: theme.colors.text, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: "bold", cursor: "pointer" }}>
        SAVE PROFILE
      </button>
    </div>
  );
}