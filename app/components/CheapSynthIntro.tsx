"use client";

import { useEffect, useRef } from "react";

/** 132 BPM */
const BPM = 132;
const QUARTER_SEC = 60 / BPM;
const SIXTEENTH_SEC = QUARTER_SEC / 4;
/** M9〜12: 1小節24分割（16分3連符グループのリピート） */
const TRIPLET_CELL_SEC = (4 * QUARTER_SEC) / 24;

const STRING_OPEN_HZ: Record<1 | 2 | 3 | 4 | 5 | 6, number> = {
  6: 82.406889,
  5: 110.0,
  4: 146.832383,
  3: 195.997718,
  2: 246.941651,
  1: 329.627557,
};

function hzStringFret(str: 1 | 2 | 3 | 4 | 5 | 6, fret: number): number {
  return STRING_OPEN_HZ[str] * 2 ** (fret / 12);
}

const HIGH_E_HZ = STRING_OPEN_HZ[1];

function fretToHzHighE(fret: number): number {
  return HIGH_E_HZ * 2 ** (fret / 12);
}

/** カポ3: タブ数字はカポからの押さえ → 実フレット = 3 + タブ */
function capoFret(tabFromCapo: number): number {
  return 3 + tabFromCapo;
}

const TAB_MEASURES_1_8: (number | "r")[][] = [
  ["r", 15, 12, 8, 15, 12, 8, 17, 13, 8, 17, 13, 8, 15, 12, 8],
  [15, 12, 8, 15, 12, 8, 13, 10, 6, 13, 10, 6, 13, 10, 6, "r"],
  ["r", 15, 12, 8, 15, 12, 8, 17, 13, 8, 17, 13, 8, 15, 12, 8],
  [15, 12, 8, 15, 12, 8, 13, 10, 6, 13, 10, 6, 13, 10, 6, "r"],
  ["r", 12, 8, 6, 12, 8, 6, 13, 10, 6, 15, 8, 6, 13, 10, 6],
  [15, 8, 6, 13, 10, 6, 13, 10, 6, 12, 8, 6, 12, 8, 6, "r"],
  ["r", 10, 8, 6, 10, 8, 6, 12, 8, 6, 10, 8, 6, 12, 8, 6],
  [13, 10, 6, 15, 12, 8, 13, 10, 6, 15, 12, 8, 13, 10, 6, "r"],
];

type SixteenthEv = { kind: "rest" } | { kind: "note"; hz: number };

function buildSixteenthEvents_1_8(): SixteenthEv[] {
  const out: SixteenthEv[] = [];
  for (const bar of TAB_MEASURES_1_8) {
    for (const cell of bar) {
      out.push(cell === "r" ? { kind: "rest" } : { kind: "note", hz: fretToHzHighE(cell) });
    }
  }
  return out;
}

const EVENTS_1_8 = buildSixteenthEvents_1_8();

/** 譜面続き M9〜10（1弦・カポなし） */
function patternM9_10(): number[] {
  const m9: number[] = [];
  const cell9 = [8, 13, 15, 20, 15, 13];
  for (let i = 0; i < 4; i++) m9.push(...cell9);
  const m10: number[] = [];
  const cell10 = [20, 15, 13, 8, 13, 15];
  for (let i = 0; i < 4; i++) m10.push(...cell10);
  return [...m9, ...m10];
}

/** M11〜12（1弦・カポ3・タブはカポ相対） */
function patternM11_12(): number[] {
  const m11: number[] = [];
  const rel11 = [3, 8, 10, 15, 10, 8];
  for (let i = 0; i < 4; i++) {
    for (const t of rel11) m11.push(capoFret(t));
  }
  const m12: number[] = [];
  const rel12 = [15, 10, 8, 3, 8, 10];
  for (let i = 0; i < 4; i++) {
    for (const t of rel12) m12.push(capoFret(t));
  }
  return [...m11, ...m12];
}

type Tick = {
  advance: number;
  mono?: { hz: number; dur: number };
  chord?: { hz: number[]; dur: number };
};

function buildTicks(): Tick[] {
  const ticks: Tick[] = [];

  for (const ev of EVENTS_1_8) {
    const adv = SIXTEENTH_SEC;
    if (ev.kind === "rest") {
      ticks.push({ advance: adv });
    } else {
      ticks.push({
        advance: adv,
        mono: { hz: ev.hz, dur: adv * 0.94 },
      });
    }
  }

  const fastMono = [...patternM9_10(), ...patternM11_12()];
  const cell = TRIPLET_CELL_SEC;
  for (const fret of fastMono) {
    ticks.push({
      advance: cell,
      mono: { hz: fretToHzHighE(fret), dur: cell * 0.92 },
    });
  }

  const Q = QUARTER_SEC;
  const bass3 = hzStringFret(6, 3);

  ticks.push({
    advance: Q,
    chord: {
      hz: [bass3, hzStringFret(4, 10), hzStringFret(3, 12), hzStringFret(2, 12)],
      dur: Q * 0.96,
    },
  });
  ticks.push({
    advance: Q,
    chord: {
      hz: [bass3, hzStringFret(4, 12), hzStringFret(3, 12), hzStringFret(2, 13)],
      dur: Q * 0.96,
    },
  });
  ticks.push({
    advance: 2 * Q,
    chord: {
      hz: [bass3, hzStringFret(4, 10), hzStringFret(3, 12), hzStringFret(2, 12)],
      dur: 2 * Q * 0.97,
    },
  });

  ticks.push({
    advance: Q,
    chord: {
      hz: [bass3, hzStringFret(4, 8), hzStringFret(3, 10), hzStringFret(2, 10)],
      dur: Q * 0.96,
    },
  });
  ticks.push({
    advance: Q,
    chord: {
      hz: [bass3, hzStringFret(4, 8), hzStringFret(3, 10), hzStringFret(2, 10)],
      dur: Q * 0.96,
    },
  });
  ticks.push({
    advance: Q,
    chord: {
      hz: [bass3, hzStringFret(4, 10), hzStringFret(3, 12), hzStringFret(2, 12)],
      dur: Q * 0.96,
    },
  });
  ticks.push({
    advance: Q,
    chord: {
      hz: [bass3, hzStringFret(4, 10), hzStringFret(3, 12), hzStringFret(2, 12)],
      dur: Q * 0.96,
    },
  });

  ticks.push({
    advance: Q,
    chord: {
      hz: [bass3, hzStringFret(4, 10), hzStringFret(3, 12), hzStringFret(2, 12)],
      dur: Q * 0.96,
    },
  });
  ticks.push({
    advance: Q,
    chord: {
      hz: [bass3, hzStringFret(4, 8), hzStringFret(3, 10), hzStringFret(2, 10)],
      dur: Q * 0.96,
    },
  });
  ticks.push({
    advance: 2 * Q,
    chord: {
      hz: [
        hzStringFret(4, 5),
        hzStringFret(3, 5),
        hzStringFret(2, 6),
        hzStringFret(1, 8),
      ],
      dur: 2 * Q * 0.97,
    },
  });

  ticks.push({
    advance: 2 * Q,
    chord: {
      hz: [hzStringFret(4, 5), hzStringFret(3, 5), hzStringFret(2, 3)],
      dur: 2 * Q * 0.97,
    },
  });
  ticks.push({
    advance: 2 * Q,
    chord: {
      hz: [hzStringFret(4, 3), hzStringFret(3, 3), hzStringFret(2, 3), hzStringFret(1, 5)],
      dur: 2 * Q * 0.97,
    },
  });

  return ticks;
}

const TICKS: Tick[] = buildTicks();

function scheduleMono(
  ctx: AudioContext,
  t: number,
  hz: number,
  dur: number,
  master: GainNode,
  vel: number
): void {
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  o1.type = "square";
  o2.type = "square";
  const detune = 1.038;
  o1.frequency.setValueAtTime(hz, t);
  o2.frequency.setValueAtTime(hz * detune, t);

  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.48 * vel, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.06 * vel, t + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  o1.connect(g);
  o2.connect(g);
  g.connect(master);

  o1.start(t);
  o2.start(t);
  o1.stop(t + dur + 0.02);
  o2.stop(t + dur + 0.02);
}

function scheduleChord(ctx: AudioContext, t: number, hzList: number[], dur: number, master: GainNode, vel: number): void {
  const n = hzList.length;
  const per = vel / Math.sqrt(n);

  for (const hz of hzList) {
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.type = "square";
    o2.type = "square";
    const detune = 1.025;
    o1.frequency.setValueAtTime(hz, t);
    o2.frequency.setValueAtTime(hz * detune, t);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.42 * per, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.1 * per, t + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    o1.connect(g);
    o2.connect(g);
    g.connect(master);

    o1.start(t);
    o2.start(t);
    o1.stop(t + dur + 0.03);
    o2.stop(t + dur + 0.03);
  }
}

function playCheapSynthPattern(ctx: AudioContext): void {
  const master = ctx.createGain();
  master.gain.value = 0.1;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 3200;
  lp.Q.value = 0.85;
  master.connect(lp);
  lp.connect(ctx.destination);

  let t = ctx.currentTime + 0.03;
  for (const tick of TICKS) {
    if (tick.mono) {
      scheduleMono(ctx, t, tick.mono.hz, tick.mono.dur, master, 1);
    }
    if (tick.chord) {
      scheduleChord(ctx, t, tick.chord.hz, tick.chord.dur, master, 1.05);
    }
    t += tick.advance;
  }
}

let sharedCtx: AudioContext | null = null;

function getOrCreateContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (sharedCtx && sharedCtx.state !== "closed") {
    return sharedCtx;
  }
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  sharedCtx = new AC();
  return sharedCtx;
}

export default function CheapSynthIntro() {
  const playedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const tryPlay = () => {
      if (playedRef.current) return;
      const ctx = getOrCreateContext();
      if (!ctx) return;

      void ctx.resume().then(() => {
        if (playedRef.current) return;
        if (ctx.state !== "running") return;
        playedRef.current = true;
        playCheapSynthPattern(ctx);
      });
    };

    tryPlay();

    const retryMs = [30, 80, 200, 500, 1200, 2200, 4000];
    const timers = retryMs.map((ms) => window.setTimeout(tryPlay, ms));

    const onFirstInteract = () => {
      tryPlay();
    };

    const onLoad = () => tryPlay();
    const onPageShow = () => tryPlay();
    const onFocus = () => tryPlay();
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    const onReadyState = () => {
      if (document.readyState === "complete") tryPlay();
    };

    window.addEventListener("load", onLoad);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("readystatechange", onReadyState);
    if (document.readyState === "complete") tryPlay();

    const pollId = window.setInterval(tryPlay, 100);
    const pollStop = window.setTimeout(() => window.clearInterval(pollId), 7000);

    window.addEventListener("pointerdown", onFirstInteract, { capture: true, passive: true });
    window.addEventListener("keydown", onFirstInteract, { capture: true, passive: true });
    window.addEventListener("touchstart", onFirstInteract, { capture: true, passive: true });
    document.addEventListener("click", onFirstInteract, { capture: true, passive: true });

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.clearInterval(pollId);
      window.clearTimeout(pollStop);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("readystatechange", onReadyState);
      window.removeEventListener("pointerdown", onFirstInteract, true);
      window.removeEventListener("keydown", onFirstInteract, true);
      window.removeEventListener("touchstart", onFirstInteract, true);
      document.removeEventListener("click", onFirstInteract, true);
    };
  }, []);

  return null;
}
