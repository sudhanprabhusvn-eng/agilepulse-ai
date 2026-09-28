import os
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="AgilePulse AI Prediction & Intelligence Service",
    description="High-performance FastAPI microservice for AI Sprint Analysis, Risk Prediction, and RAG Vector Retrieval.",
    version="2.4.0"
)

class SprintPredictionRequest(BaseModel):
    sprint_id: str
    velocity: float
    total_story_points: int
    team_capacity: float
    historical_completion_rate: Optional[float] = 0.85

class RiskAnalysisRequest(BaseModel):
    project_id: str
    active_blockers: int
    overdue_tasks: int
    unassigned_stories: int

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AgilePulse AI Engine",
        "version": "2.4.0",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))
    }

@app.post("/predict/sprint")
def predict_sprint(req: SprintPredictionRequest):
    expected_completion = round(min(1.0, (req.velocity * req.historical_completion_rate) / max(req.total_story_points, 1)) * 100, 1)
    risk_level = "Low" if expected_completion >= 85 else ("Medium" if expected_completion >= 70 else "High")
    
    return {
        "sprint_id": req.sprint_id,
        "predicted_completion_rate": expected_completion,
        "risk_level": risk_level,
        "recommended_scope_adjustment": 0 if risk_level == "Low" else (5 if risk_level == "Medium" else 15),
        "confidence_score": 0.92
    }

@app.post("/predict/risk")
def analyze_risk(req: RiskAnalysisRequest):
    composite_score = min(100, (req.active_blockers * 25) + (req.overdue_tasks * 15) + (req.unassigned_stories * 10))
    status = "Critical" if composite_score > 60 else ("Moderate" if composite_score > 30 else "Healthy")
    
    return {
        "project_id": req.project_id,
        "composite_risk_score": composite_score,
        "status": status,
        "actionable_insights": [
            "Reassign unassigned high priority user stories",
            "Hold an emergency blocker removal standup",
            "Review team capacity allocation"
        ]
    }
