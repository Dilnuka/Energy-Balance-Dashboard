import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Zap, TrendingUp, Factory, Sun } from 'lucide-react';

const mockSectorData = [
  { name: 'Industrial', electricity: 4000, petroleum: 2400, biomass: 2400 },
  { name: 'Commercial', electricity: 3000, petroleum: 1398, biomass: 2210 },
  { name: 'Transport', electricity: 2000, petroleum: 9800, biomass: 2290 },
  { name: 'Household', electricity: 2780, petroleum: 3908, biomass: 2000 },
];

const mockEmissionsData = [
  { year: '2019', operating: 0.65, built: 0.58, average: 0.62 },
  { year: '2020', operating: 0.63, built: 0.55, average: 0.59 },
  { year: '2021', operating: 0.58, built: 0.52, average: 0.55 },
  { year: '2022', operating: 0.55, built: 0.50, average: 0.52 },
  { year: '2023', operating: 0.52, built: 0.48, average: 0.50 },
];

const KPI = ({ title, value, unit, trend, icon: Icon, positive }) => (
  <div className="card animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="card-title">{title}</div>
        <div className="kpi-value">{value} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{unit}</span></div>
        <div className={`kpi-trend ${positive ? 'positive' : 'negative'}`}>
          <TrendingUp size={16} style={{ transform: positive ? 'none' : 'rotate(180deg)' }} />
          {trend} vs last year
        </div>
      </div>
      <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '12px', color: 'var(--primary-color)' }}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2>National Energy Balance Overview</h2>
          <p>Real-time analytics for the Enhanced Transparency Framework (ETF)</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}>
            <option>Year: 2023</option>
            <option>Year: 2022</option>
            <option>Year: 2021</option>
          </select>
          <button className="btn btn-outline">Export PDF</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPI title="Total Primary Energy Supply" value="11,245" unit="ktoe" trend="+2.4%" icon={Zap} positive={false} />
        <KPI title="Renewable Energy Share" value="48.2" unit="%" trend="+5.1%" icon={Sun} positive={true} />
        <KPI title="Industrial EUI Avg" value="142" unit="kWh/m²" trend="-3.2%" icon={Factory} positive={true} />
      </div>

      <div className="charts-grid animate-fade-in delay-100">
        <div className="card">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Energy Consumption by ISIC Sector (ktoe)</span>
            <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Switch to TJ</button>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--bg-color)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="electricity" stackId="a" fill="var(--primary-color)" />
                <Bar dataKey="petroleum" stackId="a" fill="var(--accent-orange)" />
                <Bar dataKey="biomass" stackId="a" fill="var(--accent-green)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card animate-fade-in delay-200">
          <div className="card-title">Grid Emission Factor Trend (tCO₂/MWh)</div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockEmissionsData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Area type="monotone" dataKey="average" stroke="var(--accent-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
