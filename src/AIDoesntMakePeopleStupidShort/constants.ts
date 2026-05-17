// Composition constants for AIDoesntMakePeopleStupidShort — vertical 9:16
// version of V3 (AIDoesntMakePeopleStupid) for YouTube Shorts / Reels / TikTok.
// Reuses the EXACT same audio assets and per-scene frame counts as V3.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Dark editorial palette (matches V3 16:9 visual direction)
export const COLORS = {
  bg: "#0a0a0a",
  textPrimary: "#ffffff",
  textSecondary: "#e8e8e8",
  textMuted: "#9a9a9a",
  green: "#56f2a6", // active / engaged / structured
  blue: "#6db3f2",  // neutral accent
  red: "#f25656",   // passive / problem
  gold: "#f2c656",  // accent chips, dividers
  cardBg: "#161616",
  cardBorder: "#2a2a2a",
} as const;

// Per-scene voice file paths — REUSES the V3 audio directory.
// Cinder's ElevenLabs clone narration; not regenerated for vertical.
export const VOICE_PATHS = {
  scene1: "voiceover/AIDoesntMakePeopleStupid/scene1.mp3",
  scene2: "voiceover/AIDoesntMakePeopleStupid/scene2.mp3",
  scene3: "voiceover/AIDoesntMakePeopleStupid/scene3.mp3",
} as const;

// Per-scene durations in frames — identical to V3 since we reuse the audio.
//   scene1.mp3 = 29.628662s -> 889
//   scene2.mp3 = 39.938322s -> 1198
//   scene3.mp3 = 18.761723s -> 563
// Total 2650 frames = 88.33s.
export const SCENE_FRAMES = {
  scene1: 889,
  scene2: 1198,
  scene3: 563,
} as const;

export const TOTAL_FRAMES =
  SCENE_FRAMES.scene1 + SCENE_FRAMES.scene2 + SCENE_FRAMES.scene3; // 2650

// Canonical enter easing (matches V3)
export const ENTER_EASING = [0.16, 1, 0.3, 1] as const;

// Vertical safe-zone padding for mobile UI (subscribe button, progress bar,
// comment overlay). Roughly 8–10% top/bottom of a 1920-tall canvas.
export const SAFE_ZONE_TOP = 180;
export const SAFE_ZONE_BOTTOM = 200;
