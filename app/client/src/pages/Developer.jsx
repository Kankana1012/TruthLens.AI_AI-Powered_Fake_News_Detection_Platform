import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaUserAstronaut,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileAlt,
  FaPaperPlane,
  FaUser,
  FaTag,
  FaCommentDots,
  FaDownload,
} from "react-icons/fa";
import {
  SiPython,
  SiPytorch,
  SiTensorflow,
  SiReact,
  SiFastapi,
  SiScikitlearn,
} from "react-icons/si";
import developerAvatar from "../assets/images/developer-avatar.png";

const SKILLS = [
  { icon: SiPython, label: "Python" },
  { icon: SiScikitlearn, label: "Machine Learning" },
  { icon: SiTensorflow, label: "Deep Learning" },
  { icon: SiPytorch, label: "Graph Neural Networks" },
  { icon: SiFastapi, label: "FastAPI" },
  { icon: SiReact, label: "React" },
];

function Developer() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email, and message");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! Kankana will get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 900);
  };

  return (
    <div className="page-wrap">
      <div className="container-custom">
        <div className="page-header">
          <div>
            <h1><FaUserAstronaut style={{ color: "var(--primary-light)", marginRight: 10 }} />Developer & Contact</h1>
            <p>Meet the developer behind TruthLens AI. Have questions or feedback? Let's connect!</p>
          </div>

          <div className="panel quote-banner">
            <p><span className="qmark">"</span>Building AI solutions for a better and more truthful digital world.<span className="qmark">"</span></p>
          </div>
        </div>

        <div className="developer-layout">
          {/* Profile */}
          <div className="panel">
            <div className="panel-head">
              <h2><FaUserAstronaut style={{ color: "var(--primary-light)" }} /> About Me</h2>
            </div>

           <div className="dev-profile-top">
              <div className="dev-avatar">
                <img
                  src={developerAvatar}
                  alt="Kankana Chakraborty"
                  className="dev-avatar-img"
                />
              </div>

              <div>
                <h3 className="dev-name">Kankana Chakraborty</h3>
                <p className="dev-role">AI/ML Engineer & Full-Stack Developer</p>

                <div className="dev-meta">
                  <FaGraduationCap /> B.Tech in Computer Science &amp; Technology
                </div>

                <div className="dev-meta">
                  <FaMapMarkerAlt /> West Bengal, India
                </div>
              </div>
            </div>

            <p className="dev-bio">
              Passionate about AI, Machine Learning, Deep Learning, and Graph Neural Networks, building intelligent solutions that solve real-world problems.
            </p>

            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Skills &amp; Expertise</h3>
            <div className="skills-grid">
              {SKILLS.map((s, i) => (
                <div className="skill-chip" key={i}>
                  <s.icon /> {s.label}
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Connect With Me</h3>
            <div className="connect-grid">
              <a className="connect-btn" href="https://github.com/
              Kankana1012" target="_blank" rel="noreferrer">
                <FaGithub /> GitHub
              </a>
              <a className="connect-btn" href="https://www.linkedin.com/in/kankana-chakraborty/" target="_blank" rel="noreferrer">
                <FaLinkedin /> LinkedIn
              </a>
              <a className="connect-btn" href="mailto:lushichakraborty@gmail.com">
                <FaEnvelope /> Email
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="panel">
            <div className="panel-head">
              <h2><FaPaperPlane style={{ color: "var(--primary-light)" }} /> Contact Me</h2>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 14.5, marginBottom: 24 }}>
              Feel free to reach out for collaborations, opportunities, or just a friendly hello!
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label><FaUser /> Your Name</label>
                  <input placeholder="Enter your full name" value={form.name} onChange={handleChange("name")} />
                </div>
                <div className="form-field">
                  <label><FaEnvelope /> Your Email</label>
                  <input type="email" placeholder="Enter your email address" value={form.email} onChange={handleChange("email")} />
                </div>
              </div>

              <div className="form-field">
                <label><FaTag /> Subject</label>
                <input placeholder="Enter subject" value={form.subject} onChange={handleChange("subject")} />
              </div>

              <div className="form-field">
                <label><FaCommentDots /> Message</label>
                <textarea
                  maxLength={1000}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange("message")}
                />
                <div className="field-count">{form.message.length} / 1000</div>
              </div>

              <button className="custom-btn primary analyze-btn" type="submit" disabled={sending}>
                {sending ? <span className="loader-spin" /> : <FaPaperPlane />}
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Developer;
