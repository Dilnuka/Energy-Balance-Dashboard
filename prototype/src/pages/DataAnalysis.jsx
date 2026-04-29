import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';
import { BarChart2, TrendingUp, Activity, Layers, RefreshCw, Info } from 'lucide-react';

const API = 'http://localhost:8000';

const COLORS = [
  '#1e3a8a','#3b82f6','#10b981','#f59e0b','#ef4444',
  '#8b5cf6','#06b6d4','#f97316','#84cc16','#ec4899'
];

/* ── Tooltip helpers ── */
const fmtMW = v => `${Number(v).toLocaleString(undefined, {maximumFractionDigits:1})} MW`;

const CustomTooltip = ({ active, payload, label, labelFmt }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--border-color)',
      borderRadius:8, padding:'10px 14px', boxShadow:'var(--shadow-md)',
      fontSize:'0.82rem'
    }}>
      <div style={{fontWeight:600, marginBottom:4, color:'var(--text-primary)'}}>
        {labelFmt ? labelFmt(label) : label}
      </div>
      {payload.map((p,i) => (
        <div key={i} style={{color:p.color, display:'flex', justifyContent:'space-between', gap:16}}>
          <span>{p.name}</span><span style={{fontWeight:600}}>{fmtMW(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ── 24×7 Heatmap ── */
const HeatmapGrid = ({ data, overallAvg }) => {
  const HOURS = Array.from({length:24},(_,i)=>i);
  const DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const lookup = {};
  data.forEach(d => { lookup[`${d.weekday}-${d.hour}`] = d; });

  const intensityColor = (intensity) => {
    // Blue (low) → white (avg) → red (high)
    if (!intensity) return '#f0f9ff';
    if (intensity < 0.8)  return `hsl(213, ${Math.round((1-intensity)*120+20)}%, ${Math.round(60+intensity*25)}%)`;
    if (intensity < 1.0)  return `hsl(213, 40%, ${Math.round(85-(1-intensity)*30)}%)`;
    if (intensity < 1.2)  return `hsl(25, ${Math.round((intensity-1)*200+30)}%, ${Math.round(90-(intensity-1)*40)}%)`;
    return `hsl(0, ${Math.min(100,Math.round((intensity-1)*150))}%, ${Math.round(Math.max(40, 80-(intensity-1.2)*100))}%)`;
  };

  return (
    <div style={{overflowX:'auto'}}>
      <div style={{display:'grid', gridTemplateColumns:`60px repeat(24, 1fr)`, gap:2, minWidth:700}}>
        {/* Header row: hours */}
        <div style={{fontSize:'0.7rem', color:'var(--text-secondary)', display:'flex', alignItems:'center'}}>Day / Hr</div>
        {HOURS.map(h=>(
          <div key={h} style={{fontSize:'0.65rem', color:'var(--text-secondary)', textAlign:'center', paddingBottom:4}}>
            {h.toString().padStart(2,'0')}
          </div>
        ))}
        {/* Data rows: days */}
        {DAYS.map((day, di) => (
          <React.Fragment key={day}>
            <div style={{
              fontSize:'0.75rem', fontWeight:600, color:'var(--text-secondary)',
              display:'flex', alignItems:'center', paddingRight:8
            }}>{day}</div>
            {HOURS.map(h => {
              const cell = lookup[`${di}-${h}`];
              const intensity = cell?.intensity ?? 1;
              const mw = cell?.avg_mw;
              return (
                <div
                  key={h}
                  title={mw ? `${day} ${h}:00 → ${fmtMW(mw)} (×${intensity.toFixed(2)} avg)` : 'No data'}
                  style={{
                    backgroundColor: intensityColor(intensity),
                    borderRadius:3, height:28,
                    border:'1px solid rgba(0,0,0,0.04)',
                    transition:'transform 0.1s',
                    cursor:'default',
                  }}
                  onMouseEnter={e=>e.currentTarget.style.transform='scale(1.2)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {/* Legend */}
      <div style={{display:'flex', alignItems:'center', gap:6, marginTop:12, fontSize:'0.72rem', color:'var(--text-secondary)'}}>
        <span>Low</span>
        <div style={{display:'flex', gap:2}}>
          {[0.6,0.75,0.9,1.0,1.1,1.25,1.4].map(v=>(
            <div key={v} style={{width:20, height:12, borderRadius:2, backgroundColor:intensityColor(v)}}/>
          ))}
        </div>
        <span>High</span>
        <span style={{marginLeft:8}}>— relative to overall average ({fmtMW(overallAvg)})</span>
      </div>
    </div>
  );
};

/* ── Section wrapper ── */
const Section = ({ title, subtitle, icon: Icon, children }) => (
  <div className="card" style={{marginBottom:24}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20}}>
      <div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:4}}>
          {Icon && <Icon size={18} color="var(--primary-color)" />}
          <span style={{fontWeight:700, fontSize:'1rem'}}>{title}</span>
        </div>
        {subtitle && <div style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>{subtitle}</div>}
      </div>
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
const DataAnalysis = () => {
  const [regions, setRegions]       = useState([]);
  const [selectedRegion, setSelected] = useState('');
  const [analytics, setAnalytics]   = useState(null);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    fetch(`${API}/api/regions`)
      .then(r=>r.json()).then(setRegions).catch(()=>{});
    fetch(`${API}/api/analytics/compare`)
      .then(r=>r.json()).then(setComparison).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!selectedRegion) return;
    setLoading(true); setError('');
    fetch(`${API}/api/regions/${selectedRegion}/analytics`)
      .then(r=>r.json())
      .then(d => { if (d.error) setError(d.error); else setAnalytics(d); })
      .catch(()=>setError('Failed to load analytics.'))
      .finally(()=>setLoading(false));
  }, [selectedRegion]);

  const refresh = () => {
    fetch(`${API}/api/regions`).then(r=>r.json()).then(setRegions).catch(()=>{});
    fetch(`${API}/api/analytics/compare`).then(r=>r.json()).then(setComparison).catch(()=>{});
    if (selectedRegion) setSelected(prev => { const tmp=prev; setSelected(''); setTimeout(()=>setSelected(tmp),50); return ''; });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28}}>
        <div>
          <h2 style={{margin:0}}>Data Analysis</h2>
          <p style={{margin:'4px 0 0 0'}}>
            Deep-dive into PJM energy patterns — hourly profiles, seasonal trends, load duration, and demand heatmaps.
          </p>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <select
            value={selectedRegion}
            onChange={e=>setSelected(e.target.value)}
            style={{
              padding:'9px 16px', borderRadius:8, border:'1px solid var(--border-color)',
              fontFamily:'inherit', fontSize:'0.875rem', outline:'none',
              minWidth:180, cursor:'pointer'
            }}
          >
            <option value="">— Select Region —</option>
            {regions.map(r=>(
              <option key={r.name} value={r.name}>{r.name} — {r.display_name}</option>
            ))}
          </select>
          <button className="btn btn-outline" onClick={refresh} title="Refresh data">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* ── 1. Region Comparison ── */}
      {comparison.length > 0 && (
        <Section
          title="Region Comparison"
          subtitle="Average and peak MW consumption across all uploaded regions"
          icon={Layers}
        >
          <div style={{height:280}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison} margin={{top:10, right:20, left:10, bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fontSize:12, fontWeight:600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{fontSize:'0.8rem'}} />
                <Bar dataKey="avg_mw" name="Avg MW" radius={[4,4,0,0]}>
                  {comparison.map((_,i)=><Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
                <Bar dataKey="peak_mw" name="Peak MW" fill="#f59e0b" opacity={0.55} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      )}

      {/* No region selected message */}
      {!selectedRegion && (
        <div className="card" style={{textAlign:'center', padding:'60px 40px', color:'var(--text-secondary)'}}>
          <BarChart2 size={48} style={{marginBottom:16, opacity:0.25}} />
          <h3 style={{color:'var(--text-secondary)', margin:'0 0 8px 0'}}>Select a Region to Analyse</h3>
          <p style={{margin:0, fontSize:'0.875rem'}}>
            Choose a region from the dropdown above to view detailed analytics.<br/>
            Upload CSV files in the <strong>State-wise Usage</strong> section first if no regions appear.
          </p>
        </div>
      )}

      {loading && (
        <div className="card" style={{textAlign:'center', padding:48, color:'var(--text-secondary)'}}>
          <div style={{fontSize:'0.875rem'}}>Computing analytics for <strong>{selectedRegion}</strong>…</div>
        </div>
      )}

      {error && (
        <div style={{
          padding:'14px 18px', borderRadius:8, backgroundColor:'#fee2e2',
          color:'#991b1b', fontSize:'0.875rem', marginBottom:20
        }}>
          {error}
        </div>
      )}

      {analytics && !loading && (
        <>
          {/* KPI row */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24}}>
            {[
              {label:'Region', value: `${analytics.region} — ${analytics.display_name}`, color:'var(--primary-color)'},
              {label:'Overall Average', value: fmtMW(analytics.overall_avg_mw), color:'var(--accent-blue)'},
              {label:'All-time Peak', value: fmtMW(analytics.overall_peak_mw), color:'var(--accent-orange)'},
            ].map(k=>(
              <div key={k.label} className="card" style={{padding:16}}>
                <div style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:6}}>{k.label}</div>
                <div style={{fontSize:'1.25rem', fontWeight:700, color:k.color}}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* ── 2. Hourly Pattern ── */}
          <Section
            title="Hourly Consumption Profile (0 – 23 h)"
            subtitle="Average, peak, and minimum MW by hour of day — reveals morning ramp-up and evening peak"
            icon={Activity}
          >
            <div style={{height:300}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.hourly_pattern} margin={{top:10,right:20,left:10,bottom:5}}>
                  <defs>
                    <linearGradient id="gradAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1e3a8a" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
                  <XAxis
                    dataKey="hour"
                    axisLine={false} tickLine={false}
                    tick={{fontSize:11}}
                    tickFormatter={h=>`${String(h).padStart(2,'0')}:00`}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize:11}}
                    tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip labelFmt={h=>`Hour ${String(h).padStart(2,'0')}:00`} />} />
                  <Legend iconType="circle" wrapperStyle={{fontSize:'0.8rem'}}/>
                  <Area type="monotone" dataKey="min_mw"  name="Min MW"  stroke="#10b981" strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false}/>
                  <Area type="monotone" dataKey="avg_mw"  name="Avg MW"  stroke="#1e3a8a" strokeWidth={2.5} fill="url(#gradAvg)" dot={false}/>
                  <Area type="monotone" dataKey="peak_mw" name="Peak MW" stroke="#f59e0b" strokeWidth={1.5} fill="url(#gradPeak)" dot={false}/>
                  <ReferenceLine y={analytics.overall_avg_mw} stroke="#94a3b8" strokeDasharray="5 4"
                    label={{value:'Overall Avg', position:'right', fontSize:10, fill:'#94a3b8'}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* ── 3. Day of Week + Monthly Trend side by side ── */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24}}>

            {/* Day-of-Week */}
            <div className="card">
              <div style={{fontWeight:700, marginBottom:4}}>Day-of-Week Demand Pattern</div>
              <div style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:16}}>
                Avg and peak MW by weekday — weekend dip visible for commercial regions
              </div>
              <div style={{height:240}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.day_pattern} margin={{top:5,right:10,left:0,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:12}}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize:11}}
                      tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                    <Tooltip content={<CustomTooltip />}/>
                    <Legend iconType="circle" wrapperStyle={{fontSize:'0.8rem'}}/>
                    <Bar dataKey="avg_mw"  name="Avg MW"  fill="#1e3a8a" radius={[4,4,0,0]}>
                      {analytics.day_pattern.map((d,i)=>(
                        <Cell key={i} fill={['Sat','Sun'].includes(d.day) ? '#94a3b8' : '#1e3a8a'}/>
                      ))}
                    </Bar>
                    <Bar dataKey="peak_mw" name="Peak MW" fill="#f59e0b" opacity={0.6} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="card">
              <div style={{fontWeight:700, marginBottom:4}}>Monthly Demand Trend</div>
              <div style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:16}}>
                Average MW per month — seasonal summer/winter peaks clearly visible
              </div>
              <div style={{height:240}}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthly_trend} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs>
                      <linearGradient id="gradMonth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
                    <XAxis
                      dataKey="month" axisLine={false} tickLine={false}
                      tick={{fontSize:10}} interval={Math.max(0, Math.floor(analytics.monthly_trend.length/8)-1)}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize:11}}
                      tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                    <Tooltip content={<CustomTooltip />}/>
                    <Area type="monotone" dataKey="avg_mw" name="Avg MW"
                      stroke="#10b981" strokeWidth={2} fill="url(#gradMonth)" dot={false}/>
                    <Line type="monotone" dataKey="peak_mw" name="Peak MW"
                      stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 3"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── 4. Load Duration Curve ── */}
          <Section
            title="Load Duration Curve"
            subtitle={`Sorted MW values from highest to lowest — X-axis = % of total hours. Area above the curve = energy served.`}
            icon={TrendingUp}
          >
            <div style={{height:280}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.load_duration} margin={{top:10,right:20,left:10,bottom:5}}>
                  <defs>
                    <linearGradient id="gradDur" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
                  <XAxis dataKey="percent" axisLine={false} tickLine={false} tick={{fontSize:11}}
                    tickFormatter={v=>`${v}%`} label={{value:'% of Hours', position:'insideBottomRight', offset:-5, fontSize:11, fill:'#94a3b8'}}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize:11}}
                    tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip
                    content={<CustomTooltip labelFmt={v=>`Top ${v}% of hours`} />}
                  />
                  <ReferenceLine y={analytics.overall_avg_mw} stroke="#94a3b8" strokeDasharray="5 4"
                    label={{value:'Avg', position:'right', fontSize:10, fill:'#94a3b8'}}/>
                  <Area type="monotone" dataKey="mw" name="Demand MW"
                    stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradDur)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{marginTop:12, padding:'10px 14px', backgroundColor:'#f0f9ff', borderRadius:8, fontSize:'0.8rem', color:'#0c4a6e', display:'flex', gap:6}}>
              <Info size={15} style={{marginTop:1, flexShrink:0}}/>
              <span>
                The load duration curve shows demand intensity distribution. A steep early drop indicates sharp peak periods;
                a flat curve means consistent base load. This is essential for grid planning and capacity investment decisions.
              </span>
            </div>
          </Section>

          {/* ── 5. Heatmap ── */}
          <Section
            title="Demand Heatmap — Hour × Day of Week"
            subtitle="Colour intensity = demand relative to overall average. Red = high demand, Blue = low demand."
            icon={Layers}
          >
            <HeatmapGrid data={analytics.heatmap} overallAvg={analytics.overall_avg_mw} />
          </Section>
        </>
      )}
    </div>
  );
};

export default DataAnalysis;
