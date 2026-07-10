import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import { MODELS } from "../../data/models";

function ModelsSection() {
  return (
    <section className="section">
      <div className="container-custom">
        <SectionTitle
          title="AI Models"
          highlight="Overview"
          subtitle="Our platform uses 9 state-of-the-art AI models for comprehensive fake news detection."
        />
        <div className="models-grid">
          {MODELS.map((model, i) => {
            const Icon = model.icon;
            return (
              <motion.div
                key={model.id}
                className="model-mini-card"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <span className="model-mini-number">{`0${i + 1}`}</span>
                <div className="model-mini-icon" style={{ color: model.color }}>
                  <Icon />
                </div>
                <h3>{model.name}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ModelsSection;
