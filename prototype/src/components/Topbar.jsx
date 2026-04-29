import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', padding: '8px 16px', borderRadius: '8px', width: '300px' }}>
        <Search size={18} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
        <input 
          type="text" 
          placeholder="Search energy data, ISIC sectors..." 
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="var(--text-secondary)" />
          <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: 'var(--accent-orange)', borderRadius: '50%' }}></span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
          <UserCircle size={32} color="var(--primary-color)" />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>System Admin</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SLSEA Verifier</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
