"use client";

import Box from "@mui/material/Box";
import { LP_BGM_ENABLED } from "@/app/lib/constants";
import CheapSynthIntro from "./CheapSynthIntro";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StepsSection from "./StepsSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

export default function HomePageContent() {
  return (
    <Box component="main">
      {LP_BGM_ENABLED ? <CheapSynthIntro /> : null}
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <CtaSection />
      <Footer />
    </Box>
  );
}
