const API_BASE = "http://localhost:8000";

let _cache = null;

/**
 * Fetches real model metrics from the backend (/api/metrics).
 * Results are cached so only one network request is made per session.
 * @returns {Promise<Object>} per-model metrics keyed by modelId
 */
export async function fetchAllMetrics() {
  if (_cache) return _cache;

  const res = await fetch(`${API_BASE}/api/metrics`);
  if (!res.ok) throw new Error("Failed to fetch model metrics");
  _cache = await res.json();
  return _cache;
}

/**
 * Fetches metrics for a single model.
 * @param {string} modelId
 * @returns {Promise<Object>}
 */
export async function fetchModelMetrics(modelId) {
  const all = await fetchAllMetrics();
  return all[modelId] || null;
}

/**
 * Clears the metrics cache (useful if you want to re-fetch).
 */
export function clearMetricsCache() {
  _cache = null;
}
