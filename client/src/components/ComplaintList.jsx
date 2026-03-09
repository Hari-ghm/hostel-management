import { api } from '../api';
import { STATUS_COLORS, PRIORITY_COLORS, CATEGORY_ICONS, fmtDate } from '../utils';
import styles from './ComplaintList.module.css';

export default function ComplaintList({ complaints, loading, onSelect, onRefresh }) {
  if (loading) return <div className={styles.empty}>Loading…</div>;
  if (!complaints.length) return <div className={styles.empty}>No complaints found.</div>;

  return (
    <div className={styles.list}>
      {complaints.map(c => (
        <ComplaintCard key={c.id} complaint={c} onSelect={onSelect} onRefresh={onRefresh} />
      ))}
    </div>
  );
}

function ComplaintCard({ complaint: c, onSelect, onRefresh }) {
  const quickResolve = async (e) => {
    e.stopPropagation();
    await api.updateComplaint(c.id, { status: 'resolved' });
    onRefresh();
  };

  return (
    <div className={styles.card} onClick={() => onSelect(c)}>
      <div className={styles.cardTop}>
        <div className={styles.meta}>
          <span className={styles.icon}>{CATEGORY_ICONS[c.category] || '📋'}</span>
          <span className={styles.room}>Room {c.roomNumber}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.name}>{c.studentName}</span>
        </div>
        <div className={styles.badges}>
          <Badge color={PRIORITY_COLORS[c.priority]}>{c.priority}</Badge>
          <Badge color={STATUS_COLORS[c.status]}>{c.status}</Badge>
        </div>
      </div>

      <div className={styles.title}>{c.title}</div>
      <div className={styles.desc}>{c.description}</div>

      <div className={styles.cardBottom}>
        <span className={styles.date}>{fmtDate(c.createdAt)}</span>
        {c.status !== 'resolved' && (
          <button className={styles.resolveBtn} onClick={quickResolve}>✓ Resolve</button>
        )}
      </div>
    </div>
  );
}

function Badge({ color, children }) {
  return (
    <span className={styles.badge} style={{ background: `${color}22`, color }}>
      {children}
    </span>
  );
}
