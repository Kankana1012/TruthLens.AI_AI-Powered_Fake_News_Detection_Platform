import {
  FaChartLine,
  FaTree,
  FaProjectDiagram,
  FaBrain,
  FaAtom,
  FaCube,
  FaShareAlt,
  FaCircleNotch,
  FaNetworkWired,
} from "react-icons/fa";

// The 9 AI models used across the platform.
// All metric values and predictions are retrieved dynamically from the backend APIs.
export const MODELS = [
  {
    id: "logreg",
    name: "Logistic Regression",
    short: "LR",
    group: "ml",
    icon: FaChartLine,
    color: "#a855f7",
  },
  {
    id: "randomforest",
    name: "Random Forest",
    short: "RF",
    group: "ml",
    icon: FaTree,
    color: "#22c55e",
  },
  {
    id: "svm",
    name: "SVM",
    short: "SVM",
    group: "ml",
    icon: FaProjectDiagram,
    color: "#38bdf8",
  },
  {
    id: "rnn",
    name: "RNN",
    short: "RNN",
    group: "dl",
    icon: FaCircleNotch,
    color: "#f97316",
  },
  {
    id: "lstm",
    name: "LSTM",
    short: "LSTM",
    group: "dl",
    icon: FaBrain,
    color: "#fb923c",
  },
  {
    id: "cnn",
    name: "CNN",
    short: "CNN",
    group: "dl",
    icon: FaCube,
    color: "#3b82f6",
  },
  {
    id: "gcn",
    name: "GCN",
    short: "GCN",
    group: "gnn",
    icon: FaNetworkWired,
    color: "#c084fc",
  },
  {
    id: "gat",
    name: "GAT",
    short: "GAT",
    group: "gnn",
    icon: FaShareAlt,
    color: "#60a5fa",
  },
  {
    id: "graphsage",
    name: "GraphSAGE",
    short: "GSAGE",
    group: "gnn",
    icon: FaAtom,
    color: "#22d3ee",
  },
];

export const MODEL_GROUPS = [
  {
    key: "ml",
    title: "Machine Learning",
    description: "Classical ML algorithms trained on TF-IDF features.",
  },
  {
    key: "dl",
    title: "Deep Learning",
    description: "Sequence & convolution based neural networks.",
  },
  {
    key: "gnn",
    title: "Graph Neural Networks",
    description: "Graph-based models capturing relational context.",
  },
];

export const getModelById = (id) => MODELS.find((m) => m.id === id);
