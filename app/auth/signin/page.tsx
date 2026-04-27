"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import { signIn } from "next-auth/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function SignInPage() {
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
              ログイン
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Google または GitHub
              アカウントで会員エリア（ダッシュボード・プロフィール）にアクセスできます。
            </Typography>
            <Stack spacing={1.5}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() =>
                  signIn("google", { callbackUrl: "/dashboard" })
                }
              >
                Google でログイン
              </Button>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<GitHubIcon />}
                onClick={() =>
                  signIn("github", { callbackUrl: "/dashboard" })
                }
                sx={{
                  bgcolor: "#24292f",
                  "&:hover": { bgcolor: "#1b1f23" },
                }}
              >
                GitHub でログイン
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
