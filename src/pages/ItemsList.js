// src/pages/ItemsList.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App"; // テーマ読み込み

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const BASE =
    process.env.NODE_ENV === "production"
      ? "https://hackathon-backend-563488838141.us-central1.run.app"
      : "http://localhost:8080";

  useEffect(() => {
    client.get("/items/list").then((res) => {
      setItems(res.data || []);
    });
  }, []);

  return (
    <div>
      <h2
        style={{
          marginBottom: "30px",
          fontFamily: theme.fonts.serif, // セリフ体で見出し
          fontSize: "24px",
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: "10px",
        }}
      >
        NEW ARRIVALS
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "30px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/items/${item.id}`)}
            style={{
              background: theme.colors.secondaryBg,
              borderRadius: theme.radius,
              boxShadow: theme.colors.shadow,
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = theme.colors.shadowHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = theme.colors.shadow;
            }}
          >
            {/* 画像部分 */}
            <div style={{ position: "relative", paddingTop: "75%", background: "#f0f0f0" }}>
              <img
                src={item.image1_url ? `${BASE}${item.image1_url}` : "/noimage.png"}
                alt={item.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => (e.target.src = "/noimage.png")}
              />
            </div>

            {/* テキスト部分 */}
            <div style={{ padding: "20px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontWeight: "500",
                  fontSize: "15px",
                  color: theme.colors.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: theme.colors.primary, // ゴールド価格
                  fontFamily: theme.fonts.sans,
                }}
              >
                ¥{item.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}