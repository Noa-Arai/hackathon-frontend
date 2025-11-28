// src/pages/ItemsList.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../api/client";

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get("/items/list")
      .then((res) => {
        setItems(res.data || []);
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("商品一覧の取得に失敗しました");
      })
      .finally(() => setLoading(false));
  }, []);

  const BASE = "https://hackathon-backend-563488838141.us-central1.run.app";

  const getThumbnail = (item) => {
    if (item.image1_url) return BASE + item.image1_url;
    if (item.image2_url) return BASE + item.image2_url;
    if (item.image3_url) return BASE + item.image3_url;
    return null;
  };

  const listStyles = {
    headerArea: {
      marginBottom: "20px",
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      marginBottom: "4px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#7a6c65",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
      marginTop: "12px",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "12px 12px 14px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
      cursor: "pointer",
      transition: "transform 0.12s ease, box-shadow 0.12s ease",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    imageBox: {
      width: "100%",
      borderRadius: "12px",
      background: "#f5eee9",
      overflow: "hidden",
      aspectRatio: "4/3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "6px",
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    titleText: {
      fontSize: "15px",
      fontWeight: 600,
      color: "#3f3a38",
    },
    desc: {
      fontSize: "13px",
      color: "#7a6c65",
      minHeight: "36px",
    },
    price: {
      fontSize: "15px",
      fontWeight: 700,
      marginTop: "4px",
      color: "#d97757",
    },
    empty: {
      marginTop: "24px",
      fontSize: "14px",
      color: "#7a6c65",
    },
  };

  const handleClickItem = (id) => {
    navigate(`/items/${id}`);
  };

  const thumbnail = (item) => getThumbnail(item);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div>
      <div style={listStyles.headerArea}>
        <h1 style={listStyles.title}>みんなの出品アイテム</h1>
        <p style={listStyles.subtitle}>気になるアイテムをクリックすると詳細が見られます。</p>
      </div>

      {items.length === 0 && <p style={listStyles.empty}>まだ商品がありません。最初の出品者になりませんか？</p>}

      <div style={listStyles.grid}>
        {items.map((item) => (
          <div
            key={item.id}
            style={listStyles.card}
            onClick={() => handleClickItem(item.id)}
          >
            <div style={listStyles.imageBox}>
              {thumbnail(item) ? (
                <img
                  src={thumbnail(item)}
                  alt={item.title}
                  style={listStyles.img}
                />
              ) : (
                <span style={{ fontSize: "12px", color: "#a28a7a" }}>
                  No Image
                </span>
              )}
            </div>
            <div>
              <div style={listStyles.titleText}>{item.title}</div>
              <div style={listStyles.desc}>
                {item.description?.length > 60
                  ? item.description.slice(0, 60) + "..."
                  : item.description}
              </div>
              <div style={listStyles.price}>{item.price} 円</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
