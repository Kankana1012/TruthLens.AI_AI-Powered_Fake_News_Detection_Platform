import { Link } from "react-router-dom";
import { FaSearch, FaBalanceScale } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";

const CTA = () => {
  return (
    <section className="section">
      <div className="container-custom">
        <div className="cta">
          <div className="cta-left">
            <div className="cta-heading-row">
              <img src={logo} alt="TruthLens AI Logo" className="cta-logo-img" />
              <h2>
                Ready to detect <span className="gradient-text">fake news?</span>
              </h2>
            </div>

            <p>
              Start analyzing news articles now and make informed decisions
              with our AI-powered ensemble of 9 machine learning models.
            </p>
          </div>

          <div className="cta-buttons">
            <Link to="/detect" className="custom-btn primary">
              <FaSearch /> Start Detecting
            </Link>

            <Link to="/compare" className="custom-btn secondary">
              <FaBalanceScale /> Compare Models
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;