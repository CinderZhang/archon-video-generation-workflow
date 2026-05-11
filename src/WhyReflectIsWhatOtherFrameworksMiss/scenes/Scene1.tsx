import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING } from "../constants";

type Framework = {
  name: string;
  meta: string;
};

const FRAMEWORKS: Framework[] = [
  { name: "gstack", meta: "77K stars" },
  { name: "Superpowers", meta: "160K stars" },
  { name: "CrewAI", meta: "human-in-the-loop" },
  { name: "LangGraph", meta: "human-in-the-loop" },
  { name: "AutoGen", meta: "human-in-the-loop" },
];

// Composed-progress helper: maps current frame against an inSec/holdSec/outSec
// envelope to a normalized 0->1 enter/exit progress value.
const useEnter = (inStartSec: number, inDurSec: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inStart = inStartSec * fps;
  const inDur = inDurSec * fps;
  return interpolate(frame, [inStart, inStart + inDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(
      ENTER_EASING[0],
      ENTER_EASING[1],
      ENTER_EASING[2],
      ENTER_EASING[3],
    ),
  });
};

const FrameworkCard: React.FC<{
  framework: Framework;
  index: number;
  startSec: number;
}> = ({ framework, index, startSec }) => {
  const enter = useEnter(startSec, 0.6);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [24, 0]);
  // Check stamp delays slightly behind card
  const checkEnter = useEnter(startSec + 0.25, 0.4);
  const checkScale = interpolate(checkEnter, [0, 1], [0.4, 1]);
  const checkOpacity = checkEnter;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: COLORS.cardBg,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 14,
        padding: "20px 28px",
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        gap: 22,
        width: 560,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `${COLORS.green}22`,
          border: `2px solid ${COLORS.green}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: checkOpacity,
          transform: `scale(${checkScale})`,
          flexShrink: 0,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path
            d="M5 13.5L10.5 19L21 7"
            stroke={COLORS.green}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            color: COLORS.textPrimary,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {framework.name}
        </div>
        <div
          style={{
            color: COLORS.textMuted,
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          AI verified · {framework.meta}
        </div>
      </div>
      {/* Suppress unused index warning by including the prop in render */}
      <span style={{ display: "none" }}>{index}</span>
    </div>
  );
};

const HumanCard: React.FC = () => {
  const enter = useEnter(4.0, 0.8);
  const opacity = enter;
  const scale = interpolate(enter, [0, 1], [0.92, 1]);
  const xEnter = useEnter(4.4, 0.5);
  const xScale = interpolate(xEnter, [0, 1], [0.3, 1]);
  const xRotate = interpolate(xEnter, [0, 1], [-30, 0]);
  const xOpacity = xEnter;

  // Pulsing ring around the X to draw the eye
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringSec = (frame - 5.2 * fps) / fps;
  const ringT = Math.max(0, ringSec);
  const ringPulse = (Math.sin(ringT * 2.4) + 1) / 2;
  const ringOpacity = interpolate(ringPulse, [0, 1], [0.15, 0.55]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: COLORS.cardBg,
        border: `2px solid ${COLORS.red}`,
        borderRadius: 24,
        padding: "44px 48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        width: 480,
        position: "relative",
      }}
    >
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          textAlign: "center",
        }}
      >
        Human understands?
      </div>
      <div style={{ position: "relative", width: 180, height: 180 }}>
        <div
          style={{
            position: "absolute",
            inset: -18,
            borderRadius: "50%",
            border: `3px solid ${COLORS.red}`,
            opacity: ringOpacity,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `${COLORS.red}1a`,
            border: `3px solid ${COLORS.red}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: xOpacity,
            transform: `scale(${xScale}) rotate(${xRotate}deg)`,
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path
              d="M22 22L78 78M78 22L22 78"
              stroke={COLORS.red}
              strokeWidth="9"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div
        style={{
          color: COLORS.red,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Not checked
      </div>
    </div>
  );
};

const HeadlineText: React.FC = () => {
  const enter = useEnter(0.2, 0.7);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [-12, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginBottom: 36,
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Every framework checks the machine.
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        Not <span style={{ color: COLORS.red }}>you</span>.
      </div>
    </div>
  );
};

const GapDivider: React.FC = () => {
  const enter = useEnter(3.4, 0.7);
  const draw = enter;
  const opacity = enter;
  return (
    <div
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 36px",
        height: 360,
      }}
    >
      <div
        style={{
          color: COLORS.gold,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginBottom: 14,
          whiteSpace: "nowrap",
        }}
      >
        the gap
      </div>
      <div
        style={{
          width: 2,
          height: 220 * draw,
          background: `linear-gradient(180deg, ${COLORS.gold}00, ${COLORS.gold}, ${COLORS.gold}00)`,
        }}
      />
    </div>
  );
};

const Footer: React.FC = () => {
  const enter = useEnter(7.5, 1.0);
  const opacity = enter;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          textAlign: "center",
        }}
      >
        Approval gates aren&apos;t comprehension checks.
        <span style={{ color: COLORS.red, marginLeft: 12 }}>
          That&apos;s the gap.
        </span>
      </div>
    </div>
  );
};

export const Scene1: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: "80px 100px",
        overflow: "hidden",
      }}
    >
      <HeadlineText />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {FRAMEWORKS.map((fw, i) => (
            <FrameworkCard
              key={fw.name}
              framework={fw}
              index={i}
              startSec={1.0 + i * 0.45}
            />
          ))}
        </div>
        <GapDivider />
        <HumanCard />
      </div>
      <Footer />
    </AbsoluteFill>
  );
};

export default Scene1;
