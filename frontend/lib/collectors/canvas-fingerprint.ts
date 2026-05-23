export async function getCanvasFingerprint(): Promise<{ hash: string; dataUrl: string }> {
  if (typeof window === "undefined" || !document.createElement) {
    return { hash: "ssr_fallback", dataUrl: "" };
  }
  
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return { hash: "unsupported", dataUrl: "" };
    }

    // 1. Render colorful background text with shadow properties
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial', sans-serif";
    ctx.fillStyle = "#f60";
    ctx.fillRect(100, 5, 80, 15);
    ctx.fillStyle = "#00ff88";
    ctx.fillText("DataMirror Scanning v1.0", 5, 5);

    // 2. Draw layered geometric arcs with blending modes
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgba(0,255,255,0.75)";
    ctx.beginPath();
    ctx.arc(30, 30, 12, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,0,255,0.75)";
    ctx.beginPath();
    ctx.arc(40, 30, 12, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,0,0.75)";
    ctx.beginPath();
    ctx.arc(35, 35, 12, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // 3. Extract the image representation
    const dataUrl = canvas.toDataURL();
    
    // 4. Hash the raw dataUrl using standard SHA-256 WebCrypto (100% free and client-side)
    const encoder = new TextEncoder();
    const rawBytes = encoder.encode(dataUrl);
    const hashBuffer = await crypto.subtle.digest("SHA-256", rawBytes);
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    return { hash: hashHex, dataUrl };
  } catch (error) {
    console.error("[Canvas Fingerprinting Error]", error);
    return { hash: "fingerprint_fault", dataUrl: "" };
  }
}
