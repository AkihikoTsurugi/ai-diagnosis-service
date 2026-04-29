"use client";

import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

type Variant = "hero" | "section";

interface CtaButtonProps {
  label: string;
  variant?: Variant;
}

export default function CtaButton({ label, variant: _variant = "hero" }: CtaButtonProps) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        size="large"
        disabled={navigating}
        onClick={() => {
          setNavigating(true);
          router.push("/diagnosis");
        }}
        sx={{
          px: { xs: 4, md: 5 },
          py: { xs: 1.5, md: 1.75 },
          fontSize: { xs: "1rem", md: "1.125rem" },
          borderRadius: "16px",
          fontWeight: 700,
          bgcolor: "#0A0A0A",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          "&:hover": {
            bgcolor: "#1E1E1E",
            transform: "scale(1.04)",
            borderColor: "rgba(255,255,255,0.28)",
            boxShadow: "0 6px 28px rgba(0,0,0,0.45)",
          },
          transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {label}
      </Button>
      <Backdrop
        open={navigating}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" />
          <Typography>診断ページへ移動中です…</Typography>
        </Stack>
      </Backdrop>
    </>
  );
}
