from pathlib import Path
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR.parent / "models" / "sms_spam_model.joblib"

sms_model = None

try:
    sms_model = joblib.load(MODEL_PATH)
    print("SMS model loaded successfully!")
except Exception as error:
    print(f"Model loading failed: {error}")

app = FastAPI(
    title="ScamSleuth AI",
    description="AI-powered scam and spam detection platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class SMSRequest(BaseModel):
    message: str = Field(min_length=1, max_length=10000)

@app.get("/")
def home():
    return {"message": "Welcome to ScamSleuth AI", "status": "running"}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "ScamSleuth AI",
        "ml_ready": sms_model is not None
    }

@app.post("/api/analyze/sms")
def analyze_sms(request: SMSRequest):
    if sms_model is None:
        raise HTTPException(status_code=503, detail="SMS model is not available.")

    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Please enter a valid SMS.")

    prediction = sms_model.predict([message])[0]
    probabilities = sms_model.predict_proba([message])[0]
    classes = list(sms_model.classes_)
    spam_probability = float(probabilities[classes.index("spam")])

    return {
        "message": message,
        "prediction": prediction,
        "classification": "Spam" if prediction == "spam" else "Legitimate",
        "risk_score": round(spam_probability * 100, 2),
        "confidence": round(max(probabilities) * 100, 2),
        "explanation": (
            "This message has patterns commonly associated with spam."
            if prediction == "spam"
            else "This message was classified as legitimate by the model."
        ),
        "model": "TF-IDF + Logistic Regression"
    }
