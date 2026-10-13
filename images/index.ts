/**
 * Every image the site uses is imported here, so components reference one place.
 * To add a photo: drop the file in this folder, import it below, and render it
 * with next/image, e.g. <Image src={images.heroPhoto} alt="…" />.
 */
import ledgerPattern from "./ledger-pattern.svg";

export const images = {
  ledgerPattern,
};

/** Inline style for the faint ledger lines behind dark green sections. */
export const ledgerBackground = {
  backgroundImage: `url(${ledgerPattern.src})`,
  backgroundSize: "160px 160px",
};
