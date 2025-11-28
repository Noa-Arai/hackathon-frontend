// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

import NewItem from "./pages/NewItem";
import ItemsList from "./pages/ItemsList";
import ItemDetail from "./pages/ItemDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

// Etsy っぽい共通スタイル
const appStyles = {
  root: {
    minHeight: "100vh",
    background: "#f5eee9", // ベージュ系
    fontFamily: "'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#3f3a38",
  },
  container: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "20px 16px 40px",
  },
  nav: {
    background: "#fff",
    borderRadius: "999px",
    padding: "10px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    margin: "16px auto 24px",
    maxWidth: "960px",
    position: "sticky",
    top: "8px",
    zIndex: 10,
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  brand: {
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  brandAccent: {
    color: "#d97757", // 柔らかいオレンジ
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontSize: "14px",
  },
  navLink: {
    textDecoration: "none",
    color: "#4b4b4b",
    padding: "6px 10px",
    borderRadius: "999px",
    transition: "background 0.15s ease",
  },
  navLinkActive: {
    background: "#f3e1d5",
    color: "#3f3a38",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
  },
  buttonGhost: {
    border: "1px solid #d0b49f",
    borderRadius: "999px",
    padding: "6px 12px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
};

function NavBar() {
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthed(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthed(false);
    navigate("/login");
  };

  return (
    <nav style={appStyles.nav}>
      <div style={appStyles.navLeft}>
        <div style={appStyles.brand}>
          Flea<span style={appStyles.brandAccent}>Nest</span>
        </div>
        <div style={appStyles.navLinks}>
          <Link to="/items" style={appStyles.navLink}>
            商品一覧
          </Link>
          <Link to="/new" style={appStyles.navLink}>
            出品する
          </Link>
        </div>
      </div>
      <div style={appStyles.navRight}>
        {isAuthed ? (
          <>
            <span>ログイン中</span>
            <button style={appStyles.buttonGhost} onClick={handleLogout}>
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" style={appStyles.navLink}>
              新規登録
            </Link>
            <Link to="/login" style={{ ...appStyles.navLink, ...appStyles.navLinkActive }}>
              ログイン
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <div style={appStyles.root}>
      <Router>
        <NavBar />
        <main style={appStyles.container}>
          <Routes>
            <Route path="/new" element={<NewItem />} />
            <Route path="/items" element={<ItemsList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* デフォルトを商品一覧に */}
            <Route path="/" element={<ItemsList />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
