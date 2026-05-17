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

// Number that ticks up from 0 -> target across the enter window.
const useTicker = (target: number, startSec: number, durSec: number) => {
  const t = useEnter(startSec, durSec);
  return Math.round(target * t);
};

// =====================================================================
// Headline — top of frame.
// =====================================================================
const Headline: React.FC = () => {
  const enter = useEnter(0.0, 0.7);
  const translateY = interpolate(enter, [0, 1], [-10, 0]);
  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translateY}px)`,
        position: "absolute",
        top: SAFE_ZONE_TOP,
        left: 0,
        right: 0,
        textAlign: "center",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        What the headlines ignored
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: "-0.015em",
          lineHeight: 1.1,
        }}
      >
        Same tool.
        <br />
        <span style={{ color: COLORS.green }}>Different harness.</span>
        <br />
        Different result.
      </div>
    </div>
  );
};

// =====================================================================
// HarnessIllustration — schematic side-view of a horse with one of two
// harness types. Old throat-and-girth strap (red, constricting) vs new
// collar harness (green, distributing load across shoulders).
// =====================================================================
const HarnessIllustration: React.FC<{
  variant: "throat" | "collar";
  color: string;
  draw: number;
  size?: number;
}> = ({ variant, color, draw, size = 240 }) => {
  const w = size;
  const h = (size * 140) / 240;
  return (
    <svg viewBox="0 0 240 140" style={{ width: w, height: h }}>
      {/* Body */}
      <ellipse
        cx="125"
        cy="78"
        rx="56"
        ry="28"
        fill={`${color}10`}
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Neck */}
      <path
        d="M 175 70 Q 195 50 200 30"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Head */}
      <ellipse
        cx="205"
        cy="26"
        rx="16"
        ry="10"
        fill={`${color}10`}
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Ear */}
      <path
        d="M 200 18 L 198 8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Mane */}
      <path
        d="M 180 60 Q 188 48 195 38"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Legs */}
      <line x1="95" y1="104" x2="92" y2="135" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="115" y1="104" x2="113" y2="135" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="145" y1="104" x2="148" y2="135" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="165" y1="104" x2="168" y2="135" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Tail */}
      <path
        d="M 70 75 Q 55 80 50 95"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Harness — variant-specific. */}
      <g opacity={draw}>
        {variant === "throat" ? (
          <>
            {/* Throat strap cutting tight across windpipe (constricting) */}
            <path
              d="M 190 35 Q 188 56 200 64"
              stroke={color}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Girth strap behind shoulder */}
            <ellipse
              cx="155"
              cy="80"
              rx="14"
              ry="28"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeDasharray="2 0"
            />
            {/* Friction marker — small X */}
            <g transform="translate(195, 50)">
              <path d="M -4 -4 L 4 4 M 4 -4 L -4 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
            </g>
          </>
        ) : (
          <>
            {/* Padded collar over shoulders — broad load distribution */}
            <path
              d="M 178 50 Q 168 78 178 100 Q 168 105 162 100 Q 152 78 162 50 Q 168 45 178 50 Z"
              fill={`${color}30`}
              stroke={color}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Hames connection — clean pulling line */}
            <line
              x1="160"
              y1="75"
              x2="100"
              y2="78"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
            {/* Efficiency marker — small check */}
            <g transform="translate(170, 76)">
              <path d="M -4 0 L -1 3 L 5 -4" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" strokeLinejoin="round" />
            </g>
          </>
        )}
      </g>
    </svg>
  );
};

// =====================================================================
// HorseStatRow — full-width row with horse illustration on left and
// stat card on right. Used vertically for Bastani comparison.
// =====================================================================
const HorseStatRow: React.FC<{
  variant: "throat" | "collar";
  color: string;
  drawStart: number;
  cardStart: number;
  tickStart: number;
  tickTarget: number;
  label: string;
  tag: string;
  unit: string;
  sublabel: string;
  highlight?: boolean;
}> = ({
  variant,
  color,
  drawStart,
  cardStart,
  tickStart,
  tickTarget,
  label,
  tag,
  unit,
  sublabel,
  highlight,
}) => {
  const draw = useEnter(drawStart, 0.8);
  const cardEnter = useEnter(cardStart, 0.7);
  const cardY = interpolate(cardEnter, [0, 1], [16, 0]);
  const ticked = useTicker(tickTarget, tickStart, 1.4);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulseT = Math.max(0, (frame - (cardStart + 1.5) * fps) / fps);
  const pulse = highlight ? (Math.sin(pulseT * 2.2) + 1) / 2 : 0;
  const shadow = highlight
    ? `0 0 ${20 + pulse * 36}px ${color}aa`
    : `0 0 0 transparent`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 22,
        width: "100%",
      }}
    >
      {/* Horse */}
      <div
        style={{
          opacity: draw,
          flexShrink: 0,
          width: 280,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <HarnessIllustration variant={variant} color={color} draw={draw} size={280} />
      </div>
      {/* Stat card */}
      <div
        style={{
          opacity: cardEnter,
          transform: `translateY(${cardY}px)`,
          flex: 1,
          background: COLORS.cardBg,
          border: `2px solid ${color}`,
          borderRadius: 18,
          padding: "20px 24px",
          boxShadow: shadow,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            color: color,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {tag}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
        >
          <span
            style={{
              color: color,
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {ticked}
          </span>
          <span
            style={{
              color: color,
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {unit}
          </span>
        </div>
        <div
          style={{
            color: COLORS.textPrimary,
            fontSize: 18,
            fontWeight: 600,
            marginTop: 2,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: COLORS.textSecondary,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.02em",
            lineHeight: 1.3,
          }}
        >
          {sublabel}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// Bastani comparison block — Unrestricted (red) stacked above Structured (green)
// =====================================================================
const BastaniBlock: React.FC = () => {
  const labelEnter = useEnter(3.0, 0.6);
  const yEnterRaw = useEnter(3.0, 0.7);
  const yEnter = interpolate(yEnterRaw, [0, 1], [16, 0]);
  const vsOpacity = useEnter(8.5, 0.4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 14,
        width: "100%",
      }}
    >
      <div
        style={{
          opacity: labelEnter,
          transform: `translateY(${yEnter}px)`,
          color: COLORS.gold,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Bastani et al · PNAS 2025
        <br />
        200+ chess students · 3 months
      </div>

      {/* Unrestricted AI — throat-strap horse */}
      <HorseStatRow
        variant="throat"
        color={COLORS.red}
        drawStart={4.5}
        cardStart={5.5}
        tickStart={5.8}
        tickTarget={30}
        tag="Unrestricted AI"
        label="chess gain"
        unit="%"
        sublabel="Throat-strap harness · friction wins"
      />

      {/* vs separator */}
      <div
        style={{
          opacity: vsOpacity,
          color: COLORS.textMuted,
          fontSize: 26,
          fontWeight: 300,
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          textAlign: "center",
          margin: "-4px 0",
        }}
      >
        vs
      </div>

      {/* Structured AI — collar harness horse */}
      <HorseStatRow
        variant="collar"
        color={COLORS.green}
        drawStart={9.5}
        cardStart={10.5}
        tickStart={10.8}
        tickTarget={64}
        tag="Structured AI"
        label="chess gain"
        unit="%"
        sublabel="2.1× the unrestricted result"
        highlight
      />
    </div>
  );
};

// =====================================================================
// Kestin Harvard row — second piece of evidence, single full-width card.
// =====================================================================
const KestinRow: React.FC = () => {
  const labelEnter = useEnter(18.0, 0.6);
  const yEnterRaw = useEnter(18.0, 0.7);
  const yEnter = interpolate(yEnterRaw, [0, 1], [16, 0]);
  const cardEnter = useEnter(19.5, 0.7);
  const cardY = interpolate(cardEnter, [0, 1], [16, 0]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulseT = Math.max(0, (frame - 21 * fps) / fps);
  const pulse = (Math.sin(pulseT * 2.2) + 1) / 2;
  const shadow = `0 0 ${20 + pulse * 36}px ${COLORS.green}aa`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 12,
        width: "100%",
        marginTop: 4,
      }}
    >
      <div
        style={{
          opacity: labelEnter,
          transform: `translateY(${yEnter}px)`,
          color: COLORS.gold,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Kestin · Harvard · Sci. Reports 2025 · physics
      </div>
      <div
        style={{
          opacity: cardEnter,
          transform: `translateY(${cardY}px)`,
          background: COLORS.cardBg,
          border: `2px solid ${COLORS.green}`,
          borderRadius: 18,
          padding: "20px 24px",
          boxShadow: shadow,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
        >
          <span
            style={{
              color: COLORS.green,
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            2×
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flex: 1,
          }}
        >
          <div
            style={{
              color: COLORS.green,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Scaffolded AI Tutor
          </div>
          <div
            style={{
              color: COLORS.textPrimary,
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            learning gains
          </div>
          <div
            style={{
              color: COLORS.textSecondary,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            vs. active-learning class
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// Closer — "Not the tool. The design. AI is the horse. The harness…"
// =====================================================================
const Closer: React.FC = () => {
  const lineA = useEnter(30.5, 0.7);
  const lineB = useEnter(33.0, 0.7);
  const aY = interpolate(lineA, [0, 1], [12, 0]);
  const bY = interpolate(lineB, [0, 1], [12, 0]);
  return (
    <div
      style={{
        position: "absolute",
        bottom: SAFE_ZONE_BOTTOM,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "0 60px",
      }}
    >
      <div
        style={{
          opacity: lineA,
          transform: `translateY(${aY}px)`,
          color: COLORS.textSecondary,
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          textAlign: "center",
        }}
      >
        Not the tool.{" "}
        <span style={{ color: COLORS.green }}>The design.</span>
      </div>
      <div
        style={{
          opacity: lineB,
          transform: `translateY(${bY}px)`,
          color: COLORS.textPrimary,
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        AI is the horse.
        <br />
        <span style={{ color: COLORS.gold }}>
          The harness determines everything.
        </span>
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: "hidden",
        // Top headline ~340px, Bottom closer ~340px
        padding: "440px 50px 360px 50px",
      }}
    >
      <Headline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          gap: 18,
          flex: 1,
        }}
      >
        <BastaniBlock />
        <KestinRow />
      </div>
      <Closer />
    </AbsoluteFill>
  );
};

export default Scene2;
