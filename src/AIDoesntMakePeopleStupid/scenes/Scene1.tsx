import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING } from "../constants";

// Composed-progress helper — maps current frame against an in-window envelope
// to a normalized 0->1 enter progress, using the canonical V2 Bézier.
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

// =====================================================================
// Hook headline — appears at t=0, splits across two lines.
// "AI doesn't make people stupid." / "Passivity does."
// Word 'Passivity' colored red — it's the indictment.
// =====================================================================
const Hook: React.FC = () => {
  const line1 = useEnter(0.0, 0.7);
  const line2 = useEnter(1.4, 0.8);
  const line1y = interpolate(line1, [0, 1], [16, 0]);
  const line2y = interpolate(line2, [0, 1], [16, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          opacity: line1,
          transform: `translateY(${line1y}px)`,
          color: COLORS.textPrimary,
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        AI doesn&apos;t make people stupid.
      </div>
      <div
        style={{
          opacity: line2,
          transform: `translateY(${line2y}px)`,
          color: COLORS.textPrimary,
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        <span style={{ color: COLORS.red }}>Passivity</span> does.
      </div>
    </div>
  );
};

// =====================================================================
// Left panel — passive use: flat, lifeless EEG line in red.
// Drawn as an SVG path that animates from left to right (stroke-dasharray).
// =====================================================================
const PassivePanel: React.FC = () => {
  const enter = useEnter(4.5, 0.8);
  const draw = useEnter(5.0, 2.0);
  const xMark = useEnter(13.0, 0.6);
  const xScale = interpolate(xMark, [0, 1], [0.5, 1]);
  const labelEnter = useEnter(5.5, 0.7);
  const citationEnter = useEnter(7.5, 0.7);
  const yTranslate = interpolate(enter, [0, 1], [24, 0]);

  // Flat-ish EEG with tiny ripples — 800 wide.
  const flatPath =
    "M 20 80 " +
    "L 80 80 L 110 78 L 140 82 L 170 80 L 210 80 L 260 81 L 310 79 " +
    "L 360 80 L 410 80 L 470 79 L 540 81 L 620 80 L 700 80 L 780 80";
  const pathLen = 900;

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${yTranslate}px)`,
        flex: 1,
        background: COLORS.cardBg,
        border: `2px solid ${COLORS.red}55`,
        borderRadius: 18,
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        position: "relative",
        minHeight: 420,
      }}
    >
      {/* Tag */}
      <div
        style={{
          opacity: labelEnter,
          color: COLORS.red,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        Passive Use — ChatGPT writes the essay
      </div>

      {/* EEG label */}
      <div
        style={{
          opacity: labelEnter,
          color: COLORS.textPrimary,
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        Brain went quiet.
      </div>

      {/* SVG EEG line */}
      <div style={{ position: "relative", flex: 1, marginTop: 8 }}>
        <svg
          viewBox="0 0 800 160"
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="none"
        >
          {/* Baseline grid */}
          <line
            x1="20"
            y1="80"
            x2="780"
            y2="80"
            stroke={`${COLORS.textMuted}30`}
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            d={flatPath}
            fill="none"
            stroke={COLORS.red}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen * (1 - draw)}
          />
        </svg>
        {/* Red X overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${xScale})`,
            opacity: xMark,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: `${COLORS.red}1a`,
            border: `3px solid ${COLORS.red}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
            <path
              d="M22 22L78 78M78 22L22 78"
              stroke={COLORS.red}
              strokeWidth="9"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Bullet list */}
      <div
        style={{
          opacity: citationEnter,
          color: COLORS.textSecondary,
          fontSize: 18,
          fontWeight: 500,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div>Weaker memory.</div>
        <div>Weaker creativity.</div>
        <div>Weaker attention.</div>
      </div>
      <div
        style={{
          opacity: citationEnter,
          color: COLORS.textMuted,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        MIT Media Lab · 54 students · EEG study
      </div>
    </div>
  );
};

// =====================================================================
// Right panel — engaged use: jagged active EEG line in green.
// =====================================================================
const EngagedPanel: React.FC = () => {
  const enter = useEnter(15.5, 0.8);
  const draw = useEnter(16.0, 2.5);
  const checkMark = useEnter(20.5, 0.6);
  const checkScale = interpolate(checkMark, [0, 1], [0.5, 1]);
  const labelEnter = useEnter(16.5, 0.7);
  const captionEnter = useEnter(18.5, 0.7);
  const yTranslate = interpolate(enter, [0, 1], [24, 0]);

  // Jagged, lively EEG path — same x range as flat panel.
  const activePath =
    "M 20 80 " +
    "L 60 80 L 80 50 L 100 110 L 120 60 L 145 95 L 170 40 L 200 100 " +
    "L 235 55 L 270 120 L 310 35 L 350 90 L 390 50 L 430 105 L 470 30 " +
    "L 510 95 L 550 55 L 590 115 L 630 45 L 670 100 L 710 60 L 750 80 L 780 80";
  const pathLen = 1300;

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${yTranslate}px)`,
        flex: 1,
        background: COLORS.cardBg,
        border: `2px solid ${COLORS.green}55`,
        borderRadius: 18,
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        position: "relative",
        minHeight: 420,
      }}
    >
      <div
        style={{
          opacity: labelEnter,
          color: COLORS.green,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        Engaged Use — human owns the problem
      </div>
      <div
        style={{
          opacity: labelEnter,
          color: COLORS.textPrimary,
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        Brain stays on.
      </div>
      <div style={{ position: "relative", flex: 1, marginTop: 8 }}>
        <svg
          viewBox="0 0 800 160"
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="none"
        >
          <line
            x1="20"
            y1="80"
            x2="780"
            y2="80"
            stroke={`${COLORS.textMuted}30`}
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            d={activePath}
            fill="none"
            stroke={COLORS.green}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen * (1 - draw)}
          />
        </svg>
        {/* Green check overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${checkScale})`,
            opacity: checkMark,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: `${COLORS.green}1a`,
            border: `3px solid ${COLORS.green}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 16L13 23L26 9"
              stroke={COLORS.green}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div
        style={{
          opacity: captionEnter,
          color: COLORS.textSecondary,
          fontSize: 18,
          fontWeight: 500,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div>Memory engaged.</div>
        <div>Creativity active.</div>
        <div>Attention sharpened.</div>
      </div>
      <div
        style={{
          opacity: captionEnter,
          color: COLORS.textMuted,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        Same tool · different human · different brain
      </div>
    </div>
  );
};

// =====================================================================
// Gold divider with "same AI. different human." callout.
// =====================================================================
const Divider: React.FC = () => {
  const enter = useEnter(15.0, 0.6);
  const draw = useEnter(15.5, 1.0);
  return (
    <div
      style={{
        opacity: enter,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 30px",
        alignSelf: "stretch",
      }}
    >
      <div
        style={{
          color: COLORS.gold,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          marginBottom: 14,
          whiteSpace: "nowrap",
        }}
      >
        same AI · different human
      </div>
      <div
        style={{
          width: 2,
          height: 360 * draw,
          background: `linear-gradient(180deg, ${COLORS.gold}00, ${COLORS.gold}, ${COLORS.gold}00)`,
        }}
      />
    </div>
  );
};

// =====================================================================
// Footer — punchline beat: "Headlines said AI makes you dumb. Wrong."
// =====================================================================
const Footer: React.FC = () => {
  const enter = useEnter(23.5, 0.9);
  const swap = useEnter(25.5, 0.7);
  const translateY = interpolate(enter, [0, 1], [12, 0]);
  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translateY}px)`,
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          textAlign: "center",
        }}
      >
        That study didn&apos;t measure{" "}
        <span
          style={{
            color: COLORS.red,
            textDecoration: "line-through",
            textDecorationColor: `${COLORS.red}cc`,
            opacity: 0.9,
          }}
        >
          AI
        </span>
        .{" "}
        <span
          style={{
            color: COLORS.green,
            opacity: swap,
          }}
        >
          It measured passivity.
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
        padding: "260px 100px 140px 100px",
        overflow: "hidden",
      }}
    >
      <Hook />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "center",
          flex: 1,
          gap: 0,
        }}
      >
        <PassivePanel />
        <Divider />
        <EngagedPanel />
      </div>
      <Footer />
    </AbsoluteFill>
  );
};

export default Scene1;
