import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaLightbulb,
  FaCopy,
  FaTrash,
  FaShareAlt,
  FaRocket,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
  FaClock,
  FaMicrochip,
  FaCalendarAlt,
  FaLandmark,
} from "react-icons/fa";

import { MODELS } from "../data/models";
import { runPrediction } from "../services/predictionService";
import { addHistoryEntry } from "../services/historyService";
import { getRandomSample } from "../data/sampleArticles";

function DetectNews() {
  const [article, setArticle] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const words = article.trim() ? article.trim().split(/\s+/).length : 0;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setArticle(text || getRandomSample());
    } catch {
      setArticle(getRandomSample());
      toast("Clipboard unavailable — inserted a sample article", { icon: "📋" });
    }
  };

  const handleClear = () => {
    setArticle("");
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedModel) {
      toast.error("Please select an AI Model");
      return;
    }
    if (!article.trim()) {
      toast.error("Please enter a news article first");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const [prediction] = await runPrediction(article, [selectedModel]);
      setResult(prediction);
      addHistoryEntry({
        article,
        modelId: prediction.modelId,
        modelName: prediction.modelName,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        time: prediction.time,
      });
      toast.success(`Prediction complete: ${prediction.prediction}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Prediction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Prediction: ${result.prediction}\nConfidence: ${result.confidence}%\nModel: ${result.modelName}`;
    navigator.clipboard?.writeText(text);
    toast.success("Result copied to clipboard");
  };

  const handleShare = () => {
    if (!result) return;
    if (navigator.share) {
      navigator
        .share({
          title: "TruthLens AI Prediction",
          text: `TruthLens AI predicted this article is ${result.prediction} (${result.confidence}% confidence) using ${result.modelName}.`,
        })
        .catch(() => { });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="page-wrap">
      <div className="container-custom">
        <div className="page-header">
          <div>
            <h1>Detect News</h1>
            <p>Enter a news article and let our AI models predict whether it is Fake or Real.</p>
          </div>
          <div className="hint-banner">
            <FaLightbulb />
            <span>Choose a model, paste your article and click Analyze News to get a prediction.</span>
          </div>
        </div>

        <div className="detect-grid">
          {/* LEFT: input */}
          <div className="panel">
            <div className="panel-head">
              <h2><span className="step-badge">1</span> Enter News Article</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="toolbar-btn green" onClick={handlePaste}>
                  <FaCopy /> Paste
                </button>
                <button className="toolbar-btn red" onClick={handleClear}>
                  <FaTrash /> Clear
                </button>
              </div>
            </div>

            <textarea
              className="article-textarea"
              placeholder="Paste or type your news article here..."
              value={article}
              onChange={(e) => setArticle(e.target.value)}
            />
            <div className="char-count">
              <span>{article.length} Characters</span>
              <span>{words} Words</span>
            </div>

            <div className="panel-head" style={{ marginTop: "30px" }}>
              <h2><span className="step-badge">2</span> Select Model</h2>
            </div>

            <div className="model-dropdown">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="model-select"
              >
                <option value="" disabled>
                  Select an AI Model
                </option>

                {MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="custom-btn primary analyze-btn"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <span className="loader-spin" />
              ) : (
                <FaRocket />
              )}
              {loading ? "Analyzing..." : "Analyze News"}
            </button>
          </div>

          {/* RIGHT: result */}
          <div className="panel">
            <div className="panel-head">
              <h2><span className="step-badge">3</span> Prediction Result</h2>
              {result && (
                <div className="result-actions">
                  <button className="toolbar-btn" onClick={handleCopy}>
                    <FaCopy /> Copy
                  </button>
                  <button className="toolbar-btn" onClick={handleShare}>
                    <FaShareAlt /> Share
                  </button>
                </div>
              )}
            </div>

            {!result && !loading && (
              <div className="result-placeholder">
                <FaShieldAlt />
                <p>Your prediction result will appear here once you analyze an article.</p>
              </div>
            )}

            {loading && (
              <div className="result-placeholder">
                <span className="loader-spin" style={{ width: 46, height: 46, borderWidth: 4 }} />
                <p>Running {MODELS.find((m) => m.id === selectedModel)?.name}...</p>
              </div>
            )}

            {result && !loading && (
              <div className="fade-in">
                <div className={`verdict-box ${result.prediction === "FAKE" ? "fake" : "real"}`}>
                  {result.prediction === "FAKE" ? <FaExclamationTriangle /> : <FaCheckCircle />}
                  <h2>{result.prediction} NEWS</h2>
                </div>

                <div className="result-row">
                  <span className="icon-badge" style={{ background: "rgba(124,58,237,.15)", color: "var(--primary-light)" }}>
                    <FaShieldAlt />
                  </span>
                  <div className="r-label">
                    <strong>Confidence</strong>
                    <span>How confident the model is</span>
                  </div>
                  <span className="r-value">{result.confidence}%</span>
                </div>

                <div className="result-row" style={{ display: "block" }}>
                  <strong style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    Probability Distribution
                  </strong>
                  <div className="prob-bars">
                    <div className="prob-row">
                      <span className="prob-label">Fake</span>
                      <div className="prob-track">
                        <div className="prob-fill fake" style={{ width: `${result.fakeProbability}%` }} />
                      </div>
                      <span className="prob-val">{result.fakeProbability}%</span>
                    </div>
                    <div className="prob-row">
                      <span className="prob-label">Real</span>
                      <div className="prob-track">
                        <div className="prob-fill real" style={{ width: `${result.realProbability}%` }} />
                      </div>
                      <span className="prob-val">{result.realProbability}%</span>
                    </div>
                  </div>
                </div>

                <div className="result-row">
                  <span className="icon-badge" style={{ background: "rgba(34,197,94,.12)", color: "var(--success)" }}>
                    <FaClock />
                  </span>
                  <div className="r-label">
                    <strong>Execution Time</strong>
                    <span>Time taken for prediction</span>
                  </div>
                  <span className="r-value">{result.time} sec</span>
                </div>

                <div className="result-row">
                  <span className="icon-badge" style={{ background: "rgba(245,158,11,.12)", color: "var(--warning)" }}>
                    <FaMicrochip />
                  </span>
                  <div className="r-label">
                    <strong>Model Used</strong>
                    <span>AI model used for prediction</span>
                  </div>
                  <span className="r-value" style={{ fontSize: 14 }}>{result.modelName}</span>
                </div>

                <div className="result-row">
                  <span className="icon-badge" style={{ background: "rgba(59,130,246,.12)", color: "var(--secondary)" }}>
                    <FaCalendarAlt />
                  </span>
                  <div className="r-label">
                    <strong>Processed On</strong>
                    <span>Date and time of prediction</span>
                  </div>
                  <span className="r-value" style={{ fontSize: 13 }}>{new Date().toLocaleString()}</span>
                </div>

                <div className="insight-box">
                  <FaLandmark />
                  <span>
                    The news article is predicted to be <strong>{result.prediction}</strong> with a{" "}
                    {result.confidence >= 90 ? "very high" : result.confidence >= 70 ? "high" : "moderate"} confidence score.
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default DetectNews;
