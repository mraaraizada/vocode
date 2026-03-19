"use client";

import { motion } from "framer-motion";
import { Container } from "@/app/components/Container";
import { BrowserMockup } from "@/app/components/BrowserMockup";

export function DemoPreviewSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6C5CE7]/10 rounded-full blur-[150px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#6C5CE7] mb-4 block">
            Live Preview
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            See It Come to{" "}
            <span className="gradient-text">Life</span>
          </h2>
          <p className="text-lg text-white/60 max-w-[600px] mx-auto">
            Watch your website take shape in real-time. Toggle between visual preview and clean, exportable code.
          </p>
        </motion.div>

        {/* Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <BrowserMockup />
        </motion.div>
      </Container>
    </section>
  );
}
