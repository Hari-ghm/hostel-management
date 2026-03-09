import React from 'react';

export default function PlaceholderView({ title, icon: Icon, description }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '24px',
        background: 'rgba(99, 102, 241, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <Icon size={40} style={{ color: 'var(--primary)' }} />
      </div>
      <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '12px' }}>{title}</h2>
      <p style={{ maxWidth: '400px', lineHeight: 1.6, fontSize: '1.05rem' }}>{description}</p>
      <button className="btn-primary" style={{ marginTop: '32px' }}>
        Configure Module
      </button>
    </div>
  );
}
