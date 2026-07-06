type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200/60 bg-primary-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.1),transparent_55%)]" />
      <div className="relative mx-auto max-w-container px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        {eyebrow && (
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
            {eyebrow}
          </span>
        )}
        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
