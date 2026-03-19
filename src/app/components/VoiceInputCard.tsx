"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, ArrowRight } from "lucide-react";

export function VoiceInputCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [textInput, setTextInput] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-[600px] mx-auto"
    >
      <div
        className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-xl shadow-indigo-500/5 border border-white/60"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated gradient ring on hover */}
        <motion.div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 2px rgba(99, 102, 241, 0.3), 0 20px 60px rgba(99, 102, 241, 0.15)"
              : "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 10px 40px rgba(99, 102, 241, 0.08)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Mic Button */}
          <motion.button
            className="relative w-[100px] h-[100px] rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: isHovered
                  ? "0 0 40px rgba(99, 102, 241, 0.4), 0 0 80px rgba(139, 92, 246, 0.2)"
                  : "0 0 20px rgba(99, 102, 241, 0.2)",
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Gradient background */}
            <div className="absolute inset-0 rounded-full soft-btn" />

            {/* Inner circle */}
            <div className="absolute inset-[3px] rounded-full bg-white flex items-center justify-center">
              <Mic className="w-8 h-8 text-[#6366f1]" />
            </div>

            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#6366f1]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.button>

          {/* Text Input Fallback */}
          <div className="w-full">
            <input
              type="text"
              placeholder="Or type your idea here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#6C5CE7]/50 focus:bg-white/10 transition-all duration-200"
            />
          </div>

          {/* CTA Button */}
          <motion.button
            className="w-full py-4 rounded-full text-white font-medium gradient-btn flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start with Voice
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
