import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import Layout from './components/Layout';
import DashboardHome from './components/DashboardHome';

import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import ComplaintList from './components/ComplaintList';
import ComplaintForm from './components/ComplaintForm';
import ComplaintDetail from './components/ComplaintDetail';

import RoomModule from './components/RoomModule';
import AnnouncementModule from './components/AnnouncementModule';
import MessModule from './components/MessModule';
import VisitorModule from './components/VisitorModule';
import FeeModule from './components/FeeModule';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  
  // Complaints View State
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });
  const [complaintViewState, setComplaintViewState] = useState('list'); // 'list' | 'new' | 'detail'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadComplaintsData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([api.getComplaints(filters), api.getStats()]);
      setComplaints(c);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (activeView === 'complaints') {
      loadComplaintsData();
    }
  }, [activeView, loadComplaintsData]);

  const openComplaintDetail = (c) => { setSelectedComplaint(c); setComplaintViewState('detail'); };
  const goBackToComplaints = () => { setSelectedComplaint(null); setComplaintViewState('list'); loadComplaintsData(); };

  // Helper to determine the Page Title
  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Admin Dashboard';
      case 'complaints': 
        if (complaintViewState === 'new') return 'Submit New Complaint';
        if (complaintViewState === 'detail') return `Complaint Details`;
        return 'Complaint Management';
      case 'rooms': return 'Room Allocation System';
      case 'mess': return 'Menu Management';
      case 'announcements': return 'Hostel Announcements';
      case 'visitors': return 'Visitor Hub';
      case 'fees': return 'Fees & Remittances';
      default: return 'HostelNova';
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHome />;
        
      case 'complaints':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {complaintViewState === 'list' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FilterBar filters={filters} setFilters={setFilters} />
                  <button className="btn-primary" onClick={() => setComplaintViewState('new')}>+ Create Complaint</button>
                </div>
                {stats && <StatsBar stats={stats} />}
                <ComplaintList
                  complaints={complaints}
                  loading={loading}
                  onSelect={openComplaintDetail}
                  onRefresh={loadComplaintsData}
                />
              </>
            )}
            
            {complaintViewState === 'new' && (
              <>
                <button className="btn-secondary" style={{ width: 'fit-content' }} onClick={goBackToComplaints}>← Back to List</button>
                <div className="card glass-panel" style={{ marginTop: '20px' }}>
                   <ComplaintForm
                     onSuccess={goBackToComplaints}
                     onCancel={goBackToComplaints}
                   />
                </div>
              </>
            )}
            
            {complaintViewState === 'detail' && selectedComplaint && (
              <>
                 <button className="btn-secondary" style={{ width: 'fit-content', marginBottom: '20px' }} onClick={goBackToComplaints}>← Back to List</button>
                 <ComplaintDetail
                   complaint={selectedComplaint}
                   onUpdate={loadComplaintsData}
                   onDelete={goBackToComplaints}
                 />
              </>
            )}
          </div>
        );

      case 'rooms':
        return <RoomModule />;
      case 'mess':
        return <MessModule />;
      case 'announcements':
        return <AnnouncementModule />;
      case 'visitors':
        return <VisitorModule />;
      case 'fees':
        return <FeeModule />;
      default:
        return null;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} title={getPageTitle()}>
      {renderContent()}
    </Layout>
  );
}
