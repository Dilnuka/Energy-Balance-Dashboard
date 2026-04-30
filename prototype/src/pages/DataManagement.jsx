import React, { useState, useEffect } from 'react';
import { Upload, FileText, Database, CheckCircle, AlertCircle, MapPin, Wind, Zap } from 'lucide-react';

const API = 'http://localhost:8000';

const CATEGORIES = [
  { id: 'pjm', name: 'Power Consumption (PJM)', icon: MapPin, endpoint: '/api/regions/upload' },
  { id: 'emissions', name: 'Carbon Emissions (U.S.)', icon: Database, endpoint: '/api/upload/emissions' },
  { id: 'renewables', name: 'Renewable Production (France)', icon: Wind, endpoint: '/api/upload/renewables' },
];

const PJM_REGIONS = [
  { code: 'AE', name: 'Atlantic City Electric' },
  { code: 'AEP', name: 'American Electric Power' },
  { code: 'AP', name: 'Allegheny Power' },
  { code: 'ATSI', name: 'American Transmission Systems Inc.' },
  { code: 'BGE', name: 'Baltimore Gas and Electric' },
  { code: 'COMED', name: 'Commonwealth Edison' },
  { code: 'DAY', name: 'Dayton Power and Light' },
  { code: 'DEOK', name: 'Duke Energy Ohio/Kentucky' },
  { code: 'DOM', name: 'Dominion Energy' },
  { code: 'DPL', name: 'Dayton Power and Light (DPL)' },
  { code: 'DUQ', name: 'Duquesne Light' },
  { code: 'EKPC', name: 'East Kentucky Power Cooperative' },
  { code: 'JC', name: 'Jersey Central Power and Light' },
  { code: 'ME', name: 'Metropolitan Edison' },
  { code: 'PE', name: 'PECO Energy (PE)' },
  { code: 'PECO', name: 'PECO Energy' },
  { code: 'PENELEC', name: 'Pennsylvania Electric' },
  { code: 'PPL', name: 'PPL Electric Utilities' },
  { code: 'PS', name: 'PSEG' },
  { code: 'RECO', name: 'Rockland Electric' },
];

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('pjm');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  
  // Specific for PJM
  const [regionName, setRegionName] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    
    let url = API;
    if (activeTab === 'pjm') {
      url += '/api/regions/upload';
      formData.append('region_name', regionName);
      formData.append('display_name', displayName);
    } else if (activeTab === 'emissions') {
      url += '/api/upload/emissions';
    } else {
      url += '/api/upload/renewables';
    }

    try {
      const resp = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      if (resp.ok) {
        setStatus({ type: 'success', msg: data.message || 'Upload completed.' });
        setFile(null);
      } else {
        let detail = data.detail || 'Upload failed';
        if (Array.isArray(detail)) {
          detail = detail.map(item => item.msg || JSON.stringify(item)).join(', ');
        }
        if (typeof detail === 'object') {
          detail = JSON.stringify(detail);
        }
        setStatus({ type: 'error', msg: detail });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Could not connect to server' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0 }}>Data Management</h2>
        <p style={{ margin: '4px 0 0 0' }}>Upload and manage energy data sources across multiple categories.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        {/* Left: Category Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat.id); setStatus(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 10,
                border: 'none',
                backgroundColor: activeTab === cat.id ? 'var(--primary-color)' : 'white',
                color: activeTab === cat.id ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: activeTab === cat.id ? '0 4px 12px rgba(30, 58, 138, 0.2)' : 'var(--shadow-sm)',
                transition: 'all 0.2s',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              <cat.icon size={18} />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right: Upload Form */}
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              backgroundColor: 'rgba(30, 58, 138, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary-color)'
            }}>
              <Upload size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Upload {CATEGORIES.find(c => c.id === activeTab).name}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Select a CSV file matching the required schema.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {activeTab === 'pjm' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Region Code (e.g. AEP)</label>
                  <select
                    value={regionName}
                    onChange={e => {
                      const code = e.target.value;
                      setRegionName(code);
                      const match = PJM_REGIONS.find(region => region.code === code);
                      setDisplayName(match ? match.name : '');
                    }}
                    required
                  >
                    <option value="">— Select region —</option>
                    {PJM_REGIONS.map(region => (
                      <option key={region.code} value={region.code}>
                        {region.code} — {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="American Electric Power"
                    required
                    readOnly={Boolean(regionName)}
                  />
                </div>
              </div>
            )}

            <div
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 12,
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
              onClick={() => document.getElementById('csv-upload').click()}
            >
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={e => setFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
              <FileText size={40} color="var(--text-secondary)" style={{ marginBottom: 12, opacity: 0.5 }} />
              {file ? (
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {(file.size / 1024).toFixed(1)} KB — Ready to upload
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Click to upload or drag and drop</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CSV files only</div>
                </>
              )}
            </div>

            {status && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 8,
                backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                color: status.type === 'success' ? '#166534' : '#991b1b',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {status.msg}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || uploading}
              style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {uploading ? 'Processing...' : (
                <>
                  <Upload size={18} />
                  Upload & Ingest
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: 32, padding: 20, backgroundColor: '#f1f5f9', borderRadius: 12 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} color="var(--accent-orange)" />
              Data Structure Requirements
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {activeTab === 'pjm' && (
                <code>Required columns: Datetime, MW</code>
              )}
              {activeTab === 'emissions' && (
                <code>Required columns: year, state-name, sector-name, fuel-name, value</code>
              )}
              {activeTab === 'renewables' && (
                <code>Required columns: Date, Start_Hour, Source, Season, Production</code>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
