// src/pages/MessageRoom.js
import React, { useEffect, useState, useCallback } from "react";
import { client } from "../api/client";
import { useParams } from "react-router-dom";

export default function MessageRoom() {
  const { itemId, partnerId } = useParams();
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  // =============== 自分の情報取得 ===============
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await client.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(res.data);
      } catch (err) {
        console.error("Failed to load me:", err);
      }
    };
    loadMe();
  }, [token]);

  // =============== メッセージ取得（＝既読化） ===============
  const loadMessages = useCallback(async () => {
    if (!itemId || !partnerId) return;

    try {
      const res = await client.get(
        `/messages/room?item_id=${itemId}&partner_id=${partnerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, [itemId, partnerId, token]);

  // 初回 + 依存変化で読み込み
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // =============== 送信 ===============
  const sendMessage = async () => {
    if (!text) return;

    try {
      await client.post(
        "/messages",
        {
            item_id: Number(itemId),
            partner_id: String(partnerId),   // ✅ バックエンドの仕様どおり
            text,
        },

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setText("");
      loadMessages(); // 送信後に更新
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!me) return <div>読み込み中...</div>;

  // =============== UI ===============
  return (
    <div style={{ padding: 20 }}>
      <h2>取引メッセージ</h2>

      <div
        style={{
          background: "#fafafa",
          padding: 12,
          borderRadius: 8,
          height: 400,
          overflowY: "auto",
          marginBottom: 12,
        }}
      >
        {(messages || []).map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 10,
              textAlign: msg.from_user_id === me.id ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                background:
                  msg.from_user_id === me.id ? "#d97757" : "#e5e7eb",
                color: msg.from_user_id === me.id ? "#fff" : "#333",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
          placeholder="メッセージを入力..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 16px",
            background: "#d97757",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          送信
        </button>
      </div>
    </div>
  );
}
