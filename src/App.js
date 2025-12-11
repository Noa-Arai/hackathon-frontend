// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import NewItem from "./pages/NewItem";
import ItemsList from "./pages/ItemsList";
import ItemDetail from "./pages/ItemDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MessageRoom from "./pages/MessageRoom";
import EditItem from "./pages/EditItem";

import { client } from "./api/client";

// --------------------
// Etsy風 洗練されたテーマ設定
// --------------------
const theme = {
  colors: {
    background: "#FDFAF5", // より明るく温かいオフホワイト
    text: "#222222", // 濃いチャコールグレーで引き締める
    textLight: "#595959", // サブテキスト用
    primary: "#F1641E", // Etsy風の落ち着いたオレンジ
    primaryHover: "#D15619",
    secondaryBg: "#FFFFFF", // カードなどの背景はクリーンな白
    border: "#E0E0E0", // 薄いグレーの境界線
    shadow: "0 4px 12px rgba(0,0,0,0.08)", // 柔らかく広がる影
    shadowHover: "0 6px 16px rgba(0,0,0,0.12)",
  },
  fonts: {
    serif: "'Georgia', 'Times New Roman', serif", // 見出し用
    sans: "'Helvetica Neue', Helvetica, Arial, sans-serif", // 本文・ボタン用
  },
  radius: "12px", // 少し大きめの角丸
};

// スタイル定義
const styles = {
  navLink: {
    textDecoration: "none",
    color: theme.colors.text,
    padding: "8px 16px",
    borderRadius: "999px",
    transition: "all 0.2s ease",
    fontFamily: theme.fonts.sans,
    fontWeight: 500,
    fontSize: "14px",
  },
  navLinkActive: {
    background: "#F0EAE2", // アクティブ時の淡い背景
    color: theme.colors.primary,
  },
  buttonPrimary: {
    background: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    padding: "10px 20px",
    cursor: "pointer",
    fontFamily: theme.fonts.sans,
    fontWeight: "bold",
    fontSize: "14px",
    transition: "background 0.2s",
  },
  buttonGhost: {
    background: "transparent",
    color: theme.colors.text,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: "999px",
    padding: "8px 18px",
    cursor: "pointer",
    fontFamily: theme.fonts.sans,
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.2s",
  },
};

// カスタムNavLinkコンポーネント（アクティブ状態のスタイル適用のため）
function NavLink({ to, children, ...props }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      style={{
        ...styles.navLink,
        ...(isActive ? styles.navLinkActive : {}),
      }}
      {...props}
    >
      {children}
    </Link>
  );
}

function NavBar() {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = React.useState(false);
  const [avatarURL, setAvatarURL] = React.useState(null);
  const location = useLocation();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthed(!!token);
    if (token) {
      client
        .get("/users/me")
        .then((res) => setAvatarURL(res.data.avatarURL))
        .catch(() => {});
    } else {
      setAvatarURL(null);
    }
  }, [location.pathname]);

  return (
    <nav
      style={{
        background: theme.colors.secondaryBg,
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: theme.colors.shadow,
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {/* ロゴ */}
        <div
          onClick={() => navigate("/items")}
          style={{
            fontSize: "28px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            cursor: "pointer",
            fontFamily: theme.fonts.serif,
            color: theme.colors.primary,
          }}
        >
          FleaNest
        </div>

        {/* ナビゲーションリンク */}
        <div style={{ display: "flex", gap: "8px" }}>
          <NavLink to="/items">商品一覧</NavLink>
          <NavLink to="/new">出品する</NavLink>
        </div>
      </div>

      {/* 右側メニュー */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {isAuthed ? (
          <>
            <div
              onClick={() => navigate("/profile")}
              style={{
                cursor: "pointer",
                width: 42,
                height: 42,
                borderRadius: "50%",
                overflow: "hidden",
                border: `2px solid ${theme.colors.border}`,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.colors.border)}
            >
              <img
                src={avatarURL || "/noimage.png"}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => (e.target.src = "/noimage.png")}
              />
            </div>
            <button
              style={styles.buttonGhost}
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.text;
                e.currentTarget.style.background = "#F7F7F7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.background = "transparent";
              }}
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">ログイン</NavLink>
            <button
              style={styles.buttonPrimary}
              onClick={() => navigate("/signup")}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.colors.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = theme.colors.primary)}
            >
              新規登録
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.sans, // 基本はサンセリフ
      }}
    >
      <Router>
        <NavBar />
        <main
          style={{
            maxWidth: "1100px", // 少し幅を広げてゆったりと
            margin: "0 auto",
            padding: "40px 24px 80px",
          }}
        >
          <Routes>
            <Route path="/items" element={<ItemsList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/new" element={<NewItem />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/items/edit/:id" element={<EditItem />} />
            <Route path="/messages/:itemId/:partnerId" element={<MessageRoom />} />
            <Route path="/" element={<ItemsList />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
// Themeを他のファイルでも使えるようにexport（簡易的）
export { theme };