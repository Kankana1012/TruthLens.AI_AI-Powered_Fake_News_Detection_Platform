import { MODELS } from "../data/models";

const API_BASE = "http://localhost:8000";

/**
 * Checks if the FastAPI backend is running and healthy.
 * @returns {Promise<boolean>} true if backend is reachable and healthy
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: "GET" });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === "ok";
  } catch (err) {
    return false;
  }
}

/**
 * Calls the real FastAPI backend (see Web_part/server) which loads the
 * actual 9 trained models from /saved_models and runs true inference.
 * @param {string} text
 * @param {string[]} modelIds - optional subset of model ids to run
 * @returns {Promise<Array>} per-model result objects
 */
export async function runPrediction(text, modelIds = null) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/predict/all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, modelIds }),
    });
  } catch (err) {
    throw new Error("Cannot reach the backend. Ensure it is running on port 8000.");
  }

  if (!res.ok) {
    let errorMsg = `Prediction request failed: ${res.status}`;
    try {
      const errorJson = await res.json();
      if (errorJson.detail) {
        if (Array.isArray(errorJson.detail)) {
          // Pydantic validation error array
          errorMsg = errorJson.detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ');
        } else {
          // Standard FastAPI HTTPException
          errorMsg = errorJson.detail;
        }
      } else {
        errorMsg += ` ${JSON.stringify(errorJson)}`;
      }
    } catch (e) {
      // Not JSON, fallback to text
      const errorText = await res.text();
      errorMsg += ` ${errorText}`;
    }
    throw new Error(errorMsg);
  }

  const backendResults = await res.json();

  // merge backend prediction with local model metadata (icon, color, name, group)
  return backendResults.map((r) => {
    const meta = MODELS.find((m) => m.id === r.modelId);
    return {
      ...r,
      modelName: meta.name,
      icon: meta.icon,
      color: meta.color,
      group: meta.group,
    };
  });
}

export function getHighestConfidence(results) {
  return results.reduce((best, r) => (r.confidence > best.confidence ? r : best), results[0]);
}

export function getFastestModel(results) {
  return results.reduce((best, r) => (r.time < best.time ? r : best), results[0]);
}
