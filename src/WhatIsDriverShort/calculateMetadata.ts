import type { CalculateMetadataFunction } from "remotion";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";

// Returns the composition's resolved metadata. Voice files are reused from
// the V1 composition (public/voiceover/WhatIsDriver/) and their exact
// durations are baked into TOTAL_FRAMES via constants.
export const calculateMetadata: CalculateMetadataFunction<
  Record<string, unknown>
> = () => {
  return {
    durationInFrames: TOTAL_FRAMES,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
  };
};
