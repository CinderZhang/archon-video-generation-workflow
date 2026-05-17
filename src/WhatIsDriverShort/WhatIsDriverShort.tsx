import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING, SCENE_FRAMES, VOICE_PATHS } from "./constants";
import Scene1 from "./scenes/Scene1";
import Scene2 from "./scenes/Scene2";
import Scene3 from "./scenes/Scene3";

// Crossfade duration between scenes (frames). Audio is continuous; visuals
// blend over this overlap. Matches V1 16:9 crossfade timing.
const CROSSFADE_FRAMES = 12; // 0.4s

// SceneContainer applies a crossfade in/out window using interpolate, so the
// previous scene fades out while the next fades in. This avoids needing
// @remotion/transitions (not installed in this project).
const SceneContainer: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ durationInFrames, children, fadeIn = true, fadeOut = true }) => {
  const frame = useCurrentFrame();
  const fadeInOpacity = fadeIn
    ? interpolate(frame, [0, CROSSFADE_FRAMES], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(
          ENTER_EASING[0],
          ENTER_EASING[1],
          ENTER_EASING[2],
          ENTER_EASING[3],
        ),
      })
    : 1;
  const fadeOutOpacity = fadeOut
    ? interpolate(
        frame,
        [durationInFrames - CROSSFADE_FRAMES, durationInFrames],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 1;
  const opacity = Math.min(fadeInOpacity, fadeOutOpacity);
  return (
    <AbsoluteFill style={{ opacity, background: COLORS.bg }}>
      {children}
    </AbsoluteFill>
  );
};

export const WhatIsDriverShort: React.FC = () => {
  const { fps } = useVideoConfig();
  // Premount the next scene so it is fully buffered/ready before its window
  // begins; helps avoid first-frame jank for audio.
  const premount = fps;

  const s1From = 0;
  const s2From = SCENE_FRAMES.scene1;
  const s3From = SCENE_FRAMES.scene1 + SCENE_FRAMES.scene2;

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Scene 1 */}
      <Sequence
        from={s1From}
        durationInFrames={SCENE_FRAMES.scene1}
        premountFor={premount}
        name="Scene1"
      >
        <SceneContainer
          durationInFrames={SCENE_FRAMES.scene1}
          fadeIn={false}
          fadeOut
        >
          <Scene1 />
        </SceneContainer>
        <Audio src={staticFile(VOICE_PATHS.scene1)} />
      </Sequence>

      {/* Scene 2 */}
      <Sequence
        from={s2From}
        durationInFrames={SCENE_FRAMES.scene2}
        premountFor={premount}
        name="Scene2"
      >
        <SceneContainer durationInFrames={SCENE_FRAMES.scene2} fadeIn fadeOut>
          <Scene2 />
        </SceneContainer>
        <Audio src={staticFile(VOICE_PATHS.scene2)} />
      </Sequence>

      {/* Scene 3 */}
      <Sequence
        from={s3From}
        durationInFrames={SCENE_FRAMES.scene3}
        premountFor={premount}
        name="Scene3"
      >
        <SceneContainer
          durationInFrames={SCENE_FRAMES.scene3}
          fadeIn
          fadeOut={false}
        >
          <Scene3 />
        </SceneContainer>
        <Audio src={staticFile(VOICE_PATHS.scene3)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default WhatIsDriverShort;
