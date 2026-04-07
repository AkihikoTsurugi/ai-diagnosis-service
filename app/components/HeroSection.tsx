import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { HERO } from "@/app/lib/constants";
import CtaButton from "./common/CtaButton";

function splitCatchcopyAtComma(text: string): { head: string; tail: string } | null {
  const i = text.indexOf("、");
  if (i < 0) return null;
  return { head: text.slice(0, i + 1), tail: text.slice(i + 1) };
}

export default function HeroSection() {
  const catchParts = splitCatchcopyAtComma(HERO.catchcopy);

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FFFFFF",
        position: "relative",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center", py: { xs: 8, md: 0 }, position: "relative", zIndex: 1 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: "#202124",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
            lineHeight: 1.25,
            mb: { xs: 2, md: 3 },
            letterSpacing: { xs: "-0.02em", md: "-0.03em" },
            fontWeight: 700,
            /* 狭い画面では「、」の直後で改行（1行目が「…、」で終わる） */
            display: { xs: "flex", md: "block" },
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
          }}
        >
          {catchParts ? (
            <>
              <Box component="span">{catchParts.head}</Box>
              <Box component="span">{catchParts.tail}</Box>
            </>
          ) : (
            HERO.catchcopy
          )}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#5f6368",
            fontSize: { xs: "0.95rem", md: "1.15rem" },
            lineHeight: 1.8,
            maxWidth: 600,
            mx: "auto",
            mb: { xs: 4, md: 5 },
          }}
        >
          {HERO.subcopy}
        </Typography>

        <CtaButton label={HERO.ctaLabel} variant="hero" />

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(95, 99, 104, 0.85)",
            mt: 2.5,
            fontSize: "0.875rem",
            letterSpacing: "0.02em",
          }}
        >
          {HERO.note}
        </Typography>
      </Container>
    </Box>
  );
}
