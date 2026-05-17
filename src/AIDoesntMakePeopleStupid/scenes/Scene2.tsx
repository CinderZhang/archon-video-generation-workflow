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

// Number that ticks up from 0 -> target across the enter window.
const useTicker = (target: number, startSec: number, durSec: number) => {
  const t = useEnter(startSec, durSec);
  return Math.round(target * t);
};

// =====================================================================
// Headline — "Here's what the headlines ignored."
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
        top: 60,
        left: 0,
        right: 0,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        What the headlines ignored
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 42,
          fontWeight: 800,
          letterSpacing: "-0.015em",
        }}
      >
        Same tool. <span style={{ color: COLORS.green }}>Different harness.</span>{" "}
        Different result.
      </div>
    </div>
  );
};

// =====================================================================
// HarnessIllustration — schematic side-view of a horse with one of two
// harness types. Old throat-and-girth strap (red, constricting) vs new
// collar harness (green, distributing load across shoulders).
//
// Drawn as simple SVG primitives — body, head, leg, harness lines.
// The harness type changes between variants:
//   variant="throat"  -> red strap around neck/throat
//   variant="collar"  -> green padded collar over shoulders
// =====================================================================
const HarnessIllustration: React.FC<{
  variant: "throat" | "collar";
  color: string;
  draw: number;
}> = ({ variant, color, draw }) => {
  return (
    <svg viewBox="0 0 240 140" style={{ width: 220, height: 130 }}>
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
// StatCard — big number + label + sublabel.
// =====================================================================
const StatCard: React.FC<{
  label: string;
  number: string;
  unit: string;
  sublabel: string;
  color: string;
  startSec: number;
  tickTarget?: number;
  tickStartSec?: number;
  tickDurSec?: number;
  tickSuffix?: string;
  highlight?: boolean;
}> = ({
  label,
  number,
  unit,
  sublabel,
  color,
  startSec,
  tickTarget,
  tickStartSec,
  tickDurSec,
  tickSuffix,
  highlight,
}) => {
  const enter = useEnter(startSec, 0.7);
  const translateY = interpolate(enter, [0, 1], [16, 0]);
  // Always call the hook (stable order). When tickTarget is undefined we
  // pass the safe defaults but ignore the result.
  const tickedValue = useTicker(
    tickTarget ?? 0,
    tickStartSec ?? startSec,
    tickDurSec ?? 1.0,
  );
  const displayNumber =
    tickTarget !== undefined
      ? `${tickedValue}${tickSuffix ?? ""}`
      : number;

  // Optional pulse on highlighted card to draw the eye to the structured win.
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulseT = Math.max(0, (frame - (startSec + 1.5) * fps) / fps);
  const pulse = highlight ? (Math.sin(pulseT * 2.2) + 1) / 2 : 0;
  const shadow = highlight
    ? `0 0 ${20 + pulse * 36}px ${color}aa`
    : `0 0 0 transparent`;

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translateY}px)`,
        background: COLORS.cardBg,
        border: `2px solid ${color}`,
        borderRadius: 16,
        padding: "22px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 240,
        boxShadow: shadow,
      }}
    >
      <div
        style={{
          color: color,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
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
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {displayNumber}
        </span>
        <span
          style={{
            color: color,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {unit}
        </span>
      </div>
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 14,
          fontWeight: 500,
          marginTop: 8,
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        {sublabel}
      </div>
    </div>
  );
};

// =====================================================================
// Bastani comparison block — Unrestricted (red) vs Structured (green)
// =====================================================================
const BastaniBlock: React.FC = () => {
  const labelEnter = useEnter(3.0, 0.6);
  const yEnterRaw = useEnter(3.0, 0.7);
  const yEnter = interpolate(yEnterRaw, [0, 1], [16, 0]);
  const harness1Draw = useEnter(4.5, 0.8);
  const harness2Draw = useEnter(9.5, 0.8);
  const vsOpacity = useEnter(8.5, 0.4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        flex: 1,
      }}
    >
      <div
        style={{
          opacity: labelEnter,
          transform: `translateY(${yEnter}px)`,
          color: COLORS.gold,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
        }}
      >
        Bastani et al · PNAS 2025 · 200+ chess students · 3 months
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 36,
        }}
      >
        {/* Unrestricted AI — throat-strap horse */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              opacity: harness1Draw,
              padding: "0 0 0 0",
            }}
          >
            <HarnessIllustration variant="throat" color={COLORS.red} draw={harness1Draw} />
          </div>
          <StatCard
            label="Unrestricted AI"
            number="+30"
            unit="%"
            sublabel="chess gain"
            color={COLORS.red}
            startSec={5.5}
            tickTarget={30}
            tickStartSec={5.8}
            tickDurSec={1.4}
            tickSuffix=""
          />
        </div>

        {/* vs separator */}
        <div
          style={{
            opacity: vsOpacity,
            color: COLORS.textMuted,
            fontSize: 32,
            fontWeight: 300,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
        >
          vs
        </div>

        {/* Structured AI — collar-harness horse */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              opacity: harness2Draw,
            }}
          >
            <HarnessIllustration variant="collar" color={COLORS.green} draw={harness2Draw} />
          </div>
          <StatCard
            label="Structured AI"
            number="+64"
            unit="%"
            sublabel="chess gain · 2.1× the unrestricted result"
            color={COLORS.green}
            startSec={10.5}
            tickTarget={64}
            tickStartSec={10.8}
            tickDurSec={1.6}
            tickSuffix=""
            highlight
          />
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// Kestin Harvard row — second piece of evidence.
// =====================================================================
const KestinRow: React.FC = () => {
  const labelEnter = useEnter(18.0, 0.6);
  const yEnterRaw = useEnter(18.0, 0.7);
  const yEnter = interpolate(yEnterRaw, [0, 1], [16, 0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        marginTop: 12,
      }}
    >
      <div
        style={{
          opacity: labelEnter,
          transform: `translateY(${yEnter}px)`,
          color: COLORS.gold,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
        }}
      >
        Kestin · Harvard · Scientific Reports 2025 · physics
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
        }}
      >
        <StatCard
          label="Scaffolded AI Tutor"
          number="2×"
          unit=""
          sublabel="learning gains vs active-learning class"
          color={COLORS.green}
          startSec={19.5}
          highlight
        />
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
        bottom: 56,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          opacity: lineA,
          transform: `translateY(${aY}px)`,
          color: COLORS.textSecondary,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "-0.005em",
        }}
      >
        Not the tool. <span style={{ color: COLORS.green }}>The design.</span>
      </div>
      <div
        style={{
          opacity: lineB,
          transform: `translateY(${bY}px)`,
          color: COLORS.textPrimary,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          marginTop: 4,
        }}
      >
        AI is the horse.{" "}
        <span style={{ color: COLORS.gold }}>The harness determines everything.</span>
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
        padding: "180px 100px 160px 100px",
      }}
    >
      <Headline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 22,
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
