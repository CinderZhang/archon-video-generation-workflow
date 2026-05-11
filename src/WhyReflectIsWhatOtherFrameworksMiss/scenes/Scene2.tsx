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
        fontSize: 180,
        fontWeight: 200,
        lineHeight: 0.8,
        margin: side === "left" ? "0 8px 0 16px" : "0 16px 0 8px",
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
        margin: "0 14px",
      }}
    >
      <div
        style={{
          color: node.color,
          fontSize: 96,
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
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginTop: 12,
          opacity: node.highlight ? 1 : 0.85,
        }}
      >
        {node.word}
      </div>
    </div>
  );
};

const RoleLabel: React.FC<{
  text: string;
  color: string;
  startSec: number;
  marginLeft?: number;
}> = ({ text, color, startSec, marginLeft }) => {
  const enter = useEnter(startSec, 0.5);
  const opacity = enter;
  return (
    <div
      style={{
        opacity,
        color,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        marginLeft: marginLeft ?? 0,
      }}
    >
      {text}
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
    startSec: 14.5,
  },
  {
    label: "Audience Pressure",
    caption: "Speaking blocks fluency-faking.",
    startSec: 16.0,
  },
  {
    label: "Linearization",
    caption: "Speech forces causal reasoning.",
    startSec: 17.5,
  },
];

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
        border: `1.5px solid ${COLORS.gold}`,
        borderRadius: 999,
        padding: "16px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        minWidth: 240,
      }}
    >
      <div
        style={{
          color: COLORS.gold,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.005em",
        }}
      >
        {chip.label}
      </div>
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: "0.01em",
        }}
      >
        {chip.caption}
      </div>
    </div>
  );
};

const Karpathy: React.FC = () => {
  const enter = useEnter(28.0, 1.4);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [16, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        position: "absolute",
        bottom: 64,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textSecondary,
          fontSize: 22,
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "0.005em",
          maxWidth: 1100,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        &ldquo;You can outsource your thinking, but you can&apos;t outsource
        your understanding.&rdquo;
        <span
          style={{
            display: "block",
            marginTop: 10,
            color: COLORS.textMuted,
            fontSize: 16,
            fontStyle: "normal",
            letterSpacing: "0.18em",
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
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        DRIVER is built differently
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: "-0.012em",
        }}
      >
        Reflect proves you understood.
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

      {/* Center diagram */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Bracket row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <NodeCell node={firstNode} pulseAt={4.6} />
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 64,
              fontWeight: 300,
              margin: "0 12px",
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
              fontSize: 64,
              fontWeight: 300,
              margin: "0 12px",
              alignSelf: "center",
              opacity: dotRightOpacity,
            }}
          >
            ·
          </div>
          <NodeCell node={lastNode} pulseAt={6.2} />
        </div>

        {/* Role labels under the diagram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            marginTop: 4,
            width: "100%",
          }}
        >
          <div style={{ width: 200, textAlign: "center" }}>
            <RoleLabel text="Yours" color={COLORS.green} startSec={4.0} />
          </div>
          <div style={{ flex: 0 }}>
            <RoleLabel text="Machine" color={COLORS.blue} startSec={4.4} />
          </div>
          <div style={{ width: 200, textAlign: "center" }}>
            <RoleLabel text="Yours" color={COLORS.green} startSec={5.6} />
          </div>
        </div>

        {/* Cognitive force chips */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 28,
            marginTop: 36,
            justifyContent: "center",
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
