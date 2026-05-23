from pydantic import BaseModel, Field
from typing import List, Dict, Any

class AdProfile(BaseModel):
    inferred_demographics: str = Field(..., description="Estimated age, lifestyle bracket, and tech profile")
    income_bracket: str = Field(..., description="Estimated income class, e.g. High, Medium, Low")
    interests: List[str] = Field(..., description="Primary inferred commercial interests")
    purchase_intent_signals: List[str] = Field(..., description="Estimated current purchase signals")

class RecommendationBucket(BaseModel):
    platform: str = Field(..., description="Recommendation platform (e.g. TikTok, YouTube, Amazon)")
    bucket_name: str = Field(..., description="Bucket classification (e.g. Fast-paced entertainment seeker, Tech enthusiast)")
    mechanics: str = Field(..., description="How the algorithm uses browser signals to capture user attention")

class DataValuation(BaseModel):
    estimated_cpm_usd: float = Field(..., description="Estimated value per 1000 pageviews (CPM) on ad exchanges")
    valuation_tier: str = Field(..., description="Premium, Mid-Tier, or Value tier based on fingerprint and locale rarity")
    factors: List[str] = Field(..., description="Core features influencing the CPM (e.g. high-performance device, high-bandwidth locale)")

class DarkPattern(BaseModel):
    name: str = Field(..., description="Specific dark pattern name (e.g. Confirmshaming, Sneak into Basket)")
    description: str = Field(..., description="How behavioral metadata is exploited to trigger this dark pattern")
    severity: str = Field(..., description="High, Medium, or Low")

class ProtectionAction(BaseModel):
    action: str = Field(..., description="Actionable tip (e.g. disable canvas APIs, switch to Mullvad Browser)")
    impact: str = Field(..., description="Specific fingerprinting metric this action neutralizes")
    difficulty: str = Field(..., description="Easy, Moderate, or Hard")

class AIAnalysisResponse(BaseModel):
    ad_profile: AdProfile
    recommendation_buckets: List[RecommendationBucket]
    data_valuation: DataValuation
    dark_patterns: List[DarkPattern]
    protection_advice: List[ProtectionAction]
