import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <div className="footer-logo">
            <img
              src={logo}
              alt="TruthLens AI Logo"
              className="footer-logo-img"
            />
            <h2>
              TruthLens <span>. AI</span>
            </h2>
          </div>

          <p>
            An AI-powered platform to detect fake news using multiple
            machine learning, deep learning, and graph neural network models.
          </p>

          <div className="social-icons">
            <a href="https://github.com/Kankana1012" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>

            <a href="https://www.linkedin.com/in/kankana-chakraborty/" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>

            <a href="mailto:contact@truthlens.ai">
              <FaEnvelope />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/detect">Detect News</Link></li>
            <li><Link to="/compare">Compare Models</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/developer">Developer</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Project Info</h3>
          <ul>
            <li>Version: 1.0.0</li>
            <li>9 AI Models</li>
            <li>44,898 News Articles</li>
            <li>99.29% Best Accuracy</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>About</h3>
          <p>Build with ❤️ to promote truth and fight misinformation using the power of Artificial Intelligence.</p>
          <br/>
          <h3>Repository</h3>
          <p>Star ⭐ the project on GitHub</p>

          <a
            href="https://github.com/Kankana1012/Fake-News-Detection-Using-GNNs"
            target="_blank"
            rel="noreferrer"
            className="custom-btn secondary sm"
            style={{ marginTop: "14px", display: "inline-flex" }}
          >
            <FaGithub /> View on GitHub
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 TruthLens.AI . All rights reserved.</p>

        <a href="https://github.com/Kankana1012/Fake-News-Detection-Using-GNNs" target="_blank" rel="noreferrer">
          GitHub Repository
        </a>
      </div>
    </footer>
  );
};

export default Footer;