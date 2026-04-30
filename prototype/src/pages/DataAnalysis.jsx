import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';
import { BarChart2, TrendingUp, Activity, Layers, RefreshCw, Info, Database, Wind, Zap, Share2 } from 'lucide-react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

const API = 'http://localhost:8000';
const FLOW_DATA_URL = '/data/energy_sankey.csv';

const COLORS = [
  '#1e3a8a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899'
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_TICKS = [0, 1, 2, 3, 4, 5, 6];
const heatColor = d3.scaleLinear()
  .domain([0.6, 1, 1.4])
  .range(['#dbeafe', '#60a5fa', '#1d4ed8'])
  .clamp(true);

const HeatCell = ({ cx, cy, payload }) => {
  if (!payload) return null;
  const size = 12;
  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      rx={3}
      ry={3}
      fill={heatColor(payload.intensity)}
      stroke="rgba(15, 23, 42, 0.08)"
    />
  );
};

/* ── Tooltip helpers ── */
const fmtVal = (v, unit = 'MW') => `${Number(v).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`;

const CustomTooltip = ({ active, payload, label, labelFmt, unit = 'MW' }) => {
  if (!active || !payload?.length) return null;

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border-color)',
      borderRadius: 8, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
      fontSize: '0.82rem'
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>
        {labelFmt ? labelFmt(label) : label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span>{p.name}</span><span style={{ fontWeight: 600 }}>{fmtVal(p.value, unit)}</span>
        </div>
      ))}
    </div>
  );
};

const formatFlowValue = (value, unit) => `${d3.format(',.0f')(value)} ${unit}`;

/* ── Section wrapper ── */
const Section = ({ title, subtitle, icon: Icon, children }) => (
  <div className="card" style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          {Icon && <Icon size={18} color="var(--primary-color)" />}
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</span>
        </div>
        {subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{subtitle}</div>}
      </div>
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
const DataAnalysis = () => {
  const [activeTab, setActiveTab] = useState('pjm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // PJM Data
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelected] = useState('');
  const [pjmAnalytics, setPjmAnalytics] = useState(null);
  const [comparison, setComparison] = useState([]);

  // Emissions Data
  const [emissionsData, setEmissionsData] = useState(null);

  // Renewables Data
  const [renewablesData, setRenewablesData] = useState(null);

  // Energy Flow (Sankey) Data
  const [flowRows, setFlowRows] = useState([]);
  const [flowYears, setFlowYears] = useState([]);
  const [flowYear, setFlowYear] = useState('');
  const [flowUnit, setFlowUnit] = useState('');
  const [flowLoading, setFlowLoading] = useState(false);
  const [flowError, setFlowError] = useState('');
  const flowContainerRef = useRef(null);
  const flowSvgRef = useRef(null);
  const flowTooltipRef = useRef(null);
  const [flowSize, setFlowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (activeTab === 'pjm') {
      fetch(`${API}/api/regions`).then(r => r.json()).then(setRegions).catch(() => { });
      fetch(`${API}/api/analytics/compare`).then(r => r.json()).then(setComparison).catch(() => { });
    } else if (activeTab === 'emissions') {
      setLoading(true);
      fetch(`${API}/api/analytics/emissions`)
        .then(r => r.json())
        .then(setEmissionsData)
        .catch(() => setError('Failed to load emissions data'))
        .finally(() => setLoading(false));
    } else if (activeTab === 'renewables') {
      setLoading(true);
      fetch(`${API}/api/analytics/renewables`)
        .then(r => r.json())
        .then(setRenewablesData)
        .catch(() => setError('Failed to load renewables data'))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'pjm' && selectedRegion) {
      setLoading(true);
      fetch(`${API}/api/regions/${selectedRegion}/analytics`)
        .then(r => r.json())
        .then(setPjmAnalytics)
        .finally(() => setLoading(false));
    }
  }, [selectedRegion, activeTab]);

  useEffect(() => {
    if (activeTab !== 'flow' || flowRows.length) return;

    setFlowLoading(true);
    setFlowError('');
    d3.csv(FLOW_DATA_URL, d => ({
      year: d.year,
      source: d.source,
      target: d.target,
      value: Number(d.value),
      unit: d.unit || 'PJ'
    }))
      .then(rows => {
        const years = Array.from(new Set(rows.map(r => r.year)))
          .sort((a, b) => Number(a) - Number(b));
        setFlowRows(rows);
        setFlowYears(years);
        setFlowYear(years[years.length - 1] || '');
        setFlowUnit(rows[0]?.unit || 'PJ');
      })
      .catch(() => setFlowError('Failed to load Sankey data.'))
      .finally(() => setFlowLoading(false));
  }, [activeTab, flowRows.length]);

  useEffect(() => {
    if (activeTab !== 'flow') return;
    const element = flowContainerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setFlowSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [activeTab]);

  const flowGraph = useMemo(() => {
    if (!flowYear || !flowRows.length) return null;
    const rows = flowRows.filter(r => String(r.year) === String(flowYear));
    const nodeNames = new Set();
    rows.forEach(row => {
      nodeNames.add(row.source);
      nodeNames.add(row.target);
    });
    const nodes = Array.from(nodeNames).map(name => ({ name }));
    const nodeIndex = new Map(nodes.map((node, index) => [node.name, index]));
    const links = rows.map(row => ({
      source: nodeIndex.get(row.source),
      target: nodeIndex.get(row.target),
      value: row.value
    }));

    return { nodes, links };
  }, [flowRows, flowYear]);

  useEffect(() => {
    if (activeTab !== 'flow' || !flowGraph || !flowSize.width || !flowSize.height) return;

    const svg = d3.select(flowSvgRef.current);
    svg.selectAll('*').remove();

    const tooltip = d3.select(flowTooltipRef.current);
    const formatValue = value => formatFlowValue(value, flowUnit || 'PJ');
    const linkColor = 'rgba(30, 90, 170, 0.55)';
    const nodeFill = name => {
      if (name.includes('Loss')) return '#0b3a6e';
      if (name.includes('Exports')) return '#0b4b8c';
      if (name.includes('Renewables')) return '#0f6fbf';
      return '#1f6fd6';
    };

    const showTooltip = (event, html) => {
      const bounds = flowContainerRef.current.getBoundingClientRect();
      const x = event.clientX - bounds.left + 12;
      const y = event.clientY - bounds.top + 12;
      tooltip
        .style('opacity', 1)
        .style('left', `${x}px`)
        .style('top', `${y}px`)
        .html(html);
    };

    const hideTooltip = () => {
      tooltip.style('opacity', 0);
    };

    const sankeyLayout = sankey()
      .nodeWidth(14)
      .nodePadding(12)
      .extent([[16, 16], [flowSize.width - 16, flowSize.height - 16]]);

    const graph = sankeyLayout({
      nodes: flowGraph.nodes.map(node => ({ ...node })),
      links: flowGraph.links.map(link => ({ ...link }))
    });

    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.45)
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', linkColor)
      .attr('stroke-width', d => Math.max(1, d.width))
      .on('mousemove', (event, d) => {
        showTooltip(event, `<div class="sankey-tooltip-title">${d.source.name} to ${d.target.name}</div><div class="sankey-tooltip-row">${formatValue(d.value)}</div>`);
      })
      .on('mouseleave', hideTooltip);

    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(graph.nodes)
      .join('g');

    nodeGroup.append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => nodeFill(d.name))
      .attr('stroke', '#0a2f5c')
      .attr('stroke-width', 1)
      .on('mousemove', (event, d) => {
        showTooltip(event, `<div class="sankey-tooltip-title">${d.name}</div><div class="sankey-tooltip-row">${formatValue(d.value)}</div>`);
      })
      .on('mouseleave', hideTooltip);

    const label = nodeGroup.append('text')
      .attr('x', d => (d.x0 < flowSize.width / 2 ? d.x1 + 10 : d.x0 - 10))
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('text-anchor', d => (d.x0 < flowSize.width / 2 ? 'start' : 'end'))
      .attr('fill', '#0f172a')
      .style('font-size', '12px');

    label.append('tspan')
      .attr('x', d => (d.x0 < flowSize.width / 2 ? d.x1 + 10 : d.x0 - 10))
      .attr('dy', '-0.2em')
      .style('font-weight', 600)
      .text(d => d.name);

    label.append('tspan')
      .attr('x', d => (d.x0 < flowSize.width / 2 ? d.x1 + 10 : d.x0 - 10))
      .attr('dy', '1.2em')
      .style('font-size', '11px')
      .style('fill', '#1e3a8a')
      .text(d => formatValue(d.value));
  }, [activeTab, flowGraph, flowSize, flowUnit]);

  const flowYearIndex = Math.max(0, flowYears.indexOf(flowYear));

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0 }}>Data Analysis</h2>
          <p style={{ margin: '4px 0 0 0' }}>Multivariate energy & environmental analytics dashboard.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, backgroundColor: 'white', padding: 4, borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
          {[
            { id: 'pjm', name: 'PJM Power', icon: Zap },
            { id: 'emissions', name: 'Emissions', icon: Database },
            { id: 'renewables', name: 'Renewables', icon: Wind },
            { id: 'flow', name: 'Energy Flow', icon: Share2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s'
              }}
            >
              <tab.icon size={16} />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="card" style={{ padding: 60, textAlign: 'center' }}>Loading analytics...</div>}

      {/* ── PJM VIEW ── */}
      {activeTab === 'pjm' && !loading && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <select
              value={selectedRegion}
              onChange={e => setSelected(e.target.value)}
              style={{
                padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border-color)',
                minWidth: 200, cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="">— Select PJM Region —</option>
              {regions.map(r => (
                <option key={r.name} value={r.name}>{r.name} — {r.display_name}</option>
              ))}
            </select>
          </div>

          {pjmAnalytics ? (
            <>
              <div className="pjm-kpi-grid">
                <div className="card">
                  <div className="card-title">Average Load</div>
                  <div className="kpi-value">{pjmAnalytics.overall_avg_mw.toLocaleString()} <span className="kpi-unit">MW</span></div>
                </div>
                <div className="card">
                  <div className="card-title">Peak Load</div>
                  <div className="kpi-value">{pjmAnalytics.overall_peak_mw.toLocaleString()} <span className="kpi-unit">MW</span></div>
                </div>
                <div className="card">
                  <div className="card-title">Records</div>
                  <div className="kpi-value">{pjmAnalytics.record_count.toLocaleString()} <span className="kpi-unit">hours</span></div>
                </div>
              </div>

              <div className="pjm-grid">
                <Section title="Hourly Profile" subtitle="Demand distribution by hour" icon={Activity}>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={pjmAnalytics.hourly_pattern}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" tickFormatter={h => `${h}:00`} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="avg_mw" name="Avg MW" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.12} />
                        <Area type="monotone" dataKey="peak_mw" name="Peak MW" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.08} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Section>

                <Section title="Day Pattern" subtitle="Weekday vs weekend load" icon={BarChart2}>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pjmAnalytics.day_pattern}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="avg_mw" name="Avg MW" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="peak_mw" name="Peak MW" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Section>
              </div>

              <div className="pjm-grid">
                <Section title="Monthly Trend" subtitle="Seasonality across months" icon={TrendingUp}>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pjmAnalytics.monthly_trend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tickFormatter={m => m.slice(2)} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="avg_mw" name="Avg MW" stroke="#1e3a8a" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="peak_mw" name="Peak MW" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Section>

                <Section title="Load Duration Curve" subtitle="Sorted hourly load profile" icon={Activity}>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pjmAnalytics.load_duration}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="percent" tickFormatter={p => `${p}%`} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip labelFmt={l => `Percentile ${l}%`} />} />
                        <Line type="monotone" dataKey="mw" name="MW" stroke="#1e3a8a" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Section>
              </div>

              <Section title="Weekday x Hour Heatmap" subtitle="Average MW intensity" icon={Layers}>
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 16, right: 24, left: 24, bottom: 24 }}>
                      <XAxis
                        type="number"
                        dataKey="hour"
                        domain={[0, 23]}
                        tickFormatter={h => `${h}:00`}
                        interval={3}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="number"
                        dataKey="weekday"
                        domain={[0, 6]}
                        ticks={DAY_TICKS}
                        tickFormatter={d => DAY_NAMES[d]}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                        reversed
                      />
                      <Tooltip
                        cursor={{ stroke: 'rgba(15, 23, 42, 0.1)' }}
                        content={<CustomTooltip unit="MW" labelFmt={label => `Hour ${label}`} />}
                      />
                      <Scatter data={pjmAnalytics.heatmap} shape={<HeatCell />} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="heatmap-legend">
                  <span className="legend-label">Lower</span>
                  <div className="legend-bar" />
                  <span className="legend-label">Higher</span>
                </div>
              </Section>

              {comparison.length > 0 && (
                <Section title="Region Comparison" subtitle="Average load across PJM regions" icon={Zap}>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparison} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="avg_mw" name="Avg MW" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Section>
              )}
            </>
          ) : (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
              Select a region to view detailed PJM power analytics.
            </div>
          )}
        </>
      )}

      {/* ── EMISSIONS VIEW ── */}
      {activeTab === 'emissions' && emissionsData && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Section title="Sector Breakdown" subtitle="CO2 emissions by industry sector" icon={Layers}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emissionsData.sector_breakdown}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {emissionsData.sector_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Fuel Contribution" subtitle="Emissions by fuel source" icon={Zap}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emissionsData.fuel_breakdown}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip unit="MT CO2" />} />
                  <Bar dataKey="value" name="MT CO2" radius={[4, 4, 0, 0]}>
                    {emissionsData.fuel_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <div style={{ gridColumn: 'span 2' }}>
            <Section title="Yearly Emissions Trend" subtitle="Historical CO2 levels (Million Metric Tons)" icon={TrendingUp}>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={emissionsData.yearly_trend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip unit="MT CO2" />} />
                    <Area type="monotone" dataKey="value" name="Total Emissions" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ── RENEWABLES VIEW ── */}
      {activeTab === 'renewables' && renewablesData && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Section title="Energy Mix" subtitle="Wind vs Solar production share" icon={Wind}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={renewablesData.source_breakdown}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {renewablesData.source_breakdown.map((entry, index) => {
                      const key = String(entry.name || entry.label || '').toLowerCase();
                      let color = '#3b82f6';
                      if (key.includes('solar')) color = '#f59e0b';
                      if (key.includes('wind')) color = '#10b981';
                      if (key.includes('mixed')) color = '#6366f1';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Seasonal Performance" subtitle="Average production (MWh) by season" icon={Activity}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={renewablesData.seasonal_performance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip unit="MWh" />} />
                  <Bar dataKey="value" name="Avg MWh" radius={[4, 4, 0, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <div style={{ gridColumn: 'span 2' }}>
            <Section title="Hourly Production Profile" subtitle="Diurnal renewable energy generation" icon={Zap}>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={renewablesData.hourly_profile}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="hour" tickFormatter={h => `${h}:00`} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip unit="MWh" />} />
                    <Area type="monotone" dataKey="value" name="Avg MWh" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ── ENERGY FLOW VIEW (SANKEY) ── */}
      {activeTab === 'flow' && (
        <Section
          title="Energy Balance Flow (Sankey)"
          subtitle="Full supply chain, from primary inputs to final use and losses."
          icon={Share2}
        >
          <div className="flow-panel">
            <div className="flow-header">
              <div>
                <div className="flow-title">Energy flow diagram</div>
                <div className="flow-meta">Sri Lanka · Year {flowYear || '—'} · {flowUnit || 'PJ'}</div>
              </div>
              <div className="flow-legend">
                <span className="flow-legend-dot" /> Total energy
              </div>
            </div>

            <div className="flow-timeline">
              <button className="flow-play" type="button" aria-label="Play timeline">▶</button>
              <div className="flow-slider">
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, flowYears.length - 1)}
                  value={flowYearIndex}
                  onChange={event => setFlowYear(flowYears[Number(event.target.value)])}
                  disabled={!flowYears.length}
                />
                <div className="flow-ticks">
                  {flowYears.map(year => (
                    <span key={year}>{year}</span>
                  ))}
                </div>
              </div>
            </div>

            {flowLoading && (
              <div className="flow-empty">Loading energy flow data...</div>
            )}

            {!flowLoading && flowError && (
              <div className="flow-empty">{flowError}</div>
            )}

            {!flowLoading && !flowError && (
              <div className="sankey-wrapper" ref={flowContainerRef}>
                <svg ref={flowSvgRef} width={flowSize.width} height={flowSize.height} />
                <div ref={flowTooltipRef} className="sankey-tooltip" />
              </div>
            )}
          </div>

          <div className="flow-note">
            <div className="flow-note-title">How to read this diagram:</div>
            <ul>
              <li><strong>Primary supply:</strong> Domestic extraction, imports, and renewables on the left.</li>
              <li><strong>Transformation:</strong> Power plants, refineries, and heat plants in the middle.</li>
              <li><strong>Final use:</strong> End-use sectors and exports on the right, with losses shown separately.</li>
              <li><em>Line thickness represents the magnitude of energy flow in the selected year.</em></li>
            </ul>
          </div>
        </Section>
      )}
    </div>
  );
};

export default DataAnalysis;
