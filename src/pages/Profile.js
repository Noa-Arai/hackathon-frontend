// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App"; // テーマ読み込み

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

  if (!me) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  const sectionTitleStyle = {
    fontFamily: theme.fonts.serif,
    fontSize: "22px",
    color: theme.colors.text,
    marginBottom: "24px",
    marginTop: "0",
    borderBottom: `1px solid ${theme.colors.border}`,
    paddingBottom: "10px",
    letterSpacing: "0.05em"
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* ---- プロフィールヘッダー ---- */}
      <div
        style={{
          background: theme.colors.secondaryBg,
          padding: "40px",
          borderRadius: theme.radius,
          boxShadow: theme.colors.shadow,
          marginBottom: "50px",
          display: "flex",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {/* アバター */}
        <div style={{ position: "relative" }}>
          {/* 🔥 無限ループ対策済み */}
          <img
            src={me.avatarURL ? `${BASE}${me.avatarURL}&t=${new Date().getTime()}` : "/noimage.svg"}
            alt={me.name}
            style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `1px solid ${theme.colors.border}`,
            }}
            onError={(e) => {
               if (e.target.src.includes("noimage.svg")) {
                 e.target.style.display = "none";
               } else {
                 e.target.src = "/noimage.svg";
               }
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2
              style={{
                margin: 0,
                fontFamily: theme.fonts.serif,
                fontSize: "32px",
                fontWeight: "normal",
                letterSpacing: "0.05em"
              }}
            >
              {me.name}
            </h2>
            <button
              onClick={() => navigate("/profile/edit")}
              style={{
                padding: "8px 20px",
                fontSize: "13px",
                background: "transparent",
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius,
                cursor: "pointer",
                fontWeight: "bold",
                letterSpacing: "0.05em",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.text;
                e.currentTarget.style.background = "#f9f9f9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.background = "transparent";
              }}
            >
              EDIT PROFILE
            </button>
          </div>
          <p style={{ color: theme.colors.textLight, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: theme.fonts.sans }}>
            {me.bio || "No biography yet."}
          </p>
          {me.birthday && (
            <p style={{ color: theme.colors.textLight, fontSize: "13px", marginTop: "12px", fontFamily: theme.fonts.sans }}>
              BIRTHDAY: {new Date(me.birthday).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
          
        {/* ---- 出品一覧 (My Items) ---- */}
        <div>
            <h3 style={sectionTitleStyle}>MY ITEMS ({myItems?.length || 0})</h3>

            {(!myItems || myItems.length === 0) && (
            <p style={{ color: theme.colors.textLight, padding: "20px 0" }}>
                まだ出品がありません。
            </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {(myItems || []).map((item) => (
                <div
                key={item.id}
                style={{
                    display: "flex",
                    gap: "16px",
                    background: theme.colors.secondaryBg,
                    padding: "12px",
                    borderRadius: theme.radius,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s"
                }}
                onClick={() => navigate(`/items/${item.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"}
                >
                {/* 🔥 無限ループ対策済み */}
                <img
                    src={item.image1_url ? `${BASE}${item.image1_url}` : "/noimage.svg"}
                    alt=""
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", background: "#f0f0f0" }}
                    onError={(e) => {
                      if (e.target.src.includes("noimage.svg")) return;
                      e.target.src = "/noimage.svg";
                    }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "4px" }}>{item.title}</div>
                        <div style={{ color: theme.colors.primary, fontWeight: "bold", fontFamily: theme.fonts.sans }}>¥{item.price.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/items/edit/${item.id}`);
                            }}
                            style={{
                                border: "none",
                                background: "transparent",
                                color: theme.colors.textLight,
                                fontSize: "12px",
                                cursor: "pointer",
                                textDecoration: "underline"
                            }}
                        >
                            編集する
                        </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* ---- DM一覧 (Messages) ---- */}
        <div>
            <h3 style={sectionTitleStyle}>MESSAGES ({myDMs?.length || 0})</h3>

            {(!myDMs || myDMs.length === 0) && (
            <p style={{ color: theme.colors.textLight, padding: "20px 0" }}>
                メッセージはありません。
            </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {(myDMs || []).map((dm) => (
                <div
                key={`${dm.item_id}-${dm.partner_id}`}
                style={{
                    background: theme.colors.secondaryBg,
                    padding: "16px",
                    borderRadius: theme.radius,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    transition: "background 0.2s",
                    borderLeft: dm.unread_count > 0 ? `4px solid ${theme.colors.primary}` : "4px solid transparent"
                }}
                onClick={() => navigate(`/messages/${dm.item_id}/${dm.partner_id}`)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={(e) => e.currentTarget.style.background = theme.colors.secondaryBg}
                >
                <div style={{
                    width: "40px", height: "40px", borderRadius: "50%", background: "#eee",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#999", fontSize: "16px", fontWeight: "bold"
                }}>
                    {(dm.partner_name || "U")[0].toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {dm.partner_name || "Unknown"}
                    </span>
                    <span style={{ fontSize: "11px", color: theme.colors.textLight }}>
                        ITEM: {dm.item_id}
                    </span>
                    </div>
                    <div
                    style={{
                        color: dm.unread_count > 0 ? theme.colors.text : theme.colors.textLight,
                        fontSize: "13px",
                        fontWeight: dm.unread_count > 0 ? "bold" : "normal",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                    }}
                    >
                    {dm.last_message || "No message"}
                    </div>
                </div>

                {/* 未読バッジ */}
                {dm.unread_count > 0 && (
                    <div
                    style={{
                        background: theme.colors.primary,
                        color: "white",
                        width: "20px", height: "20px",
                        borderRadius: "50%",
                        fontSize: "10px",
                        fontWeight: "bold",
                        display: "flex", alignItems: "center", justifyContent: "center"
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
    </div>
  );
}