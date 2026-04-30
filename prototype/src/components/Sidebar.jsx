import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSpreadsheet, Settings, PieChart, Users, BookOpen, MapPin, BarChart2, Database } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <PieChart className="mr-2" size={24} />
        SLSEA Dashboard
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
          end
        >
          <LayoutDashboard size={20} />
          <span>Energy Balance</span>
        </NavLink>
        <NavLink 
          to="/submission" 
          className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
        >
          <FileSpreadsheet size={20} />
          <span>Data Submission</span>
        </NavLink>
        <NavLink 
          to="/data-management" 
          className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
        >
          <Database size={20} />
          <span>Data Management</span>
        </NavLink>
        <NavLink
          to="/analysis"
          className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
        >
          <BarChart2 size={20} />
          <span>Data Analysis</span>
        </NavLink>
        
        <div style={{ margin: '20px 0 10px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Administration
        </div>
        
        <a href="#" className="nav-item">
          <BookOpen size={20} />
          <span>Reports & Exports</span>
        </a>
        <a href="#" className="nav-item">
          <Users size={20} />
          <span>User Roles</span>
        </a>
        <a href="#" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
