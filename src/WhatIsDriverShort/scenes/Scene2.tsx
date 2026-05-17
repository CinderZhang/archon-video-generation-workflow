import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, ENTER_EASING, SAFE_ZONE_TOP } from "../constants";

// Vertical 9:16 (1080x1920) rework of V1 Scene 2.
// 16:9 used a horizontal bracket row [D · R I V E · R] with three ratio
// badges in a row underneath. In 9:16 we keep the bracket horizontal (so
// the 6-letter sequence reads as a single line) but shrink letter sizes
// so it fits 1080 wide, then stack the three RatioBadges + captions
// vertically below. Karpathy chip pinned to the bottom safe zone.

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

// Headline at top safe zone
const Headline: React.FC = () => {
  const enter = useEnter(0.0, 0.7);
  const opacity = enter;
  return (
    <div
      style={{
        opacity,
        position: "absolute",
        top: SAFE_ZONE_TOP,
        left: 40,
        right: 40,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginBottom: 18,
        }}
      >
        DRIVER closes the gap
      </div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: "-0.018em",
          lineHeight: 1.1,
        }}
      >
        Six stages.
        <br />
        The ratio flips at the edges.
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
        fontSize: 160,
        fontWeight: 200,
        lineHeight: 0.78,
        margin: side === "left" ? "0 4px 0 10px" : "0 10px 0 4px",
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
        margin: "0 6px",
      }}
    >
      <div
        style={{
          color: node.color,
          fontSize: 92,
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
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 12,
          opacity: node.highlight ? 1 : 0.85,
          whiteSpace: "nowrap",
        }}
      >
        {node.word}
      </div>
    </div>
  );
};

// 80/20 ratio chip. Larger in vertical for mobile.
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
        background: `${borderColor}14`,
        border: `1.5px solid ${borderColor}b0`,
        borderRadius: 10,
        padding: "10px 22px",
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontSize: 26,
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

// Edge caption under each ratio badge — explains the role
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
        marginTop: 10,
        color,
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: "0.02em",
        textAlign: "center",
        fontStyle: "italic",
      }}
    >
      {label}
    </div>
  );
};

// Stage label above each ratio row to anchor it to the bracket section
const StageLabel: React.FC<{
  label: string;
  startSec: number;
  color: string;
}> = ({ label, startSec, color }) => {
  const enter = useEnter(startSec, 0.55);
  const opacity = enter * 0.85;
  return (
    <div
      style={{
        opacity,
        color,
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        marginBottom: 8,
        textAlign: "center",
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
        bottom: 180,
        left: 40,
        right: 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: `${COLORS.gold}10`,
          border: `1.5px solid ${COLORS.gold}`,
          borderRadius: 24,
          padding: "22px 32px",
          color: COLORS.gold,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.005em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          textAlign: "center",
          lineHeight: 1.25,
        }}
      >
        <span style={{ fontStyle: "italic" }}>
          Outsource thinking &ne; Outsource understanding
        </span>
        <span
          style={{
            color: COLORS.textMuted,
            fontSize: 18,
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

      {/* Center column: bracket row + 3 stacked ratio sections */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Bracket row: D · [ R I V E ] · R — fits in 1080 width at smaller scale */}
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
              fontSize: 56,
              fontWeight: 300,
              margin: "0 6px",
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
              fontSize: 56,
              fontWeight: 300,
              margin: "0 6px",
              alignSelf: "center",
              opacity: dotRightOpacity,
            }}
          >
            ·
          </div>
          <NodeCell node={lastNode} pulseAt={22.0} />
        </div>

        {/* Three stacked sections — each a stage label + badge + caption */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            width: "100%",
            marginTop: 8,
          }}
        >
          {/* Left edge — D */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StageLabel
              label="D · Define"
              startSec={9.0}
              color={COLORS.green}
            />
            <RatioBadge human={80} ai={20} emphasis="human" startSec={9.5} />
            <EdgeCaption
              label="Frame the problem"
              startSec={10.2}
              color={COLORS.green}
            />
          </div>

          {/* Middle — R I V E */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StageLabel
              label="R I V E · the middle"
              startSec={13.6}
              color={COLORS.blue}
            />
            <RatioBadge human={20} ai={80} emphasis="ai" startSec={14.0} />
            <EdgeCaption
              label="Speed compounds"
              startSec={14.6}
              color={COLORS.blue}
            />
          </div>

          {/* Right edge — final R (Reflect) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StageLabel
              label="R · Reflect"
              startSec={19.6}
              color={COLORS.green}
            />
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
