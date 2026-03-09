import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Users, AlertTriangle, CheckCircle, BedDouble } from 'lucide-react';
import { api } from '../api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './DashboardHome.module.css';

const CATEGORY_COLORS = {
  maintenance: '#38bdf8',
  cleanliness: '#6366f1',
  food: '#f59e0b',
  wifi: '#ec4899',
  security: '#10b981',
  other: '#8b5cf6'
};

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, complaintsData] = await Promise.all([
        api.getStats(),
        api.getComplaints()
      ]);
      setStats(statsData);
      setComplaints(complaintsData.slice(0, 5)); // Last 5 for activity
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const generateReport = () => {
    if (!stats) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('HostelNova Weekly Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Overview Table
    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ['Total Students', stats.totalStudents?.toString() || '0'],
        ['Total Capacity Occupied', `${stats.occupiedRooms} / ${stats.totalRooms}`],
        ['Open Complaints', stats.byStatus?.open?.toString() || '0'],
        ['Resolved Complaints', stats.byStatus?.resolved?.toString() || '0']
      ]
    });

    // Category Breakdown Table
    const catBody = Object.keys(stats.byCategory || {}).map(cat => [cat.toUpperCase(), stats.byCategory[cat]]);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Complaint Category', 'Count']],
      body: catBody
    });

    doc.save('HostelNova_Weekly_Report.pdf');
  };

  if (loading || !stats) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading real-time statistics...</div>;

  // Prepare Chart Data
  const categoryData = Object.keys(stats.byCategory || {}).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: stats.byCategory[key],
    color: CATEGORY_COLORS[key] || '#8b5cf6'
  }));

  // Dummy trend data since we don't have historical snapshot API
  const trendData = [
    { name: 'Mon', complaints: 3 },
    { name: 'Tue', complaints: 5 },
    { name: 'Wed', complaints: 2 },
    { name: 'Thu', complaints: 8 },
    { name: 'Fri', complaints: 4 },
    { name: 'Sat', complaints: Math.floor((stats.total || 0) / 2) },
    { name: 'Sun', complaints: stats.total || 0 },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeBanner}>
        <div>
          <h2 className={styles.greeting}>Welcome back, Admin! 👋</h2>
          <p className={styles.subtext}>Here's what's happening in HostelNova today.</p>
        </div>
        <button className="btn-primary" onClick={generateReport}>Generate Weekly Report (PDF)</button>
      </div>

      <div className={styles.statGrid}>
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.statHeader}>
            <div className={styles.statIconBadge} style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}>
              <Users size={24} />
            </div>
          </div>
          <div>
            <div className={styles.statValue}>{stats.totalStudents || 0}</div>
            <div className={styles.statLabel}>Total Students</div>
          </div>
        </div>

        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.statHeader}>
            <div className={styles.statIconBadge} style={{ color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' }}>
              <BedDouble size={24} />
            </div>
            <span className={styles.trendUp}>{Math.round(((stats.occupiedRooms||0) / (stats.totalRooms||1)) * 100)}% Occ</span>
          </div>
          <div>
            <div className={styles.statValue}>{stats.occupiedRooms || 0} / {stats.totalRooms || 0}</div>
            <div className={styles.statLabel}>Rooms Allocated</div>
          </div>
        </div>

        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.statHeader}>
            <div className={styles.statIconBadge} style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div>
            <div className={styles.statValue}>{stats.byStatus?.open || 0}</div>
            <div className={styles.statLabel}>Open Complaints</div>
          </div>
        </div>

        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.statHeader}>
            <div className={styles.statIconBadge} style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <div>
            <div className={styles.statValue}>{stats.byStatus?.resolved || 0}</div>
            <div className={styles.statLabel}>Total Resolved</div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className="card glass-panel" style={{ flex: 2, minHeight: '380px' }}>
          <h3 className={styles.chartTitle}>Complaint Resolution Trends</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="complaints" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorComplaints)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card glass-panel" style={{ flex: 1, minHeight: '380px' }}>
          <h3 className={styles.chartTitle}>Issues By Category</h3>
          <div style={{ width: '100%', height: '300px' }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ color: 'var(--text-muted)' }}>No category data available.</p>}
          </div>
        </div>
      </div>
      
      <div className="card glass-panel" style={{ marginTop: '24px' }}>
         <div className={styles.flexBetween}>
           <h3 className={styles.chartTitle} style={{ margin: 0 }}>Recent Activity</h3>
         </div>
         <div className={styles.activityList}>
            {complaints.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No recent activity.</p> : complaints.map((c, i) => (
              <div key={c.id || i} className={styles.activityItem}>
                 <div className={styles.activityDot} style={{ background: c.status === 'resolved' ? '#10b981' : c.status === 'in-progress' ? '#f59e0b' : '#38bdf8' }}></div>
                 <div className={styles.activityContent}>
                   <p><strong>{c.studentName || 'Student'}</strong> updated a complaint: "{c.title}" to status <strong>{c.status}</strong></p>
                   <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
