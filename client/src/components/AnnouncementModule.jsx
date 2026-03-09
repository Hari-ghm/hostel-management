import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function AnnouncementModule() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General', priority: 'Normal' });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Need a dummy author ID for now to satisfy schema (ObjectId string)
      const submitData = { ...formData, author: '64bcfd278f9f8c14b8aefc51' }; 
      await api.createAnnouncement(submitData);
      setShowForm(false);
      setFormData({ title: '', content: '', category: 'General', priority: 'Normal' });
      loadData();
    } catch (e) {
      alert("Error creating announcement");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Hostel Announcements</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showForm && (
        <form className="card glass-panel" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Title" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
          />
          <textarea 
            placeholder="Content" 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
            required 
            rows={4}
          />
          <div style={{ display: 'flex', gap: '16px' }}>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>General</option>
              <option>Maintenance</option>
              <option>Emergency</option>
              <option>Event</option>
              <option>Mess</option>
            </select>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>Post Announcement</button>
        </form>
      )}

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {announcements.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No announcements yet.</p> : announcements.map(a => (
            <div key={a._id} className="card glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>{a.title}</h3>
                <span className={`badge ${a.priority === 'Urgent' ? 'badge-error' : a.priority === 'High' ? 'badge-warning' : 'badge-info'}`}>
                  {a.priority}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)' }}>{a.content}</p>
              <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Category: <strong>{a.category}</strong> | Posted: {new Date(a.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
