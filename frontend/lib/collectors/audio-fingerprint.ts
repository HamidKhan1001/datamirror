export async function getAudioFingerprint(): Promise<string> {
  if (typeof window === "undefined") {
    return "ssr_fallback";
  }

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      return "unsupported";
    }

    // 1. Setup silent audio pipeline
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const analyser = context.createAnalyser();

    oscillator.type = "triangle";
    oscillator.frequency.value = 10000;
    
    // Set volume to 0 so the visitor hears absolutely nothing
    gainNode.gain.value = 0;

    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(context.destination);

    // 2. Play oscillator and record telemetry data
    oscillator.start(0);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyser.getFloatFrequencyData(dataArray);

    oscillator.stop();
    await context.close();

    // 3. Perform a mathematical reduction to obtain a stable seed
    let frequencySum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const val = dataArray[i];
      if (isFinite(val)) {
        frequencySum += Math.abs(val);
      }
    }

    // 4. Hash the seed using client-side SHA-256
    const seedString = `audio-wave-${frequencySum.toFixed(5)}`;
    const encoder = new TextEncoder();
    const rawBytes = encoder.encode(seedString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", rawBytes);
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    console.error("[Audio Fingerprinting Error]", error);
    return "audio_fault";
  }
}
