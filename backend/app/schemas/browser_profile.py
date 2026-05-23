from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class BehavioralSignals(BaseModel):
    time_on_page_seconds: float = Field(..., description="Seconds spent on the scanner page")
    scroll_depth_percent: float = Field(..., description="Max scroll depth reached by the visitor")
    interaction_count: int = Field(..., description="Count of click, touch, and scroll events")
    idle_ratio: float = Field(..., description="Ratio of idle time to active time")

class AnalysisRequest(BaseModel):
    fingerprint_hash: str = Field(..., description="SHA-256 fingerprint hash")
    browser_tier: str = Field(..., description="modern or legacy")
    device_class: str = Field(..., description="high, mid, or low capability device")
    network_class: str = Field(..., description="fast, slow, or unknown network speed")
    timezone_region: str = Field(..., description=" coarse location/timezone region")
    language_group: str = Field(..., description="Primary language of the visitor")
    storage_capabilities: List[str] = Field(..., description="Detected storage types available")
    uniqueness_score: float = Field(..., description="Uniqueness score from 0 to 100")
    behavioral_signals: BehavioralSignals
    raw_data: Optional[Dict[str, Any]] = Field(default=None, description="All raw collector properties")
