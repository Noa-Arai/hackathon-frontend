// src/pages/MessageList.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function MessageList() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [items, setItems] = useState([]); // 自分の商品
  const [latestMessages, setLatestMessages] = useState({}); // item_id → 最新メッセージ

  // -------------------------------------
  // 1. 自分のアカウント情報
  // -------------------------------------
  useEffect(() => {
    client.get("/users/me")
      .then((res) => setMe(res.data))
      .catch(() => {});
  }, []);

  // -------------------------------------
  // 2. 自分の商品一覧
  // -------------------------------------
  useEffect(() => {
    if (!me) return;

    client.get("/items/list")
      .then((res) => {
        const myItems = res.data.filter((it) => it.user_id === me.id);
        setItems(myItems);
      })
      .catch(() => {});
  }, [me]);

  // -------------------------------------
  // 3. 各商品の最新メッセージを取得
  // -------------------------------------
  useEffect(() => {
    if (items.length === 0) return;

    async function loadAll() {
      const map = {};

      for (const item of items) {
        try {
          const res = await client.get(`/messages/list?item_id=${item.id}`);

          // null 対策（100%安全）
          const msgList = Array.isArray(res.data) ? res.data : [];

          if (msgList.length > 0) {
            map[item.id] = msgList[msgList.length - 1];
          }
        } catch (err) {
          console.error("メッセージ取得失敗:", err);
        }
      }

      setLatestMessages(map);
    }

    loadAll();
  }, [items]);

  if (!me) return <div>読み込み中…</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>取引メッセージ一覧</h2>

      {items.length === 0 && (
        <div style={{ marginTop: 20, color: "#888" }}>まだ出品した商品がありません。</div>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fff",
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/messages/${item.id}/${me.id}`)}
        >
          <div style={{ fontWeight: 600 }}>{item.title}</div>

          {latestMessages[item.id] ? (
            <div style={{ marginTop: 4, color: "#555" }}>
              {latestMessages[item.id].text}
            </div>
          ) : (
            <div style={{ marginTop: 4, color: "#aaa" }}>
              メッセージはまだありません
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
