"use client";

import { motion } from "framer-motion";
import { Container } from "@/app/components/Container";
import { TimelineStep } from "@/app/components/TimelineStep";
import { 
  Mic, 
  Brain, 
  Layout, 
  Pencil, 
  Download 
} from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Speak Your Idea",
    description: "Describe your website idea in natural language. No templates, no drag-and-drop.",
  },
  {
    icon: Brain,
    title: "AI Structures Concept",
    description: "Our AI analyzes your input and creates a structured plan with layout, content, and design.",
  },
  {
    icon: Layout,
    title: "Choose Design Plan",
    description: "Select from multiple AI-generated design directions that match your vision.",
  },
  {
    icon: Pencil,
    title: "Edit Naturally",
    description: "Refine your site with simple commands like 'make it darker' or 'add testimonials'.",
  },
  {
    icon: Download,
    title: "Export Code",
    description: "Get production-ready React code with TypeScript, Tailwind, and best practices.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Sticky header */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-medium text-[#6C5CE7] mb-4 block">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                From Voice to{" "}
                <span className="gradient-text">Website</span>
              </h2>
              <p className="text-lg text-white/60 max-w-[400px]">
                A seamless workflow powered by AI. Describe, design, refine, and deploy in minutes.
              </p>
            </motion.div>
          </div>

          {/* Right - Timeline */}
          <div className="relative">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.title}
                icon={step.icon}
                title={step.title}
                description={step.description}
                step={index}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
