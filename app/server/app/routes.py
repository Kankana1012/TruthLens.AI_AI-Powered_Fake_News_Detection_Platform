from fastapi import APIRouter, HTTPException

from app.schemas import PredictRequest, PredictAllRequest, PredictResponse
from app.config import ML_MODEL_IDS, DL_MODEL_IDS, GNN_MODEL_IDS, ALL_MODEL_IDS
from app.services.ml_service import ml_service
from app.services.dl_service import dl_service
from app.services.gnn_service import gnn_service
from app.services.metrics_service import metrics_service

router = APIRouter()


def dispatch(text: str, model_id: str) -> dict:
    if model_id in ML_MODEL_IDS:
        return ml_service.predict(text, model_id)
    if model_id in DL_MODEL_IDS:
        return dl_service.predict(text, model_id)
    if model_id in GNN_MODEL_IDS:
        return gnn_service.predict(text, model_id)
    raise HTTPException(status_code=404, detail=f"Unknown modelId: {model_id}")


@router.get("/api/models")
def list_models():
    return {"modelIds": ALL_MODEL_IDS}


@router.post("/api/predict", response_model=PredictResponse)
def predict_one(req: PredictRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text cannot be empty")
    return dispatch(req.text, req.modelId)


@router.post("/api/predict/all", response_model=list[PredictResponse])
def predict_all(req: PredictAllRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text cannot be empty")
    ids = req.modelIds if req.modelIds else ALL_MODEL_IDS
    return [dispatch(req.text, mid) for mid in ids]


# ── Metrics endpoints ──────────────────────────────────────────────────

@router.get("/api/metrics")
def get_all_metrics():
    """Return real training metrics for all 9 models, loaded from saved_models/."""
    return metrics_service.get_all()


@router.get("/api/metrics/{model_id}")
def get_model_metrics(model_id: str):
    """Return training metrics for a single model."""
    data = metrics_service.get_one(model_id)
    if data is None:
        raise HTTPException(status_code=404, detail=f"No metrics for model: {model_id}")
    return data