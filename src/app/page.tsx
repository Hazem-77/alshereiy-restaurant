export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OfferBanner from "@/components/OfferBanner";
import OfferSection from "@/components/OfferSection";
import FeaturedItems from "@/components/FeaturedItems";
import Menu from "@/components/Menu";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getPublicOffers } from "@/lib/offers";
import { getSiteConfig } from "@/lib/siteConfigServer";
import { getPublicMenuItems } from "@/lib/menuServer";
import type { MenuItem } from "@/data/menu";

export default async function Home() {
  const publicOffers = await getPublicOffers();
  const siteConfig = await getSiteConfig();
  const menuItems = await getPublicMenuItems();

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-100 selection:bg-amber-500 selection:text-black">
      {/* Top flash promotion banner */}
      <OfferBanner initialOffers={publicOffers} initialTime={new Date()} />

      {/* Sticky navigation */}
      <Navbar siteConfig={siteConfig} />

      {/* Hero presentation */}
      <Hero siteConfig={siteConfig} />

      {/* Limited-time special offer with live countdown */}
      <OfferSection initialOffers={publicOffers} />

      {/* Most requested signature dishes */}
      <FeaturedItems siteConfig={siteConfig} menuItems={menuItems} />

      {/* Full interactive categorized menu */}
      <Menu siteConfig={siteConfig} menuItems={menuItems} />

      {/* Real storefront & story */}
      <About siteConfig={siteConfig} />

      {/* Photo gallery with Lightbox */}
      <Gallery />

      {/* Customer testimonials */}
      <Testimonials />

      {/* Working hours, map, and large CTA */}
      <Contact siteConfig={siteConfig} />

      {/* Footer */}
      <Footer siteConfig={siteConfig} />

      {/* Floating pulsing WhatsApp action button */}
      <FloatingWhatsApp siteConfig={siteConfig} />
    </main>
  );
}
