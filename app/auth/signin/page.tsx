"use client";

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
              Google アカウントで会員エリア（ダッシュボード・プロフィール）にアクセスできます。
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() =>
                signIn("google", { callbackUrl: "/dashboard" })
              }
            >
              Google でログイン
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
