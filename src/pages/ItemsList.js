import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";
import { theme } from "../App"; 
import EmotionSearch from "../components/EmotionSearch";

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
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

  // 🔥 修正: ここで「カテゴリー」と「キーワード」の両方を使って絞り込みます
  const filteredItems = items.filter((item) => {
    // 1. カテゴリ判定
    const isCategoryMatch = selectedCategory === "all" || item.category === selectedCategory;

    // 2. キーワード判定 (タイトル または 説明文 に含まれているか)
    // ※ null安全対策: データがなくても空文字として扱うことでクラッシュを防ぐ
    const title = item.title || "";
    const desc = item.description || "";
    
    const isKeywordMatch = searchKeyword === "" 
      || title.includes(searchKeyword) 
      || desc.includes(searchKeyword);

    // 両方の条件を満たすものだけを表示
    return isCategoryMatch && isKeywordMatch;
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
      <EmotionSearch onSearch={(word) => setSearchKeyword(word)} />

      {/* 🔥 追加: 検索中であることがわかるように表示 & リセットボタン */}
      {searchKeyword && (
        <div style={{ margin: "-20px 0 20px", padding: "10px", background: "#f0f8ff", borderRadius: "4px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>🔍 絞り込み中: <strong>{searchKeyword}</strong></span>
          <button 
            onClick={() => setSearchKeyword("")}
            style={{ padding: "4px 8px", cursor: "pointer", border: "1px solid #ccc", background: "#fff", borderRadius: "4px" }}
          >
            × 解除
          </button>
        </div>
      )}

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
              position: "relative"
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
                  filter: item.is_lucky_bag ? "blur(20px)" : "none",
                  transform: item.is_lucky_bag ? "scale(1.2)" : "none",
                  transition: "filter 0.3s"
                }}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/noimage.svg";
                }}
              />
              
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
                zIndex: 3
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