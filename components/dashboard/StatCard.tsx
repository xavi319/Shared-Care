import { StatIcon } from "@/components/layout/icons";
import type { StatItem } from "@/lib/types";

interface StatCardProps {
  item: StatItem;
}

export function StatCard({ item }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${item.icon}`}>
      <StatIcon icon={item.icon} />
      <p className="stat-value">
        <strong>{item.value}</strong>
      </p>
      <p className="stat-label">{item.label}</p>
    </article>
  );
}
