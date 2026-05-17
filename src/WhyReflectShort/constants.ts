// Composition constants for WhyReflectShort — vertical 9:16 version of V2
// (WhyReflectIsWhatOtherFrameworksMiss) for YouTube Shorts / Reels / TikTok.
// Reuses the EXACT same audio assets and per-scene frame counts as V2.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Dark editorial palette (matches V2 16:9 visual direction)
export const COLORS = {
  bg: "#0a0a0a",
  textPrimary: "#ffffff",
  textSecondary: "#e8e8e8",
  textMuted: "#9a9a9a",
  green: "#56f2a6", // human / Reflect / validated
  blue: "#6db3f2",  // machine middle
  red: "#f25656",   // gap / X / missing
  gold: "#f2c656",  // accent chips, highlights
  cardBg: "#161616",
  cardBorder: "#2a2a2a",
} as const;

// Per-scene voice file paths — REUSES the V2 audio directory.
// Cinder's ElevenLabs clone narration; not regenerated for vertical.
export const VOICE_PATHS = {
  scene1: "voiceover/WhyReflectIsWhatOtherFrameworksMiss/scene1.mp3",
  scene2: "voiceover/WhyReflectIsWhatOtherFrameworksMiss/scene2.mp3",
  scene3: "voiceover/WhyReflectIsWhatOtherFrameworksMiss/scene3.mp3",
} as const;

// Per-scene durations in frames — identical to V2 since we reuse the audio.
export const SCENE_FRAMES = {
  scene1: 894,  // 29.8057s
  scene2: 1056, // 35.1869s
  scene3: 559,  // 18.6224s
} as const;

export const TOTAL_FRAMES =
  SCENE_FRAMES.scene1 + SCENE_FRAMES.scene2 + SCENE_FRAMES.scene3; // 2509

// Canonical enter easing (matches V2)
export const ENTER_EASING = [0.16, 1, 0.3, 1] as const;

// Vertical safe-zone padding for mobile UI (subscribe button, progress bar,
// comment overlay). Roughly 8–10% top/bottom of a 1920-tall canvas.
export const SAFE_ZONE_TOP = 180;
export const SAFE_ZONE_BOTTOM = 200;
