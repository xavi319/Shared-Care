import { Link } from "react-router-dom";

import { StatIcon } from "../layout/icons";

export function StatCard({ item }) {
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
      <Link className={`stat-card stat-card--${item.icon} stat-card-link`} to={item.href}>
        {cardContent}
      </Link>
    );
  }

  return <article className={`stat-card stat-card--${item.icon}`}>{cardContent}</article>;
}
