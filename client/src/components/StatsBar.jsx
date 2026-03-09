import styles from './StatsBar.module.css';

export default function StatsBar({ stats }) {
  const cards = [
    { label: 'Total',       value: stats.total,                  color: 'var(--text)' },
    { label: 'Open',        value: stats.byStatus.open || 0,     color: 'var(--open)' },
    { label: 'In Progress', value: stats.byStatus['in-progress'] || 0, color: 'var(--progress)' },
    { label: 'Resolved',    value: stats.byStatus.resolved || 0, color: 'var(--resolved)' },
  ];

  return (
    <div className={styles.grid}>
      {cards.map(c => (
        <div key={c.label} className={styles.card}>
          <span className={styles.value} style={{ color: c.color }}>{c.value}</span>
          <span className={styles.label}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
