import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud, Trash2, RefreshCw, ChevronUp, ChevronDown,
  BarChart2, CheckCircle, AlertCircle, MapPin, Search
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

const API = 'http://localhost:8000';

const PJM_REGIONS = {
  AEP: 'American Electric Power',
  COMED: 'Commonwealth Edison',
  DAYTON: 'Dayton Power & Light',
  DEOK: 'Duke Energy Ohio/Kentucky',
  DOM: 'Dominion Virginia',
  DUQ: 'Duquesne Light',
  EKPC: 'East Kentucky Power Coop',
  FE: 'FirstEnergy',
  NI: 'Northern Illinois',
  PJME: 'PJM East',
  PJMW: 'PJM West',
  PJM_LOAD: 'PJM Total Load',
};

const RegionCard = ({ region, isSelected, onClick, onDelete }) => (
  <div
    onClick={onClick}
    style={{
      padding: '16px',
      borderRadius: '10px',
      border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
      backgroundColor: isSelected ? '#eff6ff' : 'var(--surface-color)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
    }}
  >
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(region.name); }}
      style={{
        position: 'absolute', top: 8, right: 8, background: 'none',
        border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
        padding: 4, borderRadius: 4,
      }}
      title="Delete region"
    >
      <Trash2 size={14} />
    </button>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <MapPin size={16} color="var(--primary-color)" />
      <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{region.name}</span>
    </div>
    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
      {region.display_name}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
      <div>
        <div style={{ color: 'var(--text-secondary)' }}>Avg</div>
        <div style={{ fontWeight: 600 }}>{region.avg_mw?.toLocaleString()} MW</div>
      </div>
      <div>
        <div style={{ color: 'var(--text-secondary)' }}>Peak</div>
        <div style={{ fontWeight: 600, color: 'var(--accent-orange)' }}>{region.peak_mw?.toLocaleString()} MW</div>
      </div>
      <div>
        <div style={{ color: 'var(--text-secondary)' }}>Records</div>
        <div style={{ fontWeight: 600 }}>{region.record_count?.toLocaleString()}</div>
      </div>
    </div>
  </div>
);

const SortableTable = ({ data }) => {
  const [sortKey, setSortKey] = useState('timestamp');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 15;

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(0);
  };

  const filtered = data.filter(r =>
    r.timestamp.includes(search) ||
    String(r.mw_value).includes(search)
  );

  const sorted = [...filtered].sort((a, b) => {
    const va = sortKey === 'mw_value' ? a.mw_value : a.timestamp;
    const vb = sortKey === 'mw_value' ? b.mw_value : b.timestamp;
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return null;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const formatDt = (s) => {
    try { return new Date(s).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }); }
    catch { return s; }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-color)', padding: '8px 14px', borderRadius: 8, width: 260 }}>
          <Search size={15} color="var(--text-secondary)" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Filter by date or MW..."
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
          />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {sorted.length.toLocaleString()} records
        </span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('timestamp')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Datetime <SortIcon k="timestamp" />
                </div>
              </th>
              <th onClick={() => handleSort('mw_value')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Consumption (MW) <SortIcon k="mw_value" />
                </div>
              </th>
              <th>Load Level</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(row => {
              const avgMw = data.reduce((a, b) => a + b.mw_value, 0) / data.length;
              const isHigh = row.mw_value > avgMw * 1.15;
              const isLow = row.mw_value < avgMw * 0.85;
              return (
                <tr key={row.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.83rem' }}>{formatDt(row.timestamp)}</td>
                  <td style={{ fontWeight: 600 }}>{row.mw_value.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                  <td>
                    {isHigh && <span className="status-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>⬆ High</span>}
                    {isLow && <span className="status-badge" style={{ background: '#d1fae5', color: '#065f46' }}>⬇ Low</span>}
                    {!isHigh && !isLow && <span className="status-badge" style={{ background: '#f0f9ff', color: '#0c4a6e' }}>— Normal</span>}
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>No records match your filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <button className="btn btn-outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>← Previous</button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Page {page + 1} of {totalPages || 1}</span>
        <button className="btn btn-outline" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next →</button>
      </div>
    </div>
  );
};

const StateWiseUsage = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionData, setRegionData] = useState([]);
  const [regionStats, setRegionStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // {type: 'success'|'error', msg: ''}

  // Upload form state
  const [regionName, setRegionName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const fileRef = useRef(null);

  const fetchRegions = async () => {
    try {
      const res = await fetch(`${API}/api/regions`);
      const data = await res.json();
      setRegions(data);
    } catch { /* backend not ready yet */ }
  };

  const fetchRegionData = async (name) => {
    setLoading(true);
    try {
      const [dataRes, statsRes] = await Promise.all([
        fetch(`${API}/api/regions/${name}/data?limit=500`),
        fetch(`${API}/api/regions/${name}/stats`),
      ]);
      setRegionData(await dataRes.json());
      setRegionStats(await statsRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegions(); }, []);

  useEffect(() => {
    if (selectedRegion) fetchRegionData(selectedRegion.name);
  }, [selectedRegion]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file || !regionName.trim()) return;

    setUploading(true);
    setUploadStatus(null);
    const form = new FormData();
    form.append('region_name', regionName.trim());
    form.append('display_name', displayName.trim() || regionName.trim());
    form.append('description', description.trim());
    form.append('file', file);

    try {
      const res = await fetch(`${API}/api/regions/upload`, { method: 'POST', body: form });
      const json = await res.json();
      if (res.ok) {
        setUploadStatus({ type: 'success', msg: json.message });
        setRegionName(''); setDisplayName(''); setDescription('');
        if (fileRef.current) fileRef.current.value = '';
        await fetchRegions();
      } else {
        setUploadStatus({ type: 'error', msg: json.detail || 'Upload failed.' });
      }
    } catch {
      setUploadStatus({ type: 'error', msg: 'Could not connect to backend.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Delete all data for region "${name}"?`)) return;
    await fetch(`${API}/api/regions/${name}`, { method: 'DELETE' });
    if (selectedRegion?.name === name) { setSelectedRegion(null); setRegionData([]); setRegionStats(null); }
    await fetchRegions();
  };

  const handleRegionNameChange = (val) => {
    setRegionName(val.toUpperCase());
    const known = PJM_REGIONS[val.toUpperCase()];
    if (known && !displayName) setDisplayName(known);
  };

  // Use last 168 records (1 week of hourly data) for trendline — ensures diverse X-axis labels
  const chartData = regionData.slice(-168);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0 }}>State-wise Power Usage</h2>
        <p style={{ margin: '4px 0 0 0' }}>Upload PJM regional CSV datasets and explore hourly consumption by state.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>

        {/* LEFT PANEL — Upload + Region List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Upload Form */}
          <div className="card">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '0.95rem' }}>Upload Regional CSV</h3>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Region Code *
                </label>
                <input
                  list="pjm-regions"
                  value={regionName}
                  onChange={e => handleRegionNameChange(e.target.value)}
                  placeholder="e.g. AEP, DEOK, DOM..."
                  required
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 6,
                    border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                />
                <datalist id="pjm-regions">
                  {Object.keys(PJM_REGIONS).map(k => <option key={k} value={k}>{PJM_REGIONS[k]}</option>)}
                </datalist>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Display Name
                </label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. American Electric Power"
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 6,
                    border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  CSV File *
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  required
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 6,
                    border: '1px solid var(--border-color)', fontSize: '0.82rem',
                    backgroundColor: 'var(--bg-color)',
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={uploading} style={{ width: '100%' }}>
                <UploadCloud size={16} />
                {uploading ? 'Uploading...' : 'Upload & Process'}
              </button>
            </form>

            {uploadStatus && (
              <div style={{
                marginTop: 12, padding: '10px 14px', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'center',
                backgroundColor: uploadStatus.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: uploadStatus.type === 'success' ? '#065f46' : '#991b1b',
                fontSize: '0.82rem',
              }}>
                {uploadStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {uploadStatus.msg}
              </div>
            )}
          </div>

          {/* Region Cards */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Uploaded Regions ({regions.length})</span>
              <button className="btn btn-outline" style={{ padding: '5px 10px' }} onClick={fetchRegions}>
                <RefreshCw size={14} />
              </button>
            </div>
            {regions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                No regions uploaded yet.<br/>Upload a CSV file to get started.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {regions.map(r => (
                  <RegionCard
                    key={r.id}
                    region={r}
                    isSelected={selectedRegion?.name === r.name}
                    onClick={() => setSelectedRegion(r)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Charts + Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {!selectedRegion ? (
            <div className="card" style={{ textAlign: 'center', padding: '80px 40px', color: 'var(--text-secondary)' }}>
              <BarChart2 size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <h3 style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>Select a Region</h3>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Upload a CSV and click a region card to explore its hourly energy data.</p>
            </div>
          ) : (
            <>
              {/* Stats bar */}
              {regionStats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Total Records', value: regionStats.record_count?.toLocaleString(), color: 'var(--primary-color)' },
                    { label: 'Average (MW)', value: regionStats.avg_mw?.toLocaleString(), color: 'var(--accent-blue)' },
                    { label: 'Peak (MW)', value: regionStats.peak_mw?.toLocaleString(), color: 'var(--accent-orange)' },
                    { label: 'Minimum (MW)', value: regionStats.min_mw?.toLocaleString(), color: 'var(--accent-green)' },
                  ].map(s => (
                    <div key={s.label} className="card" style={{ padding: 16 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trendline Chart */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Hourly Consumption Trend</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {selectedRegion.display_name} — {chartData.length > 0 ? `${chartData.length} points shown` : ''}
                    </div>
                  </div>
                </div>
                {loading ? (
                  <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    Loading chart data...
                  </div>
                ) : (
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={v => {
                            const d = new Date(v);
                            return `${d.getDate()}/${d.getMonth()+1} ${String(d.getHours()).padStart(2,'0')}h`;
                          }}
                          axisLine={false} tickLine={false} tick={{ fontSize: 10 }}
                          interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
                        />
                        <YAxis
                          axisLine={false} tickLine={false} tick={{ fontSize: 11 }}
                          tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)', fontSize:'0.8rem' }}
                          formatter={(v) => [`${v.toLocaleString()} MW`, 'Consumption']}
                          labelFormatter={l => new Date(l).toLocaleString('en-GB', {dateStyle:'medium', timeStyle:'short'})}
                        />
                        {regionStats?.avg_mw && (
                          <ReferenceLine y={regionStats.avg_mw} stroke="var(--accent-orange)" strokeDasharray="4 4"
                            label={{ value: 'Avg', position: 'right', fontSize: 11, fill: 'var(--accent-orange)' }} />
                        )}
                        <Line
                          type="monotone" dataKey="mw_value" stroke="var(--primary-color)"
                          strokeWidth={1.5} dot={false} activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="card">
                <h3 style={{ margin: '0 0 16px 0', fontSize: '0.95rem' }}>
                  Hourly Data — {selectedRegion.name}
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 8 }}>
                    (first 500 records shown)
                  </span>
                </h3>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading data...</div>
                ) : (
                  <SortableTable data={regionData} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateWiseUsage;
