from app.schemas.browser_profile import AnalysisRequest

class ProfileClassifier:
    @staticmethod
    def calculate_baseline_cpm(request: AnalysisRequest) -> float:
        """
        Calculates a baseline ad CPM (Cost Per Mille) in USD using standard ad-tech heuristics.
        Factors in device performance, network speed, timezone/locale, and uniqueness.
        """
        cpm = 1.80  # Base standard CPM

        # Device capability premiums
        if request.device_class == "high":
            cpm += 2.50
        elif request.device_class == "low":
            cpm -= 0.80

        # Network speed premiums (high-performance users are valued more for video ads)
        if request.network_class == "fast":
            cpm += 0.90
        elif request.network_class == "slow":
            cpm -= 0.40

        # Fingerprint uniqueness premiums (easier to retarget cross-site)
        cpm += (request.uniqueness_score / 100.0) * 3.50

        # Locale/Language premiums (Tier 1 ad markets command highest CPMs)
        tier_1_languages = {"en", "ja", "de", "fr", "sv", "no", "da", "nl"}
        lang_code = request.language_group.split("-")[0].lower()
        if lang_code in tier_1_languages:
            cpm += 1.50
            
        # Ensure CPM stays within logical bounds ($0.50 minimum to $12.00 maximum)
        return round(max(0.50, min(cpm, 12.00)), 2)
