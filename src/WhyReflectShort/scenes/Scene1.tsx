import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING, SAFE_ZONE_BOTTOM, SAFE_ZONE_TOP } from "../constants";

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

// Composed-progress helper: maps current frame against inStart/inDur to a
// normalized 0->1 enter progress value.
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

// Compact framework card sized for vertical stacking — full-width with
// generous padding so multiple cards fit comfortably above the gap rule.
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
        borderRadius: 18,
        padding: "20px 32px",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 24,
        width: "100%",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `${COLORS.green}22`,
          border: `2.5px solid ${COLORS.green}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: checkOpacity,
          transform: `scale(${checkScale})`,
          flexShrink: 0,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 26 26" fill="none">
          <path
            d="M5 13.5L10.5 19L21 7"
            stroke={COLORS.green}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <div
          style={{
            color: COLORS.textPrimary,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          {framework.name}
        </div>
        <div
          style={{
            color: COLORS.textMuted,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          AI verified · {framework.meta}
        </div>
      </div>
      {/* Suppress unused index warning */}
      <span style={{ display: "none" }}>{index}</span>
    </div>
  );
};

// Vertical Human card placed at the bottom of the scene, beneath the
// horizontal gap rule. Increased typography for mobile.
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
        border: `3px solid ${COLORS.red}`,
        borderRadius: 28,
        padding: "44px 56px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        Human understands?
      </div>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            border: `4px solid ${COLORS.red}`,
            opacity: ringOpacity,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `${COLORS.red}1a`,
            border: `4px solid ${COLORS.red}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: xOpacity,
            transform: `scale(${xScale}) rotate(${xRotate}deg)`,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
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
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        Not checked
      </div>
    </div>
  );
};

// Headline tightened for vertical — small caps eyebrow above 2-line headline.
const HeadlineText: React.FC = () => {
  const enter = useEnter(0.2, 0.7);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [-12, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginBottom: 28,
        textAlign: "left",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 12,
          lineHeight: 1.25,
        }}
      >
        Every framework checks the machine.
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.0,
        }}
      >
        Not <span style={{ color: COLORS.red }}>you</span>.
      </div>
    </div>
  );
};

// Horizontal gap rule for vertical layout — replaces V2's vertical divider.
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
        margin: "22px 0",
        width: "100%",
      }}
    >
      <div
        style={{
          color: COLORS.gold,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          marginBottom: 14,
          whiteSpace: "nowrap",
        }}
      >
        the gap
      </div>
      <div
        style={{
          width: `${draw * 100}%`,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.gold}00, ${COLORS.gold}, ${COLORS.gold}00)`,
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
        bottom: SAFE_ZONE_BOTTOM - 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        padding: "0 60px",
      }}
    >
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Approval gates aren&apos;t comprehension checks.{" "}
        <span style={{ color: COLORS.red }}>That&apos;s the gap.</span>
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
        padding: `${SAFE_ZONE_TOP}px 60px ${SAFE_ZONE_BOTTOM}px 60px`,
        overflow: "hidden",
      }}
    >
      <HeadlineText />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
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
