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
        position: "relative",
        py: 3,
        pt: 3.5,
        bgcolor: "#0C0C0C",
        textAlign: "center",
        /* ストライプバッグの縁取り：細い赤・白・黒のリピート */
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background:
            "repeating-linear-gradient(90deg, #E01826 0px 18px, #FFFFFF 18px 30px, #000000 30px 44px, #E01826 44px 62px, #FFFFFF 62px 74px)",
        },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}
        >
          &copy; {year} {SITE_NAME}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
