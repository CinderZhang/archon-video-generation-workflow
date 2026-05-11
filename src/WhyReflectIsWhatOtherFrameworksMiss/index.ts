import { calculateMetadata } from "./calculateMetadata";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";
import { WhyReflectIsWhatOtherFrameworksMiss } from "./WhyReflectIsWhatOtherFrameworksMiss";

export default {
  id: "WhyReflectIsWhatOtherFrameworksMiss",
  component: WhyReflectIsWhatOtherFrameworksMiss,
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
  defaultProps: {},
  calculateMetadata,
};
