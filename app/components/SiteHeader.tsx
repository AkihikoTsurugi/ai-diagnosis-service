"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SITE_NAME } from "@/app/lib/constants";

export default function SiteHeader() {
  const { status } = useSession();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          gap: 1,
          flexWrap: "wrap",
          py: 1,
          minHeight: { xs: 52, sm: 56 },
        }}
      >
        <Typography
          variant="subtitle1"
          component={Link}
          href="/"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            textDecoration: "none",
            mr: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: "auto" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {SITE_NAME}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: { xs: "center", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {status === "authenticated" ? (
            <>
              <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                size="small"
              >
                ダッシュボード
              </Button>
              <Button
                component={Link}
                href="/profile"
                variant="outlined"
                size="small"
              >
                プロフィール
              </Button>
            </>
          ) : status === "unauthenticated" ? (
            <Button
              component={Link}
              href="/auth/signin"
              variant="contained"
              size="small"
            >
              ログイン
            </Button>
          ) : (
            <Button size="small" disabled>
              読み込み中…
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
