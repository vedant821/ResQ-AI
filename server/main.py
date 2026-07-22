from dotenv import load_dotenv
load_dotenv()  # Load server/.env before any other module initialises

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.incidents import router as incidents_router
from routes.analytics import router as analytics_router

app = FastAPI(
    title="ResQ AI API",
    description="AI-Powered Emergency Incident Triage and Response System",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router)
app.include_router(incidents_router)
app.include_router(analytics_router)


@app.get("/")
async def root():
    return {
        "name": "ResQ AI API",
        "version": "1.0.0",
        "status": "running",
        "description": "AI-Powered Emergency Incident Triage and Response System",
    }


@app.get("/api/health")
async def health():
    return {"status": "healthy"}
