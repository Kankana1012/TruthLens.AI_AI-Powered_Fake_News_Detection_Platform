import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBolt, FaSearch, FaBalanceScale, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import heroImage from "../../assets/images/hero-ai.png";

function Hero() {
  return (
    <section className="hero-section">
      <div className="container-custom hero-grid">
        <div>
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaBolt /> AI POWERED
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Detect <span className="gradient-text">Fake News.</span>
            <br />
            Trust <span className="gradient-text">Real News.</span>
          </motion.h1>

          <motion.p
            className="hero-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            An AI-powered platform that analyzes news articles using
            multiple Machine Learning, Deep Learning, and Graph Neural Networks models to detect misinformation
            with high accuracy.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <Link to="/detect" className="custom-btn primary">
              <FaSearch /> Start Detecting
            </Link>
            <Link to="/compare" className="custom-btn outline">
              <FaBalanceScale /> Compare Models
            </Link>
          </motion.div>
        </div>

        <div className="hero-visual">
          
          <img
            src={heroImage}
            alt="TruthLens AI"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
