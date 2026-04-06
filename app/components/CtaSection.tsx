import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BOTTOM_CTA } from "@/app/lib/constants";
import CtaButton from "./common/CtaButton";

export default function CtaSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        background: "linear-gradient(135deg, #1565C0 0%, #1A237E 100%)",
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: "#fff",
            fontSize: { xs: "1.5rem", md: "2rem" },
            mb: { xs: 3, md: 4 },
            lineHeight: 1.4,
          }}
        >
          {BOTTOM_CTA.heading}
        </Typography>

        <CtaButton label={BOTTOM_CTA.ctaLabel} variant="section" />

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(255,255,255,0.6)",
            mt: 2.5,
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
          }}
        >
          {BOTTOM_CTA.note}
        </Typography>
      </Container>
    </Box>
  );
}
