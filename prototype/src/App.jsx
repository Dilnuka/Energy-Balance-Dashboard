import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import DataSubmission from './pages/DataSubmission';
import StateWiseUsage from './pages/StateWiseUsage';
import DataAnalysis from './pages/DataAnalysis';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/submission" element={<DataSubmission />} />
              <Route path="/state-usage" element={<StateWiseUsage />} />
              <Route path="/analysis" element={<DataAnalysis />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
