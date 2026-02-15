const BASE_URL = "https://elitetok-1.onrender.com";

// Login
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  if (!email || !password) return alert("Enter email and password");

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Login error: " + err.message);
  }
}

// Signup
async function signup() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const referral = document.getElementById("signup-ref").value || "";
  if (!email || !password) return alert("Enter email and password");

  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password, referral })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    alert("Signup error: " + err.message);
  }
}

// Load points
async function loadPoints() {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const res = await fetch(`${BASE_URL}/user/points`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    const pointsEl = document.getElementById("points");
    if (pointsEl) pointsEl.innerText = data.points || 0;
  } catch (err) {
    console.log("Error fetching points:", err.message);
  }
}

// Referral
async function useReferral() {
  const ref = document.getElementById("ref-code").value;
  const token = localStorage.getItem("token");
  if (!ref || !token) return alert("Enter referral code");
  try {
    const res = await fetch(`${BASE_URL}/user/referral`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ referralCode: ref })
    });
    const data = await res.json();
    if (res.ok) {
      alert("Referral applied! +4 points 💖");
      loadPoints();
    } else {
      alert(data.message || "Referral failed");
    }
  } catch (err) {
    alert("Referral error: " + err.message);
  }
}

// Video Analyzer
async function analyzeVideo() {
  const url = document.getElementById("video-url").value;
  const token = localStorage.getItem("token");
  if (!url) return alert("Enter video URL");
  try {
    const res = await fetch(`${BASE_URL}/video/analyze`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ videoUrl: url })
    });
    const data = await res.json();
    document.getElementById("video-result").innerText = data.result || "Analysis done ✅";
  } catch (err) {
    document.getElementById("video-result").innerText = "Error analyzing video: " + err.message;
  }
}

// Kofi Payment + Polling
function startPayment() {
  window.open("https://ko-fi.com/elitetok", "_blank");
  pollPaymentStatus(0); // start polling immediately
}

async function pollPaymentStatus(attempts) {
  const maxAttempts = 12; // 1 min total, 5 sec interval
  const token = localStorage.getItem("token");
  const statusEl = document.getElementById("payment-status");
  const pointsEl = document.getElementById("points");
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/user/points`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (pointsEl) pointsEl.innerText = data.points || 0;

    if (data.recentPayment) {
      statusEl.innerText = "Payment received! +100 points 💖";
      return;
    } else if (attempts < maxAttempts) {
      statusEl.innerText = "Waiting for payment confirmation...";
      setTimeout(() => pollPaymentStatus(attempts + 1), 5000);
    } else {
      statusEl.innerText = "Payment not confirmed yet. Try refreshing later.";
    }
  } catch (err) {
    console.log("Kofi polling error:", err.message);
    if (attempts < maxAttempts) setTimeout(() => pollPaymentStatus(attempts + 1), 5000);
  }
}

// Load points on dashboard
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("points")) loadPoints();
});