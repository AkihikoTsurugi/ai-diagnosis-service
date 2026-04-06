import Box from "@mui/material/Box";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import StepsSection from "./components/StepsSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <Box component="main">
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <CtaSection />
      <Footer />
    </Box>
  );
}
