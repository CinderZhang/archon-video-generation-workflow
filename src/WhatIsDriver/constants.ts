// Composition constants for WhatIsDriver (V1 universal intro hook)
// Voice durations come from the ElevenLabs manifest:
//   public/voiceover/WhatIsDriver/manifest.json
// generated on 2026-05-17 from scripts/v1-narration.json
// in the DRIVER-PhilosophyBigPicture repo.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Dark editorial palette (Pipeline A spec)
export const COLORS = {
  bg: "#0a0a0a",
  textPrimary: "#ffffff",
  textSecondary: "#e8e8e8",
  textMuted: "#9a9a9a",
  green: "#56f2a6", // human / Reflect / validated
  blue: "#6db3f2", // AI / machine middle
  red: "#f25656", // gap / risk
  gold: "#f2c656", // accent chips, highlights
  cardBg: "#161616",
  cardBorder: "#2a2a2a",
} as const;

// Per-scene voice file paths (relative to public/)
export const VOICE_PATHS = {
  scene1: "voiceover/WhatIsDriver/scene1.mp3",
  scene2: "voiceover/WhatIsDriver/scene2.mp3",
  scene3: "voiceover/WhatIsDriver/scene3.mp3",
} as const;

// Per-scene durations in frames (rounded from ElevenLabs manifest at 30fps).
// Static constants keep calculateMetadata pure and avoid async audio probing
// at render time.
//   scene1: 30.6503s -> 920
//   scene2: 39.0095s -> 1170
//   scene3: 18.6688s -> 560
export const SCENE_FRAMES = {
  scene1: 920,
  scene2: 1170,
  scene3: 560,
} as const;

export const TOTAL_FRAMES =
  SCENE_FRAMES.scene1 + SCENE_FRAMES.scene2 + SCENE_FRAMES.scene3; // 2650

// Canonical enter easing (per remotion-best-practices skill)
export const ENTER_EASING = [0.16, 1, 0.3, 1] as const;
