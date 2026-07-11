import { FaFileAlt, FaCogs, FaBrain, FaChartBar, FaShieldAlt } from "react-icons/fa";
import SectionTitle from "../common/SectionTitle";

const STEPS = [
  { icon: FaFileAlt, title: "1. Input News", desc: "Enter or paste the news article" },
  { icon: FaCogs, title: "2. Preprocess", desc: "Text cleaning and feature extraction" },
  { icon: FaBrain, title: "3. AI Analysis", desc: "9 models analyze the content simultaneously" },
  { icon: FaChartBar, title: "4. Prediction", desc: "Get real-time results with confidence score" },
  { icon: FaShieldAlt, title: "5. Result", desc: "Fake or Real with detailed insights" },
];

function Workflow() {
  return (
    <section className="section">
      <div className="container-custom">
        <SectionTitle
          title="How It"
          highlight="Works"
          subtitle="Simple steps to detect fake news using AI"
        />
        <div className="workflow-steps">
          {STEPS.map((step, i) => (
            <div className="workflow-step" key={i}>
              <div className="workflow-icon">
                <step.icon />
              </div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Workflow;
