import Link from "next/link";

import { StatIcon } from "@/components/layout/icons";
import type { StatItem } from "@/lib/types";

interface StatCardProps {
  item: StatItem;
}

export function StatCard({ item }: StatCardProps) {
  const cardContent = (
    <>
      <div className="stat-card-header">
        <StatIcon icon={item.icon} />
        <p className="stat-value">
          <strong>{item.value}</strong>
        </p>
      </div>
      <p className="stat-label">{item.label}</p>
    </>
  );

  if (item.href) {
    return (
      <Link className={`stat-card stat-card--${item.icon} stat-card-link`} href={item.href}>
        {cardContent}
      </Link>
    );
  }

  return (
    <article className={`stat-card stat-card--${item.icon}`}>
      {cardContent}
    </article>
  );
}
