// src/pages/ItemDetail.js
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../api/client";
import { theme } from "../App"; // テーマ読み込み

const BASE =
  process.env.NODE_ENV === "production"
    ? "https://hackathon-backend-563488838141.us-central1.run.app"
    : "http://localhost:8080";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    client.get("/items/list").then((res) => {
      const list = res.data || [];
      const found = list.find((it) => String(it.id) === String(id));
      setItem(found || null);
    });
  }, [id]);

  useEffect(() => {
    client.get("/users/me").then((res) => setMe(res.data)).catch(()=>{});
  }, []);

  if (!item) return <p style={{ padding: 40, textAlign:"center" }}>Loading...</p>;

  const sellerId = item.user_id;
  const img1 = item.image1_url ? `${BASE}${item.image1_url}` : "/noimage.png";
  const img2 = item.image2_url ? `${BASE}${item.image2_url}` : null;
  const img3 = item.image3_url ? `${BASE}${item.image3_url}` : null;

  const handlePurchase = async () => {
    try {
      await client.post("/purchase", { item_id: Number(item.id) });
      alert("購入手続きが完了しました。");
      navigate("/items");
    } catch (err) {
      console.error(err);
      alert("購入に失敗しました");
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "start",
          background: theme.colors.secondaryBg,
          padding: "40px",
          borderRadius: theme.radius,
          boxShadow: theme.colors.shadow,
        }}
      >
        {/* 左側：画像 */}
        <div>
          <div style={{ borderRadius: theme.radius, overflow: "hidden", marginBottom: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <img src={img1} alt="" style={{ width: "100%", display: "block" }} onError={(e)=>e.target.src="/noimage.png"}/>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {img2 && <img src={img2} alt="" style={{ width: "80px", height:"80px", objectFit:"cover", borderRadius: theme.radius, cursor:"pointer" }} />}
            {img3 && <img src={img3} alt="" style={{ width: "80px", height:"80px", objectFit:"cover", borderRadius: theme.radius, cursor:"pointer" }} />}
          </div>
        </div>

        {/* 右側：情報 */}
        <div>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: "32px", marginBottom: "20px", lineHeight: 1.3 }}>
            {item.title}
          </h1>

          <p style={{ fontSize: "24px", fontWeight: "bold", color: theme.colors.primary, marginBottom: "30px" }}>
            ¥{item.price.toLocaleString()}
          </p>

          <p style={{ lineHeight: 1.8, color: theme.colors.textLight, marginBottom: "40px", whiteSpace: "pre-wrap" }}>
            {item.description || "No description."}
          </p>

          {/* アクションボタン */}
          {me && me.id !== sellerId ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <button
                onClick={handlePurchase}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: theme.colors.primary, // ゴールド
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: theme.radius,
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e)=>e.target.style.background=theme.colors.primaryHover}
                onMouseLeave={(e)=>e.target.style.background=theme.colors.primary}
              >
                購入手続きへ
              </button>
              
              <button
                onClick={() => navigate(`/messages/${item.id}/${sellerId}`)}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "transparent",
                  color: theme.colors.text,
                  fontSize: "14px",
                  fontWeight: "bold",
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius,
                  cursor: "pointer",
                }}
              >
                出品者に質問する
              </button>
            </div>
          ) : (
            <div style={{ padding: "20px", background: "#f9f9f9", color: "#999", textAlign: "center", borderRadius: theme.radius }}>
              {me ? "あなたの商品です" : "購入するにはログインしてください"}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <Link to="/items" style={{ color: theme.colors.textLight, textDecoration: "none", fontSize: "14px" }}>
          ← Back to List
        </Link>
      </div>
    </div>
  );
}