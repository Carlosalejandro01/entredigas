import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Karla({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const title = "Entre Vigas · Apartamento en Santillana del Mar";
const description =
  "Apartamento cómodo y bien equipado en el centro de Santillana del Mar, para hasta 6 personas. Reserva directa, sin comisiones de intermediarios.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Entre Vigas",
    images: [{ url: "/gallery/hero.jpg", width: 1200, height: 900 }],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/gallery/hero.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-stone-900">
        {children}
      </body>
    </html>
  );
}
