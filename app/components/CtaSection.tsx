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
        bgcolor: "#FFFFFF",
        borderTop: "1px solid #e8eaed",
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: "#202124",
            fontSize: { xs: "1.5rem", md: "2rem" },
            mb: { xs: 3, md: 4 },
            lineHeight: 1.35,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {BOTTOM_CTA.heading}
        </Typography>

        <CtaButton label={BOTTOM_CTA.ctaLabel} variant="section" />

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#5f6368",
            mt: 2.5,
            fontSize: "0.875rem",
            letterSpacing: "0.02em",
          }}
        >
          {BOTTOM_CTA.note}
        </Typography>
      </Container>
    </Box>
  );
}
