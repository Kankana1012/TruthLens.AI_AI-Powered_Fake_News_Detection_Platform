from pydantic import BaseModel, Field
from typing import Optional, List


class PredictRequest(BaseModel):
    text: str = Field(..., max_length=50000)
    modelId: str


class PredictAllRequest(BaseModel):
    text: str = Field(..., max_length=50000)
    modelIds: Optional[List[str]] = None  # None = run all 9



# Field names match exactly what predictionService.js / CompareModels.jsx /
# DetectNews.jsx already read off each result object (r.modelId, r.prediction,
# r.confidence, r.fakeProbability, r.realProbability, r.time).
class PredictResponse(BaseModel):
    modelId: str
    prediction: str          # "FAKE" or "REAL"
    confidence: float        # 0-100
    fakeProbability: float   # 0-100
    realProbability: float   # 0-100
    time: float              # seconds