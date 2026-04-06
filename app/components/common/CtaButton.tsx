"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { COMING_SOON_MESSAGE } from "@/app/lib/constants";

type Variant = "hero" | "section";

interface CtaButtonProps {
  label: string;
  variant?: Variant;
}

export default function CtaButton({ label, variant = "hero" }: CtaButtonProps) {
  const [open, setOpen] = useState(false);

  const isHero = variant === "hero";

  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={() => setOpen(true)}
        sx={{
          px: { xs: 4, md: 5 },
          py: { xs: 1.5, md: 1.75 },
          fontSize: { xs: "1rem", md: "1.125rem" },
          borderRadius: "16px",
          fontWeight: 700,
          ...(isHero
            ? {
                bgcolor: "#fff",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.92)",
                  transform: "scale(1.04)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                },
              }
            : {
                bgcolor: "#fff",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.92)",
                  transform: "scale(1.04)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                },
              }),
          transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {label}
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={COMING_SOON_MESSAGE}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
