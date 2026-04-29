/**
 * Frankenstrat / EVH ストライプバッグ風
 * - 手前から: 黒（太め・少なめ）→ 白（細〜太・多層で交差）→ 赤ベース
 * - 不透明色のみ（#000 / #fff）＋ transparent。白の総幅 : 黒の総幅 ≈ 5 : 1 目安。
 */

export type RedBase = { deep: string; ground: string; bright: string };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rng: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function partitionWidths(rng: () => number, total: number, minW: number, maxW: number): number[] {
  const t = Math.floor(total);
  if (t <= 0) return [];
  const out: number[] = [];
  let rem = t;
  while (rem > 0) {
    if (rem <= maxW) {
      if (out.length > 0 && rem < minW) {
        out[out.length - 1] += rem;
      } else {
        out.push(rem);
      }
      break;
    }
    const hi = Math.min(maxW, rem - minW);
    const lo = minW;
    if (hi < lo) {
      if (out.length) out[out.length - 1] += rem;
      else out.push(rem);
      break;
    }
    const w = lo + Math.floor(rng() * (hi - lo + 1));
    out.push(w);
    rem -= w;
  }
  const sum = out.reduce((a, b) => a + b, 0);
  if (sum !== t && out.length) {
    out[out.length - 1] += t - sum;
  }
  return out;
}

type Seg = { color: string; w: number };

function buildAlternatingStops(segments: Seg[], cycle: number): string {
  let pos = 0;
  const parts: string[] = [];
  for (const seg of segments) {
    if (pos >= cycle) break;
    const w = Math.max(1, Math.round(seg.w));
    const end = Math.min(cycle, pos + w);
    parts.push(`${seg.color} ${pos}px ${end}px`);
    pos = end;
  }
  if (pos < cycle) {
    parts.push(`transparent ${pos}px ${cycle}px`);
  }
  return parts.join(", ");
}

function buildPaintCycle(
  rng: () => number,
  cycle: number,
  paintHex: string,
  totalPaint: number,
  paintMin: number,
  paintMax: number,
  gapMin: number,
  gapMax: number,
  shufflePasses = 1
): string {
  const tp = Math.floor(totalPaint);
  const gapTotal = Math.max(0, cycle - tp);
  const paints = partitionWidths(rng, tp, paintMin, paintMax);
  const gaps = partitionWidths(rng, gapTotal, gapMin, gapMax);
  const segs: Seg[] = [
    ...paints.map((w) => ({ color: paintHex, w })),
    ...gaps.map((w) => ({ color: "transparent", w })),
  ];
  for (let p = 0; p < shufflePasses; p++) {
    shuffleInPlace(segs, rng);
  }
  return buildAlternatingStops(segs, cycle);
}

/** 左側にもストライプが乗るよう X を負の値寄りにランダム化 */
function whiteLayerOffsetX(rng: () => number): number {
  const u = rng();
  if (u < 0.52) {
    return -420 + Math.floor(rng() * 240);
  }
  if (u < 0.82) {
    return -180 + Math.floor(rng() * 220);
  }
  return -80 + Math.floor(rng() * 200);
}

function whiteLayerOffsetY(rng: () => number): number {
  return -90 + Math.floor(rng() * 180);
}

function repeatingLayer(angleDeg: number, stops: string, posX: number, posY: number): string {
  return `repeating-linear-gradient(${angleDeg}deg, ${stops}) ${posX}px ${posY}px`;
}

export function buildFrankenBackgrounds(seed: number, reds: RedBase): { hero: string; cta: string } {
  return {
    hero: buildHero(seed, reds),
    cta: buildCta(seed ^ 0xb5297a4d, reds),
  };
}

function buildHero(seed: number, reds: RedBase): string {
  const rng = mulberry32(seed);
  const cycleMain = 5400;
  const cycleBlackThin = 3160;
  /** 白だけ短い周期 → 狭いビューポートでもリピートが細かく入り白が消えにくい */
  const cycleWhite = 2080;

  const blackTotal = Math.floor(cycleMain * 0.092);
  const blackThinTotal = Math.floor(cycleBlackThin * 0.078);
  const whiteTotalRef = Math.floor(blackTotal * 5.2);
  const scaleW = cycleWhite / cycleMain;
  const perWhite = Math.floor((whiteTotalRef / 4) * scaleW * 1.22);

  const bRng1 = mulberry32(seed + 0xb001);
  const bRng2 = mulberry32(seed + 0xb002);
  const bRng3 = mulberry32(seed + 0xb003);
  const blackStopsA = buildPaintCycle(bRng1, cycleMain, "#000000", Math.floor(blackTotal / 2), 10, 64, 14, 240);
  const blackStopsB = buildPaintCycle(bRng2, cycleMain, "#000000", Math.ceil(blackTotal / 2), 9, 70, 16, 260);
  const blackStopsC = buildPaintCycle(bRng3, cycleBlackThin, "#000000", blackThinTotal, 3, 26, 6, 130, 2);

  const wRng1 = mulberry32(seed + 0xe001);
  const wRng2 = mulberry32(seed + 0xe002);
  const wRng3 = mulberry32(seed + 0xe003);
  const wRng4 = mulberry32(seed + 0xe004);
  /* 白は細め・二重シャッフルでランダム感・ギャップは短めで狭画面でも密度確保 */
  const whiteStopsA = buildPaintCycle(wRng1, cycleWhite, "#FFFFFF", perWhite, 4, 62, 5, 118, 3);
  const whiteStopsB = buildPaintCycle(wRng2, cycleWhite, "#FFFFFF", perWhite, 3, 58, 5, 125, 3);
  const whiteStopsC = buildPaintCycle(wRng3, cycleWhite, "#FFFFFF", perWhite, 4, 65, 6, 132, 3);
  const whiteStopsD = buildPaintCycle(wRng4, cycleWhite, "#FFFFFF", perWhite, 3, 60, 5, 128, 3);

  const angB1 = -44 + (rng() - 0.5) * 18;
  const angB2 = 38 + (rng() - 0.5) * 22;
  const angB3 = 132 + (rng() - 0.5) * 18;
  const angW1 = -40 + (rng() - 0.5) * 42;
  const angW2 = -5 + (rng() - 0.5) * 48;
  const angW3 = 28 + (rng() - 0.5) * 44;
  const angW4 = -18 + (rng() - 0.5) * 52;

  const layers = [
    repeatingLayer(angB1, blackStopsA, Math.floor(bRng1() * 120 - 60), -170 + Math.floor(bRng1() * 170)),
    repeatingLayer(angB2, blackStopsB, Math.floor(bRng2() * 120 - 60), -160 + Math.floor(bRng2() * 190)),
    repeatingLayer(angB3, blackStopsC, -280 + Math.floor(bRng3() * 330), -260 + Math.floor(bRng3() * 170)),
    repeatingLayer(angW1, whiteStopsA, whiteLayerOffsetX(wRng1), whiteLayerOffsetY(wRng1)),
    repeatingLayer(angW2, whiteStopsB, whiteLayerOffsetX(wRng2), whiteLayerOffsetY(wRng2)),
    repeatingLayer(angW3, whiteStopsC, whiteLayerOffsetX(wRng3), whiteLayerOffsetY(wRng3)),
    repeatingLayer(angW4, whiteStopsD, whiteLayerOffsetX(wRng4), whiteLayerOffsetY(wRng4)),
    `linear-gradient(148deg, ${reds.deep} 0%, ${reds.ground} 40%, ${reds.bright} 100%) 0 0`,
  ];
  return layers.join(", ");
}

function buildCta(seed: number, reds: RedBase): string {
  const rng = mulberry32(seed);
  const cycleMain = 4600;
  const cycleWhite = 1980;

  const blackTotal = Math.floor(cycleMain * 0.096);
  const whiteTotalRef = Math.floor(blackTotal * 5.2);
  const scaleW = cycleWhite / cycleMain;
  const perWhite = Math.floor((whiteTotalRef / 4) * scaleW * 1.22);

  const bRng1 = mulberry32(seed + 0xc101);
  const bRng2 = mulberry32(seed + 0xc102);
  const blackStopsA = buildPaintCycle(bRng1, cycleMain, "#000000", Math.floor(blackTotal / 2), 8, 58, 12, 220);
  const blackStopsB = buildPaintCycle(bRng2, cycleMain, "#000000", Math.ceil(blackTotal / 2), 7, 64, 14, 230);

  const wRng1 = mulberry32(seed + 0xd101);
  const wRng2 = mulberry32(seed + 0xd102);
  const wRng3 = mulberry32(seed + 0xd103);
  const wRng4 = mulberry32(seed + 0xd104);
  const whiteStopsA = buildPaintCycle(wRng1, cycleWhite, "#FFFFFF", perWhite, 4, 58, 5, 112, 3);
  const whiteStopsB = buildPaintCycle(wRng2, cycleWhite, "#FFFFFF", perWhite, 3, 56, 5, 118, 3);
  const whiteStopsC = buildPaintCycle(wRng3, cycleWhite, "#FFFFFF", perWhite, 4, 60, 5, 122, 3);
  const whiteStopsD = buildPaintCycle(wRng4, cycleWhite, "#FFFFFF", perWhite, 3, 55, 5, 115, 3);

  const angB1 = 41 + (rng() - 0.5) * 20;
  const angB2 = -36 + (rng() - 0.5) * 16;
  const angW1 = -35 + (rng() - 0.5) * 40;
  const angW2 = 8 + (rng() - 0.5) * 46;
  const angW3 = 42 + (rng() - 0.5) * 38;
  const angW4 = -12 + (rng() - 0.5) * 48;

  const layers = [
    repeatingLayer(angB1, blackStopsA, Math.floor(bRng1() * 110 - 55), Math.floor(bRng1() * 110 - 55)),
    repeatingLayer(angB2, blackStopsB, Math.floor(bRng2() * 110 - 55), Math.floor(bRng2() * 110 - 55)),
    repeatingLayer(angW1, whiteStopsA, whiteLayerOffsetX(wRng1), whiteLayerOffsetY(wRng1)),
    repeatingLayer(angW2, whiteStopsB, whiteLayerOffsetX(wRng2), whiteLayerOffsetY(wRng2)),
    repeatingLayer(angW3, whiteStopsC, whiteLayerOffsetX(wRng3), whiteLayerOffsetY(wRng3)),
    repeatingLayer(angW4, whiteStopsD, whiteLayerOffsetX(wRng4), whiteLayerOffsetY(wRng4)),
    `linear-gradient(168deg, ${reds.bright} 0%, ${reds.ground} 42%, ${reds.deep} 100%) 0 0`,
  ];
  return layers.join(", ");
}
