// src/pages/ItemDetail.js
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../api/client";
import { theme } from "../App";

const BASE =
  process.env.NODE_ENV === "production"
    ? "https://hackathon-backend-563488838141.us-central1.run.app"
    : "http://localhost:8080";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [me, setMe] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false); // 喋ってるかどうかの状態
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
  // 🔥 修正: .svg に変更
  const img1 = item.image1_url ? `${BASE}${item.image1_url}` : "/noimage.svg";
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

  // 🗣️ 商品が喋る機能 (Browser Native API)
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = item.is_lucky_bag
      ? "中身は秘密ですが、とっても素敵な商品ですよ！あなたの運勢、試してみませんか？" // 福袋用のセリフ
      : `こちらは、${item.title}です。価格は${item.price}円。${item.description}`; // 通常のセリフ

    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = "ja-JP"; // 日本語設定
    uttr.pitch = 1.2;    // ちょっと高めの声
    uttr.rate = 1.1;     // 早口
    
    uttr.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(uttr);
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
          <div style={{ 
            borderRadius: theme.radius, 
            overflow: "hidden", 
            marginBottom: "16px", 
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            position: "relative" // secret表示用
          }}>
            <img 
              src={img1} 
              alt="" 
              style={{ 
                width: "100%", 
                display: "block",
                // 🔥 追加: 福袋ならぼかす
                filter: item.is_lucky_bag ? "blur(30px)" : "none",
                transform: item.is_lucky_bag ? "scale(1.1)" : "none",
              }} 
              // 🔥 修正: 無限ループ防止ストッパー
              onError={(e)=>{
                e.target.onerror = null; 
                e.target.src="/noimage.svg";
              }}
            />
            
            {/* 🔥 追加: SECRETオーバーレイ */}
            {item.is_lucky_bag && (
              <div style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                zIndex: 2, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)"
              }}>
                <div style={{ fontSize: "60px" }}>🎁</div>
                <div style={{ fontWeight: "bold", fontSize: "24px", letterSpacing: "0.1em" }}>SECRET ITEM</div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {/* サブ画像1 */}
{img2 && (
  <img 
    src={img2} 
    alt="" 
    style={{ width: "80px", height:"80px", objectFit:"cover", borderRadius: theme.radius, cursor:"pointer", filter: item.is_lucky_bag ? "blur(10px)" : "none" }} 
    // 🔥 追加: エラーなら非表示にする（これで404問題を視覚的に消す）
    onError={(e) => e.target.style.display = "none"}
  />
)}

{/* サブ画像2 */}
{img3 && (
  <img 
    src={img3} 
    alt="" 
    style={{ width: "80px", height:"80px", objectFit:"cover", borderRadius: theme.radius, cursor:"pointer", filter: item.is_lucky_bag ? "blur(10px)" : "none" }} 
    // 🔥 追加: エラーなら非表示にする
    onError={(e) => e.target.style.display = "none"}
  />
)}
          </div>
        </div>

        {/* 右側：情報 */}
        <div>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: "32px", marginBottom: "20px", lineHeight: 1.3 }}>
            {/* 🔥 修正: タイトル隠し */}
            {item.is_lucky_bag ? "🔒 シークレット商品" : item.title}
          </h1>

          <p style={{ fontSize: "24px", fontWeight: "bold", color: theme.colors.primary, marginBottom: "30px" }}>
            ¥{item.price.toLocaleString()}
          </p>

          {/* 🗣️ AIボイスボタン */}
          <button 
            onClick={handleSpeak}
            style={{
              marginBottom: "30px", padding: "10px 20px", borderRadius: "30px", border: "none",
              background: isSpeaking ? "#ff4d4f" : "#40a9ff", color: "#fff", fontWeight: "bold",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}
          >
            <span style={{ fontSize: "20px" }}>{isSpeaking ? "🔇" : "🗣️"}</span>
            {isSpeaking ? "話すのを止める" : (item.is_lucky_bag ? "ヒントを聞く (Voice)" : "商品説明を聞く (Voice)")}
          </button>

          <p style={{ lineHeight: 1.8, color: theme.colors.textLight, marginBottom: "40px", whiteSpace: "pre-wrap" }}>
             {/* 🔥 修正: 説明文隠し */}
            {item.is_lucky_bag 
              ? "これは福袋（Lucky Bag）です。中身は届いてからのお楽しみ！\nAIが選定したとっておきの商品が入っています。" 
              : (item.description || "No description.")}
          </p>

          {/* アクションボタン */}
          {me && me.id !== sellerId ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <button
                onClick={handlePurchase}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: theme.colors.primary, 
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
                {item.is_lucky_bag ? "運試しで購入する" : "購入手続きへ"}
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