import { notFound } from "next/navigation";
import { getFeaturedCollection, getProducts, getReviews } from "@/lib/api";
import { isLocale } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import ShopProvider from "@/components/ShopProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { About, Creations, Footer, Services, Strip, Universe } from "@/components/StaticSections";
import { CollectionSection, PromoSection } from "@/components/ProductSections";
import CatalogueSection from "@/components/CatalogueSection";
import ReviewsSection from "@/components/ReviewsSection";
import CustomSection from "@/components/CustomSection";
import FavPanel from "@/components/FavPanel";
import RequestDialog from "@/components/RequestDialog";

// ISR : la page est régénérée au plus toutes les 60 s ; si l'API est indisponible, Next sert la dernière version valide.
export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [collection, products, reviews] = await Promise.all([
    getFeaturedCollection(),
    getProducts(),
    getReviews(),
  ]);

  // Tous les produits affichables (pour le panneau des favoris)
  const all = new Map<number, Product>();
  [...(collection?.products ?? []), ...products].forEach((p) => all.set(p.id, p));

  return (
    <ShopProvider locale={locale} products={[...all.values()]}>
      <Header />
      <main id="top">
        <Hero />
        <Strip locale={locale} />
        <About locale={locale} />
        <Creations locale={locale} />
        <Universe locale={locale} />
        {collection && <CollectionSection locale={locale} collection={collection} />}
        <PromoSection locale={locale} products={products} />
        <CatalogueSection products={products} />
        <Services locale={locale} />
        <ReviewsSection initial={reviews} />
        <CustomSection />
      </main>
      <Footer locale={locale} />
      <FavPanel />
      <RequestDialog />
    </ShopProvider>
  );
}
