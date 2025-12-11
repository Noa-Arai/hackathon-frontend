// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";

const BASE = "https://hackathon-backend-563488838141.us-central1.run.app";

export default function Profile() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [myDMs, setMyDMs] = useState([]);

  // ① プロフィール取得
  useEffect(() => {
    client.get("/users/me")
      .then((res) => setMe(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ② 自分の出品一覧
  useEffect(() => {
    if (!me) return;

    client.get("/items/list")
      .then((res) => {
        // nullガード: 配列じゃなければ空配列にする
        const data = res.data || [];
        const items = data.filter((it) => String(it.user_id) === String(me.id));
        setMyItems(items);
      })
      .catch((err) => console.error(err));
  }, [me]);

  // ③ DM一覧
  useEffect(() => {
    if (!me) return;

    async function loadDM() {
      try {
        const res = await client.get("/messages/rooms");
        // 🔥 ここ重要: APIが null を返しても空配列 [] に変換してセットする
        setMyDMs(res.data || []);
      } catch (err) {
        console.error(err);
        setMyDMs([]); // エラー時も空配列へ
      }
    }
    loadDM();
  }, [me]);

  if (!me) return <div>読み込み中...</div>;

  return (
    <div style={{ padding: "20px" }}>
      {/* ---- プロフィール ---- */}
      <h2>{me.name}</h2>
      <p>{me.bio}</p>
      <p>Birthday: {me.birthday}</p>

      {/* ---- 出品一覧 ---- */}
      <h3 style={{ marginTop: "30px" }}>出品中の商品</h3>
      
      {/* 🔥 修正1: データがnullでも落ちないようにチェック */}
      {(!myItems || myItems.length === 0) && <p>まだ出品がありません。</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px",
          marginTop: "12px",
        }}
      >
        {/* 🔥 修正2: データがnullでも落ちないように ( || [] ) を追加 */}
        {(myItems || []).map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              padding: "14px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={item.image1_url ? `${BASE}${item.image1_url}` : "/noimage.png"}
              alt=""
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onError={(e) => e.target.src = "/noimage.png"} // 画像エラー対策も追加
            />
            <p style={{ fontWeight: "600", marginTop: "10px" }}>
              {item.title}
            </p>

            <button
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                background: "#4CAF50",
                color: "#fff",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/items/edit/${item.id}`)}
            >
              編集する
            </button>
          </div>
        ))}
      </div>

      {/* ---- DM一覧 ---- */}
      <h3 style={{ marginTop: "40px" }}>DM（取引メッセージ）</h3>

      {/* 🔥 修正3: ここもnullガードを追加 */}
      {(!myDMs || myDMs.length === 0) && <p>まだ DM はありません。</p>}

      {/* 🔥 修正4: ここも ( || [] ) で囲む */}
      {(myDMs || []).map((dm) => (
        <div
          key={`${dm.item_id}-${dm.partner_id}`}
          style={{
            background: "#fff",
            padding: 12,
            marginTop: 12,
            borderRadius: 10,
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() =>
            navigate(`/messages/${dm.item_id}/${dm.partner_id}`)
          }
        >
          <div style={{ fontWeight: 600 }}>
            {dm.partner_name || "名無しユーザー"}
            <span style={{ fontSize: "0.8em", color: "#888", marginLeft: 8}}>
                (Item ID: {dm.item_id})
            </span>
          </div>
          <div style={{ color: "#555", marginTop: 4 }}>{dm.last_message || "メッセージなし"}</div>

          {/* 未読バッジ */}
          {dm.unread_count > 0 && (
            <div
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                background: "red",
                color: "white",
                padding: "2px 6px",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            >
              {dm.unread_count}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}