import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-context";
import { Spotlight } from "@/components/motion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.suffix}`,
    template: `%s · ${site.name}`,
  },
  description: site.blurb,
  openGraph: {
    title: `${site.name} — ${site.suffix}`,
    description: site.blurb,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-cream antialiased">
        <Spotlight />
        <CartProvider deliveryFee={site.deliveryFee} freeOver={site.freeDeliveryOver}>
          <SiteHeader />
          <main className="relative z-10 min-h-screen">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
