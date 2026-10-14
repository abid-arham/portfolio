import { ImageResponse } from "next/og"

import { profile } from "@/data/profile"

export const alt = `${profile.name} — ${profile.role}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Shared link preview. Matches the site palette — warm paper, warm ink, one
 * amber accent. Rendered with system serif/sans rather than fetching the web
 * fonts, so the build has no network dependency.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#fbfaf7",
          color: "#2e2a26",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#c2622a",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#7d7268",
            }}
          >
            {`${profile.name} — ${profile.role}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontFamily: "Georgia, serif",
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 940,
          }}
        >
          I build web apps from the schema up.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 26,
            color: "#7d7268",
            borderTop: "1px solid #e2dcd3",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>{profile.location}</div>
          <div style={{ display: "flex" }}>Node · TypeScript · PostgreSQL</div>
        </div>
      </div>
    ),
    size
  )
}
