import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { SITE_NAME } from "@/app/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        bgcolor: "#1A1A2E",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}
        >
          &copy; {year} {SITE_NAME}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
