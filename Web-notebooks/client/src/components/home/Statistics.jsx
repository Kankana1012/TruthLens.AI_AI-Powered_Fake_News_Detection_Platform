import { FaBrain, FaNewspaper, FaChartLine, FaBolt } from "react-icons/fa";
import StatCard from "../common/StatCard";
import SectionTitle from "../common/SectionTitle";

const STATS = [
  { icon: FaBrain, value: "9", title: "AI Models" },
  { icon: FaNewspaper, value: "44,898", title: "News Articles" },
  { icon: FaChartLine, value: "99.9%", title: "Best Accuracy" },
  { icon: FaBolt, value: "Real-Time", title: "Prediction" },
];

function Statistics() {
  return (
    <section className="section statistics-section">
      <div className="container-custom">
        <SectionTitle
          title="Project"
          highlight="Overview"
          subtitle="This project leverages 9 powerful AI models and a dataset of 44,898 news articles to identify fake news with exceptional accuracy in real-time."
        />
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <StatCard key={i} icon={s.icon} value={s.value} title={s.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
