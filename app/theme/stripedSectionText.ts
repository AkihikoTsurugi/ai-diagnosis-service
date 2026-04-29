/**
 * 赤・白・黒が交差するストライプ背景の上でも読めるタイポ。
 * 文字ブロックはやや暗いガラスパネルで領域を区切る。
 */
export const textOnStripes = {
  /** メイン見出し */
  heading: {
    color: "#FFFFFF",
    textShadow:
      "0 0 2px #000000, 0 0 4px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.9), 0 4px 28px rgba(0,0,0,0.45)",
  },
  /** リード文 */
  body: {
    color: "rgba(255,255,255,0.94)",
    textShadow:
      "0 0 2px rgba(0,0,0,0.95), 0 1px 5px rgba(0,0,0,0.85), 0 3px 18px rgba(0,0,0,0.35)",
  },
  /** 注釈 */
  caption: {
    color: "rgba(255,255,255,0.82)",
    textShadow: "0 0 2px rgba(0,0,0,0.92), 0 1px 4px rgba(0,0,0,0.75)",
  },
} as const;

/** ストライプの上でコントラストを確保するダークガラスパネル */
export const stripedContentPanelSx = {
  px: { xs: 2.5, md: 4 },
  py: { xs: 3, md: 4 },
  borderRadius: 3,
  bgcolor: "rgba(10, 6, 8, 0.42)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 48px rgba(0,0,0,0.35)",
} as const;
