from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.config import settings
from app.database import get_db
from app.models import Scan

router = APIRouter()

def verify_admin_key(authorization: str = Header(..., description="Bearer admin passcode")) -> bool:
    """
    Dependency checking the Authorization Header against the system ADMIN_SECRET_KEY.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Admin token missing.")
    
    token = authorization.split(" ")[1]
    if token != settings.admin_secret_key:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid admin credentials.")
    return True

@router.get("/admin/stats", dependencies=[Depends(verify_admin_key)])
def fetch_aggregated_admin_stats(db: Session = Depends(get_db)) -> dict:
    """
    Executes database aggregates to assemble detailed system metrics:
    Averages of scores/CPMs and breakdowns of device, network, location, and confidence tags.
    """
    total_scans = db.query(Scan).count()
    if total_scans == 0:
        return {
            "total_scans": 0,
            "avg_uniqueness": 0.0,
            "avg_cpm": 0.0,
            "device_breakdown": {},
            "network_breakdown": {},
            "confidence_breakdown": {},
            "browser_breakdown": {},
            "timezone_breakdown": {}
        }

    # Calculations
    avg_uniqueness = db.query(func.avg(Scan.uniqueness_score)).scalar() or 0.0
    avg_cpm = db.query(func.avg(Scan.cpm_value)).scalar() or 0.0

    # Group counts
    def get_group_counts(column):
        results = db.query(column, func.count(column)).group_by(column).all()
        return {str(val): count for val, count in results if val is not None}

    return {
        "total_scans": total_scans,
        "avg_uniqueness": round(float(avg_uniqueness), 2),
        "avg_cpm": round(float(avg_cpm), 2),
        "device_breakdown": get_group_counts(Scan.device_class),
        "network_breakdown": get_group_counts(Scan.network_class),
        "confidence_breakdown": get_group_counts(Scan.confidence_tier),
        "browser_breakdown": get_group_counts(Scan.browser_tier),
        "timezone_breakdown": get_group_counts(Scan.timezone_region)
    }

@router.get("/admin/scans", dependencies=[Depends(verify_admin_key)])
def fetch_paginated_scans_list(
    page: int = 1,
    limit: int = 15,
    db: Session = Depends(get_db)
) -> dict:
    """
    Returns a paginated log of collected browser fingerprint records.
    Ordered by the latest visitor entries first.
    """
    offset = (page - 1) * limit
    total_scans = db.query(Scan).count()
    scans = db.query(Scan).order_by(Scan.created_at.desc()).offset(offset).limit(limit).all()

    formatted_scans = []
    for s in scans:
        formatted_scans.append({
            "id": s.id,
            "created_at": s.created_at.isoformat(),
            "fingerprint_hash": s.fingerprint_hash,
            "browser_tier": s.browser_tier,
            "device_class": s.device_class,
            "network_class": s.network_class,
            "timezone_region": s.timezone_region,
            "language_group": s.language_group,
            "uniqueness_score": s.uniqueness_score,
            "cpm_value": s.cpm_value,
            "confidence_tier": s.confidence_tier,
            "raw_data": s.raw_data,
            "ai_analysis": s.ai_analysis
        })

    return {
        "total_scans": total_scans,
        "page": page,
        "limit": limit,
        "scans": formatted_scans
    }
