import time
import joblib

from app.config import SAVED_MODELS_DIR, ML_PIPELINE_FILES, CLASS_LABELS


class MLService:
    """Logistic Regression, Random Forest, SVM.
    Each *_pipeline.joblib already bundles the TF-IDF vectorizer + classifier
    (see save_models() in fake-news-detection-ml-model.ipynb), so raw text
    goes in directly — no separate vectorizing step needed here.
    """

    def __init__(self):
        self._pipelines = {}

    def _get_pipeline(self, model_id: str):
        if model_id not in self._pipelines:
            path = SAVED_MODELS_DIR / ML_PIPELINE_FILES[model_id]
            self._pipelines[model_id] = joblib.load(path)
        return self._pipelines[model_id]

    def predict(self, text: str, model_id: str) -> dict:
        pipeline = self._get_pipeline(model_id)

        start = time.time()
        probs = pipeline.predict_proba([text])[0]  # [P(fake), P(real)]
        elapsed = time.time() - start

        fake_p, real_p = float(probs[0]) * 100, float(probs[1]) * 100
        prediction = CLASS_LABELS[0] if fake_p >= real_p else CLASS_LABELS[1]

        return {
            "modelId": model_id,
            "prediction": prediction,
            "confidence": round(max(fake_p, real_p), 2),
            "fakeProbability": round(fake_p, 2),
            "realProbability": round(real_p, 2),
            "time": round(elapsed, 4),
        }


ml_service = MLService()