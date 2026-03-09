import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function VisitorModule() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getVisitors();
      setVisitors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Visitor Logs</h2>
        <button className="btn-primary" onClick={loadData}>Refresh</button>
      </div>

      {loading ? <p>Loading visitors...</p> : (
        <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)' }}>
          {visitors.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No visitors registered yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Visitor Info</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Purpose</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Expected Entry</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(v => (
                  <tr key={v._id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{v.visitorName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{v.relationship} • {v.contactNumber}</div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                      {v.purpose}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                      {formatDate(v.expectedEntry)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${v.status === 'Approved' ? 'badge-success' : v.status === 'Rejected' ? 'badge-error' : 'badge-warning'}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
