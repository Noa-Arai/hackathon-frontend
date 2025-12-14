// src/pages/MessageRoom.js
import React, { useEffect, useState, useCallback } from "react";
import { client } from "../api/client";
import { useParams } from "react-router-dom";
import { theme } from "../App";

export default function MessageRoom() {
  const { itemId, partnerId } = useParams();
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    client.get("/users/me", { headers: { Authorization: `Bearer ${token}` } }).then(res=>setMe(res.data));
  }, [token]);

  const loadMessages = useCallback(async () => {
    if (!itemId || !partnerId) return;
    const res = await client.get(`/messages/room?item_id=${itemId}&partner_id=${partnerId}`, { headers: { Authorization: `Bearer ${token}` } });
    setMessages(res.data || []);
  }, [itemId, partnerId, token]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const sendMessage = async () => {
    if (!text) return;
    await client.post("/messages", { item_id: Number(itemId), partner_id: String(partnerId), text }, { headers: { Authorization: `Bearer ${token}` } });
    setText(""); loadMessages();
  };

  if (!me) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", borderRadius: theme.radius, boxShadow: theme.colors.shadow, padding: "20px", height: "80vh", display: "flex", flexDirection: "column" }}>
      <h2 style={{ fontFamily: theme.fonts.serif, borderBottom: `1px solid ${theme.colors.border}`, paddingBottom: "15px", marginBottom: "0", fontSize: "18px" }}>MESSAGES</h2>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
        {(messages || []).map((msg) => {
          const isMe = msg.from_user_id === me.id;
          return (
            <div key={msg.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: isMe ? theme.colors.primary : "#f1f1f1", // 自分はゴールド、相手はグレー
                  color: isMe ? "#fff" : "#333",
                  fontSize: "14px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "10px", borderTop: `1px solid ${theme.colors.border}`, paddingTop: "15px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: theme.radius, border: `1px solid ${theme.colors.border}`, outline: "none" }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} style={{ padding: "0 20px", background: theme.colors.text, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: "bold", cursor: "pointer" }}>
          SEND
        </button>
      </div>
    </div>
  );
}