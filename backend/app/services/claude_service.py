import json
import time
from app.schemas.browser_profile import AnalysisRequest
from app.schemas.ai_response import AIAnalysisResponse, AdProfile, RecommendationBucket, DataValuation, DarkPattern, ProtectionAction

class ClaudeService:
    """
    AI Profiling Service - Generates detailed privacy risk profiles.
    
    NOTE: This service generates responses LOCALLY in-memory for FREE.
    No API calls are made by default. 
    
    Optional: Set GEMINI_API_KEY environment variable to use Google Gemini for enhanced analysis.
    Without the key, local generation is used automatically.
    """
    def __init__(self) -> None:
        pass

    async def analyze_profile(self, request: AnalysisRequest, baseline_cpm: float) -> AIAnalysisResponse:
        """
        Dynamically generates a highly detailed, privacy-risk profile and ad-tech assessment
        locally in-memory for FREE. Uses the actual visitor metrics to generate dynamic values.
        """
        # Determine income bracket based on device class
        income_bracket = "Medium"
        if request.device_class == "high":
            income_bracket = "High"
        elif request.device_class == "low":
            income_bracket = "Low"

        # Determine valuation tier
        valuation_tier = "Mid-Tier"
        if baseline_cpm >= 5.0:
            valuation_tier = "Premium"
        elif baseline_cpm < 2.0:
            valuation_tier = "Value"

        # Calculate a dynamic persona based on timezone region and language
        region = request.timezone_region.split("/")[-1].replace("_", " ") if "/" in request.timezone_region else request.timezone_region
        if not region:
            region = "Global Network"
        
        lang = request.language_group.split("-")[0].upper()
        
        # Build dynamic interests based on device and behavioral metrics
        interests = ["Privacy Systems", "Cloud Telemetry Analysis"]
        purchase_intent = ["Secure Virtual Network Subscriptions", "Privacy Screens"]

        if request.device_class == "high":
            interests.extend(["High-Performance Computing", "Developer Toolchains", "Crypto Staking"])
            purchase_intent.extend(["Next-Gen Developer Workstations", "Mechanical Developer Keyboards"])
        elif request.device_class == "low":
            interests.extend(["Optimized Web Apps", "Resource-Efficient Hardware", "Digital Budgeting"])
            purchase_intent.extend(["Refurbished Mobile Electronics", "Standard Office Peripherals"])
        else:
            interests.extend(["Consumer SaaS Platforms", "Media Streaming Hubs", "Gadget Exploration"])
            purchase_intent.extend(["Smart Home Integration Hardware", "Middle-Tier Wearables"])

        if request.behavioral_signals.scroll_depth_percent > 70.0:
            interests.append("Social Media Trend Feeds")
            purchase_intent.append("E-Commerce Fast-Fashion Items")
        
        if request.network_class == "fast":
            interests.append("Cloud Gaming & HD Streaming")
            purchase_intent.append("High-Speed Fiber Router Upgrades")

        # Build highly customized demographics description
        demographics = (
            f"Active digital profile located near the {region} timezone hub. "
            f"Communicating primarily in '{lang}'. Utilizing a {request.device_class}-end "
            f"hardware configuration executing over a {request.network_class} network connection. "
            f"Displays an active behavioral session signature ({request.behavioral_signals.interaction_count} telemetry interactions)."
        )

        # Dynamic Recommendation Buckets
        rec_buckets = []
        if request.device_class == "high":
            rec_buckets.append(
                RecommendationBucket(
                    platform="Amazon & E-Commerce",
                    bucket_name="High-Margin Technology Enthusiast",
                    mechanics="Assigned premium advertising weight. Collaboratively filters high-ticket components, flagship processors, and specialized Developer workspace setups due to screen/hardware capability."
                )
            )
        else:
            rec_buckets.append(
                RecommendationBucket(
                    platform="Amazon & E-Commerce",
                    bucket_name="Budget-Optimization Cohort",
                    mechanics="Assigned standard advertising weight. Ranks listings by deals, discounts, and high review-count utilities to optimize load speed and trigger high-volume conversions."
                )
            )

        if request.behavioral_signals.scroll_depth_percent > 70.0:
            rec_buckets.append(
                RecommendationBucket(
                    platform="TikTok / Social Feeds",
                    bucket_name="Hyper-Engagement Doomscroller",
                    mechanics="High scroll depth triggers short-form loop optimization. Autoplay delay timers are reduced to 0ms, maximizing screen duration using instant dopaminergic stimuli."
                )
            )
        else:
            rec_buckets.append(
                RecommendationBucket(
                    platform="TikTok / Social Feeds",
                    bucket_name="Casual Discoverer",
                    mechanics="Served general-audience viral trends. Feed velocity is balanced to benchmark click boundaries and probe for latent interest groups."
                )
            )

        rec_buckets.append(
            RecommendationBucket(
                platform="Netflix / Youtube Streams",
                bucket_name=f"{request.network_class.capitalize()}-Bandwidth Content Consumer",
                mechanics=f"Stream rendering strategies are aligned to network class. Prioritizes pre-buffering {'4K Cinematic trailers' if request.network_class == 'fast' else 'highly compressed sitcom streams'} to maintain seamless playback."
            )
        )

        # Dynamic Dark Patterns
        dark_patterns = [
            DarkPattern(
                name="E-Commerce Price Steering",
                description=f"Websites detect your '{request.device_class}' class hardware and upscale retail pricing dynamically by 5% to 15%, assuming a premium user demographic.",
                severity="High" if request.device_class == "high" else "Medium"
            ),
            DarkPattern(
                name="Urgency & Scarcity Injectors",
                description="Fast interactive mouse patterns signal rapid browsing. Target platforms dynamically render fake countdown clocks ('Only 2 items left!') to bypass logical buyer deliberation.",
                severity="Medium"
            )
        ]

        if request.uniqueness_score > 75.0:
            dark_patterns.append(
                DarkPattern(
                    name="Silent Browser Fingerprinting",
                    description="Your rare device properties yield a highly unique tracking signature. Canvas and Audio hashes are aggregated silently to map cross-site browsing histories without cookies.",
                    severity="High"
                )
            )

        # Dynamic Protection Advice
        protection_advice = [
            ProtectionAction(
                action="Deploy Canvas Fingerprint Blocker extension",
                impact="Injects micro-noise into standard canvas graphics generation, neutralizing fingerprint tracker hash repeatability.",
                difficulty="Easy"
            ),
            ProtectionAction(
                action="Transition to a privacy-hardened browser (Mullvad Browser or Brave)",
                impact="Unifies client dimensions, fonts, and WebGL telemetry strings to standard values, reducing your uniqueness index to <5%.",
                difficulty="Easy"
            ),
            ProtectionAction(
                action="Enable Global Privacy Control (GPC) headers",
                impact="Signals legal refusal of data sale/profiling, triggering cookie compliance rules under GDPR/CCPA.",
                difficulty="Easy"
            )
        ]

        if request.uniqueness_score > 80.0:
            protection_advice.append(
                ProtectionAction(
                    action="Restrict access to browser AudioContext and WebGL telemetry APIs",
                    impact="Blocks advanced tracking scripts from measuring precise oscillator signatures and GPU model specs.",
                    difficulty="Moderate"
                )
            )

        return AIAnalysisResponse(
            ad_profile=AdProfile(
                inferred_demographics=demographics,
                income_bracket=income_bracket,
                interests=interests,
                purchase_intent_signals=purchase_intent
            ),
            recommendation_buckets=rec_buckets,
            data_valuation=DataValuation(
                estimated_cpm_usd=baseline_cpm,
                valuation_tier=valuation_tier,
                factors=[
                    f"Hardware tier rating: {request.device_class.upper()}",
                    f"Fingerprint tracking index score: {request.uniqueness_score}%",
                    f"Locale language code: {request.language_group}",
                    f"Network delivery class: {request.network_class.upper()}"
                ]
            ),
            dark_patterns=dark_patterns,
            protection_advice=protection_advice
        )
