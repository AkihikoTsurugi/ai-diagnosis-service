import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TimerIcon from "@mui/icons-material/Timer";
import BalanceIcon from "@mui/icons-material/Balance";
import { FEATURES } from "@/app/lib/constants";
import { sectionAccentStripes } from "@/app/theme/brandPalette";
import SectionTitle from "./common/SectionTitle";

const iconMap = {
  AutoAwesome: AutoAwesomeIcon,
  Timer: TimerIcon,
  Balance: BalanceIcon,
} as const;

export default function FeaturesSection() {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}
    >
      <Container maxWidth="lg">
        <SectionTitle title="SurvibeAIの特徴" />

        <Grid container spacing={4} justifyContent="center">
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: { xs: 2, md: 3 },
                    border: "1px solid",
                    borderColor: "grey.100",
                    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        background: sectionAccentStripes.featuresIcon,
                        border: "1px solid",
                        borderColor: "rgba(196, 30, 42, 0.22)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)",
                      }}
                    >
                      <Icon sx={{ fontSize: 36, color: "primary.main" }} />
                    </Box>

                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ mb: 1.5, fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
