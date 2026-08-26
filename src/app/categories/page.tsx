import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { getCategoriesWithProductCount } from "@/lib/queries/categories";

export const metadata: Metadata = {
  title: "Nos Catégories | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez toutes nos catégories de produits : bijoux, sacs, vêtements, montres et accessoires.",
};

export const revalidate = 120; // Revalidate every 2 minutes

export default async function CategoriesPage() {
  const categories = await getCategoriesWithProductCount();

  return (
    <>
      <HeaderWrapper />
      <main className="bg-[#faf6f1] min-h-screen">
        {/* Header */}
        <div className="bg-[#511F29] py-[clamp(40px,6vw,60px)] px-[clamp(20px,4vw,48px)] text-center">
          <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(32px,5vw,48px)] text-[#fbf3ec] m-0 leading-tight">
            Nos Catégories
          </h1>
          <p className="text-[15px] text-[#fcd3b4]/80 mt-3 max-w-[500px] mx-auto">
            Explorez notre collection par catégorie
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-[1200px] mx-auto py-10 px-[clamp(16px,4vw,48px)] pb-20">
          {categories.length === 0 ? (
            <div className="text-center py-[60px] px-5 bg-white rounded-2xl">
              <p className="text-[#94786b] text-base">
                Aucune catégorie disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalogue/${category.slug}`}
                  className="group block no-underline bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(81,31,41,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(81,31,41,0.12)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-[#f5f0eb] overflow-hidden">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f5f0eb] to-[#e8ddd4]">
                        <span className="font-[family-name:var(--font-serif)] text-5xl text-[#d4c4b0]">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#511F29]/0 group-hover:bg-[#511F29]/40 flex items-center justify-center transition-all duration-300">
                      <span className="py-3 px-6 bg-[#fcd3b4] text-[#511F29] text-[13px] font-semibold tracking-wide uppercase opacity-0 translate-y-2.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Voir les produits
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="font-[family-name:var(--font-serif)] text-xl font-medium text-[#2a181d] m-0">
                      {category.name}
                    </h2>
                    <p className="text-[13px] text-[#94786b] mt-1.5">
                      {category.productCount} article{category.productCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
