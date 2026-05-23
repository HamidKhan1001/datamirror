from app.schemas.browser_profile import AnalysisRequest

class RecommendationEngine:
    @staticmethod
    def generate_recommendations(request: AnalysisRequest) -> list[dict[str, str]]:
        """
        Simulates how top consumer platforms (Amazon, TikTok, Netflix) classify users and adapt feeds
        based on device, network, and behavioral inputs.
        """
        buckets = []

        # 1. E-Commerce / Amazon Profile Bucketing
        if request.device_class == "high":
            buckets.append({
                "platform": "Amazon Shopping",
                "bucket_name": "High-Value Consumer Tech Cohort",
                "mechanics": "Prioritizes luxury accessories, flagship smartphones, and premium hardware. Items are ranked by high-margin profiles since screen resolution and device memory suggest premium purchasing capability."
            })
        else:
            buckets.append({
                "platform": "Amazon Shopping",
                "bucket_name": "Value-Conscious Utility Shopper",
                "mechanics": "Ranks items by discounted tags, mid-range utility, and high sales volume. Page assets are compressed to guarantee immediate loading on standard hardware configurations."
            })

        # 2. Short Video / TikTok Content Loop Bucketing
        if request.behavioral_signals.scroll_depth_percent > 70.0:
            buckets.append({
                "platform": "TikTok Video Loop",
                "bucket_name": "High-Retention Doomscroller",
                "mechanics": "Exploits high-scroll history by serving autoplaying, high-intensity shock or comedy clips. Delay tactics (wait 0.2s before autoplay) are disabled to trigger maximum dopamine feedback."
            })
        else:
            buckets.append({
                "platform": "TikTok Video Loop",
                "bucket_name": "Passive Explorer",
                "mechanics": "Presents highly-vetted, broad-interest global viral trends. Video pacing is varied to benchmark initial attention boundaries and capture specific interests."
            })

        # 3. Streaming / Netflix Buffering Strategy
        if request.network_class == "fast":
            buckets.append({
                "platform": "Netflix Hub",
                "bucket_name": "Ultra-HD Cinematic Collector",
                "mechanics": "Immediately schedules 4K HDR stream pre-buffering. Recommended dashboard banners display high-budget sci-fi and action tiles to utilize modern rendering capabilities."
            })
        else:
            buckets.append({
                "platform": "Netflix Hub",
                "bucket_name": "Mobile Standard Viewer",
                "mechanics": "Forces pre-compression of video streams. Favors titles that stream smoothly under low bitrates (e.g. sitcoms or dialogue-heavy documentaries) to prevent buffering interruption warnings."
            })

        return buckets
