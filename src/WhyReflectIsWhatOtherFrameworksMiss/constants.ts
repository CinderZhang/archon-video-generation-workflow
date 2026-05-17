// Composition constants for WhyReflectIsWhatOtherFrameworksMiss (V2 hook)
// Voice durations come from the ElevenLabs manifest produced by the
// archon workflow run 3da1196a483c005ce092e996d71bdf6b.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Dark editorial palette (V2 visual direction)
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

// Per-scene voice file paths (relative to public/)
export const VOICE_PATHS = {
  scene1: "voiceover/WhyReflectIsWhatOtherFrameworksMiss/scene1.mp3",
  scene2: "voiceover/WhyReflectIsWhatOtherFrameworksMiss/scene2.mp3",
  scene3: "voiceover/WhyReflectIsWhatOtherFrameworksMiss/scene3.mp3",
} as const;

// Per-scene durations in frames (rounded from ElevenLabs manifest at 30fps).
// Using static constants keeps calculateMetadata pure and avoids requiring
// async audio probing in the renderer.
// rev1 (2026-05-17): scene2 + scene3 re-narrated for 80/20 framing
// and DRIVER AI brand pivot.
export const SCENE_FRAMES = {
  scene1: 894,  // 29.8057s
  scene2: 1056, // 35.1869s (rev1)
  scene3: 683,  // 22.7527s (rev1)
} as const;

export const TOTAL_FRAMES =
  SCENE_FRAMES.scene1 + SCENE_FRAMES.scene2 + SCENE_FRAMES.scene3; // 2633

// Canonical enter easing (per remotion-best-practices skill)
export const ENTER_EASING = [0.16, 1, 0.3, 1] as const;
