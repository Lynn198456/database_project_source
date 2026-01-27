const features = [
  {
    id: 1,
    title: "Premium Seats",
    desc: "Luxury recliner seating with personal space and comfort",
    icon: "🛋️",
    tone: "orange",
  },
  {
    id: 2,
    title: "4K Projection",
    desc: "Crystal clear picture quality with laser projection technology",
    icon: "🎞️",
    tone: "blue",
  },
  {
    id: 3,
    title: "Dolby Atmos",
    desc: "Immersive sound experience with 360° audio technology",
    icon: "🔊",
    tone: "purple",
  },
];

export default function PremiumExperience() {
  return (
    <section className="cf-section">
      <div className="cf-centerTitle">Premium Cinema Experience</div>

      <div className="cf-featureGrid">
        {features.map((f) => (
          <div key={f.id} className={`cf-featureCard cf-featureCard--${f.tone}`}>
            <div className="cf-featureIcon">{f.icon}</div>
            <div className="cf-featureTitle">{f.title}</div>
            <div className="cf-featureDesc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
