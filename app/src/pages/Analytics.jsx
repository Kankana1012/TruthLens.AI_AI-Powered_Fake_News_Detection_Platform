import { useMemo, useState } from "react";
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
} from "react-icons/fa";

import { MODELS } from "../data/models";

const OVERALL = {
  accuracy: 99.29,
  precision: 98.7,
  recall: 98.9,
  f1: 98.8,
  rocAuc: 99.6,
};

function genEpochSeries(target, epochs = 20) {
  const arr = [];
  for (let i = 1; i <= epochs; i++) {
    const progress = i / epochs;
    const acc = (target / 100) * (1 - Math.exp(-4 * progress)) + (Math.random() * 0.01 - 0.005);
    const loss = Math.max(0.02, (1 - progress) * 0.9 + Math.random() * 0.03);
    arr.push({ epoch: i, accuracy: Number((acc * 100).toFixed(2)), loss: Number(loss.toFixed(3)) });
  }
  return arr;
}

const CONFUSION = { tp: 4890, fn: 110, fp: 98, tn: 4902 };

function Analytics() {
  const [trainModel, setTrainModel] = useState(MODELS.find((m) => m.id === "cnn"));
  const [confModel, setConfModel] = useState(MODELS.find((m) => m.id === "cnn"));

  const barData = useMemo(
    () =>
      MODELS.map((m) => ({
        name: m.short,
        Accuracy: m.accuracy,
        Precision: m.precision,
        Recall: m.recall,
        F1: m.f1,
        "ROC-AUC": m.rocAuc,
      })),
    []
  );

  const trainingSeries = useMemo(() => genEpochSeries(trainModel.accuracy), [trainModel]);

  const metricCards = [
    { icon: FaBullseye, label: "Accuracy", value: `${OVERALL.accuracy}%`, color: "#a855f7" },
    { icon: FaStopwatch, label: "Precision", value: `${OVERALL.precision}%`, color: "#3b82f6" },
    { icon: FaRedo, label: "Recall", value: `${OVERALL.recall}%`, color: "#22c55e" },
    { icon: FaBalanceScaleRight, label: "F1-Score", value: `${OVERALL.f1}%`, color: "#f59e0b" },
    { icon: FaChartLine, label: "ROC-AUC", value: `${OVERALL.rocAuc}%`, color: "#ec4899" },
  ];

  const total = CONFUSION.tp + CONFUSION.fn + CONFUSION.fp + CONFUSION.tn;

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

        <div className="metrics-grid">
          {metricCards.map((m, i) => (
            <div className="metric-card" key={i}>
              <div className="metric-icon" style={{ background: `${m.color}22`, color: m.color }}>
                <m.icon />
              </div>
              <h3>{m.value}</h3>
              <div className="metric-label">{m.label}</div>
              <div className="metric-delta"><FaArrowUp /> +0.{Math.floor(Math.random() * 8) + 2}% vs last week</div>
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
                  <YAxis stroke="var(--text-muted)" fontSize={12} domain={[85, 100]} />
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
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="training-grid">
              <div className="training-card">
                <h5>{trainModel.name} - Accuracy</h5>
                <div style={{ width: "100%", height: 160 }}>
                  <ResponsiveContainer>
                    <LineChart data={trainingSeries}>
                      <XAxis dataKey="epoch" stroke="var(--text-muted)" fontSize={10} />
                      <YAxis stroke="var(--text-muted)" fontSize={10} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: "var(--card-bg-solid)", border: "1px solid var(--border)", borderRadius: 10 }} />
                      <Line type="monotone" dataKey="accuracy" stroke={trainModel.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="training-card">
                <h5>{trainModel.name} - Loss</h5>
                <div style={{ width: "100%", height: 160 }}>
                  <ResponsiveContainer>
                    <LineChart data={trainingSeries}>
                      <XAxis dataKey="epoch" stroke="var(--text-muted)" fontSize={10} />
                      <YAxis stroke="var(--text-muted)" fontSize={10} />
                      <Tooltip contentStyle={{ background: "var(--card-bg-solid)", border: "1px solid var(--border)", borderRadius: 10 }} />
                      <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2>Confusion Matrix</h2>
              <select
                className="select-control"
                value={confModel.id}
                onChange={(e) => setConfModel(MODELS.find((m) => m.id === e.target.value))}
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="confusion-grid">
              <div className="confusion-cell" style={{ background: "rgba(124,58,237,.28)", color: "#c4b5fd" }}>
                {CONFUSION.tp}
                <span>True Fake</span>
              </div>
              <div className="confusion-cell" style={{ background: "rgba(124,58,237,.08)", color: "var(--text-secondary)" }}>
                {CONFUSION.fn}
                <span>False Real</span>
              </div>
              <div className="confusion-cell" style={{ background: "rgba(124,58,237,.08)", color: "var(--text-secondary)" }}>
                {CONFUSION.fp}
                <span>False Fake</span>
              </div>
              <div className="confusion-cell" style={{ background: "rgba(124,58,237,.28)", color: "#c4b5fd" }}>
                {CONFUSION.tn}
                <span>True Real</span>
              </div>
            </div>

            <div className="confusion-stats">
              <div>
                <p>Accuracy</p>
                <p style={{ color: "var(--primary-light)" }}>{confModel.accuracy}%</p>
              </div>
              <div>
                <p>Precision</p>
                <p style={{ color: "var(--secondary)" }}>{confModel.precision}%</p>
              </div>
              <div>
                <p>Recall</p>
                <p style={{ color: "var(--success)" }}>{confModel.recall}%</p>
              </div>
              <div>
                <p>F1-Score</p>
                <p style={{ color: "var(--warning)" }}>{confModel.f1}%</p>
              </div>
            </div>

            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12.5, marginTop: 20 }}>
              Total Samples: {total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
