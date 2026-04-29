"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardContent({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  return (
    <Box sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h4" component="h1">
              ダッシュボード
            </Typography>
            <Typography variant="body2" color="text.secondary">
              会員専用のトップページです。
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={user.image ?? undefined}
                alt={user.name ?? ""}
                sx={{ width: 56, height: 56 }}
              />
              <div>
                <Typography variant="h6">
                  {user.name ?? "名前未設定"}
                </Typography>
                {user.email ? (
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                ) : null}
              </div>
            </Stack>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button component={Link} href="/profile" variant="contained">
                プロフィール
              </Button>
              <Button component={Link} href="/diagnosis" variant="contained">
                AIキャリア診断
              </Button>
              <Button component={Link} href="/diagnosis/history" variant="outlined">
                診断履歴
              </Button>
              <Button component={Link} href="/" variant="outlined">
                トップへ
              </Button>
              <Button
                variant="text"
                color="inherit"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                ログアウト
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
