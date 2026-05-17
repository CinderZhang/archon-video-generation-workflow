import { AIDoesntMakePeopleStupidShort } from "./AIDoesntMakePeopleStupidShort";
import { calculateMetadata } from "./calculateMetadata";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";

export default {
  id: "AIDoesntMakePeopleStupidShort",
  component: AIDoesntMakePeopleStupidShort,
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
  defaultProps: {},
  calculateMetadata,
};
