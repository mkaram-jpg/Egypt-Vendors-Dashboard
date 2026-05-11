import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter
} from "recharts";

const RAW = [
  { riderId:"R1001",riderName:"Ahmed Hassan",   vendorId:"V001",vendorName:"Bosta",   area:"Cairo",        date:"2025-05-01",slot:"08:00-10:00",storeId:"ST01",storeName:"Maadi Branch",      forecast:8.5,actual:7.2,orders:18,lateLogin:12,earlyLogout:0  },
  { riderId:"R1002",riderName:"Mohamed Ali",    vendorId:"V002",vendorName:"Trella",  area:"Giza",         date:"2025-05-01",slot:"10:00-12:00",storeId:"ST02",storeName:"Dokki Branch",      forecast:9.0,actual:8.1,orders:22,lateLogin:5, earlyLogout:0  },
  { riderId:"R1003",riderName:"Sara Ibrahim",   vendorId:"V003",vendorName:"Quiqup",  area:"Alexandria",   date:"2025-05-01",slot:"12:00-14:00",storeId:"ST03",storeName:"Heliopolis Branch",forecast:7.5,actual:5.8,orders:14,lateLogin:35,earlyLogout:20 },
  { riderId:"R1004",riderName:"Youssef Khaled", vendorId:"V004",vendorName:"Fetchr",  area:"New Cairo",    date:"2025-05-01",slot:"14:00-16:00",storeId:"ST04",storeName:"Zamalek Branch",   forecast:8.0,actual:7.9,orders:25,lateLogin:3, earlyLogout:0  },
  { riderId:"R1005",riderName:"Nour El-Din",    vendorId:"V005",vendorName:"Aramex",  area:"6th October",  date:"2025-05-01",slot:"16:00-18:00",storeId:"ST05",storeName:"Nasr City Branch", forecast:9.5,actual:6.2,orders:11,lateLogin:45,earlyLogout:30 },
  { riderId:"R1006",riderName:"Laila Mostafa",  vendorId:"V001",vendorName:"Bosta",   area:"Cairo",        date:"2025-05-02",slot:"08:00-10:00",storeId:"ST01",storeName:"Maadi Branch",      forecast:8.0,actual:7.8,orders:20,lateLogin:8, earlyLogout:0  },
  { riderId:"R1007",riderName:"Kareem Sami",    vendorId:"V002",vendorName:"Trella",  area:"Giza",         date:"2025-05-02",slot:"10:00-12:00",storeId:"ST02",storeName:"Dokki Branch",      forecast:7.5,actual:7.0,orders:19,lateLogin:0, earlyLogout:5  },
  { riderId:"R1008",riderName:"Hana Adel",      vendorId:"V003",vendorName:"Quiqup",  area:"Alexandria",   date:"2025-05-02",slot:"12:00-14:00",storeId:"ST03",storeName:"Heliopolis Branch",forecast:9.0,actual:8.5,orders:28,lateLogin:10,earlyLogout:0  },
  { riderId:"R1009",riderName:"Omar Tarek",     vendorId:"V004",vendorName:"Fetchr",  area:"New Cairo",    date:"2025-05-02",slot:"14:00-16:00",storeId:"ST04",storeName:"Zamalek Branch",   forecast:8.5,actual:6.0,orders:12,lateLogin:40,earlyLogout:25 },
  { riderId:"R1010",riderName:"Mona Fawzy",     vendorId:"V005",vendorName:"Aramex",  area:"6th October",  date:"2025-05-02",slot:"16:00-18:00",storeId:"ST05",storeName:"Nasr City Branch", forecast:7.0,actual:6.8,orders:16,lateLogin:5, earlyLogout:0  },
  { riderId:"R1011",riderName:"Amr Wael",       vendorId:"V001",vendorName:"Bosta",   area:"Cairo",        date:"2025-05-03",slot:"18:00-20:00",storeId:"ST01",storeName:"Maadi Branch",      forecast:9.0,actual:8.8,orders:30,lateLogin:0, earlyLogout:0  },
  { riderId:"R1012",riderName:"Fatma Saleh",    vendorId:"V002",vendorName:"Trella",  area:"Giza",         date:"2025-05-03",slot:"20:00-22:00",storeId:"ST02",storeName:"Dokki Branch",      forecast:8.5,actual:7.5,orders:21,lateLogin:15,earlyLogout:10 },
  { riderId:"R1013",riderName:"Tarek Nabil",    vendorId:"V003",vendorName:"Quiqup",  area:"Alexandria",   date:"2025-05-03",slot:"08:00-10:00",storeId:"ST03",storeName:"Heliopolis Branch",forecast:7.0,actual:7.0,orders:17,lateLogin:0, earlyLogout:0  },
  { riderId:"R1014",riderName:"Dina Ramzy",     vendorId:"V004",vendorName:"Fetchr",  area:"New Cairo",    date:"2025-05-03",slot:"10:00-12:00",storeId:"ST04",storeName:"Zamalek Branch",   forecast:9.5,actual:8.2,orders:26,lateLogin:20,earlyLogout:0  },
  { riderId:"R1015",riderName:"Hassan Kamel",   vendorId:"V005",vendorName:"Aramex",  area:"6th October",  date:"2025-05-03",slot:"12:00-14:00",storeId:"ST05",storeName:"Nasr City Branch", forecast:8.0,actual:5.5,orders:10,lateLogin:50,earlyLogout:35 },
  { riderId:"R1016",riderName:"Aya Mahmoud",    vendorId:"V001",vendorName:"Bosta",   area:"Cairo",        date:"2025-05-04",slot:"14:00-16:00",storeId:"ST01",storeName:"Maadi Branch",      forecast:7.5,actual:7.3,orders:23,lateLogin:5, earlyLogout:0  },
  { riderId:"R1017",riderName:"Sherif Emad",    vendorId:"V002",vendorName:"Trella",  area:"Giza",         date:"2025-05-04",slot:"16:00-18:00",storeId:"ST02",storeName:"Dokki Branch",      forecast:9.0,actual:8.9,orders:29,lateLogin:0, earlyLogout:0  },
  { riderId:"R1018",riderName:"Rania Yousry",   vendorId:"V003",vendorName:"Quiqup",  area:"Alexandria",   date:"2025-05-04",slot:"18:00-20:00",storeId:"ST03",storeName:"Heliopolis Branch",forecast:8.5,actual:6.5,orders:15,lateLogin:30,earlyLogout:20 },
  { riderId:"R1019",riderName:"Khaled Magdy",   vendorId:"V004",vendorName:"Fetchr",  area:"New Cairo",    date:"2025-05-04",slot:"20:00-22:00",storeId:"ST04",storeName:"Zamalek Branch",   forecast:7.0,actual:6.9,orders:18,lateLogin:3, earlyLogout:0  },
  { riderId:"R1020",riderName:"Noha Essam",     vendorId:"V005",vendorName:"Aramex",  area:"6th October",  date:"2025-05-04",slot:"08:00-10:00",storeId:"ST05",storeName:"Nasr City Branch", forecast:9.5,actual:9.0,orders:27,lateLogin:0, earlyLogout:0  },
  { riderId:"R1021",riderName:"Bassem Lotfy",   vendorId:"V001",vendorName:"Bosta",   area:"Cairo",        date:"2025-05-05",slot:"10:00-12:00",storeId:"ST01",storeName:"Maadi Branch",      forecast:8.0,actual:7.1,orders:20,lateLogin:18,earlyLogout:8  },
  { riderId:"R1022",riderName:"Manal Hamdy",    vendorId:"V002",vendorName:"Trella",  area:"Giza",         date:"2025-05-05",slot:"12:00-14:00",storeId:"ST02",storeName:"Dokki Branch",      forecast:7.5,actual:7.4,orders:22,lateLogin:0, earlyLogout:0  },
  { riderId:"R1023",riderName:"Wael Shaker",    vendorId:"V003",vendorName:"Quiqup",  area:"Alexandria",   date:"2025-05-05",slot:"14:00-16:00",storeId:"ST03",storeName:"Heliopolis Branch",forecast:9.0,actual:8.0,orders:24,lateLogin:12,earlyLogout:5  },
  { riderId:"R1024",riderName:"Salma Gamal",    vendorId:"V004",vendorName:"Fetchr",  area:"New Cairo",    date:"2025-05-05",slot:"16:00-18:00",storeId:"ST04",storeName:"Zamalek Branch",   forecast:8.5,actual:4.5,orders:9, lateLogin:55,earlyLogout:40 },
  { riderId:"R1025",riderName:"Adel Zaki",      vendorId:"V005",vendorName:"Aramex",  area:"6th October",  date:"2025-05-05",slot:"18:00-20:00",storeId:"ST05",storeName:"Nasr City Branch", forecast:7.0,actual:6.5,orders:16,lateLogin:8, earlyLogout:0  },
].map(r => ({
  ...r,
  supplyPct: r.actual / r.forecast,
  hoursDiff: r.actual - r.forecast,
  adherence: Math.max(0, 1 - r.lateLogin/480 - r.earlyLogout/480),
}));

const VENDORS = [...new Set(RAW.map(r => r.vendorName))];
const AREAS   = [...new Set(RAW.map(r => r.area))];
const DATES   = [...new Set(RAW.map(r => r.date))].sort();
const SLOTS   = ["08:00-10:00","10:00-12:00","12:00-14:00","14:00-16:00","16:00-18:00","18:00-20:00","20:00-22:00"];
const STORES  = [...new Set(RAW.map(r => r.storeName))];

const PALETTE = {
  Bosta:"#3B82F6", Trella:"#10B981", Quiqup:"#F59E0B", Fetchr:"#EF4444", Aramex:"#8B5CF6",
  Cairo:"#3B82F6", Giza:"#10B981", Alexandria:"#F59E0B", "New Cairo":"#EF4444", "6th October":"#8B5CF6",
};
const NOON_GOLD = "#FFD700";

function pct(v) { return (v*100).toFixed(1)+"%"; }
function fix1(v) { return (+v).toFixed(1); }

function StatusBadge({v}) {
  if (v >= 0.9) return <span style={{background:"#d1fae5",color:"#065f46",padding:"2px 8px",borderRadius:12,fontSize:11,fontWeight:600}}>✓ Good</span>;
  if (v >= 0.7) return <span style={{background:"#fef3c7",color:"#92400e",padding:"2px 8px",borderRadius:12,fontSize:11,fontWeight:600}}>⚠ Warn</span>;
  return <span style={{background:"#fee2e2",color:"#991b1b",padding:"2px 8px",borderRadius:12,fontSize:11,fontWeight:600}}>✗ Low</span>;
}

function KpiCard({label, value, sub, color="#3B82F6", icon}) {
  return (
    <div style={{background:"#1e293b",borderRadius:12,padding:"16px 18px",borderLeft:`4px solid ${color}`,flex:"1 1 160px"}}>
      <div style={{fontSize:11,color:"#94a3b8",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{icon} {label}</div>
      <div style={{fontSize:26,fontWeight:700,color:"#f1f5f9"}}>{value}</div>
      {sub && <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{sub}</div>}
    </div>
  );
}

function FilterBar({vendors, areas, dates, slots, selected, onChange}) {
  const MultiSel = ({label, options, field, color}) => (
    <div style={{flex:"1 1 140px"}}>
      <div style={{fontSize:10,color:"#94a3b8",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8}}>{label}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        <button onClick={() => onChange(field, [])}
          style={{padding:"3px 8px",borderRadius:20,fontSize:10,border:"1px solid #334155",background:selected[field].length===0?"#3B82F6":"#1e293b",color:"#f1f5f9",cursor:"pointer"}}>
          All
        </button>
        {options.map(o => {
          const on = selected[field].includes(o);
          return <button key={o} onClick={() => {
            const cur = selected[field];
            onChange(field, on ? cur.filter(x=>x!==o) : [...cur,o]);
          }} style={{padding:"3px 8px",borderRadius:20,fontSize:10,border:`1px solid ${on?(PALETTE[o]||color):"#334155"}`,
            background: on ? (PALETTE[o]||color) : "#1e293b",color:"#f1f5f9",cursor:"pointer"}}>
            {o}
          </button>;
        })}
      </div>
    </div>
  );
  return (
    <div style={{background:"#0f172a",borderRadius:12,padding:"14px 16px",marginBottom:16,display:"flex",flexWrap:"wrap",gap:16,border:"1px solid #1e293b"}}>
      <MultiSel label="Vendor" options={vendors} field="vendors" color="#3B82F6"/>
      <MultiSel label="Area" options={areas} field="areas" color="#10B981"/>
      <MultiSel label="Date" options={dates} field="dates" color="#F59E0B"/>
      <MultiSel label="Time Slot" options={slots} field="slots" color="#8B5CF6"/>
    </div>
  );
}

const TABS = ["Overview","Vendor Performance","Hourly Supply","Rider Adherence","Daily Summary","Raw Data"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState({vendors:[], areas:[], dates:[], slots:[]});

  function updateFilter(field, val) { setFilters(f => ({...f, [field]: val})); }

  const data = useMemo(() => RAW.filter(r =>
    (filters.vendors.length===0 || filters.vendors.includes(r.vendorName)) &&
    (filters.areas.length===0   || filters.areas.includes(r.area)) &&
    (filters.dates.length===0   || filters.dates.includes(r.date)) &&
    (filters.slots.length===0   || filters.slots.includes(r.slot))
  ), [filters]);

  const totalForecast = data.reduce((s,r)=>s+r.forecast,0);
  const totalActual   = data.reduce((s,r)=>s+r.actual,0);
  const totalOrders   = data.reduce((s,r)=>s+r.orders,0);
  const avgSupply     = data.length ? data.reduce((s,r)=>s+r.supplyPct,0)/data.length : 0;
  const avgAdherence  = data.length ? data.reduce((s,r)=>s+r.adherence,0)/data.length : 0;
  const avgLate       = data.length ? data.reduce((s,r)=>s+r.lateLogin,0)/data.length : 0;

  const vendorStats = VENDORS.map(v => {
    const rows = data.filter(r=>r.vendorName===v);
    if (!rows.length) return null;
    const fc = rows.reduce((s,r)=>s+r.forecast,0);
    const ac = rows.reduce((s,r)=>s+r.actual,0);
    return {
      name:v, riders: rows.length,
      forecast: +fc.toFixed(1), actual: +ac.toFixed(1),
      supply: +(ac/fc*100).toFixed(1),
      orders: rows.reduce((s,r)=>s+r.orders,0),
      lateLogin: +(rows.reduce((s,r)=>s+r.lateLogin,0)/rows.length).toFixed(1),
      earlyLogout: +(rows.reduce((s,r)=>s+r.earlyLogout,0)/rows.length).toFixed(1),
      adherence: +(rows.reduce((s,r)=>s+r.adherence,0)/rows.length*100).toFixed(1),
    };
  }).filter(Boolean);

  const slotStats = SLOTS.map(slot => {
    const rows = data.filter(r=>r.slot===slot);
    const fc = rows.reduce((s,r)=>s+r.forecast,0);
    const ac = rows.reduce((s,r)=>s+r.actual,0);
    const obj = {slot: slot.replace(":00",""), supply: fc ? +(ac/fc*100).toFixed(1) : 0, orders: rows.reduce((s,r)=>s+r.orders,0)};
    VENDORS.forEach(v => {
      const vr = rows.filter(r=>r.vendorName===v);
      const vf = vr.reduce((s,r)=>s+r.forecast,0);
      const va = vr.reduce((s,r)=>s+r.actual,0);
      obj[v] = vf ? +(va/vf*100).toFixed(1) : null;
    });
    return obj;
  });

  const storeStats = STORES.map(s => {
    const rows = data.filter(r=>r.storeName===s);
    const fc = rows.reduce((x,r)=>x+r.forecast,0);
    const ac = rows.reduce((x,r)=>x+r.actual,0);
    return {store: s.replace(" Branch",""), supply: fc ? +(ac/fc*100).toFixed(1):0, orders: rows.reduce((x,r)=>x+r.orders,0), riders: rows.length};
  });

  const dateStats = DATES.map(d => {
    const rows = data.filter(r=>r.date===d);
    const fc = rows.reduce((s,r)=>s+r.forecast,0);
    const ac = rows.reduce((s,r)=>s+r.actual,0);
    return {date: d.slice(5), supply: fc ? +(ac/fc*100).toFixed(1):0, actual: +ac.toFixed(1), forecast: +fc.toFixed(1), orders: rows.reduce((s,r)=>s+r.orders,0)};
  });

  const pieData = vendorStats.map(v => ({name:v.name, value: v.orders}));

  const S = {
    wrap: {minHeight:"100vh",background:"#0a0f1e",fontFamily:"'Inter',sans-serif",color:"#f1f5f9",padding:"0 0 40px"},
    header: {background:"linear-gradient(135deg,#0a0f1e 0%,#1a1f3a 100%)",borderBottom:"1px solid #1e293b",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"},
    logo: {display:"flex",alignItems:"center",gap:10},
    tabBar: {display:"flex",gap:2,padding:"0 24px",background:"#0f172a",borderBottom:"1px solid #1e293b"},
    tab: (active) => ({padding:"12px 18px",fontSize:12,fontWeight:500,border:"none",background:"transparent",cursor:"pointer",borderBottom:`2px solid ${active?"#FFD700":"transparent"}`,color:active?"#FFD700":"#94a3b8",transition:"all 0.2s",textTransform:"uppercase",letterSpacing:0.8}),
    content: {padding:"20px 24px"},
    grid: {display:"flex",flexWrap:"wrap",gap:12,marginBottom:20},
    panel: {background:"#1e293b",borderRadius:12,padding:"16px",border:"1px solid #334155"},
    panelTitle: {fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:12,textTransform:"uppercase",letterSpacing:1},
    table: {width:"100%",borderCollapse:"collapse",fontSize:12},
    th: {padding:"8px 10px",textAlign:"left",background:"#0f172a",color:"#94a3b8",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:0.8,borderBottom:"1px solid #334155"},
    td: (i) => ({padding:"9px 10px",borderBottom:"1px solid #1e293b",color:"#e2e8f0",background:i%2===0?"#1e293b":"#162032",fontSize:12}),
  };

  const tooltipStyle = {contentStyle:{background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#f1f5f9",fontSize:12}};

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={S.logo}>
          <div style={{width:36,height:36,background:NOON_GOLD,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#000",fontSize:16}}>N</div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",letterSpacing:-0.5}}>Noon Egypt</div>
            <div style={{fontSize:10,color:"#64748b",letterSpacing:1}}>VENDOR & RIDER OPERATIONS</div>
          </div>
        </div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:"#64748b"}}>ACTIVE RECORDS</div>
            <div style={{fontSize:18,fontWeight:700,color:NOON_GOLD}}>{data.length} / {RAW.length}</div>
          </div>
          <div style={{width:1,height:32,background:"#334155"}}/>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:"#64748b"}}>SUPPLY AVAIL</div>
            <div style={{fontSize:18,fontWeight:700,color: avgSupply>=0.9?"#10B981":avgSupply>=0.7?"#F59E0B":"#EF4444"}}>{pct(avgSupply)}</div>
          </div>
        </div>
      </div>

      <div style={S.tabBar}>
        {TABS.map((t,i) => <button key={t} style={S.tab(tab===i)} onClick={()=>setTab(i)}>{t}</button>)}
      </div>

      <div style={S.content}>
        <FilterBar vendors={VENDORS} areas={AREAS} dates={DATES} slots={SLOTS} selected={filters} onChange={updateFilter}/>

        {/* ── OVERVIEW ── */}
        {tab===0 && (
          <div>
            <div style={S.grid}>
              <KpiCard label="Total Riders" value={data.length} sub={`across ${new Set(data.map(r=>r.vendorName)).size} vendors`} color="#3B82F6" icon="🚴"/>
              <KpiCard label="Forecasted Hours" value={fix1(totalForecast)} sub="total planned" color="#8B5CF6" icon="📅"/>
              <KpiCard label="Actual Hours" value={fix1(totalActual)} sub={`gap: ${fix1(totalActual-totalForecast)} hrs`} color="#10B981" icon="⏱"/>
              <KpiCard label="Supply Avail %" value={pct(avgSupply)} sub={avgSupply>=0.9?"On target":avgSupply>=0.7?"Needs attention":"Critical"} color={avgSupply>=0.9?"#10B981":avgSupply>=0.7?"#F59E0B":"#EF4444"} icon="📊"/>
              <KpiCard label="Total Orders" value={totalOrders} sub={`avg ${data.length?fix1(totalOrders/data.length):0}/rider`} color="#F59E0B" icon="📦"/>
              <KpiCard label="Avg Adherence" value={pct(avgAdherence)} sub={`avg late: ${fix1(avgLate)} min`} color="#EF4444" icon="⏰"/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div style={S.panel}>
                <div style={S.panelTitle}>Supply Availability by Vendor</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={vendorStats} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false}/>
                    <YAxis tick={{fill:"#94a3b8",fontSize:10}} axisLine={false} domain={[0,100]} tickFormatter={v=>v+"%"}/>
                    <Tooltip {...tooltipStyle} formatter={v=>[v+"%","Supply"]}/>
                    <Bar dataKey="supply" radius={[4,4,0,0]}>
                      {vendorStats.map((v,i) => <Cell key={i} fill={PALETTE[v.name]||"#3B82F6"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={S.panel}>
                <div style={S.panelTitle}>Orders by Vendor</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={3}>
                      {pieData.map((e,i) => <Cell key={i} fill={PALETTE[e.name]||"#64748b"}/>)}
                    </Pie>
                    <Tooltip {...tooltipStyle}/>
                    <Legend formatter={v=><span style={{color:"#94a3b8",fontSize:11}}>{v}</span>}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={S.panel}>
              <div style={S.panelTitle}>Daily Actual vs Forecasted Hours Trend</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={dateStats}>
                  <defs>
                    <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="date" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false}/>
                  <YAxis tick={{fill:"#94a3b8",fontSize:10}} axisLine={false}/>
                  <Tooltip {...tooltipStyle}/>
                  <Legend formatter={v=><span style={{color:"#94a3b8",fontSize:11}}>{v}</span>}/>
                  <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" fill="url(#gF)" name="Forecast Hrs" strokeWidth={2}/>
                  <Area type="monotone" dataKey="actual"   stroke="#10B981" fill="url(#gA)" name="Actual Hrs"   strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── VENDOR PERFORMANCE ── */}
        {tab===1 && (
          <div>
            <div style={S.grid}>
              {vendorStats.map(v => (
                <div key={v.name} style={{...S.panel,flex:"1 1 160px",borderTop:`3px solid ${PALETTE[v.name]}`}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",marginBottom:8}}>{v.name}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginBottom:2}}>Riders: <span style={{color:"#f1f5f9",fontWeight:600}}>{v.riders}</span></div>
                  <div style={{fontSize:11,color:"#94a3b8",marginBottom:2}}>Supply: <span style={{color:v.supply>=90?"#10B981":v.supply>=70?"#F59E0B":"#EF4444",fontWeight:700}}>{v.supply}%</span></div>
                  <div style={{fontSize:11,color:"#94a3b8",marginBottom:2}}>Orders: <span style={{color:"#f1f5f9",fontWeight:600}}>{v.orders}</span></div>
                  <div style={{fontSize:11,color:"#94a3b8",marginBottom:4}}>Adherence: <span style={{color:"#f1f5f9",fontWeight:600}}>{v.adherence}%</span></div>
                  <div style={{background:"#0f172a",borderRadius:6,height:6,marginTop:6}}>
                    <div style={{height:6,borderRadius:6,width:v.supply+"%",background:PALETTE[v.name],transition:"width 0.5s"}}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div style={S.panel}>
                <div style={S.panelTitle}>Actual vs Forecast Hours per Vendor</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={vendorStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false}/>
                    <YAxis tick={{fill:"#94a3b8",fontSize:10}} axisLine={false}/>
                    <Tooltip {...tooltipStyle}/>
                    <Legend formatter={v=><span style={{color:"#94a3b8",fontSize:11}}>{v}</span>}/>
                    <Bar dataKey="forecast" fill="#8B5CF6" name="Forecast" radius={[3,3,0,0]}/>
                    <Bar dataKey="actual"   fill="#10B981" name="Actual"   radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={S.panel}>
                <div style={S.panelTitle}>Avg Late Login & Early Logout (min)</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={vendorStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false}/>
                    <YAxis tick={{fill:"#94a3b8",fontSize:10}} axisLine={false}/>
                    <Tooltip {...tooltipStyle}/>
                    <Legend formatter={v=><span style={{color:"#94a3b8",fontSize:11}}>{v}</span>}/>
                    <Bar dataKey="lateLogin"   fill="#EF4444" name="Late Login"    radius={[3,3,0,0]}/>
                    <Bar dataKey="earlyLogout" fill="#F59E0B" name="Early Logout"  radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={S.panel}>
              <div style={S.panelTitle}>Vendor KPI Table</div>
              <table style={S.table}>
                <thead>
                  <tr>{["Vendor","Riders","Forecast Hrs","Actual Hrs","Supply %","Orders","Avg Late (min)","Avg Early Logout","Adherence %","Status"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {vendorStats.map((v,i) => (
                    <tr key={v.name}>
                      <td style={{...S.td(i),fontWeight:700,color:PALETTE[v.name]}}>{v.name}</td>
                      <td style={S.td(i)}>{v.riders}</td>
                      <td style={S.td(i)}>{v.forecast}</td>
                      <td style={S.td(i)}>{v.actual}</td>
                      <td style={S.td(i)}><b style={{color:v.supply>=90?"#10B981":v.supply>=70?"#F59E0B":"#EF4444"}}>{v.supply}%</b></td>
                      <td style={S.td(i)}>{v.orders}</td>
                      <td style={S.td(i)}>{v.lateLogin}</td>
                      <td style={S.td(i)}>{v.earlyLogout}</td>
                      <td style={S.td(i)}>{v.adherence}%</td>
                      <td style={S.td(i)}><StatusBadge v={v.supply/100}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── HOURLY SUPPLY ── */}
        {tab===2 && (
          <div>
            <div style={S.panel}>
              <div style={S.panelTitle}>Supply Availability % by Time Slot</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={slotStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="slot" tick={{fill:"#94a3b8",fontSize:10}} axisLine={false}/>
                  <YAxis tick={{fill:"#94a3b8",fontSize:10}} axisLine={false} domain={[0,110]} tickFormatter={v=>v+"%"}/>
                  <Tooltip {...tooltipStyle} formatter={v=>[v!=null?v+"%":"N/A"]}/>
                  <Legend formatter={v=><span style={{color:"#94a3b8",fontSize:11}}>{v}</span>}/>
                  {VENDORS.map(v => <Line key={v} type="monotone" dataKey={v} stroke={PALETTE[v]} strokeWidth={2} dot={{r:4,fill:PALETTE[v]}} connectNulls/>)}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{marginTop:16,...S.panel}}>
              <div style={S.panelTitle}>Supply Heatmap — Vendor × Time Slot</div>
              <div style={{overflowX:"auto"}}>
                <table style={{...S.table,marginTop:4}}>
                  <thead>
                    <tr>
                      <th style={S.th}>Time Slot</th>
                      {VENDORS.map(v=><th key={v} style={{...S.th,color:PALETTE[v]}}>{v}</th>)}
                      <th style={S.th}>Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slotStats.map((row,i) => {
                      const vVals = VENDORS.map(v=>row[v]).filter(x=>x!=null);
                      const avg = vVals.length ? +(vVals.reduce((s,x)=>s+x,0)/vVals.length).toFixed(1) : null;
                      return (
                        <tr key={i}>
                          <td style={{...S.td(i),fontWeight:600}}>{row.slot}</td>
                          {VENDORS.map(v => {
                            const val = row[v];
                            const bg = val==null?"#1e293b":val>=90?"rgba(16,185,129,0.25)":val>=70?"rgba(245,158,11,0.25)":"rgba(239,68,68,0.25)";
                            const col = val==null?"#475569":val>=90?"#10B981":val>=70?"#F59E0B":"#EF4444";
                            return <td key={v} style={{...S.td(i),background:bg,color:col,fontWeight:700,textAlign:"center"}}>{val!=null?val+"%":"—"}</td>;
                          })}
                          <td style={{...S.td(i),fontWeight:700,color:"#f1f5f9",textAlign:"center"}}>{avg!=null?avg+"%":"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{marginTop:16,...S.panel}}>
              <div style={S.panelTitle}>Supply & Orders by Store</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={storeStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="store" tick={{fill:"#94a3b8",fontSize:10}} axisLine={false}/>
                  <YAxis yAxisId="l" tick={{fill:"#94a3b8",fontSize:10}} axisLine={false} tickFormatter={v=>v+"%"}/>
                  <YAxis yAxisId="r" orientation="right" tick={{fill:"#94a3b8",fontSize:10}} axisLine={false}/>
                  <Tooltip {...tooltipStyle}/>
                  <Legend formatter={v=><span style={{color:"#94a3b8",fontSize:11}}>{v}</span>}/>
                  <Bar yAxisId="l" dataKey="supply" name="Supply %" fill="#3B82F6" radius={[3,3,0,0]}/>
                  <Bar yAxisId="r" dataKey="orders" name="Orders"   fill="#F59E0B" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── RIDER ADHERENCE ── */}
        {tab===3 && (
          <div>
            <div style={S.grid}>
              <KpiCard label="Avg Adherence" value={pct(avgAdherence)} color="#10B981" icon="✅"/>
              <KpiCard label="Avg Late Login" value={fix1(avgLate)+" min"} color="#EF4444" icon="⏰"/>
              <KpiCard label="Avg Early Logout" value={fix1(data.length?data.reduce((s,r)=>s+r.earlyLogout,0)/data.length:0)+" min"} color="#F59E0B" icon="🚪"/>
              <KpiCard label="Hours Gap" value={fix1(totalActual-totalForecast)+" hrs"} sub={totalActual<totalForecast?"Under target":"On/Above target"} color={totalActual<totalForecast?"#EF4444":"#10B981"} icon="📉"/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div style={S.panel}>
                <div style={S.panelTitle}>Adherence Score Distribution</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={vendorStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false}/>
                    <YAxis tick={{fill:"#94a3b8",fontSize:10}} domain={[0,100]} axisLine={false} tickFormatter={v=>v+"%"}/>
                    <Tooltip {...tooltipStyle} formatter={v=>[v+"%","Adherence"]}/>
                    <Bar dataKey="adherence" radius={[4,4,0,0]}>
                      {vendorStats.map((v,i) => <Cell key={i} fill={v.adherence>=90?"#10B981":v.adherence>=70?"#F59E0B":"#EF4444"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={S.panel}>
                <div style={S.panelTitle}>Late Login vs Early Logout Scatter</div>
                <ResponsiveContainer width="100%" height={220}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="lateLogin" name="Late Login" tick={{fill:"#94a3b8",fontSize:10}} label={{value:"Late (min)",fill:"#64748b",fontSize:10,position:"insideBottom",offset:-4}}/>
                    <YAxis dataKey="earlyLogout" name="Early Logout" tick={{fill:"#94a3b8",fontSize:10}} label={{value:"Early Out",fill:"#64748b",fontSize:10,angle:-90,position:"insideLeft"}}/>
                    <Tooltip {...tooltipStyle} cursor={{strokeDasharray:"3 3"}}/>
                    <Scatter data={data} fill="#EF4444">
                      {data.map((r,i)=><Cell key={i} fill={PALETTE[r.vendorName]||"#64748b"}/>)}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={S.panel}>
              <div style={S.panelTitle}>Rider Adherence Detail</div>
              <div style={{overflowX:"auto"}}>
                <table style={S.table}>
                  <thead>
                    <tr>{["Rider ID","Name","Vendor","Area","Date","Slot","Forecast","Actual","Gap","Late (min)","Early Out","Supply %","Adherence"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {data.map((r,i) => (
                      <tr key={r.riderId}>
                        <td style={S.td(i)}><code style={{color:NOON_GOLD,fontSize:11}}>{r.riderId}</code></td>
                        <td style={{...S.td(i),fontWeight:600}}>{r.riderName}</td>
                        <td style={{...S.td(i),color:PALETTE[r.vendorName]}}>{r.vendorName}</td>
                        <td style={S.td(i)}>{r.area}</td>
                        <td style={S.td(i)}>{r.date.slice(5)}</td>
                        <td style={S.td(i)}>{r.slot}</td>
                        <td style={S.td(i)}>{r.forecast}</td>
                        <td style={S.td(i)}>{r.actual}</td>
                        <td style={{...S.td(i),color:r.hoursDiff<0?"#EF4444":"#10B981",fontWeight:700}}>{r.hoursDiff>0?"+":""}{fix1(r.hoursDiff)}</td>
                        <td style={{...S.td(i),color:r.lateLogin>20?"#EF4444":r.lateLogin>5?"#F59E0B":"#10B981"}}>{r.lateLogin}</td>
                        <td style={{...S.td(i),color:r.earlyLogout>15?"#EF4444":r.earlyLogout>0?"#F59E0B":"#10B981"}}>{r.earlyLogout}</td>
                        <td style={S.td(i)}><StatusBadge v={r.supplyPct}/></td>
                        <td style={{...S.td(i),color:r.adherence>=0.9?"#10B981":r.adherence>=0.7?"#F59E0B":"#EF4444",fontWeight:700}}>{pct(r.adherence)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── DAILY SUMMARY ── */}
        {tab===4 && (
          <div>
            <div style={S.panel}>
              <div style={S.panelTitle}>Daily Supply Availability & Orders Trend</div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dateStats}>
                  <defs>
                    <linearGradient id="gS2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="date" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false}/>
                  <YAxis yAxisId="l" tick={{fill:"#94a3b8",fontSize:10}} domain={[0,110]} axisLine={false} tickFormatter={v=>v+"%"}/>
                  <YAxis yAxisId="r" orientation="right" tick={{fill:"#94a3b8",fontSize:10}} axisLine={false}/>
                  <Tooltip {...tooltipStyle}/>
                  <Legend formatter={v=><span style={{color:"#94a3b8",fontSize:11}}>{v}</span>}/>
                  <Area yAxisId="l" type="monotone" dataKey="supply" stroke="#3B82F6" fill="url(#gS2)" name="Supply %" strokeWidth={2}/>
                  <Line yAxisId="r" type="monotone" dataKey="orders" stroke="#F59E0B" name="Orders" strokeWidth={2} dot={{r:4}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{marginTop:16,...S.panel}}>
              <div style={S.panelTitle}>Daily KPI Table</div>
              <table style={S.table}>
                <thead>
                  <tr>{["Date","Riders","Forecast Hrs","Actual Hrs","Hours Gap","Supply %","Orders","Status"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {dateStats.map((d,i) => {
                    const rows = data.filter(r=>r.date.slice(5)===d.date);
                    const gap = d.actual - d.forecast;
                    const supply = d.supply;
                    return (
                      <tr key={d.date}>
                        <td style={{...S.td(i),fontWeight:700}}>{d.date}</td>
                        <td style={S.td(i)}>{rows.length}</td>
                        <td style={S.td(i)}>{d.forecast}</td>
                        <td style={S.td(i)}>{d.actual}</td>
                        <td style={{...S.td(i),color:gap<0?"#EF4444":"#10B981",fontWeight:700}}>{gap>0?"+":""}{fix1(gap)}</td>
                        <td style={{...S.td(i),color:supply>=90?"#10B981":supply>=70?"#F59E0B":"#EF4444",fontWeight:700}}>{supply}%</td>
                        <td style={S.td(i)}>{d.orders}</td>
                        <td style={S.td(i)}><StatusBadge v={supply/100}/></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RAW DATA ── */}
        {tab===5 && (
          <div>
            <div style={{marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:12,color:"#94a3b8"}}>{data.length} records shown — use filters above to narrow down</div>
              <div style={{fontSize:12,color:NOON_GOLD,fontWeight:600}}>SUPPLY = Actual / Forecast</div>
            </div>
            <div style={{...S.panel,overflowX:"auto"}}>
              <table style={S.table}>
                <thead>
                  <tr>{["Rider ID","Rider Name","Vendor ID","Vendor","Area","Date","Time Slot","Store","Forecast Hrs","Actual Hrs","Orders","Late Login","Early Logout","Supply %","Adherence","Status"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {data.map((r,i) => (
                    <tr key={r.riderId+r.date}>
                      <td style={S.td(i)}><code style={{color:NOON_GOLD,fontSize:11}}>{r.riderId}</code></td>
                      <td style={{...S.td(i),fontWeight:600}}>{r.riderName}</td>
                      <td style={S.td(i)}><code style={{fontSize:11,color:"#64748b"}}>{r.vendorId}</code></td>
                      <td style={{...S.td(i),color:PALETTE[r.vendorName],fontWeight:600}}>{r.vendorName}</td>
                      <td style={S.td(i)}>{r.area}</td>
                      <td style={S.td(i)}>{r.date.slice(5)}</td>
                      <td style={S.td(i)}>{r.slot}</td>
                      <td style={{...S.td(i),fontSize:11}}>{r.storeName}</td>
                      <td style={S.td(i)}>{r.forecast}</td>
                      <td style={S.td(i)}>{r.actual}</td>
                      <td style={S.td(i)}>{r.orders}</td>
                      <td style={{...S.td(i),color:r.lateLogin>20?"#EF4444":r.lateLogin>5?"#F59E0B":"#10B981"}}>{r.lateLogin} min</td>
                      <td style={{...S.td(i),color:r.earlyLogout>15?"#EF4444":r.earlyLogout>0?"#F59E0B":"#10B981"}}>{r.earlyLogout} min</td>
                      <td style={{...S.td(i),fontWeight:700,color:r.supplyPct>=0.9?"#10B981":r.supplyPct>=0.7?"#F59E0B":"#EF4444"}}>{pct(r.supplyPct)}</td>
                      <td style={{...S.td(i),color:r.adherence>=0.9?"#10B981":r.adherence>=0.7?"#F59E0B":"#EF4444"}}>{pct(r.adherence)}</td>
                      <td style={S.td(i)}><StatusBadge v={r.supplyPct}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
