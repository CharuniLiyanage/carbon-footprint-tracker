export const carbonAssistant = (key, data) => {
  const { history = [], goal = 0, total = 0, score = 0 } = data;

  const latest = history[0];
  const previous = history[1];

  // =========================
  // 📊 CALCULATIONS
  // =========================
  const avgScore =
    history.length > 0
      ? Math.round(
          history.reduce((sum, h) => sum + (h.score || 0), 0) /
            history.length
        )
      : 0;

  const bestScore =
    history.length > 0
      ? Math.max(...history.map((h) => h.score || 0))
      : 0;

  const trend =
    latest && previous
      ? latest.score > previous.score
        ? "improving 📈"
        : latest.score < previous.score
        ? "declining 📉"
        : "stable ➖"
      : "not enough data";

  const goalGap = goal > 0 ? total - goal : 0;

  const performance =
    score >= 80
      ? "Excellent 🟢"
      : score >= 65
      ? "Good 🟢"
      : score >= 50
      ? "Moderate 🟡"
      : "Needs Improvement 🔴";

  // =========================
  // RESPONSES (UI SAFE)
  // =========================
  switch (key) {
    case "score":
      return {
        title: "📊 Eco Performance",
        body: `Score: ${score}/100 (${performance})

Average Score: ${avgScore}
Best Score: ${bestScore}

Your score reflects your overall carbon efficiency based on transport and electricity usage.`,
      };

    case "goal":
      if (!goal) {
        return {
          title: "🎯 Goal Status",
          body: `No CO₂ goal set yet.

Set a goal to track and control your emissions effectively.`,
        };
      }

      return goalGap > 0
        ? {
            title: "🎯 Goal Status",
            body: `⚠ You exceeded your goal by ${goalGap.toFixed(2)} kg CO₂.

Tip: Reduce high-impact activities like transport and electricity usage.`,
          }
        : {
            title: "🎯 Goal Status",
            body: `✅ You are within your goal.

Remaining allowance: ${Math.abs(goalGap).toFixed(
              2
            )} kg CO₂.`,
          };

    case "history":
      return {
        title: "📜 Activity Summary",
        body:
          history.length === 0
            ? "No data available yet."
            : `Total Records: ${history.length}

Latest Score: ${latest?.score || "N/A"}
Average Score: ${avgScore}
Best Score: ${bestScore}`,
      };

    case "trend":
      return {
        title: "📈 Performance Trend",
        body: `Your trend is ${trend}.

${
  trend.includes("improving")
    ? "Keep maintaining your current habits."
    : trend.includes("declining")
    ? "Your emissions are increasing. Consider reducing usage."
    : "Your performance is stable."
}`,
      };

    case "improve":
      return {
        title: "🌱 Improvement Tips",
        body: `To improve your carbon score:

• Reduce long-distance travel
• Use public transport or carpool
• Turn off unused electrical devices
• Use energy-efficient appliances
• Track your emissions daily`,
      };

    case "overview":
      return {
        title: "🌍 About CarbonTrack",
        body: `CarbonTrack helps you monitor CO₂ emissions, analyze trends, and improve sustainability habits through data-driven insights.`,
      };

    default:
      return {
        title: "🤖 Assistant",
        body: "Select a question to get insights about your carbon usage.",
      };
  }
};