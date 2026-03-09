import styles from './FilterBar.module.css';

const STATUSES   = ['', 'open', 'in-progress', 'resolved'];
const CATEGORIES = ['', 'maintenance', 'food', 'wifi', 'cleanliness', 'security', 'other'];
const PRIORITIES = ['', 'low', 'medium', 'high'];

export default function FilterBar({ filters, setFilters }) {
  const set = (key) => (e) => setFilters(f => ({ ...f, [key]: e.target.value }));
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className={styles.bar}>
      <Select label="Status"   value={filters.status}   onChange={set('status')}   options={STATUSES} />
      <Select label="Category" value={filters.category} onChange={set('category')} options={CATEGORIES} />
      <Select label="Priority" value={filters.priority} onChange={set('priority')} options={PRIORITIES} />
      {hasFilters && (
        <button
          className={styles.clear}
          onClick={() => setFilters({ status: '', category: '', priority: '' })}
        >
          Clear ×
        </button>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <select className={styles.select} value={value} onChange={onChange}>
      {options.map(o => (
        <option key={o} value={o}>{o ? capitalize(o) : `All ${label}s`}</option>
      ))}
    </select>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
