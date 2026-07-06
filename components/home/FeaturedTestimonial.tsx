import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function FeaturedTestimonial() {
  return (
    <section className="bg-primary-100 py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <MaterialIcon
              name="format_quote"
              className="text-5xl text-brand-primary/30"
            />
            <blockquote className="mt-4 text-2xl font-semibold leading-snug text-neutral-900 sm:text-3xl lg:text-4xl">
              &ldquo;We cut our SEO tool spend by 70% while keeping the exact
              same workflow. The dashboard makes it effortless to launch
              everything.&rdquo;
            </blockquote>
            <footer className="mt-8">
              <p className="text-lg font-bold text-neutral-900">Sarah Khan</p>
              <p className="text-sm text-neutral-600">
                Digital Marketing Agency, Karachi
              </p>
            </footer>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-primary-200 to-primary-400 shadow-card">
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-bold text-brand-primary shadow-lg">
                  SK
                </div>
                <p className="mt-6 text-lg font-bold text-neutral-900">
                  Agency owner
                </p>
                <p className="mt-2 text-sm text-neutral-700">
                  Uses Semrush, Moz & SpyFu daily
                </p>
                <div className="mt-6 flex gap-1 text-brand-primary">
                  {[...Array(5)].map((_, i) => (
                    <MaterialIcon key={i} name="star" filled />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
