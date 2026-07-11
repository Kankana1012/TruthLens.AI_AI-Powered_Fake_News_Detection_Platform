import re
import time
import joblib
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import hashlib
import random

from app.config import (
    SAVED_MODELS_DIR,
    GNN_STATE_FILES,
    GNN_TFIDF_FILE,
    GNN_GRAPH_FILE,
    CLASS_LABELS,
)

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, GATConv, SAGEConv

nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)
nltk.download("stopwords", quiet=True)
_STOPWORDS = set(stopwords.words("english"))

def preprocess_text(text: str) -> str:
    """Mirrors preprocess_text() in fake-news-detection-gnns-models.ipynb exactly —
    must match or the TF-IDF vector won't line up with how the graph was built."""
    text = text.lower()
    text = re.sub(r"@\w+|#\w+|http\S+|www\S+|[^a-zA-Z\s]", "", text)
    tokens = word_tokenize(text)
    tokens = [w for w in tokens if w not in _STOPWORDS]
    return " ".join(tokens)

# --- architectures copied 1:1 from get_gcn / get_gat / get_graphsage in the notebook ---
class GCNModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.conv1 = GCNConv(input_dim, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, output_dim)
        self.relu = nn.ReLU()
    def forward(self, x, edge_index):
        x = self.relu(self.conv1(x, edge_index))
        x = self.conv2(x, edge_index)
        return F.log_softmax(x, dim=1)

class GATModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.conv1 = GATConv(input_dim, hidden_dim)
        self.conv2 = GATConv(hidden_dim, output_dim)
        self.relu = nn.ReLU()
    def forward(self, x, edge_index):
        x = self.relu(self.conv1(x, edge_index))
        x = self.conv2(x, edge_index)
        return F.log_softmax(x, dim=1)

class GraphSAGEModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.conv1 = SAGEConv(input_dim, hidden_dim)
        self.conv2 = SAGEConv(hidden_dim, output_dim)
        self.relu = nn.ReLU()
    def forward(self, x, edge_index):
        x = self.relu(self.conv1(x, edge_index))
        x = self.conv2(x, edge_index)
        return F.log_softmax(x, dim=1)

ARCH_CLASSES = {"gcn": GCNModel, "gat": GATModel, "graphsage": GraphSAGEModel}

class GNNService:
    def __init__(self):
        self._tfidf = None
        self._graph = None
        self._models = {}

    @property
    def tfidf(self):
        if self._tfidf is None:
            self._tfidf = joblib.load(SAVED_MODELS_DIR / GNN_TFIDF_FILE)
        return self._tfidf

    @property
    def graph(self):
        if self._graph is None:
            self._graph = torch.load(SAVED_MODELS_DIR / GNN_GRAPH_FILE, weights_only=False)
        return self._graph

    def _get_model(self, model_id: str):
        if model_id not in self._models:
            cfg = self.graph["config"]
            model = ARCH_CLASSES[model_id](
                input_dim=cfg["max_features"],
                hidden_dim=cfg["hidden_dim"],
                output_dim=cfg["output_dim"],
            )
            loaded = torch.load(SAVED_MODELS_DIR / GNN_STATE_FILES[model_id], map_location="cpu", weights_only=False)
            state_dict = loaded["model_state_dict"] if "model_state_dict" in loaded else loaded
            model.load_state_dict(state_dict)
            model.eval()
            self._models[model_id] = model
        return self._models[model_id]

    def predict(self, text: str, model_id: str) -> dict:
        cfg = self.graph["config"]
        k = cfg["k_neighbors"]

        start = time.time()
        cleaned = preprocess_text(text)
        new_vec = self.tfidf.transform([cleaned]).toarray()
        new_x = torch.tensor(new_vec, dtype=torch.float)

        existing_x = self.graph["x"]
        sims = F.cosine_similarity(new_x, existing_x)
        topk = torch.topk(sims, k=k).indices

        combined_x = torch.cat([existing_x, new_x], dim=0)
        new_node_id = combined_x.size(0) - 1

        fwd = torch.stack([topk, torch.full_like(topk, new_node_id)])
        bwd = torch.stack([torch.full_like(topk, new_node_id), topk])
        combined_edge_index = torch.cat([self.graph["edge_index"], fwd, bwd], dim=1)

        model = self._get_model(model_id)
        with torch.no_grad():
            log_probs = model(combined_x, combined_edge_index)
        probs = torch.exp(log_probs[new_node_id])
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

gnn_service = GNNService()