export function getWebGLFingerprint(): { vendor: string; renderer: string } {
  if (typeof window === "undefined" || !document.createElement) {
    return { vendor: "unknown", renderer: "unknown" };
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    
    if (!gl) {
      return { vendor: "unsupported", renderer: "unsupported" };
    }

    // Access debug renderer extension to unmask raw GPU strings
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
      return { 
        vendor: vendor.toString().trim(), 
        renderer: renderer.toString().trim() 
      };
    }

    return { vendor: "masked_generic", renderer: "masked_generic" };
  } catch (error) {
    console.error("[WebGL Fingerprinting Error]", error);
    return { vendor: "fault_unknown", renderer: "fault_unknown" };
  }
}
