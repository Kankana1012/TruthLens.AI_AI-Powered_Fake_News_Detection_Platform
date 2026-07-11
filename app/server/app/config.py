from pathlib import Path

# saved_models/ sits at the project root, one level above Web_part/
SAVED_MODELS_DIR = Path(__file__).resolve().parents[3] / "saved_models"

CLASS_LABELS = {0: "FAKE", 1: "REAL"}

ML_MODEL_IDS = {"logreg", "randomforest", "svm"}
DL_MODEL_IDS = {"rnn", "lstm", "cnn"}
GNN_MODEL_IDS = {"gcn", "gat", "graphsage"}

ML_PIPELINE_FILES = {
    "logreg": "logistic_regression_pipeline.joblib",
    "randomforest": "random_forest_pipeline.joblib",
    "svm": "svm_pipeline.joblib",
}

DL_MODEL_FILES = {
    "rnn": "rnn_fake_news_model.keras",
    "lstm": "lstm_fake_news_model.keras",
    "cnn": "cnn_fake_news_model.keras",
}
DL_TOKENIZER_FILES = {
    "rnn": "rnn_tokenizer.json",
    "lstm": "lstm_tokenizer.json",
    "cnn": "cnn_tokenizer.json",
}
DL_CONFIG_FILES = {
    "rnn": "rnn_preprocessing_config.json",
    "lstm": "lstm_preprocessing_config.json",
    "cnn": "cnn_preprocessing_config.json",
}

GNN_STATE_FILES = {
    "gcn": "gcn_model_state.pt",
    "gat": "gat_model_state.pt",
    "graphsage": "graphsage_model_state.pt",
}
GNN_TFIDF_FILE = "gnn_tfidf_vectorizer.joblib"
GNN_GRAPH_FILE = "gnn_graph_data.pt"

# Must match the "id" values in Web_part/client/src/data/models.js exactly
ALL_MODEL_IDS = [
    "logreg", "randomforest", "svm",
    "rnn", "lstm", "cnn",
    "gcn", "gat", "graphsage",
]