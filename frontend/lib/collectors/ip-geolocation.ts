/**
 * IP Address & Geolocation Collector
 * Fetches user's IP and approximate geolocation
 */

export interface IPGeolocationData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  is_vpn?: boolean;
  is_proxy?: boolean;
  is_datacenter?: boolean;
}

export async function getIPAndGeolocation(): Promise<IPGeolocationData> {
  try {
    // Try multiple free geolocation APIs
    const response = await Promise.race([
      fetch("https://ipapi.co/json/", { cache: "no-store" }),
      fetch("https://ip-api.com/json/", { cache: "no-store" }),
    ]);

    if (!response.ok) {
      return { ip: "unknown" };
    }

    const data = await response.json();

    // Normalize response from different APIs
    return {
      ip: data.ip || data.query || "unknown",
      city: data.city,
      region: data.region || data.regionName,
      country: data.country_name || data.country,
      country_code: data.country_code || data.countryCode,
      timezone: data.timezone,
      latitude: data.latitude || data.lat,
      longitude: data.longitude || data.lon,
      isp: data.org || data.isp,
      is_vpn: data.is_vpn === true || data.vpn === true,
      is_proxy: data.is_proxy === true || data.proxy === true,
      is_datacenter: data.is_datacenter === true || data.is_datacenter === true,
    };
  } catch (error) {
    console.warn("IP geolocation fetch failed:", error);
    return { ip: "unknown" };
  }
}
