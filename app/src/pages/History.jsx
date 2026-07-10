import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaDownload,
  FaFilePdf,
  FaTrash,
  FaEye,
  FaShareAlt,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
} from "react-icons/fa";

import {
  getHistory,
  deleteHistoryEntry,
  clearHistory,
  exportToCSV,
  exportToPrintable,
} from "../services/historyService";
import { MODELS } from "../data/models";
import { formatDateTime, truncate } from "../utils/helpers";

const PAGE_SIZE = 10;

function History() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [modelFilter, setModelFilter] = useState("all");
  const [predFilter, setPredFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const refresh = () => setEntries(getHistory());

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch =
        !search ||
        (e.article || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.modelName || "").toLowerCase().includes(search.toLowerCase());
      const matchesModel = modelFilter === "all" || e.modelId === modelFilter;
      const matchesPred = predFilter === "all" || e.prediction === predFilter;
      return matchesSearch && matchesModel && matchesPred;
    });
  }, [entries, search, modelFilter, predFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const total = entries.length;
    const real = entries.filter((e) => e.prediction === "REAL").length;
    const fake = entries.filter((e) => e.prediction === "FAKE").length;
    const avgTime = total
      ? (entries.reduce((s, e) => s + Number(e.time || 0), 0) / total).toFixed(2)
      : 0;
    return { total, real, fake, avgTime };
  }, [entries]);

  const handleDelete = (id) => {
    deleteHistoryEntry(id);
    refresh();
    toast.success("Entry removed");
  };

  const handleClearAll = () => {
    if (entries.length === 0) return;
    if (window.confirm("Clear all prediction history? This cannot be undone.")) {
      clearHistory();
      refresh();
      toast.success("History cleared");
    }
  };

  const handleCopyRow = (entry) => {
    navigator.clipboard?.writeText(
      `${entry.modelName}: ${entry.prediction} (${entry.confidence}%) — ${truncate(entry.article, 100)}`
    );
    toast.success("Copied to clipboard");
  };

  return (
    <div className="page-wrap">
      <div className="container-custom">
        <div className="page-header">
          <div>
            <h1><FaHistory style={{ color: "var(--primary-light)", marginRight: 10 }} />Prediction History</h1>
            <p>View and manage all your news predictions.</p>
          </div>
        </div>

        <div className="panel">
          <div className="history-toolbar">
            <div className="search-box">
              <FaSearch />
              <input
                placeholder="Search news article, model..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <select
              className="select-control"
              value={modelFilter}
              onChange={(e) => {
                setModelFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Models</option>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <select
              className="select-control"
              value={predFilter}
              onChange={(e) => {
                setPredFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Predictions</option>
              <option value="FAKE">Fake</option>
              <option value="REAL">Real</option>
            </select>

            <button className="toolbar-btn purple" onClick={() => exportToCSV(filtered)}>
              <FaDownload /> Download CSV
            </button>
            <button className="toolbar-btn green" onClick={() => exportToPrintable(filtered)}>
              <FaFilePdf /> Download PDF
            </button>
            <button className="toolbar-btn red" onClick={handleClearAll}>
              <FaTrash /> Clear History
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <FaFileAlt />
              <p>
                {entries.length === 0
                  ? "No predictions yet — run a check on the Detect News or Compare Models page."
                  : "No entries match your filters."}
              </p>
            </div>
          ) : (
            <>
              <div className="compare-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date & Time</th>
                      <th>Model</th>
                      <th>News Article (Preview)</th>
                      <th>Prediction</th>
                      <th>Confidence</th>
                      <th>Time (sec)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((e, i) => (
                      <tr key={e.id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td>{formatDateTime(e.timestamp)}</td>
                        <td>{e.modelName}</td>
                        <td>{truncate(e.article, 55)}</td>
                        <td>
                          <span className={`pred-tag ${e.prediction?.toLowerCase()}`}>{e.prediction}</span>
                        </td>
                        <td>{e.confidence}%</td>
                        <td>{e.time}</td>
                        <td>
                          <button className="action-icon-btn" title="View" onClick={() => setViewing(e)}>
                            <FaEye />
                          </button>
                          <button className="action-icon-btn" title="Share" onClick={() => handleCopyRow(e)}>
                            <FaShareAlt />
                          </button>
                          <button className="action-icon-btn danger" title="Delete" onClick={() => handleDelete(e.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-bar">
                <span style={{ color: "var(--text-muted)", fontSize: 13.5 }}>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} predictions
                </span>
                <div className="page-buttons">
                  <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    ‹
                  </button>
                  {Array.from({ length: totalPages }).slice(0, 6).map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${page === i + 1 ? "active" : ""}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                    ›
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="history-summary">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
                <FaFileAlt />
              </div>
              <h2>{stats.total}</h2>
              <p>Total Predictions</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
                <FaCheckCircle />
              </div>
              <h2>{stats.real}</h2>
              <p>Real News</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>
                <FaTimesCircle />
              </div>
              <h2>{stats.fake}</h2>
              <p>Fake News</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>
                <FaClock />
              </div>
              <h2>{stats.avgTime}s</h2>
              <p>Avg. Execution Time</p>
            </div>
          </div>
        </div>
      </div>

      {viewing && (
        <div
          onClick={() => setViewing(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 20,
          }}
        >
          <div
            className="panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }}
          >
            <div className="panel-head">
              <h2>Prediction Detail</h2>
              <span className={`pred-tag ${viewing.prediction?.toLowerCase()}`}>{viewing.prediction}</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>
              {formatDateTime(viewing.timestamp)} • {viewing.modelName} • {viewing.confidence}% confidence • {viewing.time}s
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 14.5 }}>{viewing.article}</p>
            <button className="custom-btn secondary" style={{ marginTop: 20 }} onClick={() => setViewing(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
