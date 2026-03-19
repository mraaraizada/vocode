"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { cn } from "@/app/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

export function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300",
        scrolled
          ? "glass border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <Container className="h-full">
        <nav className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.a
            href="/"
            className="text-xl font-bold text-white tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            VOCODE
          </motion.a>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                whileHover={{ y: -1 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <motion.a
              href="#login"
              className="hidden sm:block text-sm text-white/70 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
            >
              Login
            </motion.a>
            <motion.button
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white gradient-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Building
            </motion.button>
          </div>
        </nav>
      </Container>
    </motion.header>
  );
}
