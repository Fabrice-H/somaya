import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategoriesWithProductCount } from "@/features/categories/server/queries";

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
        {/* Header */}
        <div className="bg-[#511f29] py-[clamp(40px,6vw,60px)] px-[clamp(20px,4vw,48px)] text-center">
          <h1 className="font-[family-name:var(--font-stack)] font-normal text-[clamp(32px,5vw,48px)] text-[#ffffff] m-0 leading-tight">
            Nos Catégories
          </h1>
          <p className="text-[15px] text-white/80 mt-3 max-w-[500px] mx-auto">
            Explorez notre collection par catégorie
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-[1200px] mx-auto py-10 px-[clamp(16px,4vw,48px)] pb-20">
          {categories.length === 0 ? (
            <div className="text-center py-[60px] px-5 bg-white rounded-2xl">
              <p className="text-[#6b6b6b] text-base">
                Aucune catégorie disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalogue/${category.slug}`}
                  className="group block no-underline bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-[#fafafa] overflow-hidden">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#fafafa] to-[#e8ddd4]">
                        <span className="font-[family-name:var(--font-stack)] text-5xl text-[#d4c4b0]">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300">
                      <span className="py-3 px-6 bg-[#f4f4f2] text-black text-[13px] font-semibold tracking-wide uppercase opacity-0 translate-y-2.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Voir les produits
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="font-[family-name:var(--font-stack)] text-xl font-medium text-[#000000] m-0">
                      {category.name}
                    </h2>
                    <p className="text-[13px] text-[#6b6b6b] mt-1.5">
                      {category.productCount} article{category.productCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
    </>
  );
}
