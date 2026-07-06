type RouteLoadingProps = {
  label?: string;
};

export function RouteLoading({ label = "Loading page..." }: RouteLoadingProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div className="navigation-progress-spinner" />
      <p className="text-sm font-medium text-neutral-500">{label}</p>
    </div>
  );
}
