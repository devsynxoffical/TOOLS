import { MaterialIcon } from "@/components/ui/MaterialIcon";

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card group">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-brand-primary">
        <MaterialIcon name={icon} className="text-xl" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-neutral-800">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
    </div>
  );
}
