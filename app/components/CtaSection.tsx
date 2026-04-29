import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BOTTOM_CTA } from "@/app/lib/constants";
import { lpBackgroundFallback, lpBackgrounds } from "@/app/theme/brandPalette";
import { stripedContentPanelSx, textOnStripes } from "@/app/theme/stripedSectionText";
import CtaButton from "./common/CtaButton";

export default function CtaSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        background: lpBackgrounds.cta,
        backgroundColor: lpBackgroundFallback.cta,
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={stripedContentPanelSx}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              ...textOnStripes.heading,
              fontSize: { xs: "1.5rem", md: "2rem" },
              mb: { xs: 3, md: 4 },
              lineHeight: 1.4,
              fontWeight: 800,
            }}
          >
            {BOTTOM_CTA.heading}
          </Typography>

          <CtaButton label={BOTTOM_CTA.ctaLabel} variant="section" />

          <Typography
            variant="caption"
            sx={{
              ...textOnStripes.caption,
              display: "block",
              mt: 2.5,
              fontSize: "0.875rem",
              letterSpacing: "0.05em",
            }}
          >
            {BOTTOM_CTA.note}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
