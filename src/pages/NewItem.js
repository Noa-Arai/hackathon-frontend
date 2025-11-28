import React, { useState } from "react";
import { client } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function NewItem() {
  // --- 商品情報 ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // --- AI説明生成 ---
  const [loadingAI, setLoadingAI] = useState(false);

  // --- 画像データ & プレビュー ---
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);

  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");

  const navigate = useNavigate();

  // --- AI説明生成機能 ---
  const generateDescription = async () => {
    if (!title) return alert("先に商品名を入力してください");

    try {
      setLoadingAI(true);
      const res = await client.post("/ai/describe", { title });
      setDescription(res.data.description || "");
    } catch (e) {
      alert("AI説明生成に失敗しました");
    } finally {
      setLoadingAI(false);
    }
  };

  // --- 画像セット + プレビュー生成 ---
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // --- 商品登録処理（multipart） ---
  const handleSubmit = async () => {
    if (!title || !description || !price) {
      alert("全ての項目を入力してください");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("price", price);

    if (file1) form.append("file1", file1);
    if (file2) form.append("file2", file2);
    if (file3) form.append("file3", file3);

    try {
      await client.post("/items", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("商品を登録しました！");
      navigate("/items");
    } catch (err) {
      console.error(err);
      alert("商品登録に失敗しました");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>商品投稿</h2>

      {/* --- 商品名 --- */}
      <input
        type="text"
        placeholder="商品名"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {/* --- AI説明生成ボタン --- */}
      <button onClick={generateDescription} disabled={loadingAI}>
        {loadingAI ? "AI生成中..." : "AIで説明生成"}
      </button>

      <br /><br />

      {/* --- 説明文 --- */}
      <textarea
        placeholder="説明文"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", height: 120 }}
      />

      <br /><br />

      {/* --- 価格 --- */}
      <input
        type="number"
        placeholder="価格"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ width: "100%", marginBottom: 20 }}
      />

      {/* --- 画像アップロード --- */}
      <h3>画像アップロード（最大3枚）</h3>

      <div>
        <input type="file" accept="image/*"
          onChange={(e) => handleFileChange(e, setFile1, setPreview1)} />
        {preview1 && <img src={preview1} width={150} alt="preview1" />}
      </div>

      <div>
        <input type="file" accept="image/*"
          onChange={(e) => handleFileChange(e, setFile2, setPreview2)} />
        {preview2 && <img src={preview2} width={150} alt="preview2" />}
      </div>

      <div>
        <input type="file" accept="image/*"
          onChange={(e) => handleFileChange(e, setFile3, setPreview3)} />
        {preview3 && <img src={preview3} width={150} alt="preview3" />}
      </div>

      <br />

      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        商品を登録する
      </button>
    </div>
  );
}
