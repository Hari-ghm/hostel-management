import { useState } from 'react';
import { api } from '../api';
import styles from './ComplaintForm.module.css';

const CATEGORIES = ['maintenance', 'food', 'wifi', 'cleanliness', 'security', 'other'];

const EMPTY = { studentName: '', roomNumber: '', category: 'maintenance', title: '', description: '', priority: 'medium' };

export default function ComplaintForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.studentName || !form.roomNumber || !form.title || !form.description) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.createComplaint(form);
      onSuccess();
    } catch (e) {
      setError('Failed to submit. Is the server running?');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>New Complaint</h2>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.row}>
        <Field label="Student Name *">
          <input className={styles.input} value={form.studentName} onChange={set('studentName')} placeholder="e.g. Arjun Mehta" />
        </Field>
        <Field label="Room Number *">
          <input className={styles.input} value={form.roomNumber} onChange={set('roomNumber')} placeholder="e.g. 204" />
        </Field>
      </div>

      <div className={styles.row}>
        <Field label="Category">
          <select className={styles.input} value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{capitalize(c)}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select className={styles.input} value={form.priority} onChange={set('priority')}>
            {['low','medium','high'].map(p => <option key={p} value={p}>{capitalize(p)}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Title *">
        <input className={styles.input} value={form.title} onChange={set('title')} placeholder="Brief title of the issue" />
      </Field>

      <Field label="Description *">
        <textarea className={styles.input} rows={4} value={form.description} onChange={set('description')} placeholder="Describe the issue in detail…" />
      </Field>

      <div className={styles.actions}>
        <button className={styles.cancel} onClick={onCancel}>Cancel</button>
        <button className={styles.submit} onClick={submit} disabled={saving}>
          {saving ? 'Submitting…' : 'Submit Complaint'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
    </div>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
