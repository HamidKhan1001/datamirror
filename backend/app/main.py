from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routers import health, analyze, admin

# Initialize SQLAlchemy Tables on boot
init_db()

app = FastAPI(
    title="DataMirror - Digital Fingerprinting & Analytics",
    description="Advanced browser fingerprinting, user behavior analytics, and device tracking demonstrator for portfolio showcase.",
    version="1.0.0"
)

# Parse multiple Allowed CORS Origins if configured in environment
origins = [org.strip() for org in settings.allowed_origins.split(",") if org.strip()]
if not origins:
    origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include Routers
app.include_router(health.router)
app.include_router(analyze.router)
app.include_router(admin.router)

@app.get("/")
async def root() -> dict[str, str]:
    return {
        "application": "DataMirror Analytics Engine",
        "status": "active",
        "version": "1.0.0",
        "api_docs": "/docs",
        "description": "Portfolio project: Browser fingerprinting & tracking analytics"
    }
