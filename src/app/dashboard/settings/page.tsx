"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "dark",
    language: "en",
    autoSave: true,
    notifications: true,
    exportFormat: "html",
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ padding: "40px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Settings
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Customize your VOCODE experience
        </p>
      </div>

      {/* Settings Sections */}
      <div style={{ width: "100%", maxWidth: 600, display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* Appearance */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: 16 }}>
            Appearance
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "0.9375rem" }}>Theme</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8125rem" }}>Choose your preferred theme</p>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "0.9375rem" }}>Language</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8125rem" }}>Select your language</p>
              </div>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Editor Settings */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: 16 }}>
            Editor
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "0.9375rem" }}>Auto-save</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8125rem" }}>Automatically save your changes</p>
              </div>
              <button
                onClick={() => handleToggle("autoSave")}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 999,
                  border: "none",
                  background: settings.autoSave ? "linear-gradient(135deg, #6C5CE7, #00D4FF)" : "rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 3,
                    left: settings.autoSave ? 23 : 3,
                    transition: "all 0.2s ease",
                  }}
                />
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "0.9375rem" }}>Export Format</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8125rem" }}>Default format for exporting code</p>
              </div>
              <select
                value={settings.exportFormat}
                onChange={(e) => setSettings({ ...settings, exportFormat: e.target.value })}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                <option value="html">HTML</option>
                <option value="react">React</option>
                <option value="vue">Vue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: 16 }}>
            Notifications
          </h3>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#fff", fontSize: "0.9375rem" }}>Enable notifications</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8125rem" }}>Get notified about project updates</p>
            </div>
            <button
              onClick={() => handleToggle("notifications")}
              style={{
                width: 44,
                height: 24,
                borderRadius: 999,
                border: "none",
                background: settings.notifications ? "linear-gradient(135deg, #6C5CE7, #00D4FF)" : "rgba(255,255,255,0.1)",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: settings.notifications ? 23 : 3,
                  transition: "all 0.2s ease",
                }}
              />
            </button>
          </div>
        </div>

        {/* Account */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: 16 }}>
            Account
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: "0.875rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              }}
            >
              Change Password
            </button>
            <button
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: "0.875rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              }}
            >
              Export All Data
            </button>
            <button
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                border: "1px solid rgba(255,100,100,0.3)",
                background: "rgba(255,100,100,0.1)",
                color: "#ff6464",
                fontSize: "0.875rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,100,100,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,100,100,0.1)";
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
