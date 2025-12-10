// src/pages/ItemsList.js
import React, { useEffect, useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const BASE = "https://hackathon-backend-563488838141.us-central1.run.app";

  useEffect(() => {
    client.get("/items/list").then((res) => {
      setItems(res.data || []);
    });
  }, []);

  const getImage = (item) => {
    if (item.image1_url) return BASE + item.image1_url;
    if (item.image2_url) return BASE + item.image2_url;
    if (item.image3_url) return BASE + item.image3_url;
    return "/noimage.png";
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>人気商品</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/items/${item.id}`)}
            style={{
              background: "#fff",
              padding: "14px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              cursor: "pointer",
            }}
          >
            <img
              src={getImage(item)}
              alt={item.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <p style={{ marginTop: "12px", fontWeight: "600" }}>{item.title}</p>
            <p style={{ fontSize: "16px", fontWeight: "700" }}>¥{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
