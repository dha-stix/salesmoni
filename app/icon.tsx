import { ImageResponse } from "next/og";
import { LogoMark } from "@/lib/brand-image";

// The browser tab icon (favicon).
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<LogoMark size={64} />, size);
}
