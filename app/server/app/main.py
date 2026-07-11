import os
import sys

# Ensure Python can find the 'app' module when running `python app/main.py` directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Suppress noisy TensorFlow startup warnings
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router
from app.config import SAVED_MODELS_DIR

app = FastAPI(title="TruthLens AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
def on_startup():
    exists = SAVED_MODELS_DIR.exists()
    print(f"[TruthLens] saved_models dir: {SAVED_MODELS_DIR}  (exists={exists})")
    if not exists:
        print("[TruthLens] WARNING: saved_models/ not found — predictions will fail!")


@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "modelsDir": str(SAVED_MODELS_DIR),
        "modelsDirExists": SAVED_MODELS_DIR.exists(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000)