import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { bodyFont, headingFont } from "@/shared/design-system/fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "NutriLens — a critical reading of ingredients",
    template: "%s · NutriLens",
  },
  description:
    "Type the name of a packaged food and see its ingredient list classified as adequate, moderate, avoid, or carcinogenic. This is not about calories — it is about what is on the label.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
