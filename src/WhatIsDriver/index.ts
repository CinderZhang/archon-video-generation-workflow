import { calculateMetadata } from "./calculateMetadata";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";
import { WhatIsDriver } from "./WhatIsDriver";

export default {
  id: "WhatIsDriver",
  component: WhatIsDriver,
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
  defaultProps: {},
  calculateMetadata,
};
