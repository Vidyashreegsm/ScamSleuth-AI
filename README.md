# ScamSleuth AI

An AI-powered SMS spam detection platform using machine learning.

## Features
- SMS spam detection
- Spam risk probability score
- Model confidence score
- Explainable detection results
- Recent scan history

## Tech Stack
- React + Vite
- Python + FastAPI
- Scikit-learn
- TF-IDF + Logistic Regression

## Model Performance
- Dataset: UCI SMS Spam Collection
- Total messages: 5,572
- Held-out test accuracy: 97.04%

## Run Locally

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev

## Future Improvements
- Email phishing detection
- Suspicious URL analysis
- Downloadable security reports

## Note
Spam classification does not necessarily mean a message is fraudulent.
