import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  FaBullseye,
  FaStopwatch,
  FaRedo,
  FaBalanceScaleRight,
  FaChartLine,
  FaDownload,
  FaArrowUp,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

import { MODELS } from "../data/models";
import { fetchAllMetrics } from "../services/metricsService";

function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainModel, setTrainModel] = useState(MODELS.find((m) => m.id === "cnn"));
  const [confModel, setConfModel] = useState(MODELS.find((m) => m.id === "cnn"));

  // Fetch real metrics from the backend on mount
  useEffect(() => {
    fetchAllMetrics()
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load metrics:", err);
        setError("Could not fetch model metrics — is the backend running on port 8000?");
        setLoading(false);
      });
  }, []);

  // Compute best overall accuracy from all models (real data or fallback to models.js)
  const overall = useMemo(() => {
    if (!metrics) {
      return { accuracy: 0, precision: 0, recall: 0, f1: 0, rocAuc: 0 };
    }
    // Use real metrics: find the best across all models
    let best = { accuracy: 0, precision: 0, recall: 0, f1: 0, rocAuc: 0 };
    Object.values(metrics).forEach((m) => {
      if (m.accuracy > best.accuracy) {
        best = {
          accuracy: m.accuracy,
          precision: m.precision,
          recall: m.recall,
          f1: m.f1,
          rocAuc: m.rocAuc,
        };
      }
    });
    return best;
  }, [metrics]);

  const barData = useMemo(() => {
    return MODELS.map((m) => {
      const real = metrics?.[m.id];
      return {
        name: m.short,
        Accuracy: real?.accuracy ?? 0,
        Precision: real?.precision ?? 0,
        Recall: real?.recall ?? 0,
        F1: real?.f1 ?? 0,
        "ROC-AUC": real?.rocAuc ?? 0,
      };
    });
  }, [metrics]);

  // Training history: use real data from the API
  const trainingSeries = useMemo(() => {
    if (!metrics) return null;
    const modelMetrics = metrics[trainModel.id];
    if (!modelMetrics?.trainingHistory) return null;
    return modelMetrics.trainingHistory;
  }, [metrics, trainModel]);

  // Confusion matrix: use real data from the API
  const confusion = useMemo(() => {
    if (!metrics) return null;
    const modelMetrics = metrics[confModel.id];
    if (!modelMetrics?.confusionMatrix) return null;
    const cm = modelMetrics.confusionMatrix;
    // cm = [[TN, FP], [FN, TP]]  or  [[TP, FN], [FP, TN]] depending on notebook
    // The saved models use: cm[0] = [class_0_correct, class_0_wrong], cm[1] = [class_1_wrong, class_1_correct]
    // For fake news: class 0 = Fake, class 1 = Real
    // cm[0][0] = True Fake (correctly predicted fake)
    // cm[0][1] = False Real (fake predicted as real)
    // cm[1][0] = False Fake (real predicted as fake)
    // cm[1][1] = True Real (correctly predicted real)
    return {
      tp: cm[0][0],   // True Fake
      fn: cm[0][1],   // False Real
      fp: cm[1][0],   // False Fake
      tn: cm[1][1],   // True Real
    };
  }, [metrics, confModel]);

  const confModelMetrics = useMemo(() => {
    if (metrics?.[confModel.id]) {
      const m = metrics[confModel.id];
      return { accuracy: m.accuracy, precision: m.precision, recall: m.recall, f1: m.f1 };
    }
    return { accuracy: 0, precision: 0, recall: 0, f1: 0 };
  }, [metrics, confModel]);

  const metricCards = [
    { icon: FaBullseye, label: "Best Accuracy", value: `${overall.accuracy}%`, color: "#a855f7" },
    { icon: FaStopwatch, label: "Precision", value: `${overall.precision}%`, color: "#3b82f6" },
    { icon: FaRedo, label: "Recall", value: `${overall.recall}%`, color: "#22c55e" },
    { icon: FaBalanceScaleRight, label: "F1-Score", value: `${overall.f1}%`, color: "#f59e0b" },
    { icon: FaChartLine, label: "ROC-AUC", value: `${overall.rocAuc}%`, color: "#ec4899" },
  ];

  const total = confusion ? (confusion.tp + confusion.fn + confusion.fp + confusion.tn) : 0;

  // Models that have training history available
  const modelsWithHistory = useMemo(() => {
    if (!metrics) return MODELS;
    return MODELS.filter((m) => metrics[m.id]?.trainingHistory);
  }, [metrics]);

  // Models that have confusion matrix available
  const modelsWithConfusion = useMemo(() => {
    if (!metrics) return MODELS;
    return MODELS.filter((m) => metrics[m.id]?.confusionMatrix);
  }, [metrics]);

  return (
    <div className="page-wrap">
      <div className="container-custom">
        <div className="page-header">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Detailed performance analysis of all 9 AI models on the evaluation dataset.</p>
          </div>
          <button className="toolbar-btn purple">
            <FaDownload /> Export Report
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="empty-state" style={{ margin: "60px 0" }}>
            <FaSpinner className="loader-spin" style={{ fontSize: 40 }} />
            <p>Loading model metrics from backend...</p>
          </div>
        )}

        {error && (
          <div className="empty-state" style={{ margin: "60px 0", color: "var(--warning)" }}>
            <FaExclamationTriangle style={{ fontSize: 40 }} />
            <p>{error}</p>
          </div>
        )}

        {/* Metric overview cards */}
        <div className="metrics-grid">
          {metricCards.map((m, i) => (
            <div className="metric-card" key={i}>
              <div className="metric-icon" style={{ background: `${m.color}22`, color: m.color }}>
                <m.icon />
              </div>
              <h3>{m.value}</h3>
              <div className="metric-label">{m.label}</div>
              {metrics && (
                <div className="metric-delta">
                  <FaArrowUp /> From real evaluation data
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="analytics-layout">
          <div className="panel">
            <div className="panel-head">
              <h2>Model Comparison</h2>
            </div>
            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{ background: "var(--card-bg-solid)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Accuracy" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Precision" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Recall" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="F1" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ROC-AUC" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel-head" style={{ marginTop: 30 }}>
              <h2>Training Progress</h2>
              <select
                className="select-control"
                value={trainModel.id}
                onChange={(e) => setTrainModel(MODELS.find((m) => m.id === e.target.value))}
              >
                {modelsWithHistory.length > 0
                  ? modelsWithHistory.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))
                  : MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))
                }
              </select>
            </div>

            {trainingSeries ? (
              <div className="training-grid">
                <div className="training-card">
                  <h5>{trainModel.name} — Accuracy (Real Training Data)</h5>
                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <LineChart data={trainingSeries}>
                        <XAxis dataKey="epoch" stroke="var(--text-muted)" fontSize={10} />
                        <YAxis stroke="var(--text-muted)" fontSize={10} domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: "var(--card-bg-solid)", border: "1px solid var(--border)", borderRadius: 10 }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line type="monotone" dataKey="accuracy" name="Train Acc" stroke={trainModel.color} strokeWidth={2} dot={false} />
                        {trainingSeries[0]?.valAccuracy !== null && (
                          <Line type="monotone" dataKey="valAccuracy" name="Val Acc" stroke="#22c55e" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="training-card">
                  <h5>{trainModel.name} — Loss (Real Training Data)</h5>
                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <LineChart data={trainingSeries}>
                        <XAxis dataKey="epoch" stroke="var(--text-muted)" fontSize={10} />
                        <YAxis stroke="var(--text-muted)" fontSize={10} />
                        <Tooltip contentStyle={{ background: "var(--card-bg-solid)", border: "1px solid var(--border)", borderRadius: 10 }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line type="monotone" dataKey="loss" name="Train Loss" stroke="#ef4444" strokeWidth={2} dot={false} />
                        {trainingSeries[0]?.valLoss !== null && (
                          <Line type="monotone" dataKey="valLoss" name="Val Loss" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "30px 0" }}>
                <FaChartLine style={{ fontSize: 30, color: "var(--text-muted)" }} />
                <p>
                  {loading
                    ? "Loading training history..."
                    : `No training history available for ${trainModel.name}. Training history is available for RNN, LSTM, and CNN models.`
                  }
                </p>
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2>Confusion Matrix</h2>
              <select
                className="select-control"
                value={confModel.id}
                onChange={(e) => setConfModel(MODELS.find((m) => m.id === e.target.value))}
              >
                {modelsWithConfusion.length > 0
                  ? modelsWithConfusion.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))
                  : MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))
                }
              </select>
            </div>

            {confusion ? (
              <>
                <div className="confusion-grid">
                  <div className="confusion-cell" style={{ background: "rgba(124,58,237,.28)", color: "#c4b5fd" }}>
                    {confusion.tp.toLocaleString()}
                    <span>True Fake</span>
                  </div>
                  <div className="confusion-cell" style={{ background: "rgba(124,58,237,.08)", color: "var(--text-secondary)" }}>
                    {confusion.fn.toLocaleString()}
                    <span>False Real</span>
                  </div>
                  <div className="confusion-cell" style={{ background: "rgba(124,58,237,.08)", color: "var(--text-secondary)" }}>
                    {confusion.fp.toLocaleString()}
                    <span>False Fake</span>
                  </div>
                  <div className="confusion-cell" style={{ background: "rgba(124,58,237,.28)", color: "#c4b5fd" }}>
                    {confusion.tn.toLocaleString()}
                    <span>True Real</span>
                  </div>
                </div>

                <div className="confusion-stats">
                  <div>
                    <p>Accuracy</p>
                    <p style={{ color: "var(--primary-light)" }}>{confModelMetrics.accuracy}%</p>
                  </div>
                  <div>
                    <p>Precision</p>
                    <p style={{ color: "var(--secondary)" }}>{confModelMetrics.precision}%</p>
                  </div>
                  <div>
                    <p>Recall</p>
                    <p style={{ color: "var(--success)" }}>{confModelMetrics.recall}%</p>
                  </div>
                  <div>
                    <p>F1-Score</p>
                    <p style={{ color: "var(--warning)" }}>{confModelMetrics.f1}%</p>
                  </div>
                </div>

                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12.5, marginTop: 20 }}>
                  Total Samples: {total.toLocaleString()}
                  {metrics?.[confModel.id]?.source && (
                    <> • Source: {metrics[confModel.id].source}</>
                  )}
                </p>
              </>
            ) : (
              <div className="empty-state" style={{ padding: "40px 0" }}>
                <FaExclamationTriangle style={{ fontSize: 30, color: "var(--text-muted)" }} />
                <p>
                  {loading
                    ? "Loading confusion matrix..."
                    : `No confusion matrix available for ${confModel.name}. Confusion matrices are available for RNN, LSTM, GCN, GAT, and GraphSAGE models.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
