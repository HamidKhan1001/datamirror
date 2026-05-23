import time
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models import Scan
from app.schemas.browser_profile import AnalysisRequest
from app.utils.sanitizer import Sanitizer
from app.utils.rate_limiter import rate_limit_dependency
from app.services.profile_classifier import ProfileClassifier
from app.services.claude_service import ClaudeService
from app.services.fingerprint_analyzer import FingerprintAnalyzer

router = APIRouter()
_claude_service = ClaudeService()

@router.post("/analyze", dependencies=[Depends(rate_limit_dependency)])
async def analyze_browser_fingerprint(
    payload: AnalysisRequest,
    authorization: str = Header(..., description="Bearer backend proxy token"),
    db: Session = Depends(get_db)
) -> dict:
    """
    Validates, sanitizes, and evaluates a visitor's browser fingerprint.
    Persists data to Neon Postgres/SQLite and triggers dynamic local AI profiling.
    """
    # 1. Validate incoming proxy auth token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization header.")
    
    token = authorization.split(" ")[1]
    if token != settings.backend_secret:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid backend access credentials.")

    # 2. Sanitize payload metrics
    sanitized_payload = Sanitizer.clean(payload)

    # 3. Calculate baseline CPM metrics
    baseline_cpm = ProfileClassifier.calculate_baseline_cpm(sanitized_payload)

    # 4. Generate high-fidelity dynamic profiling assessment (100% free offline CPU mode)
    start_time = time.time()
    ai_response = await _claude_service.analyze_profile(sanitized_payload, baseline_cpm)
    latency_ms = int((time.time() - start_time) * 1000)

    # 5. Classify browser tracking tracking tier
    confidence_tier = FingerprintAnalyzer.determine_confidence_tier(sanitized_payload.uniqueness_score)

    # 6. Persist session scan entry to Neon Postgres
    db_scan = Scan(
        fingerprint_hash=sanitized_payload.fingerprint_hash,
        browser_tier=sanitized_payload.browser_tier,
        device_class=sanitized_payload.device_class,
        network_class=sanitized_payload.network_class,
        timezone_region=sanitized_payload.timezone_region,
        language_group=sanitized_payload.language_group,
        uniqueness_score=sanitized_payload.uniqueness_score,
        cpm_value=baseline_cpm,
        confidence_tier=confidence_tier,
        raw_data=sanitized_payload.raw_data or {},
        ai_analysis=ai_response.model_dump()
    )

    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)

    # 7. Package and return full payload including metrics
    response_payload = ai_response.model_dump()
    response_payload["meta"] = {
        "tokens_used": 0,  # 0 because it's locally processed for FREE
        "latency_ms": latency_ms,
        "scan_id": db_scan.id
    }
    
    return response_payload
