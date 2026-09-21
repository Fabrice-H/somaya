import { Suspense } from "react";
import { getTestimonials } from "@/features/testimonials/server/queries";
import { TestimonialsManager } from "@/features/testimonials/components/admin/TestimonialsManager";
import { TestimonialsSkeleton } from "@/features/testimonials/components/admin/TestimonialsSkeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Témoignages | Admin SO'MAYA",
};

async function TestimonialsData() {
  const data = await getTestimonials();
  return <TestimonialsManager initialData={data} />;
}

export default function TestimonialsPage() {
  return (
    <Suspense fallback={<TestimonialsSkeleton />}>
      <TestimonialsData />
    </Suspense>
  );
}
