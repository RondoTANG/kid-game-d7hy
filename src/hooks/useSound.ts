let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playCorrectSound(): void {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // silently fail
  }
}

export function playWrongSound(): void {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.28);
  } catch {
    // silently fail
  }
}
