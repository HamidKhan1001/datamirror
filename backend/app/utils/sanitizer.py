import re
from app.schemas.browser_profile import AnalysisRequest

class Sanitizer:
    @staticmethod
    def clean(request: AnalysisRequest) -> AnalysisRequest:
        # Prevent HTML/Script injection attacks by stripping simple tags
        def sanitize_str(s: str) -> str:
            if not s:
                return ""
            return re.sub(r"<[^>]*>", "", s).strip()

        request.timezone_region = sanitize_str(request.timezone_region)
        request.language_group = sanitize_str(request.language_group)
        request.browser_tier = sanitize_str(request.browser_tier)
        request.device_class = sanitize_str(request.device_class)
        request.network_class = sanitize_str(request.network_class)

        # Scan raw data dict for anything resembling PII or tokens, and purge
        if request.raw_data:
            pii_keywords = {
                "ip", "address", "name", "email", "phone", "password", 
                "token", "secret", "auth", "cookie", "lat", "lon", 
                "latitude", "longitude", "coords", "gps", "account"
            }
            cleaned_raw = {}
            for k, v in request.raw_data.items():
                # Check if key contains any of the bad words
                k_lower = k.lower()
                if any(kw in k_lower for kw in pii_keywords):
                    continue
                # Also clean string values in raw data from any html tags
                if isinstance(v, str):
                    v = sanitize_str(v)
                cleaned_raw[k] = v
            request.raw_data = cleaned_raw

        return request
