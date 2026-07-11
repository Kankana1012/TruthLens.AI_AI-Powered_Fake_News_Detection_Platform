import json
import time
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences

from app.config import (
    SAVED_MODELS_DIR,
    DL_MODEL_FILES,
    DL_TOKENIZER_FILES,
    DL_CONFIG_FILES,
    CLASS_LABELS,
)


class DLService:
    """RNN, LSTM, CNN — each has its own model + tokenizer + preprocessing config
    (num_words=10000, maxlen=500, padding/truncating='post', per each notebook's
    save_models() cell). Tokenizers are fit independently per notebook, so each
    is loaded and cached separately by model_id.
    """

    def __init__(self):
        self._models = {}
        self._tokenizers = {}
        self._configs = {}

    def _get_config(self, model_id: str) -> dict:
        if model_id not in self._configs:
            path = SAVED_MODELS_DIR / DL_CONFIG_FILES[model_id]
            with open(path, "r", encoding="utf-8") as f:
                self._configs[model_id] = json.load(f)
        return self._configs[model_id]

    def _get_tokenizer(self, model_id: str):
        if model_id not in self._tokenizers:
            path = SAVED_MODELS_DIR / DL_TOKENIZER_FILES[model_id]
            with open(path, "r", encoding="utf-8") as f:
                tokenizer_json = json.load(f)
            # tokenizer_from_json expects a JSON *string*; the file on disk is
            # already-parsed JSON, so re-serialize before passing it in.
            self._tokenizers[model_id] = tokenizer_from_json(json.dumps(tokenizer_json))
        return self._tokenizers[model_id]

    def _get_model(self, model_id: str):
        if model_id not in self._models:
            path = SAVED_MODELS_DIR / DL_MODEL_FILES[model_id]
            self._models[model_id] = load_model(path)
        return self._models[model_id]

    def predict(self, text: str, model_id: str) -> dict:
        config = self._get_config(model_id)
        tokenizer = self._get_tokenizer(model_id)
        model = self._get_model(model_id)

        start = time.time()
        seq = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(
            seq,
            maxlen=config["maxlen"],
            padding=config["padding"],
            truncating=config["truncating"],
        )
        raw_output = model.predict(padded, verbose=0)[0]
        elapsed = time.time() - start

        # Assumes a single sigmoid output = P(real), matching class_labels
        # {"0": "Fake", "1": "True"} in *_preprocessing_config.json.
        # If model.summary() shows a 2-unit softmax instead, change this to
        # fake_p, real_p = float(raw_output[0]) * 100, float(raw_output[1]) * 100
        real_p = float(raw_output[0]) * 100
        fake_p = 100 - real_p
        prediction = CLASS_LABELS[1] if real_p >= fake_p else CLASS_LABELS[0]

        return {
            "modelId": model_id,
            "prediction": prediction,
            "confidence": round(max(fake_p, real_p), 2),
            "fakeProbability": round(fake_p, 2),
            "realProbability": round(real_p, 2),
            "time": round(elapsed, 4),
        }


dl_service = DLService()