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

const DRIVER_LETTERS = ["D", "R", "I", "V", "E", "R"] as const;

const Wordmark: React.FC = () => {
  const enter = useEnter(0.5, 1.0);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [40, 0]);

  // Final-R highlight sweep
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweepStart = 2.4 * fps;
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

// Hex color blend (no external deps).
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

const Subtitle: React.FC = () => {
  const enter = useEnter(4.2, 0.9);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [12, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 36,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          marginBottom: 8,
        }}
      >
        Reflect — the only assessment that survives an AI age.
      </div>
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginTop: 14,
        }}
      >
        Purdue Daniels School of Business
        <span style={{ margin: "0 12px", color: COLORS.gold }}>·</span>
        First AI Working Competency Course
      </div>
    </div>
  );
};

const CTA: React.FC = () => {
  const enter = useEnter(7.4, 0.8);
  const opacity = enter;
  return (
    <div
      style={{
        opacity,
        position: "absolute",
        bottom: 90,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: COLORS.cardBg,
          border: `1.5px solid ${COLORS.gold}`,
          borderRadius: 999,
          padding: "16px 36px",
          color: COLORS.gold,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span>Watch the full argument</span>
        <span style={{ fontSize: 18 }}>—&nbsp;links below</span>
      </div>
    </div>
  );
};

const QrPlaceholder: React.FC = () => {
  const enter = useEnter(8.5, 0.8);
  const opacity = enter * 0.85;
  return (
    <div
      style={{
        opacity,
        position: "absolute",
        bottom: 60,
        right: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          background: COLORS.bg,
          border: `1.5px solid ${COLORS.gold}`,
          borderRadius: 12,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "repeat(7, 1fr)",
          gap: 2,
          padding: 8,
        }}
      >
        {Array.from({ length: 49 }).map((_, i) => {
          // Deterministic pseudo-QR pattern (no animation needed).
          const on = ((i * 37 + 11) % 5) < 2 || i === 0 || i === 6 || i === 42;
          return (
            <div
              key={i}
              style={{
                background: on ? COLORS.gold : "transparent",
                borderRadius: 1,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        scan
      </div>
    </div>
  );
};

const TopTag: React.FC = () => {
  const enter = useEnter(0.0, 0.7);
  const opacity = enter;
  return (
    <div
      style={{
        opacity,
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
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        The only check that can&apos;t be faked
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
        <Subtitle />
      </div>
      <CTA />
      <QrPlaceholder />
    </AbsoluteFill>
  );
};

export default Scene3;
