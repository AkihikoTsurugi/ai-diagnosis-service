# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# Lint
npm run lint
```

テスト環境は未構築。

## 環境変数

`.env.local` に以下が必要:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
MONGODB_URI=
MONGODB_DB=          # 省略可（省略時は接続文字列のデフォルトDB使用）
```

## アーキテクチャ概要

**SurvibeAI** は Next.js 16 App Router + MUI + MongoDB で構築された AIキャリア診断サービスの LP + 会員基盤。

### 認証（NextAuth v5 beta）の二重構成

NextAuth を **2つのインスタンス** に分けている。これは Next.js middleware がEdge Runtimeで動作するため MongoDB Adapter を使えないことへの対処:

| ファイル | 用途 | Adapter |
|---------|------|---------|
| `auth.config.ts` | 共通設定（JWT戦略・コールバック・保護ルート） | なし（Edge対応） |
| `auth.ts` | ルートハンドラ用（フルNextAuth） | MongoDBAdapter あり |
| `proxy.ts` | ミドルウェア（`auth.config.ts` のみ使用） | なし |

`proxy.ts` は Next.js 16 の middleware 非推奨対応のため proxy という名前で配置。`next.config.ts` で `middleware` として認識される。

### ページ構成

- `/` — LP（HeroSection → FeaturesSection → StepsSection → CtaSection → Footer）
- `/auth/signin` — Googleログインページ
- `/auth/error` — NextAuth エラーページ
- `/dashboard` — 認証必須のダッシュボード
- `/profile` — 認証必須のプロフィール編集

### 保護ルート

`proxy.ts` の matcher で `/dashboard/:path*` と `/profile/:path*` を保護。未認証時は `/auth/signin` にリダイレクト。

### API

- `GET/PUT /api/user/profile` — ユーザープロフィールの取得・更新（認証必須）。`createdAt`/`updatedAt` フィールドを自動補完する。

### UI・スタイリング

- MUI v7 + Emotion。カスタムテーマは `app/theme/theme.ts`。
- `app/theme/ThemeRegistry.tsx` でサーバーサイドの Emotion キャッシュを設定（MUI SSR 対応）。
- フォントは Noto Sans JP（日本語）+ Inter（英数字）を `next/font` で読み込み。
- LPのテキスト・定数は `app/lib/constants.ts` に集約。コンポーネントに文字列を直接書かない。

### MongoDB

`lib/mongodb.ts` でクライアントを管理。開発環境ではグローバル変数でホットリロード時の接続再生成を防ぐ。

## 開発上の注意

- **CTAボタン**は現在 Stage1（Coming Soon の Snackbar 表示）。Stage2 で診断ページへの遷移に変更予定。
- `next-auth.d.ts`（`types/` 配下）で Session に `id` フィールドを拡張している。`session.user.id` は NextAuth のデフォルト型には存在しないため必須。
- `app/layout.tsx` の `<body suppressHydrationWarning>` はブラウザ拡張が属性を注入する際の hydration mismatch を許容するため意図的に設定している。
