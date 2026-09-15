import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { bodyFont, headingFont } from "@/shared/design-system/fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "NutriLens — leitura crítica de ingredientes",
    template: "%s · NutriLens",
  },
  description:
    "Digite o nome de um produto industrializado e veja a lista de ingredientes classificada: adequado, moderado, evitar ou cancerígeno. Não é sobre calorias, é sobre o que está no rótulo.",
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
      lang="pt-BR"
      className={`${headingFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
