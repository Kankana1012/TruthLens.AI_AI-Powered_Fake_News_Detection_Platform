import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaBalanceScale,
  FaCopy,
  FaTrash,
  FaInfoCircle,
  FaStar,
  FaBolt,
  FaTrophy,
  FaSync,
} from "react-icons/fa";

import { runPrediction, getHighestConfidence, getFastestModel } from "../services/predictionService";
import { addHistoryEntry } from "../services/historyService";
import { getRandomSample } from "../data/sampleArticles";

const HOW_IT_WORKS = [
  "Enter or paste any news article.",
  "All 9 AI models will analyze the content.",
  "View and compare predictions, confidence scores and response times.",
  "Highest confidence and fastest model will be highlighted.",
];

function CompareModels() {
  const [article, setArticle] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const words = article.trim() ? article.trim().split(/\s+/).length : 0;

  const handlePasteExample = () => {
    setArticle(getRandomSample());
    setResults(null);
  };

  const handleClear = () => {
    setArticle("");
    setResults(null);
  };

  const handleCompare = () => {
    if (!article.trim()) {
      toast.error("Please paste a news article first");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = runPrediction(article);
      setResults(res);
      res.forEach((r) =>
        addHistoryEntry({
          article,
          modelId: r.modelId,
          modelName: r.modelName,
          prediction: r.prediction,
          confidence: r.confidence,
          time: r.time,
        })
      );
      setLoading(false);
      toast.success("Comparison complete across all 9 models");
    }, 900);
  };

  const handleCopyResults = () => {
    if (!results) return;
    const text = results
      .map((r) => `${r.modelName}: ${r.prediction} (${r.confidence}%, ${r.time}s)`)
      .join("\n");
    navigator.clipboard?.writeText(text);
    toast.success("Results copied to clipboard");
  };

  const best = results ? getHighestConfidence(results) : null;
  const fastest = results ? getFastestModel(results) : null;

  return (
    <div className="page-wrap">
      <div className="container-custom">
        <div className="page-header">
          <div>
            <h1><FaBalanceScale style={{ color: "var(--primary-light)", marginRight: 10 }} />Compare Models</h1>
            <p>Paste a news article below and compare predictions from all 9 AI models at once.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="toolbar-btn green" onClick={handlePasteExample}>
              <FaCopy /> Paste Example
            </button>
            <button className="toolbar-btn red" onClick={handleClear}>
              <FaTrash /> Clear
            </button>
          </div>
        </div>

        <div className="compare-layout">
          <div className="panel">
            <div className="panel-head">
              <h2><span className="step-badge">1</span> Paste News Article</h2>
            </div>
            <textarea
              className="article-textarea"
              placeholder="Paste or type your news article here..."
              value={article}
              onChange={(e) => setArticle(e.target.value)}
            />
            <div className="char-count" style={{ marginBottom: 20 }}>
              <span>{article.length} Characters</span>
              <span>{words} Words</span>
            </div>
            <button className="custom-btn primary analyze-btn" onClick={handleCompare} disabled={loading}>
              {loading ? <span className="loader-spin" /> : <FaSync />}
              {loading ? "Comparing..." : "Compare All Models"}
            </button>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2><FaInfoCircle style={{ color: "var(--primary-light)" }} /> How Comparison Works</h2>
            </div>
            <div className="info-list">
              {HOW_IT_WORKS.map((step, i) => (
                <div className="info-item" key={i}>
                  <span className="info-num">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2><span className="step-badge">2</span> Model Comparison Results</h2>
            {results && (
              <button className="toolbar-btn" onClick={handleCopyResults}>
                <FaCopy /> Copy Results
              </button>
            )}
          </div>

          {!results && (
            <div className="empty-state">
              <FaBalanceScale />
              <p>Run a comparison to see how all 9 models score this article.</p>
            </div>
          )}

          {results && (
            <>
              <div className="compare-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Model</th>
                      <th>Prediction</th>
                      <th>Confidence</th>
                      <th>Time (sec)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => {
                      const Icon = r.icon;
                      const isBest = r.modelId === best.modelId;
                      const isFastest = r.modelId === fastest.modelId;
                      return (
                        <tr
                          key={r.modelId}
                          className={isBest ? "highlight-row" : isFastest ? "highlight-fast" : ""}
                        >
                          <td>{i + 1}</td>
                          <td>
                            <span className="model-name-cell">
                              <Icon style={{ color: r.color }} /> {r.modelName}
                            </span>
                          </td>
                          <td>
                            <span className={`pred-tag ${r.prediction.toLowerCase()}`}>{r.prediction}</span>
                          </td>
                          <td>
                            <div className="conf-cell">
                              <div className="conf-track">
                                <div
                                  className="conf-fill"
                                  style={{
                                    width: `${r.confidence}%`,
                                    background: r.prediction === "FAKE" ? "var(--danger)" : "var(--success)",
                                  }}
                                />
                              </div>
                              <span>{r.confidence}%</span>
                            </div>
                          </td>
                          <td>
                            <span className="time-cell">
                              {r.time}s {isFastest && <FaBolt className="bolt-icon" />}
                              {isBest && <FaStar className="star-icon" />}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="compare-summary">
                <div className="summary-item">
                  <span className="summary-icon trophy"><FaTrophy /></span>
                  <div>
                    <h4>Highest Confidence</h4>
                    <p>{best.modelName} ({best.confidence}%)</p>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-icon bolt"><FaBolt /></span>
                  <div>
                    <h4>Fastest Model</h4>
                    <p>{fastest.modelName} ({fastest.time}s)</p>
                  </div>
                </div>
                <button className="toolbar-btn purple" onClick={handleCompare}>
                  <FaSync /> Try Another
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompareModels;
