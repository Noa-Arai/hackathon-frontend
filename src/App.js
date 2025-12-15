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
// Design 3: Stylish & Monotone (Gold Accent)
// --------------------
const theme = {
  colors: {
    background: "#FAFAFA",
    text: "#111111",
    textLight: "#888888",
    primary: "#C0A062",
    primaryHover: "#A88B52",
    secondaryBg: "#FFFFFF",
    border: "#E5E5E5",
    shadow: "0 2px 15px rgba(0,0,0,0.04)",
    shadowHover: "0 10px 30px rgba(0,0,0,0.08)",
  },
  fonts: {
    serif: "'Times New Roman', 'YuMincho', serif",
    sans: "'Helvetica Neue', Arial, sans-serif",
  },
  radius: "4px",
};

// スタイル定義
const styles = {
  navLink: {
    textDecoration: "none",
    color: theme.colors.text,
    padding: "8px 0",
    margin: "0 12px",
    transition: "all 0.2s ease",
    fontFamily: theme.fonts.sans,
    fontWeight: 500,
    fontSize: "14px",
    position: "relative",
    letterSpacing: "0.05em",
  },
  navLinkActive: {
    color: theme.colors.primary,
    borderBottom: `2px solid ${theme.colors.primary}`,
  },
  buttonPrimary: {
    background: theme.colors.text,
    color: "#fff",
    border: "none",
    borderRadius: theme.radius,
    padding: "10px 24px",
    cursor: "pointer",
    fontFamily: theme.fonts.sans,
    fontWeight: "bold",
    fontSize: "13px",
    letterSpacing: "0.05em",
    transition: "background 0.3s",
  },
  buttonGhost: {
    background: "transparent",
    color: theme.colors.text,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius,
    padding: "8px 18px",
    cursor: "pointer",
    fontFamily: theme.fonts.sans,
    fontSize: "13px",
    transition: "all 0.2s",
  },
};

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

  const BASE = process.env.NODE_ENV === "production"
    ? "https://hackathon-backend-563488838141.us-central1.run.app"
    : "http://localhost:8080";

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthed(!!token);
    if (token) {
      client
        .get("/users/me")
        .then((res) => setAvatarURL(res.data.avatar_url))
        .catch(() => {});
    } else {
      setAvatarURL(null);
    }
  }, [location.pathname]);

  return (
    <nav
      style={{
        background: theme.colors.secondaryBg,
        padding: "0 40px",
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${theme.colors.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <div
          onClick={() => navigate("/items")}
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
            cursor: "pointer",
            fontFamily: theme.fonts.serif,
            color: theme.colors.primary,
            textTransform: "uppercase",
          }}
        >
          FleaNest
        </div>

        <div style={{ display: "flex" }}>
          <NavLink to="/items">ITEM LIST</NavLink>
          <NavLink to="/new">SELL</NavLink>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {isAuthed ? (
          <>
            <div
              onClick={() => navigate("/profile")}
              style={{
                cursor: "pointer",
                width: 36,
                height: 36,
                borderRadius: "50%",
                overflow: "hidden",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              {/* 🔥 無限ループ対策済み画像タグ */}
              <img
                src={avatarURL ? `${BASE}${avatarURL}&t=${new Date().getTime()}` : "/noimage.svg"}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  // すでにnoimage.pngを含んでいるなら、これ以上読み込まない（非表示にする）
                  if (e.target.src.includes("noimage.svg")) {
                    e.target.style.display = "none";
                  } else {
                    e.target.src = "/noimage.svg";
                  }
                }}
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">LOGIN</NavLink>
            <button
              style={{...styles.buttonPrimary, background: theme.colors.primary}}
              onClick={() => navigate("/signup")}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.colors.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = theme.colors.primary)}
            >
              SIGN UP
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
        fontFamily: theme.fonts.sans,
      }}
    >
      <Router>
        <NavBar />
        <main
          style={{
            maxWidth: "1200px",
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

export { theme };