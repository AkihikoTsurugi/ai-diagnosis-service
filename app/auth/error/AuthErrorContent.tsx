"use client";

import Link from "next/link";
import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";

const MESSAGES: Record<
  string,
  { title: string; body: string }
> = {
  Configuration: {
    title: "サーバー設定の問題",
    body:
      "認証サーバー（AUTH_SECRET やデータベース接続など）の設定が不足しているか、正しくありません。Vercel の環境変数を確認し、本番用に再デプロイしてください。",
  },
  AccessDenied: {
    title: "アクセスが拒否されました",
    body: "このアカウントではサインインできません。",
  },
  Verification: {
    title: "サインインリンクが無効です",
    body: "リンクの有効期限が切れたか、すでに使用されています。",
  },
};

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? undefined;
  const key = error ?? "Default";
  const msg = MESSAGES[key] ?? {
    title: "サインインエラー",
    body: "サインイン中に問題が発生しました。もう一度お試しください。",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: 1 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">
              {msg.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {msg.body}
            </Typography>
            {key === "Configuration" && (
              <Typography variant="caption" color="text.secondary" component="p">
                参考:{" "}
                <MuiLink
                  href="https://errors.authjs.dev#configuration"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Auth.js — Configuration
                </MuiLink>
              </Typography>
            )}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button component={Link} href="/auth/signin" variant="contained">
                ログインへ戻る
              </Button>
              <Button component={Link} href="/" variant="outlined">
                トップへ
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
