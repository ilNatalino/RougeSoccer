import type { ReactNode } from "react";
import type { CardDefinition } from "../game/types";

type SpriteRenderer = () => ReactNode;
type FieldTone = "standard" | "wide" | "box" | "set-piece" | "defense";

type PlayerProps = {
  x: number;
  y: number;
  kit?: string;
  accent?: string;
};

const RED = "#dc3e31";
const BLUE = "#2257c9";
const GOLD = "#f2ad24";
const FIELD = "#13794f";
const FIELD_DARK = "#0d3f33";
const FIELD_LIGHT = "#1d8b58";
const CHALK = "#fffaf0";
const INK = "#17231f";
const SKIN = "#f4c38a";

const CARD_SPRITES: Record<string, SpriteRenderer> = {
  "passaggio-corto": PassaggioCortoSprite,
  "cambio-gioco": CambioGiocoSprite,
  inserimento: InserimentoSprite,
  cross: CrossSprite,
  tiro: TiroSprite,
  pressing: PressingSprite,
  ripiegamento: RipiegamentoSprite,
  verticalizzazione: VerticalizzazioneSprite,
  "tiro-piazzato": TiroPiazzatoSprite,
  marcatura: MarcaturaSprite,
  "azione-fascia": AzioneFasciaSprite,
  "calcio-piazzato": CalcioPiazzatoSprite,
  "giro-palla-paziente": GiroPallaPazienteSprite,
  "terzo-uomo": TerzoUomoSprite,
  "imbucata-centrale": ImbucataCentraleSprite,
  "linea-compatta": LineaCompattaSprite,
  "lancio-lungo": LancioLungoSprite,
  "punizione-studiata": PunizioneStudiataSprite,
  "sovrapposizione-continua": SovrapposizioneContinuaSprite,
  "attacco-in-area": AttaccoInAreaSprite,
  "tiro-di-prima": TiroDiPrimaSprite,
};

export function CardIllustration({ card }: { card: CardDefinition }) {
  const Sprite = CARD_SPRITES[card.id] ?? FallbackSprite;

  return (
    <span className="card-illustration" aria-hidden="true">
      <Sprite />
    </span>
  );
}

function SpriteFrame({
  children,
  tone = "standard",
  centerCircle = false,
  penaltyBox = false,
}: {
  children: ReactNode;
  tone?: FieldTone;
  centerCircle?: boolean;
  penaltyBox?: boolean;
}) {
  const colors = getFieldTone(tone);

  return (
    <svg
      className="card-sprite"
      viewBox="0 0 96 64"
      focusable="false"
      role="presentation"
      shapeRendering="crispEdges"
    >
      <rect width="96" height="64" fill={INK} />
      <rect x="3" y="3" width="90" height="58" fill={colors.base} />
      <rect x="3" y="3" width="18" height="58" fill={colors.stripe} opacity="0.42" />
      <rect x="39" y="3" width="18" height="58" fill={colors.stripe} opacity="0.42" />
      <rect x="75" y="3" width="18" height="58" fill={colors.stripe} opacity="0.42" />
      <rect x="3" y="3" width="90" height="58" fill="none" stroke={CHALK} strokeWidth="2" />
      {centerCircle && (
        <>
          <rect x="47" y="3" width="2" height="58" fill={CHALK} opacity="0.72" />
          <rect x="37" y="22" width="22" height="2" fill={CHALK} opacity="0.64" />
          <rect x="37" y="40" width="22" height="2" fill={CHALK} opacity="0.64" />
          <rect x="35" y="24" width="2" height="16" fill={CHALK} opacity="0.64" />
          <rect x="59" y="24" width="2" height="16" fill={CHALK} opacity="0.64" />
        </>
      )}
      {penaltyBox && (
        <>
          <rect x="74" y="15" width="19" height="34" fill="none" stroke={CHALK} strokeWidth="2" />
          <rect x="86" y="24" width="7" height="16" fill="none" stroke={CHALK} strokeWidth="2" />
        </>
      )}
      {children}
    </svg>
  );
}

function getFieldTone(tone: FieldTone) {
  switch (tone) {
    case "wide":
      return { base: "#166f62", stripe: "#1b8572" };
    case "box":
      return { base: "#147044", stripe: "#1f8a54" };
    case "set-piece":
      return { base: "#706534", stripe: "#897839" };
    case "defense":
      return { base: "#176657", stripe: "#1c7b68" };
    case "standard":
    default:
      return { base: FIELD, stripe: FIELD_LIGHT };
  }
}

function Player({ x, y, kit = RED, accent = CHALK }: PlayerProps) {
  return (
    <g>
      <rect x={x + 2} y={y} width="6" height="6" fill={SKIN} />
      <rect x={x} y={y + 6} width="10" height="8" fill={kit} />
      <rect x={x + 1} y={y + 8} width="8" height="2" fill={accent} opacity="0.72" />
      <rect x={x - 1} y={y + 8} width="2" height="7" fill={SKIN} />
      <rect x={x + 9} y={y + 8} width="2" height="7" fill={SKIN} />
      <rect x={x + 1} y={y + 14} width="3" height="7" fill={INK} />
      <rect x={x + 6} y={y + 14} width="3" height="7" fill={INK} />
      <rect x={x} y={y + 21} width="4" height="2" fill={accent} />
      <rect x={x + 6} y={y + 21} width="4" height="2" fill={accent} />
    </g>
  );
}

function Ball({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="5" height="5" fill={CHALK} />
      <rect x={x + 2} y={y + 1} width="1" height="1" fill={INK} />
      <rect x={x + 1} y={y + 3} width="2" height="1" fill={INK} />
    </g>
  );
}

function PassLine({
  points,
  color = CHALK,
  dashed = false,
}: {
  points: Array<[number, number]>;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <polyline
      points={points.map(([x, y]) => `${x},${y}`).join(" ")}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="miter"
      strokeLinecap="square"
      strokeDasharray={dashed ? "4 3" : undefined}
    />
  );
}

function ArrowHead({
  x,
  y,
  direction = "right",
  color = CHALK,
}: {
  x: number;
  y: number;
  direction?: "right" | "left" | "up" | "down";
  color?: string;
}) {
  const points = {
    right: `${x},${y - 4} ${x + 8},${y} ${x},${y + 4}`,
    left: `${x},${y - 4} ${x - 8},${y} ${x},${y + 4}`,
    up: `${x - 4},${y} ${x},${y - 8} ${x + 4},${y}`,
    down: `${x - 4},${y} ${x},${y + 8} ${x + 4},${y}`,
  }[direction];

  return <polygon points={points} fill={color} />;
}

function Goal({ x = 78, y = 17 }: { x?: number; y?: number }) {
  return (
    <g>
      <rect x={x} y={y} width="13" height="30" fill="#d9f3ff" opacity="0.84" />
      <rect x={x} y={y} width="13" height="30" fill="none" stroke={INK} strokeWidth="2" />
      <rect x={x + 4} y={y} width="1" height="30" fill={INK} opacity="0.42" />
      <rect x={x + 8} y={y} width="1" height="30" fill={INK} opacity="0.42" />
      <rect x={x} y={y + 10} width="13" height="1" fill={INK} opacity="0.42" />
      <rect x={x} y={y + 20} width="13" height="1" fill={INK} opacity="0.42" />
    </g>
  );
}

function MiniWall({ x, y, count = 3 }: { x: number; y: number; count?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, index) => (
        <g key={index}>
          <rect x={x + index * 8 + 2} y={y} width="4" height="4" fill={SKIN} />
          <rect x={x + index * 8} y={y + 4} width="8" height="10" fill={BLUE} />
          <rect x={x + index * 8 + 1} y={y + 14} width="2" height="5" fill={INK} />
          <rect x={x + index * 8 + 5} y={y + 14} width="2" height="5" fill={INK} />
        </g>
      ))}
    </g>
  );
}

function PassaggioCortoSprite() {
  return (
    <SpriteFrame centerCircle>
      <Player x={23} y={21} />
      <Player x={60} y={24} />
      <PassLine points={[[36, 34], [56, 35]]} />
      <ArrowHead x={56} y={35} />
      <Ball x={45} y={32} />
    </SpriteFrame>
  );
}

function CambioGiocoSprite() {
  return (
    <SpriteFrame tone="wide">
      <rect x="13" y="3" width="2" height="58" fill={CHALK} opacity="0.56" />
      <rect x="81" y="3" width="2" height="58" fill={CHALK} opacity="0.56" />
      <Player x={15} y={39} />
      <Player x={72} y={10} />
      <PassLine points={[[28, 45], [45, 34], [66, 20]]} color={GOLD} />
      <ArrowHead x={66} y={20} color={GOLD} />
      <Ball x={35} y={38} />
    </SpriteFrame>
  );
}

function InserimentoSprite() {
  return (
    <SpriteFrame penaltyBox>
      <rect x="50" y="14" width="2" height="36" fill={BLUE} opacity="0.75" />
      <Player x={27} y={35} />
      <Player x={59} y={18} />
      <Player x={61} y={40} kit={BLUE} />
      <PassLine points={[[36, 43], [54, 34], [63, 27]]} />
      <PassLine points={[[61, 28], [70, 21]]} color={GOLD} dashed />
      <ArrowHead x={70} y={21} color={GOLD} />
      <Ball x={52} y={32} />
    </SpriteFrame>
  );
}

function CrossSprite() {
  return (
    <SpriteFrame tone="wide" penaltyBox>
      <rect x="13" y="3" width="2" height="58" fill={CHALK} opacity="0.7" />
      <Player x={13} y={41} />
      <Player x={70} y={24} />
      <Player x={79} y={36} kit={BLUE} />
      <PassLine points={[[25, 47], [44, 35], [67, 30]]} color={GOLD} />
      <ArrowHead x={67} y={30} color={GOLD} />
      <Ball x={36} y={39} />
    </SpriteFrame>
  );
}

function TiroSprite() {
  return (
    <SpriteFrame penaltyBox>
      <Goal />
      <Player x={38} y={31} />
      <Player x={66} y={27} kit={BLUE} />
      <PassLine points={[[51, 38], [74, 29], [83, 25]]} color={GOLD} />
      <ArrowHead x={83} y={25} color={GOLD} />
      <Ball x={59} y={34} />
    </SpriteFrame>
  );
}

function PressingSprite() {
  return (
    <SpriteFrame tone="defense" centerCircle>
      <Player x={43} y={24} kit={BLUE} />
      <Player x={24} y={15} />
      <Player x={62} y={34} />
      <Ball x={48} y={45} />
      <PassLine points={[[34, 27], [43, 31]]} color={GOLD} />
      <PassLine points={[[64, 39], [55, 36]]} color={GOLD} />
      <rect x="39" y="20" width="23" height="30" fill="none" stroke={GOLD} strokeWidth="2" />
    </SpriteFrame>
  );
}

function RipiegamentoSprite() {
  return (
    <SpriteFrame tone="defense">
      <Goal x={6} y={17} />
      <Player x={56} y={12} />
      <Player x={63} y={35} />
      <Player x={31} y={20} />
      <Player x={22} y={39} />
      <PassLine points={[[61, 20], [43, 20], [33, 25]]} color={GOLD} dashed />
      <ArrowHead x={33} y={25} direction="left" color={GOLD} />
      <PassLine points={[[67, 43], [48, 44], [32, 48]]} color={GOLD} dashed />
      <ArrowHead x={32} y={48} direction="left" color={GOLD} />
    </SpriteFrame>
  );
}

function VerticalizzazioneSprite() {
  return (
    <SpriteFrame centerCircle>
      <Player x={20} y={34} />
      <Player x={67} y={18} />
      <rect x="41" y="12" width="3" height="40" fill={BLUE} />
      <rect x="54" y="12" width="3" height="40" fill={BLUE} />
      <PassLine points={[[32, 43], [48, 35], [65, 27]]} color={GOLD} />
      <ArrowHead x={65} y={27} color={GOLD} />
      <Ball x={45} y={34} />
    </SpriteFrame>
  );
}

function TiroPiazzatoSprite() {
  return (
    <SpriteFrame tone="set-piece" penaltyBox>
      <Goal />
      <Player x={37} y={37} />
      <Player x={68} y={25} kit={BLUE} accent={GOLD} />
      <Ball x={51} y={44} />
      <PassLine points={[[55, 43], [68, 34], [83, 21]]} color={GOLD} dashed />
      <ArrowHead x={83} y={21} color={GOLD} />
      <rect x="84" y="21" width="5" height="5" fill={RED} />
    </SpriteFrame>
  );
}

function MarcaturaSprite() {
  return (
    <SpriteFrame tone="defense">
      <Player x={43} y={24} kit={BLUE} />
      <Player x={34} y={24} />
      <rect x="31" y="20" width="29" height="30" fill="none" stroke={GOLD} strokeWidth="2" />
      <rect x="37" y="26" width="15" height="18" fill="none" stroke={CHALK} strokeWidth="2" />
      <Ball x={63} y={35} />
    </SpriteFrame>
  );
}

function AzioneFasciaSprite() {
  return (
    <SpriteFrame tone="wide">
      <rect x="14" y="3" width="2" height="58" fill={CHALK} opacity="0.76" />
      <Player x={17} y={33} />
      <Player x={42} y={22} kit={BLUE} />
      <PassLine points={[[24, 39], [24, 29], [29, 18]]} color={GOLD} />
      <ArrowHead x={29} y={18} direction="up" color={GOLD} />
      <Ball x={24} y={38} />
      <rect x="12" y="12" width="18" height="40" fill="none" stroke={CHALK} strokeWidth="2" opacity="0.5" />
    </SpriteFrame>
  );
}

function CalcioPiazzatoSprite() {
  return (
    <SpriteFrame tone="set-piece">
      <rect x="30" y="30" width="36" height="2" fill={CHALK} opacity="0.68" />
      <Ball x={43} y={28} />
      <Player x={26} y={34} />
      <Player x={56} y={18} />
      <MiniWall x={68} y={28} count={2} />
      <PassLine points={[[47, 29], [59, 22], [71, 18]]} color={GOLD} dashed />
      <ArrowHead x={71} y={18} color={GOLD} />
    </SpriteFrame>
  );
}

function GiroPallaPazienteSprite() {
  return (
    <SpriteFrame centerCircle>
      <Player x={23} y={35} />
      <Player x={44} y={15} />
      <Player x={66} y={35} />
      <Ball x={45} y={35} />
      <PassLine points={[[34, 41], [47, 27], [68, 42], [34, 41]]} color={GOLD} />
      <ArrowHead x={47} y={27} direction="up" color={GOLD} />
      <ArrowHead x={68} y={42} color={GOLD} />
      <ArrowHead x={34} y={41} direction="left" color={GOLD} />
    </SpriteFrame>
  );
}

function TerzoUomoSprite() {
  return (
    <SpriteFrame>
      <Player x={18} y={34} />
      <Player x={43} y={31} />
      <Player x={65} y={14} />
      <Player x={55} y={39} kit={BLUE} />
      <PassLine points={[[31, 42], [45, 39], [35, 32]]} />
      <PassLine points={[[50, 36], [64, 25], [72, 19]]} color={GOLD} />
      <ArrowHead x={72} y={19} color={GOLD} />
      <Ball x={49} y={35} />
    </SpriteFrame>
  );
}

function ImbucataCentraleSprite() {
  return (
    <SpriteFrame penaltyBox centerCircle>
      <Player x={24} y={34} />
      <Player x={67} y={23} />
      <Player x={49} y={19} kit={BLUE} />
      <Player x={49} y={39} kit={BLUE} />
      <PassLine points={[[36, 42], [52, 33], [66, 30]]} color={GOLD} />
      <ArrowHead x={66} y={30} color={GOLD} />
      <Ball x={53} y={32} />
    </SpriteFrame>
  );
}

function LineaCompattaSprite() {
  return (
    <SpriteFrame tone="defense">
      <Goal x={5} y={17} />
      <rect x="31" y="27" width="40" height="2" fill={GOLD} />
      <Player x={28} y={22} />
      <Player x={40} y={22} />
      <Player x={52} y={22} />
      <Player x={64} y={22} />
      <Player x={71} y={8} kit={BLUE} />
      <Player x={76} y={40} kit={BLUE} />
      <rect x="25" y="18" width="53" height="31" fill="none" stroke={CHALK} strokeWidth="2" opacity="0.58" />
    </SpriteFrame>
  );
}

function LancioLungoSprite() {
  return (
    <SpriteFrame tone="wide">
      <Goal x={5} y={17} />
      <Player x={18} y={36} />
      <Player x={73} y={15} />
      <rect x="56" y="10" width="3" height="45" fill={BLUE} />
      <PassLine points={[[29, 43], [45, 25], [72, 23]]} color={GOLD} dashed />
      <ArrowHead x={72} y={23} color={GOLD} />
      <Ball x={43} y={27} />
    </SpriteFrame>
  );
}

function PunizioneStudiataSprite() {
  return (
    <SpriteFrame tone="set-piece" penaltyBox>
      <Goal />
      <Ball x={35} y={42} />
      <Player x={20} y={35} />
      <MiniWall x={50} y={29} count={3} />
      <PassLine points={[[39, 42], [48, 25], [68, 19], [84, 24]]} color={GOLD} dashed />
      <ArrowHead x={84} y={24} color={GOLD} />
    </SpriteFrame>
  );
}

function SovrapposizioneContinuaSprite() {
  return (
    <SpriteFrame tone="wide">
      <rect x="14" y="3" width="2" height="58" fill={CHALK} opacity="0.76" />
      <Player x={21} y={34} />
      <Player x={38} y={21} />
      <Player x={50} y={36} kit={BLUE} />
      <PassLine points={[[30, 42], [37, 31], [45, 22]]} color={GOLD} />
      <ArrowHead x={45} y={22} direction="up" color={GOLD} />
      <PassLine points={[[39, 31], [50, 20], [61, 14]]} color={GOLD} dashed />
      <ArrowHead x={61} y={14} color={GOLD} />
      <Ball x={31} y={39} />
    </SpriteFrame>
  );
}

function AttaccoInAreaSprite() {
  return (
    <SpriteFrame tone="box" penaltyBox>
      <Goal />
      <Player x={55} y={18} />
      <Player x={62} y={36} />
      <Player x={42} y={30} />
      <Player x={70} y={27} kit={BLUE} />
      <PassLine points={[[42, 37], [56, 30], [66, 24]]} color={GOLD} />
      <PassLine points={[[50, 39], [65, 42], [76, 39]]} color={GOLD} />
      <Ball x={66} y={30} />
    </SpriteFrame>
  );
}

function TiroDiPrimaSprite() {
  return (
    <SpriteFrame penaltyBox>
      <Goal />
      <Player x={29} y={36} />
      <Player x={56} y={26} />
      <Player x={67} y={32} kit={BLUE} />
      <PassLine points={[[41, 44], [55, 36]]} />
      <ArrowHead x={55} y={36} />
      <PassLine points={[[62, 34], [76, 28], [84, 25]]} color={GOLD} />
      <ArrowHead x={84} y={25} color={GOLD} />
      <Ball x={59} y={34} />
      <rect x="54" y="25" width="16" height="16" fill="none" stroke={GOLD} strokeWidth="2" />
    </SpriteFrame>
  );
}

function FallbackSprite() {
  return (
    <SpriteFrame centerCircle>
      <Player x={25} y={23} />
      <Player x={62} y={23} kit={BLUE} />
      <Ball x={46} y={34} />
      <PassLine points={[[35, 34], [47, 36], [61, 34]]} color={GOLD} dashed />
      <rect x="42" y="18" width="12" height="4" fill={CHALK} />
      <rect x="50" y="22" width="4" height="11" fill={CHALK} />
      <rect x="48" y="38" width="4" height="4" fill={CHALK} />
    </SpriteFrame>
  );
}
