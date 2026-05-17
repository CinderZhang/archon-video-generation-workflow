import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING } from "../constants";

// Frame-driven enter envelope. Returns 0->1 normalized progress through the
// in window, clamped at both ends. All motion in this scene uses this hook so
// timing is deterministic and inspectable at any frame.
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

// Hook lockup: "You are using AI wrong."
// Anchored top-center, large. Word "wrong" lands in red on a slight delay
// to match the spoken emphasis.
const Hook: React.FC = () => {
  const enter = useEnter(0.0, 0.7);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [-18, 0]);

  // "wrong" lands on its own stress beat
  const wrongEnter = useEnter(0.8, 0.5);
  const wrongOpacity = wrongEnter;
  const wrongScale = interpolate(wrongEnter, [0, 1], [0.85, 1]);

  // Subtitle ("Not dangerously wrong. Invisibly wrong.") fades after the
  // headline lands.
  const subEnter = useEnter(2.6, 0.9);
  const subOpacity = subEnter;
  const subTranslate = interpolate(subEnter, [0, 1], [10, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        position: "absolute",
        top: 90,
        left: 0,
        right: 0,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginBottom: 18,
        }}
      >
        The mistake nobody sees
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 108,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.02,
        }}
      >
        You are using AI{" "}
        <span
          style={{
            display: "inline-block",
            color: COLORS.red,
            opacity: wrongOpacity,
            transform: `scale(${wrongScale})`,
            transformOrigin: "center bottom",
          }}
        >
          wrong
        </span>
        .
      </div>
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subTranslate}px)`,
          marginTop: 22,
          color: COLORS.textSecondary,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        Not dangerously wrong.{" "}
        <span style={{ color: COLORS.red, fontWeight: 700 }}>
          Invisibly wrong.
        </span>
      </div>
    </div>
  );
};

// Left side of the gap diagram: AI does the thinking
const ThinkingCard: React.FC = () => {
  const enter = useEnter(6.2, 0.7);
  const opacity = enter;
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: COLORS.cardBg,
        border: `1.5px solid ${COLORS.blue}55`,
        borderRadius: 18,
        padding: "36px 40px",
        width: 520,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          color: COLORS.blue,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        AI
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: "-0.012em",
          textAlign: "center",
        }}
      >
        does the thinking
      </div>
      {/* Brain glyph as understated mark */}
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path
          d="M18 12c-4 0-7 3-7 7 0 2 .9 3.7 2.3 5C12 25.5 11 27.4 11 30c0 3 1.8 5.4 4.4 6.5C16 39 18.2 41 21 41h2v4h10v-4h2c2.8 0 5-2 5.6-4.5C43.2 35.4 45 33 45 30c0-2.6-1-4.5-2.3-6 1.4-1.3 2.3-3 2.3-5 0-4-3-7-7-7-2 0-3.7.8-5 2.2C31.7 12.8 30 12 28 12s-3.7.8-5 2.2C21.7 12.8 20 12 18 12z"
          stroke={COLORS.blue}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Right side of the gap diagram: You do the approving
const ApprovingCard: React.FC = () => {
  const enter = useEnter(7.4, 0.7);
  const opacity = enter;
  const scale = interpolate(enter, [0, 1], [0.94, 1]);

  // Stamp animation: scales in from large->1 with brief flash
  const stampEnter = useEnter(8.1, 0.4);
  const stampScale = interpolate(stampEnter, [0, 1], [2.4, 1]);
  const stampOpacity = stampEnter;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: COLORS.cardBg,
        border: `1.5px solid ${COLORS.green}55`,
        borderRadius: 18,
        padding: "36px 40px",
        width: 520,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        position: "relative",
      }}
    >
      <div
        style={{
          color: COLORS.green,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        You
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: "-0.012em",
          textAlign: "center",
        }}
      >
        do the approving
      </div>
      {/* Approve stamp: hollow rectangle with check */}
      <div
        style={{
          opacity: stampOpacity,
          transform: `scale(${stampScale}) rotate(-6deg)`,
          border: `4px solid ${COLORS.green}`,
          borderRadius: 8,
          padding: "8px 18px",
          color: COLORS.green,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M4 11.5L9 16.5L18 6"
            stroke={COLORS.green}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Approve
      </div>
    </div>
  );
};

// Vertical gold gap divider with "the gap" label, draws upward.
const GapDivider: React.FC = () => {
  const enter = useEnter(9.0, 0.9);
  const opacity = enter;
  const draw = enter;
  return (
    <div
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 28px",
        height: 280,
      }}
    >
      <div
        style={{
          color: COLORS.gold,
          fontSize: 14,
          fontWeight: 800,
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
          width: 2,
          height: 200 * draw,
          background: `linear-gradient(180deg, ${COLORS.gold}00, ${COLORS.gold}, ${COLORS.gold}00)`,
        }}
      />
    </div>
  );
};

// Citation chip — Anthropic Shen & Tamkin 2026, muted at bottom
const CitationChip: React.FC = () => {
  const enter = useEnter(15.0, 1.0);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [12, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: `${COLORS.textMuted}10`,
        border: `1px solid ${COLORS.textMuted}55`,
        borderRadius: 999,
        padding: "12px 24px",
        color: COLORS.textSecondary,
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: "0.02em",
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span
        style={{
          color: COLORS.gold,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        Research
      </span>
      <span style={{ color: COLORS.textMuted }}>·</span>
      <span>
        Anthropic, Shen &amp; Tamkin 2026:{" "}
        <span style={{ color: COLORS.red, fontWeight: 700 }}>
          pure delegation = &lt;40% comprehension
        </span>
      </span>
    </div>
  );
};

// Closing kicker: "That is not a policy concern. That is a career risk."
const Kicker: React.FC = () => {
  const enter = useEnter(24.5, 1.0);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [12, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 22,
        textAlign: "center",
        color: COLORS.textSecondary,
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: "-0.005em",
      }}
    >
      Not a policy concern.{" "}
      <span style={{ color: COLORS.red, fontWeight: 800 }}>
        A career risk.
      </span>
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
        overflow: "hidden",
      }}
    >
      <Hook />

      {/* Gap diagram lives in the middle vertical band */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-30%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThinkingCard />
        <GapDivider />
        <ApprovingCard />
      </div>

      {/* Citation + kicker stacked at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <CitationChip />
        <Kicker />
      </div>
    </AbsoluteFill>
  );
};

export default Scene1;
