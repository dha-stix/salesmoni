import { ImageResponse } from "next/og";
import { LogoMark } from "@/lib/brand-image";

// The icon used when the site is saved to an iPhone or iPad home screen.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<LogoMark size={180} rounded={false} />, size);
}
