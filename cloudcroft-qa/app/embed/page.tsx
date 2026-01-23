"use client";

import { useState } from "react";

export default function EmbedPage() {
  const [apiUrl, setApiUrl] = useState("https://your-domain.com/api/ask");
  const [mode, setMode] = useState<"floating" | "inline">("floating");

  const floatingCode = `<!-- Cloudcroft Q&A Widget -->
<script>
  window.CloudcroftQA = {
    apiUrl: "${apiUrl}"
  };
</script>
<script src="${apiUrl.replace("/api/ask", "")}/widget.js"></script>`;

  const inlineCode = `<!-- Cloudcroft Q&A Widget (Inline) -->
<div id="cloudcroft-chat-container"></div>
<script>
  window.CloudcroftQA = {
    apiUrl: "${apiUrl}",
    inline: true,
    container: "#cloudcroft-chat-container"
  };
</script>
<script src="${apiUrl.replace("/api/ask", "")}/widget.js"></script>`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #1e3a5f, #0f172a)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Embed Cloudcroft Q&A
        </h1>
        <p
          style={{
            color: "#94a3b8",
            marginBottom: "32px",
          }}
        >
          Add the Cloudcroft Q&A widget to any website with a simple code
          snippet.
        </p>

        {/* Configuration */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Configuration
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                color: "#94a3b8",
                marginBottom: "8px",
              }}
            >
              API URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#1e293b",
                color: "white",
                fontSize: "14px",
              }}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "4px",
              }}
            >
              Replace with your deployed API URL
            </p>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                color: "#94a3b8",
                marginBottom: "8px",
              }}
            >
              Widget Mode
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setMode("floating")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: mode === "floating" ? "#2563eb" : "#334155",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Floating Button
              </button>
              <button
                onClick={() => setMode("inline")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: mode === "inline" ? "#2563eb" : "#334155",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Inline Embed
              </button>
            </div>
          </div>
        </div>

        {/* Code snippet */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
              {mode === "floating" ? "Floating Widget" : "Inline Widget"} Code
            </h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  mode === "floating" ? floatingCode : inlineCode
                );
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #334155",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Copy Code
            </button>
          </div>

          <pre
            style={{
              background: "#0f172a",
              padding: "16px",
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            <code>{mode === "floating" ? floatingCode : inlineCode}</code>
          </pre>

          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              marginTop: "12px",
            }}
          >
            {mode === "floating"
              ? "This adds a floating chat button in the bottom-right corner of your page."
              : "This embeds the chat widget inline within a container element."}
          </p>
        </div>

        {/* Preview */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Features
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: "12px",
            }}
          >
            {[
              "Lightweight - No external dependencies",
              "Responsive - Works on all screen sizes",
              "Customizable - Easy to style with CSS variables",
              "Accessible - Keyboard navigation support",
              "Fast - Optimized for performance",
            ].map((feature, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "14px",
                  color: "#cbd5e1",
                }}
              >
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    background: "#22c55e",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Back link */}
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <a
            href="/"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            ← Back to main app
          </a>
        </div>
      </div>
    </div>
  );
}
