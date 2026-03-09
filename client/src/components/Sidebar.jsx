import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareWarning, 
  BedDouble, 
  Utensils, 
  Megaphone, 
  UsersRound, 
  Wallet,
  Settings,
  LogOut
} from 'lucide-react';
import styles from './Layout.module.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
  { id: 'rooms', label: 'Room Allocation', icon: BedDouble },
  { id: 'mess', label: 'Mess Management', icon: Utensils },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'visitors', label: 'Visitors Gate', icon: UsersRound },
  { id: 'fees', label: 'Fees & Invoices', icon: Wallet },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoBadge}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
            <path d="M10 6h4"/>
            <path d="M10 10h4"/>
            <path d="M10 14h4"/>
            <path d="M10 18h4"/>
          </svg>
        </div>
        <div>
          <h2 className={styles.brandName}>Hostel<span className="gradient-text">Nova</span></h2>
          <span className={styles.brandRole}>Admin Portal</span>
        </div>
      </div>
      
      <nav className={styles.sidebarNav}>
        <div className={styles.navSection}>Main Menu</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.activeItem : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <item.icon size={20} className={styles.navIcon} />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className={styles.sidebarFooter}>
        <button className={styles.navItem}>
          <Settings size={20} className={styles.navIcon} />
          Settings
        </button>
        <button className={`${styles.navItem} ${styles.dangerItem}`}>
          <LogOut size={20} className={styles.navIcon} />
          Logout
        </button>
      </div>
    </aside>
  );
}
