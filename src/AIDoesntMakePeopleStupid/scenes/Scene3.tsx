import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING } from "../constants";

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

// Linear hex interpolation between two hex colors -> rgb(...) string.
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

// =====================================================================
// Top tag — "DRIVER is one such harness."
// =====================================================================
const TopTag: React.FC = () => {
  const enter = useEnter(0.0, 0.7);
  return (
    <div
      style={{
        opacity: enter,
        position: "absolute",
        top: 80,
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
        }}
      >
        DRIVER is one such harness
      </div>
    </div>
  );
};

// =====================================================================
// DRIVER wordmark — letters stagger in; final R gets the green sweep.
// =====================================================================
const Wordmark: React.FC = () => {
  const enter = useEnter(0.4, 1.0);
  const translateY = interpolate(enter, [0, 1], [40, 0]);

  // Highlight sweep on final R.
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweepStart = 2.2 * fps;
  const sweepDur = 1.4 * fps;
  const sweepT = interpolate(frame, [sweepStart, sweepStart + sweepDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const finalRColor =
    sweepT < 0.45
      ? COLORS.textPrimary
      : interpolateColor(
          COLORS.textPrimary,
          COLORS.green,
          (sweepT - 0.45) / 0.55,
        );
  const glow = sweepT > 0.6 ? Math.min(1, (sweepT - 0.6) / 0.4) : 0;

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      {DRIVER_LETTERS.map((letter, i) => {
        const isFinalR = i === DRIVER_LETTERS.length - 1;
        return (
          <span
            key={`driver-${i}`}
            style={{
              fontSize: 220,
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

// =====================================================================
// Brand line — "From DRIVER AI" primary; Purdue + 300+ credibility.
// =====================================================================
const BrandLine: React.FC = () => {
  const enter = useEnter(3.8, 0.9);
  const translateY = interpolate(enter, [0, 1], [12, 0]);
  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translateY}px)`,
        marginTop: 28,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.green,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        }}
      >
        From DRIVER AI
      </div>
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginTop: 12,
        }}
      >
        Field-tested with 300+ students · Purdue
      </div>
    </div>
  );
};

// =====================================================================
// Proof beat — "My top 5 students proved it."
// =====================================================================
const ProofBeat: React.FC = () => {
  const enter = useEnter(7.5, 0.8);
  const translateY = interpolate(enter, [0, 1], [10, 0]);
  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translateY}px)`,
        marginTop: 36,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          maxWidth: 1100,
          margin: "0 auto",
          lineHeight: 1.35,
        }}
      >
        Top 5 students.{" "}
        <span style={{ color: COLORS.green }}>Production apps. Public repos.</span>{" "}
        Explained on camera — no script.
      </div>
    </div>
  );
};

// =====================================================================
// CTA — green pill: "Watch my top 5 students prove it →"
// =====================================================================
const CTA: React.FC = () => {
  const enter = useEnter(12.5, 0.8);
  return (
    <div
      style={{
        opacity: enter,
        position: "absolute",
        bottom: 95,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: `${COLORS.green}18`,
          border: `2px solid ${COLORS.green}`,
          borderRadius: 999,
          padding: "18px 44px",
          color: COLORS.green,
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <span>Watch my top 5 students prove it</span>
        <span style={{ fontSize: 28 }}>→</span>
      </div>
    </div>
  );
};

// =====================================================================
// Sources rail — Bastani / Kestin citations bottom-left for credibility.
// =====================================================================
const SourcesRail: React.FC = () => {
  const enter = useEnter(13.5, 0.7);
  return (
    <div
      style={{
        opacity: enter * 0.85,
        position: "absolute",
        bottom: 40,
        left: 80,
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div>Bastani et al · PNAS 2025</div>
      <div>Kestin · Harvard · Scientific Reports 2025</div>
    </div>
  );
};

// =====================================================================
// Right rail — DRIVER AI mark badge bottom-right.
// =====================================================================
const Mark: React.FC = () => {
  const enter = useEnter(13.5, 0.7);
  return (
    <div
      style={{
        opacity: enter * 0.85,
        position: "absolute",
        bottom: 40,
        right: 80,
        color: COLORS.gold,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      }}
    >
      driver-ai.com
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
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-55%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Wordmark />
        <BrandLine />
        <ProofBeat />
      </div>
      <CTA />
      <SourcesRail />
      <Mark />
    </AbsoluteFill>
  );
};

export default Scene3;
