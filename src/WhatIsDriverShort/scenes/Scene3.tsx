import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING, SAFE_ZONE_TOP } from "../constants";

// Vertical 9:16 (1080x1920) rework of V1 Scene 3 (brand close).
// 16:9 used a wide DRIVER wordmark (fontSize 220) — for 9:16 we scale the
// wordmark down so all 6 letters fit in 1080 width with breathing room.
// The final R still receives the green sweep + glow.

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

// Hex color blend helper (no external deps).
const interpolateColor = (a: string, b: string, t: number): string => {
  const parse = (h: string) => {
    const cleaned = h.replace("#", "");
    return [
      parseInt(cleaned.slice(0, 2), 16),
      parseInt(cleaned.slice(2, 4), 16),
      parseInt(cleaned.slice(4, 6), 16),
    ] as const;
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const r = clamp(ar + (br - ar) * t);
  const g = clamp(ag + (bg - ag) * t);
  const bl = clamp(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
};

const DRIVER_LETTERS = ["D", "R", "I", "V", "E", "R"] as const;

// DRIVER wordmark — scaled for vertical width. Final R color-sweeps to green
// at ~2s and gets a glow.
const Wordmark: React.FC = () => {
  const enter = useEnter(0.4, 0.9);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [36, 0]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweepStart = 2.0 * fps;
  const sweepDur = 1.4 * fps;
  const sweepT = interpolate(frame, [sweepStart, sweepStart + sweepDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const finalRColor =
    sweepT < 0.45
      ? COLORS.textPrimary
      : interpolateColor(COLORS.textPrimary, COLORS.green, (sweepT - 0.45) / 0.55);
  const glow = sweepT > 0.6 ? Math.min(1, (sweepT - 0.6) / 0.4) : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {DRIVER_LETTERS.map((letter, i) => {
        const isFinalR = i === DRIVER_LETTERS.length - 1;
        return (
          <span
            key={`driver-${i}`}
            style={{
              fontSize: 148,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: isFinalR ? finalRColor : COLORS.textPrimary,
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              textShadow: isFinalR
                ? `0 0 ${30 * glow}px ${COLORS.green}aa`
                : "none",
              lineHeight: 1,
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

// Tagline under the wordmark — fits comfortably in 9:16 with line breaks
const Tagline: React.FC = () => {
  const enter = useEnter(3.8, 0.9);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [10, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 50,
        textAlign: "center",
        color: COLORS.textSecondary,
        fontSize: 40,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        maxWidth: 940,
        lineHeight: 1.3,
      }}
    >
      A workflow for the distinction between thinking and understanding.
    </div>
  );
};

// Brand line — DRIVER AI primary, Purdue/Daniels as credibility ballast
const BrandLine: React.FC = () => {
  const enter = useEnter(6.4, 0.9);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [10, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 64,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.green,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        }}
      >
        Built into
        <br />
        DRIVER AI
      </div>
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginTop: 28,
          lineHeight: 1.4,
        }}
      >
        Battle-tested with 300+ students
        <br />
        Daniels School of Business · Purdue
      </div>
    </div>
  );
};

// Two minimal gold CTA chips at the bottom safe zone
const CTAChips: React.FC = () => {
  const enter1 = useEnter(11.0, 0.7);
  const enter2 = useEnter(11.6, 0.7);
  const o1 = enter1;
  const o2 = enter2;
  const t1 = interpolate(enter1, [0, 1], [16, 0]);
  const t2 = interpolate(enter2, [0, 1], [16, 0]);

  const chipStyle: React.CSSProperties = {
    background: COLORS.cardBg,
    border: `1.5px solid ${COLORS.gold}`,
    borderRadius: 999,
    padding: "20px 40px",
    color: COLORS.gold,
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: "0.02em",
    display: "inline-flex",
    alignItems: "center",
    gap: 14,
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div style={{ opacity: o1, transform: `translateY(${t1}px)`, ...chipStyle }}>
        <span>Full argument</span>
        <span style={{ fontSize: 32, lineHeight: 1 }}>&rarr;</span>
      </div>
      <div style={{ opacity: o2, transform: `translateY(${t2}px)`, ...chipStyle }}>
        <span>Stage-by-stage playlist</span>
        <span style={{ fontSize: 32, lineHeight: 1 }}>&rarr;</span>
      </div>
    </div>
  );
};

// Top tag — small, sets the closing frame
const TopTag: React.FC = () => {
  const enter = useEnter(0.0, 0.7);
  const opacity = enter;
  return (
    <div
      style={{
        opacity,
        position: "absolute",
        top: SAFE_ZONE_TOP,
        left: 0,
        right: 0,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        Close the gap
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: "hidden",
      }}
    >
      <TopTag />
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Wordmark />
        <Tagline />
        <BrandLine />
      </div>
      <CTAChips />
    </AbsoluteFill>
  );
};

export default Scene3;
