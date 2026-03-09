import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function MessModule() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getMessMenus();
      setMenus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Menu Management</h2>
        <button className="btn-primary" onClick={loadData}>Refresh</button>
      </div>

      {loading ? <p>Loading menu...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {menus.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No menus created yet.</p> : menus.map(m => (
            <div key={m._id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.4rem' }}>{m.day}</h3>
                <span className="badge badge-success">Active</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Breakfast</div>
                  <div style={{ color: 'var(--text-main)', marginTop: '4px' }}>{m.meals?.breakfast || '--'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Lunch</div>
                  <div style={{ color: 'var(--text-main)', marginTop: '4px' }}>{m.meals?.lunch || '--'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Snacks</div>
                  <div style={{ color: 'var(--text-main)', marginTop: '4px' }}>{m.meals?.snacks || '--'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Dinner</div>
                  <div style={{ color: 'var(--text-main)', marginTop: '4px' }}>{m.meals?.dinner || '--'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
