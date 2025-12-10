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
import MessageRoom from "./pages/MessageRoom";
import EditItem from "./pages/EditItem";

import { client } from "./api/client";
import EditProfile from "./pages/EditProfile";
<Route path="/profile/edit" element={<EditProfile />} />


// --------------------
// Etsy 調のテーマカラー
// --------------------
const colors = {
  background: "#f5eee9",
  text: "#3f3a38",
  navBg: "#ffffff",
  navShadow: "0 8px 20px rgba(0,0,0,0.06)",
  pillHover: "#f4e3d8",
  accent: "#d97757",
};

const navLinkStyle = {
  textDecoration: "none",
  color: colors.text,
  padding: "6px 14px",
  borderRadius: "999px",
  transition: "0.2s",
};

const buttonStyleGhost = {
  border: "1px solid #d0b49f",
  borderRadius: "999px",
  padding: "6px 14px",
  background: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthed, setIsAuthed] = React.useState(false);
  const [avatarURL, setAvatarURL] = React.useState(null);

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
        background: colors.navBg,
        borderRadius: "999px",
        padding: "14px 26px",
        margin: "20px auto 32px",
        maxWidth: "980px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: colors.navShadow,
        position: "sticky",
        top: "12px",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div
          onClick={() => navigate("/items")}
          style={{
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          Flea<span style={{ color: colors.accent }}>Nest</span>
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: "15px" }}>
          <Link to="/items" style={navLinkStyle}>
            商品一覧
          </Link>
          <Link to="/new" style={navLinkStyle}>
            出品する
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {isAuthed ? (
          <>
            <div
              onClick={() => navigate("/profile")}
              style={{
                cursor: "pointer",
                width: 38,
                height: 38,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #eee",
              }}
            >
              <img
                src={avatarURL}
                alt="avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <button
              style={buttonStyleGhost}
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" style={navLinkStyle}>
              新規登録
            </Link>
            <Link
              to="/login"
              style={{ ...navLinkStyle, background: colors.pillHover }}
            >
              ログイン
            </Link>
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
        background: colors.background,
        color: colors.text,
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <Router>
        <NavBar />
        <main
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "20px 16px 60px",
          }}
        >
          <Routes>
            <Route path="/items" element={<ItemsList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/new" element={<NewItem />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/items/edit/:id" element={<EditItem />} />

            {/* DM */}
            <Route
              path="/messages/:itemId/:partnerId"
              element={<MessageRoom />}
            />

            {/* default */}
            <Route path="/" element={<ItemsList />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
