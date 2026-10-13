/**
 * Shared pieces for the images Next.js generates at build time: the social
 * preview (app/opengraph-image.tsx) and the browser icons (app/icon.tsx and
 * app/apple-icon.tsx). These render with next/og, which supports only inline
 * styles and flexbox, so they can't reuse the Tailwind components.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const brand = {
  forest: "#0B2E22",
  forestSoft: "#143F30",
  green: "#0A6B4A",
  mint: "#CFE6DA",
  sage: "#C9DDD3",
  gold: "#F4B63F",
  ink: "#0F1F18",
  muted: "#5A6B62",
  line: "#E1E7DF",
};

/**
 * Reads the font files once and caches them as text, which lets Next.js build
 * the preview image ahead of time instead of on every request.
 */
async function readFontFiles() {
  "use cache";
  // Literal paths let Next.js include these files when it bundles for hosting.
  return Promise.all([
    readFile(join(process.cwd(), "styles/fonts/bricolage-grotesque-500.woff"), "base64"),
    readFile(join(process.cwd(), "styles/fonts/bricolage-grotesque-700.woff"), "base64"),
  ]);
}

function toArrayBuffer(base64: string) {
  const bytes = Buffer.from(base64, "base64");
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

/** The heading typeface, in the shape next/og expects. */
export async function loadBrandFonts() {
  const [medium, bold] = (await readFontFiles()).map(toArrayBuffer);
  return [
    { name: "Bricolage Grotesque", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Bricolage Grotesque", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

const barHeights = [0.42, 0.72, 0.3, 0.54];

interface LogoMarkProps {
  size: number;
  /** Gold tile with green bars (default), or the reverse for light backgrounds. */
  tile?: string;
  bars?: string;
  /** Square corners let iOS apply its own rounding to the home-screen icon. */
  rounded?: boolean;
}

/** The SalesMoni mark: four chart bars on a rounded tile. */
export function LogoMark({ size, tile = brand.gold, bars = brand.forest, rounded = true }: LogoMarkProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: size * 0.085,
        paddingBottom: size * 0.24,
        borderRadius: rounded ? size * 0.28 : 0,
        background: tile,
      }}
    >
      {barHeights.map((height, index) => (
        <div
          key={index}
          style={{
            width: size * 0.09,
            height: size * height,
            borderRadius: size * 0.045,
            background: bars,
          }}
        />
      ))}
    </div>
  );
}
