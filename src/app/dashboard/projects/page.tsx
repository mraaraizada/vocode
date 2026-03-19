"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: "building" | "completed" | "draft";
  thumbnail?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem("vocode-projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
    setIsLoading(false);
  }, []);

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem("vocode-projects", JSON.stringify(updatedProjects));
      
      // Also clear current project if it was the deleted one
      const currentProject = localStorage.getItem("vocode-current-project");
      if (currentProject) {
        const current = JSON.parse(currentProject);
        if (current.id === id) {
          localStorage.removeItem("vocode-current-project");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "40px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={{ padding: "40px", minHeight: "100vh" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            My Projects
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            Manage and edit your generated websites
          </p>
        </div>

        {/* Empty State */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: 24, opacity: 0.5 }}>📁</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#fff", marginBottom: 8 }}>
            No projects yet
          </h3>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24, textAlign: "center", maxWidth: 400 }}>
            Start building your first website with VOCODE AI
          </p>
          <Link
            href="/dashboard/new"
            style={{
              padding: "12px 24px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            Create New Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            My Projects
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/dashboard/new"
          style={{
            padding: "12px 24px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #6C5CE7, #00D4FF)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            transition: "all 0.2s ease",
          }}
        >
          + New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                height: 160,
                background: project.thumbnail || "linear-gradient(135deg, #6C5CE720, #00D4FF20)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {project.thumbnail ? (
                <div style={{ width: "100%", height: "100%", background: project.thumbnail }} />
              ) : (
                <span style={{ fontSize: "3rem", opacity: 0.3 }}>🌐</span>
              )}
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Info */}
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>
                  {project.name}
                </h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      background: project.status === "completed" ? "rgba(0,212,255,0.15)" : project.status === "building" ? "rgba(255,193,7,0.15)" : "rgba(108,92,231,0.15)",
                      color: project.status === "completed" ? "#00D4FF" : project.status === "building" ? "#FFC107" : "#6C5CE7",
                      textTransform: "capitalize",
                    }}
                  >
                    {project.status}
                  </span>
                  <button
                    onClick={(e) => deleteProject(project.id, e)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      fontSize: "1rem",
                      lineHeight: 1,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                    title="Delete project"
                  >
                    ⋮
                  </button>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginBottom: 12 }}>
                {project.description}
              </p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
                Created {project.createdAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
