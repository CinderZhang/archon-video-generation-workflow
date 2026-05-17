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

type DriverNode = {
  letter: string;
  word: string;
  color: string;
  highlight: boolean;
  startSec: number;
};

// Narration order: "Define and Discover, Represent, Implement, Validate,
// Evolve, Reflect." Six letters with D and final R as the 80% human edges.
const NODES: DriverNode[] = [
  { letter: "D", word: "Define · Discover", color: COLORS.green, highlight: true, startSec: 1.4 },
  { letter: "R", word: "Represent", color: COLORS.blue, highlight: false, startSec: 2.1 },
  { letter: "I", word: "Implement", color: COLORS.blue, highlight: false, startSec: 2.5 },
  { letter: "V", word: "Validate", color: COLORS.blue, highlight: false, startSec: 2.9 },
  { letter: "E", word: "Evolve", color: COLORS.blue, highlight: false, startSec: 3.3 },
  { letter: "R", word: "Reflect", color: COLORS.green, highlight: true, startSec: 4.0 },
];

// Headline at top
const Headline: React.FC = () => {
  const enter = useEnter(0.0, 0.7);
  const opacity = enter;
  return (
    <div
      style={{
        opacity,
        position: "absolute",
        top: 70,
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
          marginBottom: 12,
        }}
      >
        DRIVER closes the gap
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: "-0.018em",
        }}
      >
        Six stages. The ratio flips at the edges.
      </div>
    </div>
  );
};

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
        fontSize: 200,
        fontWeight: 200,
        lineHeight: 0.78,
        margin: side === "left" ? "0 6px 0 14px" : "0 14px 0 6px",
        userSelect: "none",
      }}
    >
      {side === "left" ? "[" : "]"}
    </div>
  );
};

const NodeCell: React.FC<{ node: DriverNode; pulseAt?: number }> = ({
  node,
  pulseAt,
}) => {
  const enter = useEnter(node.startSec, 0.45);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [16, 0]);

  // Pulse glow for highlighted (green) edge nodes
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
    ? `0 0 ${24 + glow * 36}px ${node.color}${alphaHex(60 + glow * 80)}`
    : "none";

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 12px",
      }}
    >
      <div
        style={{
          color: node.color,
          fontSize: 108,
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
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginTop: 14,
          opacity: node.highlight ? 1 : 0.85,
          whiteSpace: "nowrap",
        }}
      >
        {node.word}
      </div>
    </div>
  );
};

// 80/20 ratio chip. Used 3x: human-edge, AI-middle, human-edge.
// emphasis controls which half is bright.
const RatioBadge: React.FC<{
  human: number;
  ai: number;
  startSec: number;
  emphasis: "human" | "ai";
}> = ({ human, ai, startSec, emphasis }) => {
  const enter = useEnter(startSec, 0.55);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [12, 0]);
  const humanColor = COLORS.green;
  const aiColor = COLORS.blue;
  const borderColor = emphasis === "human" ? humanColor : aiColor;
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 6,
        background: `${borderColor}14`,
        border: `1.5px solid ${borderColor}b0`,
        borderRadius: 8,
        padding: "6px 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: humanColor, opacity: emphasis === "human" ? 1 : 0.5 }}>
        {human}% HUMAN
      </span>
      <span style={{ color: COLORS.textMuted, opacity: 0.7 }}>/</span>
      <span style={{ color: aiColor, opacity: emphasis === "ai" ? 1 : 0.5 }}>
        {ai}% AI
      </span>
    </div>
  );
};

// Edge captions under D and the final R explaining the human role.
const EdgeCaption: React.FC<{
  label: string;
  startSec: number;
  color: string;
}> = ({ label, startSec, color }) => {
  const enter = useEnter(startSec, 0.6);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [8, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 8,
        color,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: "0.02em",
        textAlign: "center",
        fontStyle: "italic",
        maxWidth: 220,
      }}
    >
      {label}
    </div>
  );
};

// Karpathy quote chip at the bottom — gold accent
const KarpathyChip: React.FC = () => {
  const enter = useEnter(28.0, 1.2);
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [14, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: `${COLORS.gold}10`,
          border: `1.5px solid ${COLORS.gold}`,
          borderRadius: 999,
          padding: "14px 28px",
          color: COLORS.gold,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.005em",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontStyle: "italic" }}>
          Outsource thinking &nbsp;&ne;&nbsp; Outsource understanding
        </span>
        <span
          style={{
            color: COLORS.textMuted,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Karpathy
        </span>
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

  // Hoist hook calls to keep React hook ordering stable.
  const dotLeftOpacity = useEnter(1.7, 0.4);
  const dotRightOpacity = useEnter(3.6, 0.4);

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

      {/* Center diagram block */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-52%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        {/* Bracket row: D · [ R I V E ] · R */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <NodeCell node={firstNode} pulseAt={11.0} />
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 72,
              fontWeight: 300,
              margin: "0 10px",
              alignSelf: "center",
              opacity: dotLeftOpacity,
            }}
          >
            ·
          </div>
          <Bracket side="left" startSec={1.9} />
          {middleNodes.map((n) => (
            <NodeCell key={n.letter + n.word} node={n} />
          ))}
          <Bracket side="right" startSec={3.4} />
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 72,
              fontWeight: 300,
              margin: "0 10px",
              alignSelf: "center",
              opacity: dotRightOpacity,
            }}
          >
            ·
          </div>
          <NodeCell node={lastNode} pulseAt={22.0} />
        </div>

        {/* 80/20 ratio badges anchored beneath each section */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 0,
            marginTop: 8,
            width: "100%",
          }}
        >
          <div
            style={{
              width: 360,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            <RatioBadge human={80} ai={20} emphasis="human" startSec={9.5} />
            <EdgeCaption
              label="Frame the problem"
              startSec={10.2}
              color={COLORS.green}
            />
          </div>
          <div
            style={{
              flex: 0,
              padding: "0 18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            <RatioBadge human={20} ai={80} emphasis="ai" startSec={14.0} />
            <EdgeCaption
              label="Speed compounds"
              startSec={14.6}
              color={COLORS.blue}
            />
          </div>
          <div
            style={{
              width: 360,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            <RatioBadge human={80} ai={20} emphasis="human" startSec={20.0} />
            <EdgeCaption
              label="Prove you understand it"
              startSec={20.6}
              color={COLORS.green}
            />
          </div>
        </div>
      </div>

      <KarpathyChip />
    </AbsoluteFill>
  );
};

export default Scene2;
