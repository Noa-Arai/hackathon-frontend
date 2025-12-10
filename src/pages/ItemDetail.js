// src/pages/ItemDetail.js
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../api/client";

const BASE = "https://hackathon-backend-563488838141.us-central1.run.app";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  // 商品取得
  useEffect(() => {
    client.get("/items/list").then((res) => {
      const list = res.data || [];
      const found = list.find((it) => String(it.id) === String(id));
      setItem(found || null);
    });
  }, [id]);

  // 自分のプロフィール
  useEffect(() => {
    client.get("/users/me").then((res) => setMe(res.data));
  }, []);

  if (!item) return <p style={{ padding: 20 }}>読み込み中...</p>;

  const sellerId = item.user_id;
  const img1 = item.image1_url ? `${BASE}${item.image1_url}` : "/noimage.png";
  const img2 = item.image2_url ? `${BASE}${item.image2_url}` : null;
  const img3 = item.image3_url ? `${BASE}${item.image3_url}` : null;

  // ⭐ 購入処理（最小限の追加）
  const handlePurchase = async () => {
    try {
      await client.post("/purchase", {
        item_id: Number(item.id),   // ★ここだけ変更
      });

    alert("購入が完了しました！");
    navigate("/items");
  } catch (err) {
    console.error(err);
    alert("購入に失敗しました");
  }
};


  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Georgia', serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "start",
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <img
            src={img1}
            alt=""
            style={{
              width: "100%",
              borderRadius: "12px",
              marginBottom: "14px",
              objectFit: "cover",
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            {img2 && (
              <img
                src={img2}
                alt=""
                style={{ width: "30%", borderRadius: "8px" }}
              />
            )}
            {img3 && (
              <img
                src={img3}
                alt=""
                style={{ width: "30%", borderRadius: "8px" }}
              />
            )}
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700 }}>{item.title}</h1>

          <p style={{ marginTop: "10px", fontSize: "18px", color: "#444" }}>
            {item.description || "説明文がありません"}
          </p>

          <p style={{ marginTop: "16px", fontSize: "22px", fontWeight: 700 }}>
            ¥{item.price}
          </p>

          {/* DMボタン（変更なし） */}
          {me && me.id !== sellerId && (
            <button
              onClick={() => navigate(`/messages/${item.id}/${sellerId}`)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                borderRadius: "999px",
                background: "#d97757",
                color: "#fff",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
              }}
            >
              出品者にメッセージする
            </button>
          )}

          {/* 購入ボタン（ここだけ修正） */}
          {me && me.id !== sellerId && (
            <button
              onClick={handlePurchase}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "12px",
                borderRadius: "999px",
                background: "#3f3a38",
                color: "#fff",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
              }}
            >
              購入する
            </button>
          )}
        </div>
      </div>

      <Link
        to="/items"
        style={{ display: "block", marginTop: "20px", color: "#d97757" }}
      >
        ← 商品一覧へ戻る
      </Link>
    </div>
  );
}
