"use client";

import Box from "@mui/material/Box";
import CheapSynthIntro from "./CheapSynthIntro";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StepsSection from "./StepsSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

export default function HomePageContent() {
  return (
    <Box component="main">
      <CheapSynthIntro />
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <CtaSection />
      <Footer />
    </Box>
  );
}
