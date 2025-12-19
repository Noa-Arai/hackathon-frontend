import React, { useState } from 'react';
import { client } from '../api/client'; // あなたのプロジェクトのaxios設定に合わせて
import { theme } from '../App';         // あなたのテーマ設定に合わせて

export default function EmotionSearch() {
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!emotion) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await client.get(`/items/search/emotion?emotion=${encodeURIComponent(emotion)}`);
      setResult(res.data);
    } catch (e) {
      console.error(e);
      alert("AIエラー: うまく読み取れませんでした");
    } finally {
      setLoading(false);
    }
  };

  // エンターキーでも送信できるように
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ 
      marginBottom: "30px", padding: "20px", 
      background: "#f0f8ff", borderRadius: "8px", 
      border: "2px solid #87CEFA"
    }}>
      <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#333" }}>
        🔮 <strong>AI感情検索</strong> (今の気分を入力！)
      </h3>
      
      <div style={{ display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          value={emotion} 
          onChange={(e) => setEmotion(e.target.value)} 
          onKeyDown={handleKeyDown}
          placeholder="例: 上司に怒られた、癒やされたい..."
          style={{ 
            flex: 1, padding: "10px", borderRadius: "4px", 
            border: "1px solid #ccc", fontSize: "16px" 
          }}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          style={{ 
            padding: "10px 20px", background: "#007bff", 
            color: "#fff", border: "none", borderRadius: "4px", 
            fontWeight: "bold", cursor: "pointer" 
          }}
        >
          {loading ? "..." : "検索"}
        </button>
      </div>

      {/* 結果表示 */}
      {result && (
        <div style={{ marginTop: "15px" }}>
          <p style={{ fontSize: "14px", color: "#555" }}>
            🤖 <strong>「{result.emotion}」</strong>なあなたへのおすすめキーワード:
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "5px" }}>
            {result.keywords.map((word, i) => (
              <span key={i} style={{
                background: "#fff", padding: "6px 12px", 
                borderRadius: "15px", border: "1px solid #ccc",
                fontWeight: "bold", color: "#333", boxShadow: "0 2px 2px rgba(0,0,0,0.1)"
              }}>
                🔍 {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}