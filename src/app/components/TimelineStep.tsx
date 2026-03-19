"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TimelineStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step: number;
  isLast?: boolean;
}

export function TimelineStep({ icon: Icon, title, description, step, isLast }: TimelineStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      className="relative flex items-start gap-4"
    >
      {/* Connection line */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: step * 0.1 + 0.2 }}
          className="absolute left-6 top-14 w-0.5 h-[calc(100%-3rem)] origin-top"
          style={{
            background: "linear-gradient(180deg, rgba(108, 92, 231, 0.5) 0%, rgba(0, 212, 255, 0.2) 100%)"
          }}
        />
      )}

      {/* Step number/icon */}
      <div className="relative z-10 flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-xl glass flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
      </div>

      {/* Content card */}
      <div className="flex-1 pb-8">
        <div className="glass rounded-[20px] p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium text-[#6C5CE7] bg-[#6C5CE7]/10 px-2 py-0.5 rounded-full">
              Step {step + 1}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/60">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
