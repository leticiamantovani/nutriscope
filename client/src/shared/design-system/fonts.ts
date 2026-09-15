import { Inter, Nunito } from "next/font/google";

/**
 * Typography sources. Only the CSS variables are consumed elsewhere
 * (see tokens.css → --font-heading / --font-sans).
 */
export const headingFont = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
