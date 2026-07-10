import { MODELS } from "../data/models";

/**
 * TruthLens AI ships with 9 pre-trained models (see /saved_models in the
 * research repo: Logistic Regression, Random Forest, SVM, RNN, LSTM, CNN,
 * GCN, GAT, GraphSAGE). Wiring this UI to the real Python/Flask inference
 * service is a drop-in swap inside this file — replace `runPrediction`
 * with a fetch() call to your `/api/predict` endpoint. Until then, this
 * module simulates the ensemble locally with deterministic, text-aware
 * heuristics so every screen (Detect, Compare, History, Analytics) behaves
 * consistently for the same input.
 */

// ---- deterministic hash + seeded RNG so the same article always
// ---- produces the same "model" behaviour ----
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FAKE_SIGNALS = [
  "you won't believe",
  "shocking",
  "secret",
  "miracle",
  "cure all",
  "share before",
  "doctors hate",
  "don't want you to know",
  "click here",
  "one weird trick",
  "government is hiding",
  "wake up",
  "goes viral",
  "banned",
  "they don't want you to see",
  "conspiracy",
  "100% guaranteed",
];

const REAL_SIGNALS = [
  "according to",
  "published in",
  "peer-reviewed",
  "university",
  "reuters",
  "associated press",
  "government agencies",
  "study shows",
  "researchers",
  "official statement",
  "data suggests",
  "central bank",
  "quarterly report",
  "spokesperson said",
];

function analyzeText(text) {
  const lower = text.toLowerCase();
  let score = 0.5; // 0 = real, 1 = fake

  FAKE_SIGNALS.forEach((sig) => {
    if (lower.includes(sig)) score += 0.09;
  });
  REAL_SIGNALS.forEach((sig) => {
    if (lower.includes(sig)) score -= 0.07;
  });

  const exclamations = (text.match(/!/g) || []).length;
  score += Math.min(exclamations * 0.03, 0.15);

  const words = text.split(/\s+/).filter(Boolean);
  const capsWords = words.filter((w) => w.length > 3 && w === w.toUpperCase());
  score += Math.min(capsWords.length * 0.02, 0.12);

  if (words.length < 25) score += 0.05; // very short articles are harder to verify

  return Math.max(0.03, Math.min(0.97, score));
}

/**
 * Run the (simulated) 9-model ensemble against a news article.
 * @param {string} text
 * @param {string[]} modelIds - optional subset of model ids to run
 * @returns {Array} per-model result objects
 */
export function runPrediction(text, modelIds = null) {
  const seed = hashString(text.trim().toLowerCase() || "empty");
  const rand = mulberry32(seed);
  const baseFakeScore = analyzeText(text);

  const models = modelIds
    ? MODELS.filter((m) => modelIds.includes(m.id))
    : MODELS;

  return models.map((model, idx) => {
    const jitter = (rand() - 0.5) * 0.14;
    let fakeScore = Math.max(0.02, Math.min(0.98, baseFakeScore + jitter));

    const prediction = fakeScore >= 0.5 ? "FAKE" : "REAL";
    const rawConfidence =
      prediction === "FAKE" ? fakeScore : 1 - fakeScore;

    // Blend with the model's own baseline confidence so stronger models
    // (e.g. CNN) read as more confident, matching benchmark metrics.
    const confidence = Math.min(
      99.97,
      Math.max(
        51,
        (rawConfidence * 100 * 0.55 + model.baseConfidence * 100 * 0.45) *
          (0.985 + rand() * 0.03)
      )
    );

    const time = Math.max(
      0.01,
      model.baseTime * (0.85 + rand() * 0.3) + idx * 0.002
    );

    return {
      modelId: model.id,
      modelName: model.name,
      icon: model.icon,
      color: model.color,
      group: model.group,
      prediction,
      confidence: Number(confidence.toFixed(2)),
      fakeProbability: Number((fakeScore * 100).toFixed(2)),
      realProbability: Number(((1 - fakeScore) * 100).toFixed(2)),
      time: Number(time.toFixed(2)),
    };
  });
}

export function getHighestConfidence(results) {
  return results.reduce((best, r) => (r.confidence > best.confidence ? r : best), results[0]);
}

export function getFastestModel(results) {
  return results.reduce((best, r) => (r.time < best.time ? r : best), results[0]);
}
