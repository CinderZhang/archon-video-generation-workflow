import { calculateMetadata } from "./calculateMetadata";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";
import { WhatIsDriverShort } from "./WhatIsDriverShort";

export default {
  id: "WhatIsDriverShort",
  component: WhatIsDriverShort,
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
  defaultProps: {},
  calculateMetadata,
};
