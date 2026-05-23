export function calculateUniquenessScore(params: {
  deviceMemory?: number;
  cpuCores?: number;
  timezone?: string;
  language?: string;
  fontsCount: number;
  hasWebGL: boolean;
  hasAudio: boolean;
  storageCapabilitiesCount: number;
  dnt: boolean;
}): { score: number; percentile: number; tier: "Anonymous" | "Trackable" | "Highly Identifiable" } {
  // Base baseline score representing average baseline standard browser uniqueness
  let score = 25.0;

  // 1. Timezone and Coarse Location Rarity
  const highVolumeTimezones = [
    "America/New_York", "America/Chicago", "America/Los_Angeles",
    "Europe/London", "Europe/Paris", "Asia/Kolkata", "Asia/Tokyo"
  ];
  if (params.timezone && !highVolumeTimezones.includes(params.timezone)) {
    score += 18.0; // Rare regional location increases fingerprint rarity
  } else {
    score += 4.0;
  }

  // 2. Installed Fonts Density
  // standard modern systems detect about 5 to 10 fonts in standard sandboxed canvas checks.
  // Extreme values (many fonts or blocked font detection) add uniqueness.
  if (params.fontsCount > 10) {
    score += 20.0; // High custom font library density
  } else if (params.fontsCount < 3) {
    score += 12.0; // Font telemetry blocked (often points to custom anti-fingerprint tools)
  } else {
    score += 6.0;
  }

  // 3. Hardware Rendering and Oscillator telemetry availability
  if (params.hasWebGL) score += 6.0;
  if (params.hasAudio) score += 6.0;

  // 4. System hardware configurations (cores/RAM memory)
  // Extreme high-end developer workstations or custom VPS nodes have rare profiles.
  const cores = params.cpuCores || 4;
  if (cores > 8 || cores < 4) {
    score += 15.0;
  } else {
    score += 5.0;
  }

  const memory = params.deviceMemory || 8;
  if (memory > 16 || memory < 8) {
    score += 15.0;
  } else {
    score += 5.0;
  }

  // 5. Storage capability restrictions (Indicates standard vs Private Incognito browsing)
  if (params.storageCapabilitiesCount < 3) {
    score += 10.0; // Restrictive permissions yield a distinct signature
  }

  // 6. Do Not Track (DNT) header state
  if (params.dnt) {
    score += 5.0; // ironically, enabling DNT makes your fingerprint slightly more unique
  }

  // Clamp uniqueness score strictly between 15% and 98%
  const finalScore = Math.round(Math.min(98, Math.max(15, score)));
  
  let tier: "Anonymous" | "Trackable" | "Highly Identifiable" = "Trackable";
  if (finalScore < 35) {
    tier = "Anonymous";
  } else if (finalScore >= 75) {
    tier = "Highly Identifiable";
  }

  return {
    score: finalScore,
    percentile: finalScore, // score maps to rarity percentile
    tier
  };
}
