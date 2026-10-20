import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon size={23} className={iconColor} strokeWidth={2} />
      </div>

      <p className="text-sm text-text-secondary">{title}</p>

      <h2 className="mt-2 text-[clamp(1.1rem,1.6vw,1.5rem)] font-semibold tracking-tight text-text-primary">
        {value}
      </h2>
    </article>
  );
}
