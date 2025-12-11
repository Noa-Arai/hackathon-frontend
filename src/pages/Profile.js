// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
// App.jsからテーマをインポート（パスは適宜調整してください。同じ階層ならこれでOK）
import { theme } from "../App";

const BASE =
  process.env.NODE_ENV === "production"
    ? "https://hackathon-backend-563488838141.us-central1.run.app"
    : "http://localhost:8080";

export default function Profile() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [myDMs, setMyDMs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    client.get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMe(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!me || !token) return;
    client.get("/items/list", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = res.data || [];
        const items = data.filter((it) => String(it.user_id) === String(me.id));
        setMyItems(items);
      })
      .catch((err) => console.error(err));
  }, [me]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!me || !token) return;
    async function loadDM() {
      try {
        const res = await client.get("/messages/rooms", { headers: { Authorization: `Bearer ${token}` } });
        setMyDMs(res.data || []);
      } catch (err) {
        console.error(err);
        setMyDMs([]);
      }
    }
    loadDM();
  }, [me]);

  if (!me) return <div style={{ padding: "40px", textAlign: "center" }}>読み込み中...</div>;

  const sectionTitleStyle = {
    fontFamily: theme.fonts.serif,
    fontSize: "22px",
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: "24px",
    paddingBottom: "12px",
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* ---- プロフィールヘッダー ---- */}
      <div
        style={{
          background: theme.colors.secondaryBg,
          padding: "32px",
          borderRadius: theme.radius,
          boxShadow: theme.colors.shadow,
          marginBottom: "48px",
          display: "flex",
          alignItems: "flex-start",
          gap: "24px",
        }}
      >
        {/* アバター */}
        <img
          src={me.avatarURL ? `${BASE}${me.avatarURL}` : "/noimage.png"}
          alt={me.name}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            border: `3px solid ${theme.colors.background}`,
            boxShadow: theme.colors.shadow,
          }}
          onError={(e) => (e.target.src = "/noimage.png")}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2
              style={{
                margin: 0,
                fontFamily: theme.fonts.serif,
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              {me.name}
            </h2>
            <button
              onClick={() => navigate("/profile/edit")}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                background: theme.colors.background,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 600,
                fontFamily: theme.fonts.sans,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.text;
                e.currentTarget.style.background = "#F0EAE2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.background = theme.colors.background;
              }}
            >
              プロフィールを編集
            </button>
          </div>
          <p style={{ color: theme.colors.textLight, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {me.bio || "自己紹介はまだありません。"}
          </p>
          {me.birthday && (
            <p style={{ color: theme.colors.textLight, fontSize: "14px", marginTop: "12px" }}>
              🎂 {new Date(me.birthday).toLocaleDateString()} 生まれ
            </p>
          )}
        </div>
      </div>

      {/* ---- 出品一覧 ---- */}
      <div style={{ marginBottom: "48px" }}>
        <h3 style={sectionTitleStyle}>出品中の商品 ({myItems?.length || 0})</h3>

        {(!myItems || myItems.length === 0) && (
          <p style={{ color: theme.colors.textLight, textAlign: "center", padding: "40px" }}>
            まだ出品がありません。
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "24px",
          }}
        >
          {(myItems || []).map((item) => (
            <div
              key={item.id}
              style={{
                background: theme.colors.secondaryBg,
                borderRadius: theme.radius,
                overflow: "hidden",
                boxShadow: theme.colors.shadow,
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme.colors.shadowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.colors.shadow;
              }}
              onClick={() => navigate(`/items/${item.id}`)} // 商品詳細へ
            >
              <div style={{ aspectRatio: "4/3", background: "#f0f0f0" }}>
                <img
                  src={item.image1_url ? `${BASE}${item.image1_url}` : "/noimage.png"}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/noimage.png")}
                />
              </div>
              <div style={{ padding: "16px" }}>
                <h4
                  style={{
                    margin: "0 0 8px",
                    fontSize: "16px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </h4>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <p style={{ margin: 0, fontWeight: 700, color: theme.colors.text }}>
                    ¥{item.price.toLocaleString()}
                   </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 親のonClickを止める
                      navigate(`/items/edit/${item.id}`);
                    }}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      background: "transparent",
                      color: theme.colors.textLight,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.colors.text}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.colors.border}
                  >
                    編集
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- DM一覧 ---- */}
      <div>
        <h3 style={sectionTitleStyle}>メッセージ ({myDMs?.length || 0})</h3>

        {(!myDMs || myDMs.length === 0) && (
          <p style={{ color: theme.colors.textLight, textAlign: "center", padding: "40px" }}>
            まだメッセージはありません。
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(myDMs || []).map((dm) => (
            <div
              key={`${dm.item_id}-${dm.partner_id}`}
              style={{
                background: theme.colors.secondaryBg,
                padding: "20px",
                borderRadius: theme.radius,
                boxShadow: theme.colors.shadow,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                transition: "all 0.2s",
                borderLeft: dm.unread_count > 0 ? `4px solid ${theme.colors.primary}` : "4px solid transparent",
              }}
              onClick={() => navigate(`/messages/${dm.item_id}/${dm.partner_id}`)}
              onMouseEnter={(e) => {
                 e.currentTarget.style.boxShadow = theme.colors.shadowHover;
                 e.currentTarget.style.background = "#FAFAFA";
              }}
              onMouseLeave={(e) => {
                 e.currentTarget.style.boxShadow = theme.colors.shadow;
                 e.currentTarget.style.background = theme.colors.secondaryBg;
              }}
            >
              {/* 相手のアバター（もしあれば表示、なければイニシャルなど） */}
              <div style={{
                  width: "48px", height: "48px", borderRadius: "50%", background: "#eee",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", color: "#999", fontSize: "20px"
              }}>
                {(dm.partner_name || "U")[0].toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, fontSize: "16px" }}>
                    {dm.partner_name || "名無しユーザー"}
                  </span>
                  <span style={{ fontSize: "12px", color: theme.colors.textLight }}>
                    Item ID: {dm.item_id}
                  </span>
                </div>
                <div
                  style={{
                    color: dm.unread_count > 0 ? theme.colors.text : theme.colors.textLight,
                    fontSize: "14px",
                    fontWeight: dm.unread_count > 0 ? 600 : 400,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                  }}
                >
                  {dm.last_message || "メッセージなし"}
                </div>
              </div>

              {/* 未読バッジ */}
              {dm.unread_count > 0 && (
                <div
                  style={{
                    background: theme.colors.primary,
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    minWidth: "24px",
                    textAlign: "center"
                  }}
                >
                  {dm.unread_count}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}