import React, { useState } from "react";
import "./index.css";

// Updated backend URL
const API = "https://backend-9jp6.onrender.com";

export default function App() {
  const [token, setToken] = useState("");
  const [coins, setCoins] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ref, setRef] = useState("");

  const [video, setVideo] = useState(null);
  const [thumb, setThumb] = useState(null);

  const [videoResult, setVideoResult] = useState("");
  const [thumbResult, setThumbResult] = useState("");

  // ================= AUTH =================
  const signup = async () => {
    const res = await fetch(API + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, ref }),
    });
    alert(await res.text());
  };

  const login = async () => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setToken(data.token);
    loadCoins(data.token);
  };

  const loadCoins = async (t) => {
    const res = await fetch(API + "/coins", {
      headers: { Authorization: t },
    });
    const data = await res.json();
    setCoins(data.coins);
  };

  // ================= VIDEO ANALYSIS =================
  const analyzeVideo = async () => {
    if (!video) return;

    const form = new FormData();
    form.append("video", video);

    const res = await fetch(API + "/analyze", {
      method: "POST",
      headers: { Authorization: token },
      body: form,
    });

    const data = await res.json();

    setVideoResult(
      `Score: ${data.score}/100
Engagement: ${data.engagement}
Viral: ${data.viral}`
    );

    loadCoins(token);
  };

  // ================= THUMBNAIL AI =================
  const scoreThumb = async () => {
    if (!thumb) return;

    const form = new FormData();
    form.append("image", thumb);

    const res = await fetch(API + "/thumbnail-score", {
      method: "POST",
      headers: { Authorization: token },
      body: form,
    });

    const data = await res.json();

    setThumbResult(
      `Score: ${data.score}/100
Brightness: ${data.brightness}
Contrast: ${data.contrast}
Sharpness: ${data.sharpness}`
    );
  };

  // ================= KO-FI =================
  const buyCoins = () => {
    window.open("https://ko-fi.com/elitetok", "_blank");
  };

  // ================= AUTH SCREEN =================
  if (!token) {
    return (
      <div className="center">
        <div className="card">
          <h1 className="title">ELITE TOK</h1>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            placeholder="Referral Code (optional)"
            onChange={(e) => setRef(e.target.value)}
          />

          <button onClick={signup}>Sign Up</button>
          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div className="center">
      <div className="card">
        <h2>Coins: {coins}</h2>

        {/* VIDEO ANALYSIS */}
        <h3>Video Analysis</h3>
        <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
        <button onClick={analyzeVideo}>Analyze (-5 coins)</button>
        <pre>{videoResult}</pre>

        {/* THUMBNAIL AI */}
        <h3>Thumbnail AI</h3>
        <input type="file" onChange={(e) => setThumb(e.target.files[0])} />
        <button onClick={scoreThumb}>Score Thumbnail</button>
        <pre>{thumbResult}</pre>

        {/* REFERRAL */}
        <h3>Your Referral Code</h3>
        <b>{email}</b>

        {/* KO-FI */}
        <h3>Buy Coins</h3>
        <button onClick={buyCoins}>£10 → 1000 Coins</button>
      </div>
    </div>
  );
}