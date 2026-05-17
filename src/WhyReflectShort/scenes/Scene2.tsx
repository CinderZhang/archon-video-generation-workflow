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

type Node = {
  letter: string;
  word: string;
  color: string;
  highlight: boolean;
  startSec: number;
};

const NODES: Node[] = [
  { letter: "D", word: "Define", color: COLORS.green, highlight: true, startSec: 0.4 },
  { letter: "R", word: "Represent", color: COLORS.blue, highlight: false, startSec: 1.4 },
  { letter: "I", word: "Implement", color: COLORS.blue, highlight: false, startSec: 1.7 },
  { letter: "V", word: "Validate", color: COLORS.blue, highlight: false, startSec: 2.0 },
  { letter: "E", word: "Evolve", color: COLORS.blue, highlight: false, startSec: 2.3 },
  { letter: "R", word: "Reflect", color: COLORS.green, highlight: true, startSec: 3.0 },
];

// Bracket character — sized for vertical layout (slightly smaller than V2's
// 180px since the row is more compressed horizontally).
const Bracket: React.FC<{ side: "left" | "right"; startSec: number }> = ({
  side,
  startSec,
}) => {
  const enter = useEnter(startSec, 0.5);
  const opacity = enter;
  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        color: COLORS.textMuted,
        fontSize: 140,
        fontWeight: 200,
        lineHeight: 0.8,
        margin: side === "left" ? "0 4px 0 8px" : "0 8px 0 4px",
        userSelect: "none",
      }}
    >
      {side === "left" ? "[" : "]"}
    </div>
  );
};

const NodeCell: React.FC<{ node: Node; pulseAt?: number }> = ({
  node,
  pulseAt,
}) => {
  const enter = useEnter(node.startSec, 0.45);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [16, 0]);

  // Optional pulse for green-glow effect on highlighted nodes
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let glow = 0;
  if (node.highlight && pulseAt !== undefined) {
    const pulseStart = pulseAt * fps;
    const pulseDur = 1.6 * fps;
    const t = interpolate(frame, [pulseStart, pulseStart + pulseDur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    glow = Math.sin(t * Math.PI);
  }
  const alphaHex = (n: number) => {
    const v = Math.max(0, Math.min(255, Math.round(n)));
    const hex = v.toString(16);
    return hex.length < 2 ? "0" + hex : hex;
  };
  const shadow = node.highlight
    ? `0 0 ${24 + glow * 32}px ${node.color}${alphaHex(60 + glow * 80)}`
    : "none";

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 6px",
      }}
    >
      <div
        style={{
          color: node.color,
          fontSize: 78,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          textShadow: shadow,
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        }}
      >
        {node.letter}
      </div>
      <div
        style={{
          color: node.highlight ? node.color : COLORS.textMuted,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginTop: 10,
          opacity: node.highlight ? 1 : 0.85,
          textAlign: "center",
          maxWidth: 110,
          lineHeight: 1.1,
        }}
      >
        {node.word}
      </div>
    </div>
  );
};

// 80/20 ratio chip rendered beneath each section of the bracket.
const RatioBadge: React.FC<{
  human: number;
  ai: number;
  startSec: number;
  emphasis: "human" | "ai";
}> = ({ human, ai, startSec, emphasis }) => {
  const enter = useEnter(startSec, 0.5);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [10, 0]);
  const humanColor = COLORS.green;
  const aiColor = COLORS.blue;
  const borderColor = emphasis === "human" ? humanColor : aiColor;
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 6,
        background: `${borderColor}10`,
        border: `2px solid ${borderColor}80`,
        borderRadius: 8,
        padding: "8px 16px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontSize: 19,
        fontWeight: 700,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: humanColor, opacity: emphasis === "human" ? 1 : 0.55 }}>
        {human}% HUMAN
      </span>
      <span style={{ color: COLORS.textMuted, opacity: 0.7 }}>/</span>
      <span style={{ color: aiColor, opacity: emphasis === "ai" ? 1 : 0.55 }}>
        {ai}% AI
      </span>
    </div>
  );
};

type Chip = {
  label: string;
  caption: string;
  startSec: number;
};

const CHIPS: Chip[] = [
  {
    label: "Compression",
    caption: "Explaining reveals the gaps.",
    startSec: 24.2,
  },
  {
    label: "Audience Pressure",
    caption: "Speaking blocks fluency-faking.",
    startSec: 25.2,
  },
  {
    label: "Linearization",
    caption: "Speech forces causal reasoning.",
    startSec: 26.2,
  },
];

// Pill stretches full width for vertical layout.
const ChipPill: React.FC<{ chip: Chip }> = ({ chip }) => {
  const enter = useEnter(chip.startSec, 0.55);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [18, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: `${COLORS.gold}14`,
        border: `2px solid ${COLORS.gold}`,
        borderRadius: 999,
        padding: "18px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        width: "100%",
      }}
    >
      <div
        style={{
          color: COLORS.gold,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.005em",
        }}
      >
        {chip.label}
      </div>
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: "0.01em",
          textAlign: "center",
        }}
      >
        {chip.caption}
      </div>
    </div>
  );
};

const Karpathy: React.FC = () => {
  const enter = useEnter(28.5, 1.2);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [16, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        position: "absolute",
        bottom: SAFE_ZONE_BOTTOM - 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 26,
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "0.005em",
          maxWidth: "100%",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        &ldquo;You can outsource your thinking, but you can&apos;t outsource
        your understanding.&rdquo;
        <span
          style={{
            display: "block",
            marginTop: 12,
            color: COLORS.textMuted,
            fontSize: 18,
            fontStyle: "normal",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          — Karpathy
        </span>
      </div>
    </div>
  );
};

const Headline: React.FC = () => {
  const enter = useEnter(0.0, 0.6);
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
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        DRIVER is built differently
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: "-0.012em",
          lineHeight: 1.05,
        }}
      >
        The ratio flips at the edges.
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  // Indices: 0=D, 1..4=R/I/V/E, 5=R(eflect)
  const middleNodes = NODES.slice(1, 5);
  const firstNode = NODES[0];
  const lastNode = NODES[5];
  if (!firstNode || !lastNode) {
    throw new Error("NODES misconfigured");
  }

  // Hoist hook calls so React hook ordering stays stable.
  const dotLeftOpacity = useEnter(0.9, 0.4);
  const dotRightOpacity = useEnter(2.7, 0.4);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: "hidden",
      }}
    >
      <Headline />

      {/* Center diagram — bracket horizontal at top with RatioBadges below
          each section, then cognitive-force chips stacked vertically. */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE_TOP + 220,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "0 40px",
        }}
      >
        {/* Bracket row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <NodeCell node={firstNode} pulseAt={4.6} />
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 48,
              fontWeight: 300,
              margin: "0 4px",
              alignSelf: "center",
              opacity: dotLeftOpacity,
            }}
          >
            ·
          </div>
          <Bracket side="left" startSec={1.1} />
          {middleNodes.map((n) => (
            <NodeCell key={n.letter + n.word} node={n} />
          ))}
          <Bracket side="right" startSec={2.5} />
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 48,
              fontWeight: 300,
              margin: "0 4px",
              alignSelf: "center",
              opacity: dotRightOpacity,
            }}
          >
            ·
          </div>
          <NodeCell node={lastNode} pulseAt={6.2} />
        </div>

        {/* 80/20 ratio badges row — anchored beneath the bracket sections.
            For vertical we use a single row that mirrors V2 positioning. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 18,
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <RatioBadge human={80} ai={20} emphasis="human" startSec={17.0} />
          </div>
          <div style={{ flex: 0, padding: "0 4px" }}>
            <RatioBadge human={20} ai={80} emphasis="ai" startSec={4.0} />
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <RatioBadge human={80} ai={20} emphasis="human" startSec={19.0} />
          </div>
        </div>

        {/* Cognitive force chips — stacked vertically (full width). */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginTop: 38,
            justifyContent: "center",
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {CHIPS.map((chip) => (
            <ChipPill key={chip.label} chip={chip} />
          ))}
        </div>
      </div>

      <Karpathy />
    </AbsoluteFill>
  );
};

export default Scene2;
