import "./Tips.css";

function Tips() {
  const tips = [
    {
      icon: "🚶",
      title: "Use Public Transport",
      desc: "Reduce emissions by avoiding private vehicles for daily travel.",
    },
    {
      icon: "💡",
      title: "Save Electricity",
      desc: "Switch off lights, fans, and devices when not in use.",
    },
    {
      icon: "🌱",
      title: "Eat More Green Food",
      desc: "Reduce meat consumption and choose plant-based meals.",
    },
    {
      icon: "🚿",
      title: "Save Water",
      desc: "Take shorter showers and fix water leaks immediately.",
    },
    {
      icon: "♻️",
      title: "Recycle Waste",
      desc: "Separate plastic, paper, and glass for recycling.",
    },
    {
      icon: "🚲",
      title: "Use a Bicycle",
      desc: "Short trips are better done with cycling instead of driving.",
    },
    {
      icon: "🌍",
      title: "Plant Trees",
      desc: "Trees absorb CO₂ and improve air quality.",
    },
    {
      icon: "📦",
      title: "Avoid Plastic",
      desc: "Use reusable bags and bottles instead of single-use plastic.",
    },
  ];

  return (
    <div className="tips-page">
      <h1>🌱 Eco Tips</h1>
      <p className="subtitle">
        Simple habits that help you reduce your carbon footprint
      </p>

      <div className="tips-grid">
        {tips.map((tip, i) => (
          <div key={i} className="tip-card">
            <h3>
              {tip.icon} {tip.title}
            </h3>
            <p>{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tips;