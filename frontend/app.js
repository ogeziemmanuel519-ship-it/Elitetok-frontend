const API = "https://elitetok-1.onrender.com";

let token = "";

// SIGNUP
async function signup(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const ref = document.getElementById("ref").value;

    const res = await fetch(API + "/signup", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({email,password,ref})
    });

    alert(await res.text());
}

// LOGIN
async function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/login", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({email,password})
    });

    const data = await res.json();

    token = data.token;
    document.getElementById("dashboard").classList.remove("hidden");

    loadCoins();
}

// LOAD COINS
async function loadCoins(){
    const res = await fetch(API + "/coins", {
        headers:{ Authorization: token }
    });

    const data = await res.json();
    document.getElementById("coins").innerText =
        "Coins: " + data.coins;
}


// VIDEO ANALYSIS
async function analyze(){
    const file = document.getElementById("videoFile").files[0];

    const form = new FormData();
    form.append("video", file);

    const res = await fetch(API + "/analyze", {
        method:"POST",
        headers:{ Authorization: token },
        body: form
    });

    const data = await res.json();

    document.getElementById("result").innerHTML =
        `
        Score: ${data.score}/100 <br>
        Engagement: ${data.engagement} <br>
        Viral Chance: ${data.viral}
        `;

    loadCoins();
}