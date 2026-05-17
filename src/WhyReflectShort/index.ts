import { calculateMetadata } from "./calculateMetadata";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";
import { WhyReflectShort } from "./WhyReflectShort";

export default {
  id: "WhyReflectShort",
  component: WhyReflectShort,
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
  defaultProps: {},
  calculateMetadata,
};
