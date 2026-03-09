import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function GenericModule({ title, fetchResource }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await fetchResource();
      setData(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [fetchResource]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{title}</h2>
        <button className="btn-primary" onClick={loadData}>Refresh Data</button>
      </div>

      {loading ? <p>Loading data from database...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {data.length === 0 ? (
             <div className="card glass-panel" style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
               <p>No records found in the database.</p>
             </div>
          ) : data.map(item => (
            <div key={item._id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <pre style={{ overflowX: 'auto', background: 'var(--bg-dark)', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
                 {JSON.stringify(item, null, 2)}
               </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
