import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING, SAFE_ZONE_TOP } from "../constants";

// Vertical 9:16 (1080x1920) rework of V1 Scene 1.
// 16:9 used a horizontal Thinking / GAP / Approving diagram. In 9:16 we
// stack vertically: Hook headline at top, Thinking card, Gap divider,
// Approving card, then citation + kicker at the bottom safe zone.
// Type sizes scaled ~1.5x for mobile readability.

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

// Hook lockup: "You are using AI wrong." — top safe-zone, full width.
// "wrong" lands red on its own stress beat. Subtitle below.
const Hook: React.FC = () => {
  const enter = useEnter(0.0, 0.7);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [-18, 0]);

  const wrongEnter = useEnter(0.8, 0.5);
  const wrongOpacity = wrongEnter;
  const wrongScale = interpolate(wrongEnter, [0, 1], [0.85, 1]);

  const subEnter = useEnter(2.6, 0.9);
  const subOpacity = subEnter;
  const subTranslate = interpolate(subEnter, [0, 1], [10, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        position: "absolute",
        top: SAFE_ZONE_TOP,
        left: 60,
        right: 60,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        The mistake nobody sees
      </div>
      {/* Headline wraps cleanly: "You are using" on line 1, "AI wrong." on line 2 */}
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 140,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.02,
        }}
      >
        You are using
        <br />
        AI{" "}
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
          marginTop: 36,
          color: COLORS.textSecondary,
          fontSize: 42,
          fontWeight: 500,
          letterSpacing: "-0.005em",
          lineHeight: 1.25,
        }}
      >
        Not dangerously wrong.
        <br />
        <span style={{ color: COLORS.red, fontWeight: 700 }}>
          Invisibly wrong.
        </span>
      </div>
    </div>
  );
};

// AI does the thinking — top card of the vertical gap diagram
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
        borderRadius: 22,
        padding: "44px 56px",
        width: 820,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          color: COLORS.blue,
          fontSize: 22,
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
          fontSize: 62,
          fontWeight: 700,
          letterSpacing: "-0.012em",
          textAlign: "center",
        }}
      >
        does the thinking
      </div>
      {/* Brain glyph */}
      <svg width="84" height="84" viewBox="0 0 56 56" fill="none">
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

// You do the approving — bottom card of the vertical gap diagram
const ApprovingCard: React.FC = () => {
  const enter = useEnter(7.4, 0.7);
  const opacity = enter;
  const scale = interpolate(enter, [0, 1], [0.94, 1]);

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
        borderRadius: 22,
        padding: "44px 56px",
        width: 820,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        position: "relative",
      }}
    >
      <div
        style={{
          color: COLORS.green,
          fontSize: 22,
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
          fontSize: 62,
          fontWeight: 700,
          letterSpacing: "-0.012em",
          textAlign: "center",
        }}
      >
        do the approving
      </div>
      <div
        style={{
          opacity: stampOpacity,
          transform: `scale(${stampScale}) rotate(-6deg)`,
          border: `5px solid ${COLORS.green}`,
          borderRadius: 10,
          padding: "12px 26px",
          color: COLORS.green,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
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

// Horizontal gold gap divider with "the gap" label, draws outward.
// In vertical layout the gap sits between the two stacked cards.
const GapDivider: React.FC = () => {
  const enter = useEnter(9.0, 0.9);
  const opacity = enter;
  const draw = enter;
  return (
    <div
      style={{
        opacity,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: "24px 0",
        width: "100%",
        gap: 24,
      }}
    >
      <div
        style={{
          width: 220 * draw,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.gold}00, ${COLORS.gold})`,
        }}
      />
      <div
        style={{
          color: COLORS.gold,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        the gap
      </div>
      <div
        style={{
          width: 220 * draw,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.gold}00)`,
        }}
      />
    </div>
  );
};

// Citation chip — Anthropic Shen & Tamkin 2026. In vertical, the long text
// is allowed to wrap inside a pill-shaped container.
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
        borderRadius: 28,
        padding: "20px 36px",
        color: COLORS.textSecondary,
        fontSize: 26,
        fontWeight: 500,
        letterSpacing: "0.02em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        maxWidth: 920,
        textAlign: "center",
        lineHeight: 1.35,
      }}
    >
      <span
        style={{
          color: COLORS.gold,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        Research · Anthropic 2026
      </span>
      <span>
        Pure delegation ={" "}
        <span style={{ color: COLORS.red, fontWeight: 700 }}>
          &lt;40% comprehension
        </span>
      </span>
    </div>
  );
};

// Closing kicker: "Not a policy concern. A career risk."
const Kicker: React.FC = () => {
  const enter = useEnter(24.5, 1.0);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [12, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 28,
        textAlign: "center",
        color: COLORS.textSecondary,
        fontSize: 40,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        lineHeight: 1.2,
      }}
    >
      Not a policy concern.
      <br />
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

      {/* Vertical gap diagram — center band, stacked: AI / gap / You */}
      <div
        style={{
          position: "absolute",
          top: 880,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ThinkingCard />
        <GapDivider />
        <ApprovingCard />
      </div>

      {/* Citation + kicker stacked at bottom safe zone */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <CitationChip />
        <Kicker />
      </div>
    </AbsoluteFill>
  );
};

export default Scene1;
