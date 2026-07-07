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
    <section className="relative overflow-hidden bg-collab-yellow">
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      <div className="relative mx-auto max-w-container px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        {eyebrow && <span className="marketing-eyebrow mb-4 inline-block">{eyebrow}</span>}
        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-collab-dark sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-collab-dark/75 sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
