import { ImageResponse } from "next/og";
import { LogoMark, brand, loadBrandFonts } from "@/lib/brand-image";

// The picture shown when a SalesMoni link is shared on WhatsApp, X, LinkedIn,
// Facebook, Slack, iMessage, and other apps that read Open Graph tags.
export const alt = "SalesMoni: know what you sold, what's left, and what you made.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bars = [58, 84, 66, 110, 92, 124, 150];
const rows = [
  { name: "Rice 50kg", qty: 1, total: "78,000" },
  { name: "Vegetable oil 5L", qty: 2, total: "29,000" },
];

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: brand.forest,
          color: "#FFFFFF",
          fontFamily: "Bricolage Grotesque",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 620, height: "100%", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <LogoMark size={64} />
            <div style={{ fontSize: 44, fontWeight: 700 }}>SalesMoni</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 66, fontWeight: 700, lineHeight: 1.06, letterSpacing: -2 }}>
            <div>Know what you</div>
            <div>sold, what&apos;s left,</div>
            <div style={{ display: "flex" }}>
              <div style={{ marginRight: 16, flexShrink: 0 }}>and what you</div>
              <div style={{ color: brand.gold, flexShrink: 0 }}>made.</div>
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 27, fontWeight: 500, color: brand.sage }}>
            Sales records, stock control, and Excel reports
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 400, position: "relative" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              padding: 32,
              borderRadius: 32,
              background: "#FFFFFF",
              color: brand.ink,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 22, fontWeight: 500, color: brand.muted }}>Sales today (NGN)</div>
                <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>248,500</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "#E3F2EA",
                  color: brand.green,
                  fontSize: 19,
                  fontWeight: 700,
                }}
              >
                18 sales
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 150 }}>
              {bars.map((height, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height,
                    borderRadius: 10,
                    background: index === bars.length - 1 ? brand.green : brand.mint,
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {rows.map((row) => (
                <div
                  key={row.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderTop: `2px solid ${brand.line}`,
                    fontSize: 22,
                    fontWeight: 500,
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {row.name}
                    <div style={{ color: brand.muted }}>{`\u00a0x ${row.qty}`}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{row.total}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              left: -48,
              bottom: -44,
              padding: "14px 22px",
              borderRadius: 20,
              background: brand.gold,
              color: brand.forest,
              fontSize: 21,
            }}
          >
            <div style={{ fontWeight: 700 }}>Stock updated</div>
            <div style={{ fontWeight: 500 }}>Rice 50kg: 41 left</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadBrandFonts() },
  );
}
