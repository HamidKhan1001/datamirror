import time
from fastapi import APIRouter

router = APIRouter()
_launch_time = time.time()

@router.get("/health")
async def health_check() -> dict[str, str | int]:
    """
    Returns API operational status, versioning, and running uptime.
    """
    return {
        "status": "ok",
        "version": "1.0.0",
        "uptime_seconds": int(time.time() - _launch_time)
    }
