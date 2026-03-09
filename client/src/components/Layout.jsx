import React from 'react';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';
import { Bell } from 'lucide-react';

export default function Layout({ activeView, setActiveView, children, title }) {
  return (
    <div className={styles.appShell}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>{title}</h1>
          <div className={styles.topbarActions}>
            <button className="btn-secondary" style={{ padding: '8px', border: 'none' }}>
              <Bell size={20} />
            </button>
            <div className={styles.avatar}>A</div>
          </div>
        </header>
        
        <div className={styles.pageBody}>
          {children}
        </div>
      </main>
    </div>
  );
}
