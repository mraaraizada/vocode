"use client";

import { motion } from "framer-motion";
import { Container } from "@/app/components/Container";
import { FeatureCard } from "@/app/components/FeatureCard";
import { 
  Mic, 
  Sparkles, 
  Palette, 
  Code2, 
  Zap, 
  Globe 
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice-First Design",
    description: "Simply describe your idea and watch VOCODE transform it into a beautiful, functional website.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Our advanced AI understands your vision and creates optimized layouts, content, and styling.",
  },
  {
    icon: Palette,
    title: "Smart Design System",
    description: "Automatically applies consistent design principles, color theory, and typography best practices.",
  },
  {
    icon: Code2,
    title: "Production-Ready Code",
    description: "Export clean, optimized React code with TypeScript, Tailwind CSS, and modern best practices.",
  },
  {
    icon: Zap,
    title: "Instant Iterations",
    description: "Make changes with natural language. 'Make it more modern' and see updates in real-time.",
  },
  {
    icon: Globe,
    title: "One-Click Deploy",
    description: "Deploy your site instantly to global edge networks with a single click.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Build</span>
          </h2>
          <p className="text-lg text-white/60 max-w-[600px] mx-auto">
            Powerful features that make website creation effortless
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
