import { AIDoesntMakePeopleStupid } from "./AIDoesntMakePeopleStupid";
import { calculateMetadata } from "./calculateMetadata";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";

export default {
  id: "AIDoesntMakePeopleStupid",
  component: AIDoesntMakePeopleStupid,
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
  defaultProps: {},
  calculateMetadata,
};
