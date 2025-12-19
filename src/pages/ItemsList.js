// src/pages/ItemsList.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App"; 
import EmotionSearch from "../components/EmotionSearch";

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <div>
      <h2
        style={{
          marginBottom: "30px",
          fontFamily: theme.fonts.serif,
          fontSize: "24px",
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: "10px",
        }}
      >
        NEW ARRIVALS
      </h2>

      {/* AI感情検索 */}
      <EmotionSearch />

      {/* カテゴリーフィルタ */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        {[
          { id: "all", label: "ALL" },
          { id: "fashion", label: "👗 Fashion" },
          { id: "gadget", label: "📱 Gadget" },
          { id: "interior", label: "🪑 Interior" },
          { id: "hobby", label: "🎮 Hobby" },
          { id: "other", label: "📦 Other" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              background: selectedCategory === cat.id ? theme.colors.text : "#eee",
              color: selectedCategory === cat.id ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 商品リスト */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "30px",
        }}
      >
        {filteredItems.map((item) => (
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
              position: "relative" // 配置調整用にrelative推奨
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
            {/* 画像エリア */}
            <div style={{ position: "relative", paddingTop: "75%", background: "#f0f0f0" }}>
              <img
                src={item.image1_url ? `${BASE}${item.image1_url}` : "/noimage.svg"}
                alt={item.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  // 福袋ならぼかす
                  filter: item.is_lucky_bag ? "blur(20px)" : "none",
                  transform: item.is_lucky_bag ? "scale(1.2)" : "none",
                  transition: "filter 0.3s"
                }}
                // 🔥 修正: 無限ループ防止 (nullを入れて再発火を防ぐ)
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/noimage.svg";
                }}
              />
              
              {/* 福袋用のオーバーレイ */}
              {item.is_lucky_bag && (
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  zIndex: 2, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ fontSize: "40px" }}>🎁</div>
                  <div style={{ fontWeight: "bold", fontSize: "18px", letterSpacing: "0.1em" }}>SECRET</div>
                </div>
              )}

              {/* カテゴリーラベル */}
              <span style={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                fontSize: "10px",
                padding: "4px 8px",
                borderRadius: "4px",
                textTransform: "uppercase",
                zIndex: 3 // 画像より上に
              }}>
                {item.category || "other"}
              </span>
            </div>

            {/* テキストエリア */}
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
                {/* 🔥 修正: 重複していた {item.title} を削除しました */}
                {item.is_lucky_bag ? "🔒 シークレット商品" : item.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: theme.colors.primary,
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