/**
 * Frankenstrat（EVH ストライプ）バッグ風カラーリング
 * - 鮮やかな赤ベースに、白ライン（多・交差）＋黒ライン（太め・強調）を重ねる
 * - 背景レイヤー順（手前→奥）: 黒×2 → 白×3 → 赤（frankenStripeGenerator.ts）
 */
import { buildFrankenBackgrounds } from "./frankenStripeGenerator";

export const brandPalette = {
  /** ストラト赤ベース */
  redGround: "#D6121C",
  redDeep: "#8F0A12",
  redBright: "#F01828",
  redLight: "#FF5A62",
  white: "#FFFFFF",
  black: "#000000",
  /** MUI primary（ヴァーミリオン赤） */
  primaryMain: "#E01826",
  primaryDark: "#B0101C",
  primaryLight: "#FF6B72",
  /** 互換 */
  redVermillion: "#E01826",
} as const;

const FRANKEN_SEED = 0x4652414e; // "FRAN"

export const lpBackgrounds = buildFrankenBackgrounds(FRANKEN_SEED, {
  deep: brandPalette.redDeep,
  ground: brandPalette.redGround,
  bright: brandPalette.redBright,
});

export const lpBackgroundFallback = {
  hero: brandPalette.redDeep,
  cta: brandPalette.redDeep,
} as const;

const { white, redLight } = brandPalette;

/** 特徴カードアイコン周り */
export const sectionAccentStripes = {
  featuresIcon: `linear-gradient(145deg, rgba(224,24,38,0.12) 0%, ${white} 65%, ${redLight} 100%)`,
} as const;
