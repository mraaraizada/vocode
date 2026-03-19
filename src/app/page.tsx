"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import HowItWorks from "@/components/HowItWorks";
import DemoPreview from "@/components/DemoPreview";
import Footer from "@/components/Footer";
import AppLoading from "@/components/AppLoading";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  // Prevent body scroll during loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      {loading && <AppLoading onDone={() => setLoading(false)} />}
      <main
        style={{
          minHeight: "100vh",
          background: "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(108,92,231,0.15) 0%, transparent 60%), #07060f",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        <Navbar />
        <HeroSection />
        <FeaturesGrid />
        <HowItWorks />
        <DemoPreview />
        <Footer />
      </main>
    </>
  );
}
