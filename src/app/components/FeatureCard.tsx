"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className="glass rounded-[24px] p-8 h-full transition-all duration-300 group-hover:border-white/20">
        {/* Glow border on hover */}
        <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(108, 92, 231, 0.3), 0 0 30px rgba(108, 92, 231, 0.1)"
          }}
        />

        {/* Icon */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C5CE7]/20 to-[#00D4FF]/20 flex items-center justify-center mb-6">
          <Icon className="w-7 h-7 text-white" />
          
          {/* Icon glow */}
          <div className="absolute inset-0 rounded-2xl bg-[#6C5CE7] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
