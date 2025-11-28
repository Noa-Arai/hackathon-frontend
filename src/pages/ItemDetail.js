// src/pages/ItemDetail.js
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../api/client";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ★ Cloud Run のベースURL（一覧と同じ）
  const BASE = "https://hackathon-backend-563488838141.us-central1.run.app";

  useEffect(() => {
    client
      .get("/items/list")
      .then((res) => {
        const items = res.data || [];
        const found = items.find((i) => String(i.id) === id);
        setItem(found || null);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePurchase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("購入するにはログインが必要です");
      navigate("/login");
      return;
    }

    try {
      await client.post("/purchase", { item_id: Number(id) });
      alert("購入が完了しました！");
      navigate("/items");
    } catch (err) {
      console.error(err);
      alert("購入に失敗しました");
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!item) return <p>商品が見つかりませんでした。</p>;

  // ★ 画像URLをまとめる
  const images = [];
  if (item.image1_url) images.push(BASE + item.image1_url);
  if (item.image2_url) images.push(BASE + item.image2_url);
  if (item.image3_url) images.push(BASE + item.image3_url);

  // -------------------------------
  // ここからUI
  // -------------------------------

  return (
    <div>
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px 22px",
          boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1.5fr)",
          gap: "20px",
        }}
      >
        {/* ------- 画像エリア ------- */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            borderRadius: "14px",
            background: "#f5eee9",
            padding: "10px",
          }}
        >
          {images.length > 0 ? (
            images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`item-${idx}`}
                style={{
                  width: "300px",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ))
          ) : (
            <span style={{ fontSize: "13px", color: "#a28a7a" }}>No Image</span>
          )}
        </div>

        {/* ------- 詳細エリア ------- */}
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
            {item.title}
          </h1>

          <div style={{ fontSize: "20px", fontWeight: 700, color: "#d97757" }}>
            {item.price} 円
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#7a6c65",
              marginTop: "14px",
              marginBottom: "4px",
            }}
          >
            商品の説明
          </div>

          <div
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#4b4b4b",
              whiteSpace: "pre-wrap",
            }}
          >
            {item.description}
          </div>

          <button
            style={{
              marginTop: "20px",
              borderRadius: "999px",
              border: "none",
              padding: "14px 20px",
              fontSize: "16px",
              fontWeight: 700,
              background: "#d97757",
              color: "#fff",
              cursor: "pointer",
              width: "100%",
              letterSpacing: "0.03em",
            }}
            onClick={handlePurchase}
          >
            この商品を購入する
          </button>
        </div>
      </div>

      <Link
        to="/items"
        style={{
          display: "inline-block",
          marginTop: "18px",
          fontSize: "14px",
          color: "#7a6c65",
          textDecoration: "none",
        }}
      >
        ← 商品一覧に戻る
      </Link>
    </div>
  );
}
