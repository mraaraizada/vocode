"use client";

import { motion } from "framer-motion";
import { Container } from "@/app/components/Container";
import { VoiceInputCard } from "@/app/components/VoiceInputCard";
import { FloatingObjects } from "@/app/components/3d/FloatingObjects";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-[72px] overflow-hidden">
      {/* 3D Background */}
      <FloatingObjects />

      {/* Content */}
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a2e] leading-tight tracking-tight"
          >
            Turn Your Ideas Into a{" "}
            <span className="gradient-text-vivid">Website</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-gray-500 max-w-[600px]"
          >
            Describe your idea. VOCODE designs, builds, and exports
            production-ready code instantly.
          </motion.p>

          {/* Voice Input Card */}
          <div className="mt-12 w-full">
            <VoiceInputCard />
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex items-center gap-8 text-white/40 text-sm"
          >
            <span>No credit card required</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>Free to start</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>Export anytime</span>
          </motion.div>
        </div>
      </Container>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
}
