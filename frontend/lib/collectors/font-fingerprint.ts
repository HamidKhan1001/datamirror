export function getFontFingerprint(): string[] {
  if (typeof window === "undefined" || !document.createElement) {
    return [];
  }

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return [];
    }

    const testString = "mmmmmmmmmmlli";
    const testSize = "60px";
    
    // Fallback base fonts to compare widths against
    const fallbacks = ["sans-serif", "serif", "monospace"] as const;
    const baseWidths: Record<string, number> = {};

    // Record reference widths of pure fallback typography
    for (const fb of fallbacks) {
      ctx.font = `${testSize} ${fb}`;
      baseWidths[fb] = ctx.measureText(testString).width;
    }

    // List of targeted fonts to verify presence
    const fontsToTest = [
      "Arial", "Times New Roman", "Helvetica", "Courier New", "Georgia", 
      "Trebuchet MS", "Verdana", "Impact", "Segoe UI", "Calibri", 
      "Monaco", "Consolas", "Futura", "Lucida Grande", "Gill Sans"
    ];

    const detectedFonts: string[] = [];

    for (const font of fontsToTest) {
      let isDifferentFromFallbacks = true;
      
      // If the font width matches all fallback widths, the browser fell back (not installed)
      for (const fb of fallbacks) {
        ctx.font = `${testSize} '${font}', ${fb}`;
        const measuredWidth = ctx.measureText(testString).width;
        if (measuredWidth === baseWidths[fb]) {
          isDifferentFromFallbacks = false;
          break;
        }
      }

      if (isDifferentFromFallbacks) {
        detectedFonts.push(font);
      }
    }

    return detectedFonts;
  } catch (error) {
    console.error("[Font Fingerprinting Error]", error);
    return [];
  }
}
