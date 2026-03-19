"use client";

import DashboardSidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "radial-gradient(ellipse 100% 60% at 70% 20%, rgba(108,92,231,0.08) 0%, transparent 60%), #060510",
        position: "relative",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          right: "15%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,92,231,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "orb-drift 20s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          left: "30%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "orb-drift 25s ease-in-out infinite reverse",
        }}
      />

      <DashboardSidebar />
      <main style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
