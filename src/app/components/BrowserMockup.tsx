"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";

export function BrowserMockup() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const codeSnippet = `<HeroSection>
  <Container>
    <h1 className="text-4xl font-bold">
      Turn Ideas Into Reality
    </h1>
    <p className="mt-4 text-lg text-gray-600">
      AI-powered website builder
    </p>
    <Button className="mt-6">
      Get Started
    </Button>
  </Container>
</HeroSection>`;

  return (
    <div className="glass rounded-[20px] overflow-hidden">
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
        {/* Window Controls */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 mx-4">
          <div className="glass rounded-lg px-4 py-1.5 text-xs text-white/40 text-center">
            vocode.ai/builder
          </div>
        </div>

        {/* Toggle */}
        <div className="flex gap-1 p-1 rounded-lg bg-white/5">
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-all duration-200",
              activeTab === "preview"
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60"
            )}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-all duration-200",
              activeTab === "code"
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60"
            )}
          >
            Code
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative h-[400px] bg-[#0a0a0f]">
        <AnimatePresence mode="wait">
          {activeTab === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-8 flex items-center justify-center"
            >
              {/* Mock Website Preview */}
              <div className="w-full max-w-md text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#00D4FF]" />
                <div className="h-8 w-3/4 mx-auto mb-4 rounded-lg bg-white/10" />
                <div className="h-4 w-1/2 mx-auto mb-8 rounded-lg bg-white/5" />
                <div className="h-10 w-40 mx-auto rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF]" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-6 overflow-auto"
            >
              <pre className="text-sm font-mono leading-relaxed">
                <code className="text-white/80">
                  {codeSnippet.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-white/20 select-none">
                        {i + 1}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(line),
                        }}
                      />
                    </div>
                  ))}
                </code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow frame */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 60px rgba(108, 92, 231, 0.1)",
          }}
        />
      </div>
    </div>
  );
}

function highlightCode(line: string): string {
  // Simple syntax highlighting
  return line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /(&lt;\/?)(\w+)/g,
      '<span class="text-[#ff79c6]">$1$2</span>'
    )
    .replace(
      /(\s)(className|onClick)(=)/g,
      '<span class="text-[#8be9fd]">$1$2</span>$3'
    )
    .replace(
      /"([^"]*)"/g,
      '<span class="text-[#f1fa8c]">"$1"</span>'
    )
    .replace(
      /{(.*?)}/g,
      '<span class="text-[#bd93f9]">{$1}</span>'
    );
}
