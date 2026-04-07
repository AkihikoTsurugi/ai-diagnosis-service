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

export default function CtaButton({ label, variant: _variant = "hero" }: CtaButtonProps) {
  const [open, setOpen] = useState(false);

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
          borderRadius: 9999,
          fontWeight: 600,
          bgcolor: "#1a73e8",
          color: "#fff",
          boxShadow: "none",
          "&:hover": {
            bgcolor: "#1557b0",
            boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)",
          },
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
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
