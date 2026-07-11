# TruthLens AI — Fake News Detector

An AI-powered platform that analyzes news articles using an ensemble of 9
Machine Learning, Deep Learning, and Graph Neural Network models to detect
misinformation — built to match the TruthLens AI product design (Home,
Detect News, Compare Models, Analytics, History, Developer/Contact).

## Tech Stack

- **React 18 + Vite** — fast dev server & build
- **React Router v6** — client-side routing across 6 pages
- **Framer Motion** — entrance/hover animations
- **Recharts** — analytics bar/line charts
- **React Icons** — all iconography
- **react-hot-toast** — notifications
- Plain CSS with a CSS-variable dark/light theme system (no Tailwind/Bootstrap
  required) — see `src/styles/variables.css`

## Getting Started

```bash
cd client
npm install
npm run dev       # http://localhost:5173
```

Build for production:

```bash
npm run build     # outputs to client/dist
npm run preview   # preview the production build
```

## Pages

| Route         | Description                                                        |
|---------------|---------------------------------------------------------------------|
| `/`           | Landing page — hero, stats, 9-model overview, workflow, CTA          |
| `/detect`     | Paste an article, pick 1 of 9 models, get a Fake/Real verdict         |
| `/compare`    | Run one article through **all 9 models** side-by-side                |
| `/analytics`  | Aggregate metrics, per-model bar charts, training curves, confusion matrix |
| `/history`    | Searchable/filterable log of past predictions, CSV/PDF export         |
| `/developer`  | Developer profile & contact form                                     |

## About the "AI" in this build

The original project ships real trained model artifacts in `/saved_models`
(Keras `.keras` models for CNN/RNN/LSTM, scikit-learn `.joblib` pipelines for
Logistic Regression/Random Forest/SVM, and PyTorch `.pt` state dicts for
GCN/GAT/GraphSAGE) plus a scaffold for a Python inference service
(`/ai-service`) and an Express API (`/server`). Serving those models live
requires a real backend host (Flask/FastAPI + Node), which is out of scope
for a static frontend deliverable.

To keep every screen fully interactive out of the box, `src/services/predictionService.js`
simulates the 9-model ensemble client-side: it's **deterministic** (the same
article always returns the same verdict), uses lightweight text heuristics
(sensational phrasing, sourcing language, punctuation) to lean the verdict
real/fake, then blends in each model's benchmark accuracy so stronger models
(CNN, LSTM) read as more confident — matching the metrics already recorded in
`/saved_models/*_model_metrics.json`.

**To connect the real models:** stand up `ai-service` (Flask/FastAPI) to load
the `.keras` / `.joblib` / `.pt` files and expose a `/predict` endpoint, then
replace the body of `runPrediction()` in `predictionService.js` with a
`fetch("/api/predict", …)` call. Everything else (History, Analytics inputs,
UI) already expects that exact shape of result object.

## Project Structure

```
client/
  src/
    components/   layout, home, common (Button, StatCard, SectionTitle)
    pages/        Home, DetectNews, CompareModels, Analytics, History, Developer
    services/     predictionService.js (mock ensemble), historyService.js (localStorage)
    data/         models.js (9-model registry), sampleArticles.js
    styles/       variables.css (theme), + one stylesheet per page/section
    hooks/        useTheme.js (dark/light persisted to localStorage)
```
