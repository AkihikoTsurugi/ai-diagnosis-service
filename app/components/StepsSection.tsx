import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MapIcon from "@mui/icons-material/Map";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { STEPS } from "@/app/lib/constants";
import SectionTitle from "./common/SectionTitle";

const iconMap = {
  QuizOutlined: QuizOutlinedIcon,
  Psychology: PsychologyIcon,
  Map: MapIcon,
} as const;

export default function StepsSection() {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F3F1F0" }}
    >
      <Container maxWidth="lg">
        <SectionTitle title="かんたん3ステップ" />

        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {STEPS.map((step, index) => {
            const Icon = iconMap[step.icon];
            return (
              <Grid size={{ xs: 12, md: "auto" }} key={step.title}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* Arrow connector (before items 2 and 3, md only) */}
                  {index > 0 && (
                    <Box
                      sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        mx: 2,
                      }}
                    >
                      <ArrowForwardIcon
                        sx={{ fontSize: 32, color: "primary.light", opacity: 0.6 }}
                      />
                    </Box>
                  )}

                  <Box
                    sx={{
                      textAlign: "center",
                      px: { xs: 2, md: 4 },
                      py: { xs: 3, md: 4 },
                      maxWidth: 280,
                      mx: "auto",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 2.5,
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          zIndex: 1,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          bgcolor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Icon sx={{ fontSize: 36, color: "primary.main" }} />
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ mb: 1, fontSize: { xs: "1.05rem", md: "1.15rem" } }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8 }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
