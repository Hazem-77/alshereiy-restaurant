import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0b0c10",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://alshereiy.com"),
  title: `${siteConfig.name} | فرايد تشكن وبورجر - أشهى الوجبات المقرمشة في الإسكندرية`,
  description: siteConfig.description,
  keywords: [
    "مطعم الشريعى",
    "الشريعى فرايد تشكن",
    "فرايد تشكن مصر",
    "برجر الإسكندرية",
    "وجبات بروست",
    "وجبات زنجر",
    "دجاج مقلي مقرمش",
    "ساندوتش هرم فراخ",
    "هرم لحمة",
    "عروض مطعم الشريعى",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} | فرايد تشكن وبورجر`,
    description: siteConfig.description,
    url: "https://alshereiy.com",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.branding.storefrontImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.branding.heroImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/logo/logo-emblem.jpg",
    apple: "/images/logo/logo-emblem.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    image: `https://alshereiy.com${siteConfig.branding.storefrontImage}`,
    telephone: siteConfig.contact.phone,
    servesCuisine: ["Fried Chicken", "Burgers", "Fast Casual"],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressLocality: siteConfig.contact.city,
      addressCountry: "EG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "12:30",
        closes: "02:30",
      },
    ],
    menu: "https://alshereiy.com/#menu",
  };

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${cairo.className} ${cairo.variable} min-h-screen bg-[#0b0c10] text-gray-100 antialiased selection:bg-amber-500 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
