class FingerprintAnalyzer:
    @staticmethod
    def determine_confidence_tier(uniqueness_score: float) -> str:
        """
        Determines how trackable a user is based on their uniqueness score (0-100).
        """
        if uniqueness_score < 35.0:
            return "Anonymous"
        elif uniqueness_score < 75.0:
            return "Trackable"
        else:
            return "Highly Identifiable"
