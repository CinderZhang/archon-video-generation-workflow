// Composition constants for AIDoesntMakePeopleStupid (V3 hook).
// Voice durations come from the ElevenLabs render produced 2026-05-17 with
// Cinder's voice clone (voice id 7Ed8U4ORWoPPxoXMLATR).

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Dark editorial palette — kept identical to V2 so the DRIVER series feels
// like one show.
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

// Per-scene voice file paths (relative to public/).
export const VOICE_PATHS = {
  scene1: "voiceover/AIDoesntMakePeopleStupid/scene1.mp3",
  scene2: "voiceover/AIDoesntMakePeopleStupid/scene2.mp3",
  scene3: "voiceover/AIDoesntMakePeopleStupid/scene3.mp3",
} as const;

// Per-scene durations in frames (rounded from ffprobe of the rendered mp3s
// at 30fps). Static constants keep calculateMetadata pure.
//   scene1.mp3 = 29.628662s -> 889
//   scene2.mp3 = 39.938322s -> 1198
//   scene3.mp3 = 18.761723s -> 563
// Total 2650 frames = 88.33s — inside the 60-90s hook window.
export const SCENE_FRAMES = {
  scene1: 889,
  scene2: 1198,
  scene3: 563,
} as const;

export const TOTAL_FRAMES =
  SCENE_FRAMES.scene1 + SCENE_FRAMES.scene2 + SCENE_FRAMES.scene3; // 2650

// Canonical enter easing (per remotion-best-practices skill — same Bézier as V2).
export const ENTER_EASING = [0.16, 1, 0.3, 1] as const;
