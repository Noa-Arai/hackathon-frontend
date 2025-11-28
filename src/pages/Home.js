import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);

  // --- AIで説明生成 ---
  const generateDescription = () => {
    if (!title) {
      alert("タイトルを入力してください");
      return;
    }

    setLoadingAI(true);

    fetch("https://hackathon-backend-563488838141.us-central1.run.app/ai/describe?title=" + title)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("AI生成に失敗しました");
        } else {
          setDescription(data.description);
        }
      })
      .catch(() => alert("AIエラー"))
      .finally(() => setLoadingAI(false));
  };

  // --- 商品登録 ---
  const handleSubmit = () => {
    const data = {
      title,
      description,
      price: Number(price),
      image_url: imageUrl,
    };

    fetch("https://hackathon-backend-563488838141.us-central1.run.app/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("投稿失敗");
        return res.json();
      })
      .then(() => {
        alert("商品を登録しました！");
        navigate("/items");  // 商品一覧へ移動
      })
      .catch((err) => alert(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>商品投稿</h1>

      <div style={{ marginBottom: "20px" }}>
        {/* 商品名 */}
        <input
          placeholder="商品名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "200px", marginRight: "10px" }}
        />

        {/* AI説明生成ボタン */}
        <button onClick={generateDescription} disabled={loadingAI}>
          {loadingAI ? "AI生成中..." : "AIで説明生成"}
        </button>
      </div>

      {/* 説明欄（AIがここに入る） */}
      <textarea
        placeholder="説明"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "400px", height: "120px", display: "block", marginBottom: "20px" }}
      />

      {/* 価格 */}
      <input
        type="number"
        placeholder="価格"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ width: "200px", marginRight: "10px" }}
      />

      {/* 画像URL */}
      <input
        placeholder="画像URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />

      {/* 投稿 */}
      <button onClick={handleSubmit}>商品を登録する</button>
    </div>
  );
}
