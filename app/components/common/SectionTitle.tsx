import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontSize: { xs: "1.75rem", md: "2.25rem" },
          mb: 1,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
      <Box
        sx={{
          width: 60,
          height: 4,
          bgcolor: "primary.main",
          borderRadius: 2,
          mx: "auto",
          mt: 2,
        }}
      />
    </Box>
  );
}
