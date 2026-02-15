// Points system
if (!localStorage.getItem("points")) localStorage.setItem("points", "1000");

// Elements
const analyzeVideoBtn = document.getElementById("analyzeVideoBtn");
const videoUrlInput = document.getElementById("videoUrl");
const analysisResult = document.getElementById("analysisResult");
const videoScoreDiv = document.getElementById("videoScore");
const scoreBreakdownDiv = document.getElementById("scoreBreakdown");
const pointsDisplay = document.getElementById("points");

analyzeVideoBtn.addEventListener("click", () => {
    let currentPoints = parseInt(localStorage.getItem("points") || "0");

    if (currentPoints < 5) {
        alert("Not enough Elite Coins to analyze video!");
        return;
    }

    const videoUrl = videoUrlInput.value.trim();
    if (!videoUrl) {
        alert("Please paste a video URL!");
        return;
    }

    // Deduct coins
    currentPoints -= 5;
    localStorage.setItem("points", currentPoints);
    pointsDisplay.textContent = currentPoints;

    // Show analysis result
    analysisResult.textContent = `Video analyzed! ✅ Elite Coins deducted: 5. Video: ${videoUrl}`;

    // Simulate video rating algorithm
    const videoLength = Math.floor(Math.random() * 10) + 1; // 1-10 mins
    const engagement = Math.random(); // 0.0 - 1.0
    const lengthPenalty = (videoLength / 10).toFixed(2);
    const engagementBonus = (engagement * 1.5).toFixed(2);
    let rawScore = 5 - (videoLength / 10) + (engagement * 1.5); 
    let score = Math.min(Math.max(Math.round(rawScore), 1), 5);

    // Show stars
    let stars = "";
    for (let i = 0; i < 5; i++) stars += i < score ? "★" : "☆";
    videoScoreDiv.textContent = `Video Score: ${stars} (${score}/5)`;

    // Breakdown with animated bars
    scoreBreakdownDiv.innerHTML = ""; // Clear previous

    const breakdowns = [
        {label: "Length Penalty", value: lengthPenalty},
        {label: "Engagement Bonus", value: engagementBonus},
        {label: "Raw Score", value: rawScore.toFixed(2)}
    ];

    breakdowns.forEach(b => {
        const barContainer = document.createElement("div");
        barContainer.className = "breakdown-bar";

        const barFill = document.createElement("div");
        barFill.className = "breakdown-fill";
        barContainer.appendChild(barFill);

        const label = document.createElement("div");
        label.textContent = `${b.label}: ${b.value}`;
        label.style.fontSize = "0.8rem";
        label.style.marginBottom = "2px";

        scoreBreakdownDiv.appendChild(label);
        scoreBreakdownDiv.appendChild(barContainer);

        // Animate bar width proportional to value (max 5)
        const widthPercent = Math.min(b.value / 5 * 100, 100);
        setTimeout(() => { barFill.style.width = widthPercent + "%"; }, 50);
    });
});