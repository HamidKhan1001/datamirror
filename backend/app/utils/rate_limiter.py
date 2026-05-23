import time
import hashlib
from fastapi import HTTPException, Request
from app.config import settings

class RateLimiter:
    def __init__(self) -> None:
        # Maps hashed IP (str) to list of request timestamps (float)
        self.requests: dict[str, list[float]] = {}

    def check_limit(self, client_ip: str) -> bool:
        # Hash IP address with SHA-256 for privacy protection
        hashed_ip = hashlib.sha256(client_ip.encode("utf-8")).hexdigest()
        now = time.time()
        one_minute_ago = now - 60.0

        # Retrieve request timestamps and prune entries older than one minute
        timestamps = self.requests.get(hashed_ip, [])
        timestamps = [t for t in timestamps if t > one_minute_ago]
        self.requests[hashed_ip] = timestamps

        # Verify against allowed rate
        if len(timestamps) >= settings.rate_limit_per_minute:
            return True

        # Append current request timestamp
        self.requests[hashed_ip].append(now)
        return False

# Global rate limiter instance
_limiter = RateLimiter()

def rate_limit_dependency(request: Request) -> None:
    # Use client host IP or fallback
    client_ip = "127.0.0.1"
    if request.client and request.client.host:
        client_ip = request.client.host
        
    if _limiter.check_limit(client_ip):
        raise HTTPException(
            status_code=429, 
            detail=f"Rate limit exceeded ({settings.rate_limit_per_minute} req/min). Please wait and try again."
        )
