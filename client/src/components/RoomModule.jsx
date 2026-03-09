import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { UserPlus } from 'lucide-react';

export default function RoomModule() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getRooms();
      setRooms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAllocate = async (roomId, roomNumber, capacity, occLength) => {
    if (occLength >= capacity) {
      alert(`Room ${roomNumber} is already full! (${occLength}/${capacity})`);
      return;
    }
    
    const studentId = window.prompt(`Enter Student User ID to allocate to Room ${roomNumber}`);
    if (!studentId || studentId.trim() === '') return;
    
    try {
      await api.allocateRoom(roomId, { studentId: studentId.trim() });
      loadData();
    } catch (e) {
      alert(`Error allocating student: ${e.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Room Allocation & Tracking</h2>
        <button className="btn-primary" onClick={loadData}>Refresh Data</button>
      </div>

      {loading ? <p>Loading rooms...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {rooms.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No rooms setup yet in the database.</p> : rooms.map(room => (
            <div key={room._id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                   <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.4rem' }}>Room {room.roomNumber}</h3>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Floor {room.floor} • {room.type}</span>
                </div>
                <span className={`badge ${room.status === 'Available' ? 'badge-success' : room.status === 'Full' ? 'badge-error' : 'badge-warning'}`}>
                  {room.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                <span style={{ padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                  {room.amenities?.hasAC ? '❄️ AC Enabled' : '💨 Non-AC'}
                </span>
                <span style={{ padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                  🛁 Bath: {room.amenities?.hasAttachedBath ? 'Attached' : 'Common'}
                </span>
                <span style={{ padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                   👥 Occupancy: {room.occupants?.length} / {room.capacity}
                </span>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <button 
                   onClick={() => handleAllocate(room._id, room.roomNumber, room.capacity, room.occupants?.length || 0)} 
                   className={room.occupants?.length >= room.capacity ? "btn-secondary" : "btn-primary"} 
                   style={{ width: '100%', display: 'flex', justifyContent: 'center', opacity: room.occupants?.length >= room.capacity ? 0.5 : 1 }}
                   disabled={room.occupants?.length >= room.capacity}
                >
                  <UserPlus size={18} /> {room.occupants?.length >= room.capacity ? 'Room Full' : 'Allocate Student'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
