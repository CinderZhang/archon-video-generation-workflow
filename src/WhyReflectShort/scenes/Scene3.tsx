import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING, SAFE_ZONE_BOTTOM, SAFE_ZONE_TOP } from "../constants";

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

// Wordmark sized to fill the 1080-wide canvas comfortably with padding.
// Vertical canvas has plenty of vertical room — letter size optimized so the
// 6-letter wordmark fits on one line.
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
        gap: 10,
        width: "100%",
      }}
    >
      {DRIVER_LETTERS.map((letter, i) => {
        const isFinalR = i === DRIVER_LETTERS.length - 1;
        return (
          <span
            key={`driver-${i}`}
            style={{
              fontSize: 168,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: isFinalR ? finalRColor : COLORS.textPrimary,
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              textShadow: isFinalR
                ? `0 0 ${40 * glow}px ${COLORS.green}aa`
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

const Subtitle: React.FC = () => {
  const enter = useEnter(4.2, 0.9);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [12, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 50,
        textAlign: "center",
        padding: "0 50px",
      }}
    >
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          marginBottom: 8,
          lineHeight: 1.25,
        }}
      >
        Reflect — the only assessment that survives an AI age.
      </div>
    </div>
  );
};

// Brand line — DRIVER AI primary; Purdue as credibility ballast only.
const BrandLine: React.FC = () => {
  const enter = useEnter(11.0, 0.9);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [10, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 38,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.green,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        }}
      >
        From DRIVER AI
      </div>
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginTop: 16,
        }}
      >
        Battle-tested with 300+ students at Purdue
      </div>
    </div>
  );
};

const CTA: React.FC = () => {
  const enter = useEnter(13.0, 0.8);
  const opacity = enter;
  return (
    <div
      style={{
        opacity,
        position: "absolute",
        bottom: SAFE_ZONE_BOTTOM + 220,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "0 40px",
      }}
    >
      <div
        style={{
          background: COLORS.cardBg,
          border: `2px solid ${COLORS.gold}`,
          borderRadius: 999,
          padding: "20px 36px",
          color: COLORS.gold,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "center",
        }}
      >
        <span>Watch the full argument — links below</span>
      </div>
    </div>
  );
};

// QR centered at the bottom for vertical (no horizontal real estate to push
// it into a corner the way V2 does).
const QrPlaceholder: React.FC = () => {
  const enter = useEnter(13.8, 0.8);
  const opacity = enter * 0.9;
  return (
    <div
      style={{
        opacity,
        position: "absolute",
        bottom: SAFE_ZONE_BOTTOM - 20,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          background: COLORS.bg,
          border: `2px solid ${COLORS.gold}`,
          borderRadius: 14,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "repeat(7, 1fr)",
          gap: 3,
          padding: 10,
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
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.22em",
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
        top: SAFE_ZONE_TOP - 60,
        left: 0,
        right: 0,
        textAlign: "center",
        padding: "0 40px",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "0.3em",
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
          padding: "0 20px",
        }}
      >
        <Wordmark />
        <Subtitle />
        <BrandLine />
      </div>
      <CTA />
      <QrPlaceholder />
    </AbsoluteFill>
  );
};

export default Scene3;
