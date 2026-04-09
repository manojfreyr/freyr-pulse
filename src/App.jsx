import { useState, useMemo } from "react";

// ─── Colour palette ────────────────────────────────────────────────────────
const C = {
  primary:"#2176C7", primaryDark:"#1a5fa0", primaryLight:"#E6F1FB", primaryMid:"#cde3f7",
  white:"#ffffff", bg:"#f4f7fb", sidebar:"#0C1F3D", sidebarText:"#a8bdd6",
  border:"#dde4ed", text:"#1a2535", textSub:"#5a6a7e", textMuted:"#8fa0b4",
  success:"#16a34a", successBg:"#dcfce7", warning:"#d97706", warningBg:"#fef3c7",
  danger:"#dc2626", dangerBg:"#fee2e2", info:"#0369a1", infoBg:"#e0f2fe",
  purple:"#7c3aed", purpleBg:"#ede9fe",
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (n, cur="USD") => new Intl.NumberFormat("en-US",{style:"currency",currency:cur,maximumFractionDigits:0}).format(n||0);
const fmtN = n => new Intl.NumberFormat("en-US").format(Math.round(n||0));
const pct = n => `${(n||0).toFixed(1)}%`;
const fmtM = n => n>=1e6?`$${(n/1e6).toFixed(1)}M`:n>=1e3?`$${(n/1e3).toFixed(0)}K`:`$${fmtN(n)}`;

// ─── Primitives ────────────────────────────────────────────────────────────
const Btn=({children,variant="primary",size="md",onClick,disabled,style})=>{
  const base={border:"none",borderRadius:6,cursor:disabled?"not-allowed":"pointer",fontWeight:600,transition:"all 0.15s",opacity:disabled?0.5:1,
    padding:size==="sm"?"5px 12px":size==="lg"?"10px 22px":"7px 16px",fontSize:size==="sm"?12:size==="lg"?15:13};
  const v={primary:{background:C.primary,color:C.white},secondary:{background:C.white,color:C.primary,border:`1.5px solid ${C.primary}`},
    ghost:{background:"transparent",color:C.textSub},danger:{background:C.danger,color:C.white},
    success:{background:C.success,color:C.white},warning:{background:C.warning,color:C.white}};
  return <button onClick={onClick} disabled={disabled} style={{...base,...v[variant],...style}}>{children}</button>;
};

const Badge=({children,color="blue",dot})=>{
  const cols={blue:{bg:C.primaryLight,text:C.primary},green:{bg:C.successBg,text:C.success},
    amber:{bg:C.warningBg,text:C.warning},red:{bg:C.dangerBg,text:C.danger},
    purple:{bg:C.purpleBg,text:C.purple},gray:{bg:"#f1f5f9",text:C.textSub}};
  const c=cols[color]||cols.blue;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:c.bg,color:c.text}}>
    {dot&&<span style={{width:6,height:6,borderRadius:"50%",background:c.text}}/>}{children}</span>;
};

const Card=({children,style,onClick})=>(
  <div onClick={onClick} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:20,...style,cursor:onClick?"pointer":undefined}}>{children}</div>
);

const KpiCard=({label,value,sub,accent=C.primary,badge,delta})=>(
  <Card style={{borderTop:`3px solid ${accent}`,flex:1,minWidth:150}}>
    <div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
    <div style={{fontSize:22,fontWeight:700,color:C.text,margin:"6px 0 4px"}}>{value}</div>
    {sub&&<div style={{fontSize:12,color:C.textSub}}>{sub}</div>}
    {delta!==undefined&&<div style={{fontSize:12,color:delta>=0?C.success:C.danger,fontWeight:600,marginTop:4}}>{delta>=0?"▲":"▼"} {Math.abs(delta).toFixed(1)}% vs prior</div>}
    {badge&&<div style={{marginTop:6}}>{badge}</div>}
  </Card>
);

const Input=({label,value,onChange,type="text",placeholder,required,readOnly,style,hint})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textSub}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <input type={type} value={value} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder} readOnly={readOnly}
      style={{border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,color:C.text,background:readOnly?C.bg:C.white,outline:"none",...style}}/>
    {hint&&<div style={{fontSize:11,color:C.textMuted}}>{hint}</div>}
  </div>
);

const Select=({label,value,onChange,options,required,style,placeholder})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textSub}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <select value={value} onChange={e=>onChange?.(e.target.value)}
      style={{border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,color:value?C.text:C.textMuted,background:C.white,outline:"none",...style}}>
      {placeholder&&<option value="">{placeholder}</option>}
      {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
    </select>
  </div>
);

const Modal=({open,onClose,title,children,width=640})=>{
  if(!open)return null;
  return <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:C.white,borderRadius:12,width:"100%",maxWidth:width,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
      <div style={{padding:"18px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontWeight:700,fontSize:16,color:C.text}}>{title}</div>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.textMuted}}>×</button>
      </div>
      <div style={{padding:24,overflowY:"auto",flex:1}}>{children}</div>
    </div>
  </div>;
};

const Table=({cols,rows,onRow})=>(
  <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead><tr>{cols.map(c=><th key={c.key} style={{padding:"9px 14px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:c.right?"right":"left",fontWeight:600,color:C.textSub,fontSize:11,textTransform:"uppercase",letterSpacing:0.4,whiteSpace:"nowrap"}}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.map((r,i)=>(
          <tr key={i} onClick={()=>onRow?.(r)} style={{borderBottom:`1px solid ${C.border}`,cursor:onRow?"pointer":undefined,transition:"background 0.1s"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {cols.map(c=><td key={c.key} style={{padding:"10px 14px",color:C.text,textAlign:c.right?"right":"left"}}>{c.render?c.render(r,i):r[c.key]}</td>)}
          </tr>
        ))}
        {rows.length===0&&<tr><td colSpan={cols.length} style={{padding:"32px 14px",textAlign:"center",color:C.textMuted}}>No records found</td></tr>}
      </tbody>
    </table>
  </div>
);

const Tabs=({tabs,active,onChange})=>(
  <div style={{display:"flex",gap:2,borderBottom:`1.5px solid ${C.border}`,marginBottom:20}}>
    {tabs.map(t=>(
      <button key={t.key} onClick={()=>onChange(t.key)} style={{padding:"9px 18px",border:"none",background:"none",cursor:"pointer",fontSize:13,
        fontWeight:active===t.key?700:500,color:active===t.key?C.primary:C.textSub,
        borderBottom:active===t.key?`2.5px solid ${C.primary}`:"2.5px solid transparent",marginBottom:-1.5,transition:"all 0.15s"}}>
        {t.label}{t.count!==undefined&&<span style={{marginLeft:6,background:active===t.key?C.primary:C.border,color:active===t.key?C.white:C.textSub,borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{t.count}</span>}
      </button>
    ))}
  </div>
);

const SectionHeader=({title,sub,action})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
    <div>
      <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.text}}>{title}</h2>
      {sub&&<p style={{margin:"4px 0 0",color:C.textSub,fontSize:13}}>{sub}</p>}
    </div>
    {action}
  </div>
);

const Alert=({type="info",children})=>{
  const t={info:{bg:C.infoBg,text:C.info,icon:"ℹ"},warning:{bg:C.warningBg,text:C.warning,icon:"⚠"},danger:{bg:C.dangerBg,text:C.danger,icon:"✕"},success:{bg:C.successBg,text:C.success,icon:"✓"}};
  const cfg=t[type];
  return <div style={{background:cfg.bg,color:cfg.text,borderRadius:8,padding:"10px 14px",fontSize:13,fontWeight:500,display:"flex",gap:8,alignItems:"flex-start",marginBottom:16}}><span>{cfg.icon}</span><div>{children}</div></div>;
};

const MiniBar=({value,max,color=C.primary})=>(
  <div style={{height:6,background:C.bg,borderRadius:3,width:"100%",marginTop:4}}>
    <div style={{height:6,borderRadius:3,background:color,width:`${Math.min(100,(value/max)*100)}%`,transition:"width 0.3s"}}/>
  </div>
);

// ─── GLOBAL SEED DATA ──────────────────────────────────────────────────────
const CURRENCIES=["USD","GBP","EUR","CHF","JPY","CAD","AUD","INR","SGD","AED"];
const ROLES=["Senior Regulatory Affairs Specialist","Regulatory Affairs Specialist","Clinical Writer","Senior Clinical Writer","Publishing Specialist","Project Manager","Principal Consultant","Associate Consultant"];
const GRADES=["Associate","Specialist","Senior Specialist","Principal","Director","Senior Director"];
const LOCATIONS=["US","UK","EU","India","Singapore","UAE"];
const DIVISIONS=["Regulatory Affairs","Clinical Writing","Publishing","PV & Safety"];
const DEPARTMENTS=["Global RA","CMC","Labelling","Clinical Operations","Medical Writing","PV Operations"];
const MONTHS_2026=["Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026","Jul 2026","Aug 2026","Sep 2026","Oct 2026","Nov 2026","Dec 2026"];
const CUR_MONTH_IDX=3;
const FX_PAIRS=["GBP/USD","EUR/USD","CHF/USD","JPY/USD","CAD/USD","AUD/USD","INR/USD","SGD/USD","AED/USD"];
const FX_RATES_MAP={"GBP":1.275,"EUR":1.082,"CHF":1.108,"JPY":0.0067,"CAD":0.735,"AUD":0.638,"INR":0.012,"SGD":0.742,"AED":0.272,"USD":1};

// Tag master
const TAGS={
  division:DIVISIONS,
  department:DEPARTMENTS,
  country:["US","UK","Germany","France","Japan","India","Singapore","Australia","Canada","UAE"],
  region:["North America","Europe","Asia Pacific","LATAM","Middle East","India"],
  customerType:["Pharma","Biotech","MedTech","CRO","Generics","Academic"],
  accountType:["Strategic","Standard","Growth","At Risk"],
};

// Customers
const CUSTOMERS=[
  {id:"c1",name:"Johnson & Johnson",type:"Pharma",region:"North America",country:"US",status:"Active",strategic:true,revenue:2850000,projects:8,deliveryOwner:"Jane Smith"},
  {id:"c2",name:"AstraZeneca",type:"Pharma",region:"Europe",country:"UK",status:"Active",strategic:true,revenue:1920000,projects:5,deliveryOwner:"Mike Kumar"},
  {id:"c3",name:"GSK",type:"Pharma",region:"Europe",country:"UK",status:"Active",strategic:false,revenue:1340000,projects:4,deliveryOwner:"Sara Lee"},
  {id:"c4",name:"Pfizer",type:"Pharma",region:"North America",country:"US",status:"Active",strategic:true,revenue:980000,projects:3,deliveryOwner:"Tom Raj"},
  {id:"c5",name:"Novartis",type:"Pharma",region:"Europe",country:"Switzerland",status:"Active",strategic:false,revenue:760000,projects:3,deliveryOwner:"Sara Lee"},
  {id:"c6",name:"Roche",type:"Pharma",region:"Europe",country:"Germany",status:"Active",strategic:false,revenue:640000,projects:2,deliveryOwner:"Mike Kumar"},
  {id:"c7",name:"Merck",type:"Pharma",region:"North America",country:"US",status:"Active",strategic:false,revenue:520000,projects:2,deliveryOwner:"Tom Raj"},
  {id:"c8",name:"Sanofi",type:"Pharma",region:"Europe",country:"France",status:"Active",strategic:false,revenue:410000,projects:2,deliveryOwner:"Jane Smith"},
  {id:"c9",name:"Bayer",type:"Pharma",region:"Europe",country:"Germany",status:"Active",strategic:false,revenue:380000,projects:1,deliveryOwner:"Sara Lee"},
  {id:"c10",name:"Abbott",type:"MedTech",region:"North America",country:"US",status:"Active",strategic:false,revenue:290000,projects:1,deliveryOwner:"Tom Raj"},
];

// Contracts
const CONTRACTS=[
  {id:"k1",customerId:"c1",customer:"Johnson & Johnson",ref:"MSA-JNJ-2024",type:"MSA",value:3200000,currency:"USD",start:"2024-01-01",end:"2026-12-31",status:"Active"},
  {id:"k2",customerId:"c2",customer:"AstraZeneca",ref:"MSA-AZ-2024",type:"MSA",value:2100000,currency:"GBP",start:"2024-03-01",end:"2026-09-30",status:"Active"},
  {id:"k3",customerId:"c3",customer:"GSK",ref:"MSA-GSK-2023",type:"MSA",value:1500000,currency:"GBP",start:"2023-07-01",end:"2026-06-30",status:"Active"},
  {id:"k4",customerId:"c4",customer:"Pfizer",ref:"SOW-PFZ-2025",type:"SOW",value:1000000,currency:"USD",start:"2025-01-01",end:"2026-04-30",status:"Active"},
  {id:"k5",customerId:"c5",customer:"Novartis",ref:"MSA-NOV-2024",type:"MSA",value:850000,currency:"EUR",start:"2024-06-01",end:"2026-12-31",status:"Active"},
  {id:"k6",customerId:"c6",customer:"Roche",ref:"MSA-ROC-2025",type:"MSA",value:700000,currency:"EUR",start:"2025-01-01",end:"2026-12-31",status:"Active"},
  {id:"k7",customerId:"c7",customer:"Merck",ref:"SOW-MRK-2025",type:"SOW",value:550000,currency:"USD",start:"2025-04-01",end:"2026-03-31",status:"Expired"},
];

// Projects
const PROJECTS=[
  {id:"p1",contractId:"k1",customer:"Johnson & Johnson",name:"J&J RA Global Support",division:"Regulatory Affairs",dept:"Global RA",status:"Active",deliveryOwner:"Jane Smith",start:"2024-01-15",end:"2026-12-31",forecast:1240000,actual:892000},
  {id:"p2",contractId:"k2",customer:"AstraZeneca",name:"AZ Clinical Writing Programme",division:"Clinical Writing",dept:"Medical Writing",status:"Active",deliveryOwner:"Mike Kumar",start:"2024-03-01",end:"2026-09-30",forecast:960000,actual:621000},
  {id:"p3",contractId:"k3",customer:"GSK",name:"GSK Publishing Suite",division:"Publishing",dept:"Labelling",status:"Active",deliveryOwner:"Sara Lee",start:"2023-07-01",end:"2026-06-30",forecast:680000,actual:512000},
  {id:"p4",contractId:"k4",customer:"Pfizer",name:"Pfizer Labelling Hub",division:"Regulatory Affairs",dept:"Labelling",status:"Active",deliveryOwner:"Tom Raj",start:"2025-01-01",end:"2026-04-30",forecast:490000,actual:388000},
  {id:"p5",contractId:"k5",customer:"Novartis",name:"Novartis PV Safety Review",division:"PV & Safety",dept:"PV Operations",status:"Active",deliveryOwner:"Sara Lee",start:"2024-06-01",end:"2026-12-31",forecast:380000,actual:265000},
  {id:"p6",contractId:"k2",customer:"AstraZeneca",name:"AZ Regulatory Strategy",division:"Regulatory Affairs",dept:"CMC",status:"On Hold",deliveryOwner:"Mike Kumar",start:"2024-06-01",end:"2026-06-30",forecast:290000,actual:148000},
  {id:"p7",contractId:"k6",customer:"Roche",name:"Roche RA Submissions",division:"Regulatory Affairs",dept:"Global RA",status:"Active",deliveryOwner:"Mike Kumar",start:"2025-01-01",end:"2026-12-31",forecast:320000,actual:198000},
  {id:"p8",contractId:"k1",customer:"Johnson & Johnson",name:"J&J Clinical Writing Support",division:"Clinical Writing",dept:"Clinical Operations",status:"Active",deliveryOwner:"Jane Smith",start:"2024-07-01",end:"2026-12-31",forecast:410000,actual:287000},
];

// Service Lines
const SERVICE_LINES_LIST=[
  {id:"sl1",name:"HA Query Support",projectId:"p1",project:"J&J RA Global Support",customer:"Johnson & Johnson",commercialType:"T&M Managed",division:"Regulatory Affairs",dept:"Global RA",currency:"USD",deliveryOwner:"Jane Smith"},
  {id:"sl2",name:"Regulatory Affairs Fixed",projectId:"p1",project:"J&J RA Global Support",customer:"Johnson & Johnson",commercialType:"Fixed Price",division:"Regulatory Affairs",dept:"CMC",currency:"USD",deliveryOwner:"Jane Smith"},
  {id:"sl3",name:"Clinical Writing Support",projectId:"p2",project:"AZ Clinical Writing Programme",customer:"AstraZeneca",commercialType:"T&M Staffing",division:"Clinical Writing",dept:"Medical Writing",currency:"GBP",deliveryOwner:"Mike Kumar"},
  {id:"sl4",name:"Publishing Unit Work",projectId:"p3",project:"GSK Publishing Suite",customer:"GSK",commercialType:"Unit-Based",division:"Publishing",dept:"Labelling",currency:"GBP",deliveryOwner:"Sara Lee"},
  {id:"sl5",name:"PV Safety Review",projectId:"p5",project:"Novartis PV Safety Review",customer:"Novartis",commercialType:"Recurring",division:"PV & Safety",dept:"PV Operations",currency:"EUR",deliveryOwner:"Sara Lee"},
  {id:"sl6",name:"RA Strategy Advisory",projectId:"p6",project:"AZ Regulatory Strategy",customer:"AstraZeneca",commercialType:"T&M Managed",division:"Regulatory Affairs",dept:"CMC",currency:"GBP",deliveryOwner:"Mike Kumar"},
  {id:"sl7",name:"Roche Submission Support",projectId:"p7",project:"Roche RA Submissions",customer:"Roche",commercialType:"Fixed Price",division:"Regulatory Affairs",dept:"Global RA",currency:"EUR",deliveryOwner:"Mike Kumar"},
  {id:"sl8",name:"J&J Clinical Writing",projectId:"p8",project:"J&J Clinical Writing Support",customer:"Johnson & Johnson",commercialType:"T&M Staffing",division:"Clinical Writing",dept:"Clinical Operations",currency:"USD",deliveryOwner:"Jane Smith"},
];

// Invoices
const INVOICES=[
  {id:"i1",number:"FRUS20261831",customer:"Johnson & Johnson",project:"J&J RA Global Support",serviceLine:"HA Query Support",amount:148500,currency:"USD",status:"Paid",issued:"2026-01-15",due:"2026-02-15",paid:"2026-02-10",odooSync:"Synced"},
  {id:"i2",number:"FRUS20261832",customer:"Johnson & Johnson",project:"J&J RA Global Support",serviceLine:"Regulatory Affairs Fixed",amount:45000,currency:"USD",status:"Paid",issued:"2026-02-01",due:"2026-03-01",paid:"2026-02-28",odooSync:"Synced"},
  {id:"i3",number:"FRGB20261201",customer:"AstraZeneca",project:"AZ Clinical Writing Programme",serviceLine:"Clinical Writing Support",amount:82400,currency:"GBP",status:"Outstanding",issued:"2026-03-01",due:"2026-04-01",paid:null,odooSync:"Synced"},
  {id:"i4",number:"FRGB20261202",customer:"GSK",project:"GSK Publishing Suite",serviceLine:"Publishing Unit Work",amount:54200,currency:"GBP",status:"Overdue",issued:"2026-02-15",due:"2026-03-15",paid:null,odooSync:"Failed"},
  {id:"i5",number:"FREU20261101",customer:"Novartis",project:"Novartis PV Safety Review",serviceLine:"PV Safety Review",amount:75000,currency:"EUR",status:"Paid",issued:"2026-01-20",due:"2026-02-20",paid:"2026-02-18",odooSync:"Synced"},
  {id:"i6",number:"FRUS20261833",customer:"Pfizer",project:"Pfizer Labelling Hub",serviceLine:"Pfizer RA",amount:122000,currency:"USD",status:"Outstanding",issued:"2026-03-15",due:"2026-04-15",paid:null,odooSync:"Synced"},
  {id:"i7",number:"FRUS20261834",customer:"Johnson & Johnson",project:"J&J Clinical Writing Support",serviceLine:"J&J Clinical Writing",amount:98000,currency:"USD",status:"Paid",issued:"2026-03-01",due:"2026-04-01",paid:"2026-03-28",odooSync:"Synced"},
];

// Rate Card
const initRates=[
  {id:"r1",role:"Senior Regulatory Affairs Specialist",grade:"Senior Specialist",location:"US",currency:"USD",unit:"Hour",rate:185,effectiveFrom:"2026-01-01",effectiveTo:"",status:"Active"},
  {id:"r2",role:"Regulatory Affairs Specialist",grade:"Specialist",location:"UK",currency:"GBP",unit:"Hour",rate:120,effectiveFrom:"2026-01-01",effectiveTo:"",status:"Active"},
  {id:"r3",role:"Clinical Writer",grade:"Specialist",location:"US",currency:"USD",unit:"Hour",rate:145,effectiveFrom:"2026-01-01",effectiveTo:"",status:"Active"},
  {id:"r4",role:"Senior Clinical Writer",grade:"Senior Specialist",location:"UK",currency:"GBP",unit:"Hour",rate:155,effectiveFrom:"2026-01-01",effectiveTo:"",status:"Active"},
  {id:"r5",role:"Publishing Specialist",grade:"Specialist",location:"India",currency:"USD",unit:"Page",rate:45,effectiveFrom:"2026-01-01",effectiveTo:"",status:"Active"},
  {id:"r6",role:"Project Manager",grade:"Principal",location:"US",currency:"USD",unit:"Hour",rate:210,effectiveFrom:"2026-01-01",effectiveTo:"",status:"Active"},
  {id:"r7",role:"Principal Consultant",grade:"Director",location:"EU",currency:"EUR",unit:"Day",rate:1800,effectiveFrom:"2026-01-01",effectiveTo:"",status:"Active"},
  {id:"r8",role:"Associate Consultant",grade:"Associate",location:"India",currency:"USD",unit:"Hour",rate:55,effectiveFrom:"2025-01-01",effectiveTo:"2025-12-31",status:"Retired"},
];
const initOverrides=[
  {id:"o1",serviceLine:"HA Query Support",project:"J&J RA Global Support",customer:"Johnson & Johnson",role:"Senior Regulatory Affairs Specialist",stdRate:185,overrideRate:195,currency:"USD",unit:"Hour",deviation:5.4,reason:"Strategic account premium",effectiveFrom:"2026-01-01"},
  {id:"o2",serviceLine:"Clinical Writing Support",project:"AZ Clinical Writing Programme",customer:"AstraZeneca",role:"Senior Clinical Writer",stdRate:155,overrideRate:130,currency:"GBP",unit:"Hour",deviation:-16.1,reason:"Volume discount — 2000+ hrs/yr commitment",effectiveFrom:"2026-01-01"},
  {id:"o3",serviceLine:"PV Safety Review",project:"Novartis PV Safety Review",customer:"Novartis",role:"Principal Consultant",stdRate:1800,overrideRate:1950,currency:"EUR",unit:"Day",deviation:8.3,reason:"Specialist premium — rare expertise",effectiveFrom:"2026-03-01"},
];
const initAlerts=[
  {id:"a1",serviceLine:"HA Query Support",project:"J&J RA Global Support",deliveryOwner:"Jane Smith",role:"Senior Regulatory Affairs Specialist",oldRate:175,newRate:185,currency:"USD",effectiveDate:"2026-01-01",status:"Pending",daysOverdue:94},
  {id:"a2",serviceLine:"Clinical Writing Support",project:"AZ Clinical Writing Programme",deliveryOwner:"Mike Kumar",role:"Senior Clinical Writer",oldRate:145,newRate:155,currency:"GBP",effectiveDate:"2026-01-01",status:"Acknowledged",daysOverdue:0},
  {id:"a3",serviceLine:"PV Safety Review",project:"Novartis PV Safety Review",deliveryOwner:"Sara Lee",role:"Principal Consultant",oldRate:1700,newRate:1800,currency:"EUR",effectiveDate:"2026-01-01",status:"Pending",daysOverdue:94},
  {id:"a4",serviceLine:"Regulatory Affairs Fixed",project:"J&J RA Global Support",deliveryOwner:"Jane Smith",role:"Project Manager",oldRate:195,newRate:210,currency:"USD",effectiveDate:"2026-01-01",status:"Pending",daysOverdue:94},
];

// FX rates
const initFxRates=[
  {id:"fx1",pair:"GBP/USD",from:"GBP",to:"USD",month:"Jan 2026",rate:1.272,enteredBy:"Admin",enteredAt:"2026-02-05"},
  {id:"fx2",pair:"GBP/USD",from:"GBP",to:"USD",month:"Feb 2026",rate:1.268,enteredBy:"Admin",enteredAt:"2026-03-04"},
  {id:"fx3",pair:"GBP/USD",from:"GBP",to:"USD",month:"Mar 2026",rate:1.275,enteredBy:"Admin",enteredAt:"2026-04-03"},
  {id:"fx4",pair:"EUR/USD",from:"EUR",to:"USD",month:"Jan 2026",rate:1.084,enteredBy:"Admin",enteredAt:"2026-02-05"},
  {id:"fx5",pair:"EUR/USD",from:"EUR",to:"USD",month:"Feb 2026",rate:1.079,enteredBy:"Admin",enteredAt:"2026-03-04"},
  {id:"fx6",pair:"EUR/USD",from:"EUR",to:"USD",month:"Mar 2026",rate:1.082,enteredBy:"Admin",enteredAt:"2026-04-03"},
];

// Forecast seed
const buildForecastEntries=(commercialType)=>{
  const entries={};
  MONTHS_2026.forEach((m,i)=>{
    const isPast=i<CUR_MONTH_IDX;
    let qty=null,rate=null,amount=0,actual=null;
    if(["T&M Managed","T&M Staffing"].includes(commercialType)){qty=80+Math.round(Math.random()*40);rate=185;amount=qty*rate;actual=isPast?Math.round(amount*(0.85+Math.random()*0.25)):null;}
    else if(commercialType==="Fixed Price"){amount=[45000,0,60000,0,45000,0,60000,0,45000,0,60000,30000][i]||0;actual=isPast&&amount>0?Math.round(amount*(0.9+Math.random()*0.15)):null;}
    else if(commercialType==="Unit-Based"){qty=200+Math.round(Math.random()*100);rate=45;amount=qty*rate;actual=isPast?Math.round(amount*(0.88+Math.random()*0.2)):null;}
    else{amount=25000;actual=isPast?25000:null;}
    entries[m]={qty,rate,amount:Math.round(amount),actual,note:"",locked:isPast};
  });
  return entries;
};
const initForecastVersions={
  sl1:[{id:"v1",name:"Baseline",type:"Baseline",createdBy:"Jane Smith",createdAt:"2026-01-10",reason:"Initial forecast",locked:true,isWorking:false},{id:"v2",name:"Q2 Revision",type:"Working",createdBy:"Jane Smith",createdAt:"2026-04-01",reason:"Scope increase",locked:false,isWorking:true}],
  sl2:[{id:"v3",name:"Baseline",type:"Baseline",createdBy:"Jane Smith",createdAt:"2026-01-10",reason:"Initial forecast",locked:true,isWorking:false},{id:"v4",name:"Q1 Revision",type:"Working",createdBy:"Jane Smith",createdAt:"2026-02-15",reason:"Milestone replan",locked:false,isWorking:true}],
  sl3:[{id:"v5",name:"Baseline",type:"Baseline",createdBy:"Mike Kumar",createdAt:"2026-01-12",reason:"Initial forecast",locked:true,isWorking:false},{id:"v6",name:"Q2 Revision",type:"Working",createdBy:"Mike Kumar",createdAt:"2026-04-02",reason:"Resource mix change",locked:false,isWorking:true}],
  sl4:[{id:"v7",name:"Baseline",type:"Baseline",createdBy:"Sara Lee",createdAt:"2026-01-15",reason:"Initial forecast",locked:true,isWorking:false},{id:"v8",name:"Q2 Revision",type:"Working",createdBy:"Sara Lee",createdAt:"2026-04-03",reason:"Page volume revised",locked:false,isWorking:true}],
  sl5:[{id:"v9",name:"Baseline",type:"Baseline",createdBy:"Sara Lee",createdAt:"2026-01-20",reason:"Initial forecast",locked:true,isWorking:false},{id:"v10",name:"Q2 Revision",type:"Working",createdBy:"Sara Lee",createdAt:"2026-04-05",reason:"Extended contract",locked:false,isWorking:true}],
};
const initForecastEntries={
  sl1:{v1:buildForecastEntries("T&M Managed"),v2:buildForecastEntries("T&M Managed")},
  sl2:{v3:buildForecastEntries("Fixed Price"),v4:buildForecastEntries("Fixed Price")},
  sl3:{v5:buildForecastEntries("T&M Staffing"),v6:buildForecastEntries("T&M Staffing")},
  sl4:{v7:buildForecastEntries("Unit-Based"),v8:buildForecastEntries("Unit-Based")},
  sl5:{v9:buildForecastEntries("Recurring"),v10:buildForecastEntries("Recurring")},
};

// Users
const USERS=[
  {id:"u1",name:"Jane Smith",email:"jane.smith@freyr.com",role:"Delivery Owner",division:"Regulatory Affairs",status:"Active",lastLogin:"2026-04-09",scope:["J&J","Sanofi"]},
  {id:"u2",name:"Mike Kumar",email:"mike.kumar@freyr.com",role:"Delivery Owner",division:"Clinical Writing",status:"Active",lastLogin:"2026-04-08",scope:["AstraZeneca","Roche"]},
  {id:"u3",name:"Sara Lee",email:"sara.lee@freyr.com",role:"Delivery Owner",division:"PV & Safety",status:"Active",lastLogin:"2026-04-07",scope:["GSK","Novartis","Bayer"]},
  {id:"u4",name:"Tom Raj",email:"tom.raj@freyr.com",role:"Delivery Owner",division:"Regulatory Affairs",status:"Active",lastLogin:"2026-04-06",scope:["Pfizer","Merck","Abbott"]},
  {id:"u5",name:"Rachel Kumar",email:"rachel.kumar@freyr.com",role:"Portfolio Head",division:"Pharma",status:"Active",lastLogin:"2026-04-09",scope:["All Pharma"]},
  {id:"u6",name:"Amir Patel",email:"amir.patel@freyr.com",role:"Division Head",division:"Regulatory Affairs",status:"Active",lastLogin:"2026-04-09",scope:["Regulatory Affairs"]},
  {id:"u7",name:"Sarah Chen",email:"sarah.chen@freyr.com",role:"Admin",division:"All",status:"Active",lastLogin:"2026-04-09",scope:["All"]},
  {id:"u8",name:"David Osei",email:"david.osei@freyr.com",role:"Leadership",division:"All",status:"Active",lastLogin:"2026-04-08",scope:["All"]},
  {id:"u9",name:"Priya Sharma",email:"priya.sharma@freyr.com",role:"Delivery Owner",division:"Publishing",status:"Pending",lastLogin:"—",scope:[]},
];

// Tag reviews
const initTagReviews=[
  {id:"tr1",project:"J&J RA Global Support",customer:"Johnson & Johnson",deliveryOwner:"Jane Smith",trigger:"Scheduled",triggerDetail:"Monthly review — Apr 2026",dueDate:"2026-04-15",status:"Overdue",daysOverdue:0,tags:{division:"Regulatory Affairs",dept:"Global RA",country:"US",region:"North America"}},
  {id:"tr2",project:"AZ Regulatory Strategy",customer:"AstraZeneca",deliveryOwner:"Mike Kumar",trigger:"Status Change",triggerDetail:"Active → On Hold (2026-03-20)",dueDate:"2026-03-27",status:"Overdue",daysOverdue:13,tags:{division:"Regulatory Affairs",dept:"CMC",country:"UK",region:"Europe"}},
  {id:"tr3",project:"GSK Publishing Suite",customer:"GSK",deliveryOwner:"Sara Lee",trigger:"Scheduled",triggerDetail:"Monthly review — Mar 2026",dueDate:"2026-03-31",status:"Overdue",daysOverdue:9,tags:{division:"Publishing",dept:"Labelling",country:"UK",region:"Europe"}},
  {id:"tr4",project:"Pfizer Labelling Hub",customer:"Pfizer",deliveryOwner:"Tom Raj",trigger:"Manual",triggerDetail:"Initiated by Admin",dueDate:"2026-04-20",status:"Pending",daysOverdue:0,tags:{division:"Regulatory Affairs",dept:"Labelling",country:"US",region:"North America"}},
  {id:"tr5",project:"Novartis PV Safety Review",customer:"Novartis",deliveryOwner:"Sara Lee",trigger:"Scheduled",triggerDetail:"Monthly review — Apr 2026",dueDate:"2026-04-15",status:"Pending",daysOverdue:0,tags:{division:"PV & Safety",dept:"PV Operations",country:"Switzerland",region:"Europe"}},
];

// Live aggregation helpers
const toUSD=(amount,currency)=>amount*(FX_RATES_MAP[currency]||1);
const totalForecastUSD=()=>PROJECTS.reduce((s,p)=>s+toUSD(p.forecast,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
const totalActualUSD=()=>PROJECTS.reduce((s,p)=>s+toUSD(p.actual,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
const invoiceTotalUSD=()=>INVOICES.reduce((s,i)=>s+toUSD(i.amount,i.currency),0);
const invoicePaidUSD=()=>INVOICES.filter(i=>i.status==="Paid").reduce((s,i)=>s+toUSD(i.amount,i.currency),0);
const invoiceOutstandingUSD=()=>INVOICES.filter(i=>["Outstanding","Overdue"].includes(i.status)).reduce((s,i)=>s+toUSD(i.amount,i.currency),0);
const getRealization=()=>totalForecastUSD()>0?totalActualUSD()/totalForecastUSD()*100:0;

// DO-scoped helpers
const DO_SCOPE={
  "Jane Smith":["c1","c8"],
  "Mike Kumar":["c2","c6"],
  "Sara Lee":["c3","c5","c9"],
  "Tom Raj":["c4","c7","c10"],
};
const getDoProjects=(doName)=>PROJECTS.filter(p=>p.deliveryOwner===doName);
const getDoForecast=(doName)=>getDoProjects(doName).reduce((s,p)=>s+toUSD(p.forecast,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
const getDoActual=(doName)=>getDoProjects(doName).reduce((s,p)=>s+toUSD(p.actual,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);

// Monthly trend data (derived from projects)
const TREND_DATA=MONTHS_2026.slice(0,CUR_MONTH_IDX+1).map((m,i)=>{
  const fc=totalForecastUSD()/12;
  const act=i<CUR_MONTH_IDX?totalActualUSD()/CUR_MONTH_IDX*(0.9+Math.random()*0.2):null;
  return{month:m,forecast:Math.round(fc),actual:act?Math.round(act):null};
});

// ─── NAV ──────────────────────────────────────────────────────────────────
const NAV=[
  {key:"dashboard",label:"Dashboard",icon:"◼",group:"Overview"},
  {key:"do-dashboard",label:"DO Dashboard",icon:"👤",group:"Dashboards"},
  {key:"ph-dashboard",label:"Portfolio Head",icon:"📂",group:"Dashboards"},
  {key:"dh-dashboard",label:"Division Head",icon:"🏛",group:"Dashboards"},
  {key:"admin-dashboard",label:"Admin Dashboard",icon:"⚙",group:"Dashboards"},
  {key:"leadership",label:"Leadership",icon:"👁",group:"Dashboards"},
  {key:"customers",label:"Customers",icon:"🏢",group:"Delivery"},
  {key:"contracts",label:"Contracts",icon:"📋",group:"Delivery"},
  {key:"projects",label:"Projects",icon:"📁",group:"Delivery"},
  {key:"service-lines",label:"Service Lines",icon:"⚙",group:"Delivery"},
  {key:"rate-card",label:"Rate Card",icon:"💰",group:"Finance"},
  {key:"fx-rates",label:"FX Rates",icon:"💱",group:"Finance"},
  {key:"forecast",label:"Forecast",icon:"📊",group:"Finance"},
  {key:"invoices",label:"Invoices",icon:"🧾",group:"Finance"},
  {key:"exceptions",label:"Exceptions",icon:"⚠",group:"Reporting"},
  {key:"tag-reviews",label:"Tag Reviews",icon:"🔁",group:"Admin"},
  {key:"users",label:"User Management",icon:"👥",group:"Admin"},
  {key:"tags",label:"Tag Master",icon:"🏷",group:"Admin"},
];

// ─── MINI CHART ────────────────────────────────────────────────────────────
const MiniTrendChart=({data,height=80,showLabels=false})=>{
  const max=Math.max(...data.map(d=>Math.max(d.forecast||0,d.actual||0)),1);
  const w=100/data.length;
  return(
    <svg viewBox={`0 0 ${data.length*40} ${height+20}`} style={{width:"100%",height:height+20}}>
      {data.map((d,i)=>{
        const x=i*40+20;
        const fh=(d.forecast/max)*(height-10);
        const ah=d.actual?(d.actual/max)*(height-10):0;
        return(
          <g key={i}>
            <rect x={x-10} y={height-fh} width={8} height={fh} fill={C.primaryLight} rx={2}/>
            {d.actual&&<rect x={x+2} y={height-ah} width={8} height={ah} fill={C.primary} rx={2}/>}
            {showLabels&&<text x={x} y={height+14} textAnchor="middle" fontSize={8} fill={C.textMuted}>{d.month.slice(0,3)}</text>}
          </g>
        );
      })}
    </svg>
  );
};

// ─── DASHBOARD (main overview) ─────────────────────────────────────────────
function Dashboard({onNav}){
  const fc=totalForecastUSD(),ac=totalActualUSD(),real=getRealization();
  const invOut=invoiceOutstandingUSD(),invPaid=invoicePaidUSD();
  const overdueTR=initTagReviews.filter(r=>r.status==="Overdue").length;
  const failedSync=INVOICES.filter(i=>i.odooSync==="Failed").length;

  return(
    <div>
      <SectionHeader title="Platform Overview" sub="Freyr Pulse — April 2026 · All figures in USD"/>
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Total Forecast 2026" value={fmtM(fc)} sub="All service lines · Working version" accent={C.primary} delta={8.3}/>
        <KpiCard label="Actuals YTD (Q1)" value={fmtM(ac)} sub="Jan–Mar 2026 billed" accent={C.success}/>
        <KpiCard label="Realization YTD" value={pct(real)} sub="Actuals / Forecast" accent={real>=92?C.success:real>=80?C.warning:C.danger} badge={<Badge color={real>=92?"green":real>=80?"amber":"red"} dot>{real>=92?"On track":real>=80?"Watch":"At risk"}</Badge>}/>
        <KpiCard label="Outstanding Invoices" value={fmtM(invOut)} sub={`${INVOICES.filter(i=>i.status==="Overdue").length} overdue`} accent={C.warning}/>
        <KpiCard label="Active Customers" value={CUSTOMERS.filter(c=>c.status==="Active").length} sub={`${CUSTOMERS.filter(c=>c.strategic).length} strategic accounts`} accent={C.primary}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Forecast vs Actuals — 2026 YTD</div>
          <MiniTrendChart data={TREND_DATA} height={120} showLabels/>
          <div style={{display:"flex",gap:16,marginTop:8,fontSize:12,color:C.textSub}}>
            <span><span style={{display:"inline-block",width:12,height:12,background:C.primaryLight,borderRadius:2,marginRight:4}}/>Forecast</span>
            <span><span style={{display:"inline-block",width:12,height:12,background:C.primary,borderRadius:2,marginRight:4}}/>Actual</span>
          </div>
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Action Items</div>
          {[
            {label:`${failedSync} Odoo sync failure${failedSync!==1?"s":""}`,color:"red",action:"Fix",page:"exceptions"},
            {label:`${INVOICES.filter(i=>i.status==="Overdue").length} overdue invoices`,color:"red",action:"View",page:"invoices"},
            {label:`${overdueTR} overdue tag reviews`,color:"amber",action:"Review",page:"tag-reviews"},
            {label:`3 pending rate alerts`,color:"amber",action:"View",page:"rate-card"},
            {label:`2 contracts expiring <30d`,color:"amber",action:"View",page:"contracts"},
            {label:`Apr 2026 FX rates missing`,color:"blue",action:"Enter",page:"fx-rates"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:C[item.color]||C.primary,flexShrink:0}}/>
                <span style={{fontSize:13,color:C.text}}>{item.label}</span>
              </div>
              <Btn size="sm" variant="ghost" onClick={()=>onNav(item.page)}>{item.action} →</Btn>
            </div>
          ))}
        </Card>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Top Customers by Forecast</div>
          <Table cols={[
            {key:"name",label:"Customer"},
            {key:"forecast",label:"Forecast",right:true,render:r=><strong>{fmtM(r.revenue)}</strong>},
            {key:"real",label:"Realization",right:true,render:r=>{const real=r.actual/r.revenue*100||88;return<Badge color={real>=92?"green":real>=80?"amber":"red"}>{pct(real)}</Badge>;}},
          ]} rows={CUSTOMERS.slice(0,5).map(c=>({...c,actual:c.revenue*0.88}))}/>
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Revenue by Division</div>
          {DIVISIONS.map((div,i)=>{
            const divProjects=PROJECTS.filter(p=>p.division===div);
            const divFc=divProjects.reduce((s,p)=>s+toUSD(p.forecast,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
            const divAc=divProjects.reduce((s,p)=>s+toUSD(p.actual,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
            const colors=[C.primary,C.success,C.warning,C.purple];
            return(
              <div key={div} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                  <span style={{fontWeight:600}}>{div}</span>
                  <span style={{color:C.textSub}}>{fmtM(divFc)} · {pct(divFc>0?divAc/divFc*100:0)} real.</span>
                </div>
                <MiniBar value={divFc} max={totalForecastUSD()} color={colors[i]}/>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ─── DO DASHBOARD ──────────────────────────────────────────────────────────
function DODashboard(){
  const doName="Jane Smith";
  const myProjects=getDoProjects(doName);
  const myFc=getDoForecast(doName),myAc=getDoActual(doName);
  const myReal=myFc>0?myAc/myFc*100:0;
  const myInvoices=INVOICES.filter(i=>["Johnson & Johnson","Sanofi"].includes(i.customer));
  const myOutstanding=myInvoices.filter(i=>["Outstanding","Overdue"].includes(i.status)).reduce((s,i)=>s+toUSD(i.amount,i.currency),0);
  const myReviews=initTagReviews.filter(r=>r.deliveryOwner===doName);

  return(
    <div>
      <SectionHeader title="My Dashboard" sub={`${doName} · Delivery Owner · April 2026`}/>
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="My Forecast 2026" value={fmtM(myFc)} sub="All my service lines" accent={C.primary}/>
        <KpiCard label="Actuals YTD" value={fmtM(myAc)} sub="Jan–Mar 2026" accent={C.success}/>
        <KpiCard label="Realization" value={pct(myReal)} sub="Actuals / Forecast" accent={myReal>=92?C.success:myReal>=80?C.warning:C.danger} badge={<Badge color={myReal>=92?"green":myReal>=80?"amber":"red"} dot>{myReal>=92?"On track":"Watch"}</Badge>}/>
        <KpiCard label="Outstanding" value={fmtM(myOutstanding)} sub="Pending payment" accent={C.warning}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>My Projects</div>
          <Table cols={[
            {key:"name",label:"Project"},
            {key:"customer",label:"Customer"},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="On Hold"?"amber":"gray"} dot>{r.status}</Badge>},
            {key:"forecast",label:"Forecast",right:true,render:r=><span>{fmtM(toUSD(r.forecast,CONTRACTS.find(k=>k.id===r.contractId)?.currency||"USD"))}</span>},
            {key:"actual",label:"Actual YTD",right:true,render:r=><strong>{fmtM(toUSD(r.actual,CONTRACTS.find(k=>k.id===r.contractId)?.currency||"USD"))}</strong>},
            {key:"real",label:"Real.",right:true,render:r=>{const rl=r.actual/r.forecast*100;return<Badge color={rl>=92?"green":rl>=80?"amber":"red"}>{pct(rl)}</Badge>;}},
          ]} rows={myProjects}/>
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Action Items</div>
          {myReviews.filter(r=>r.status==="Overdue").map((r,i)=>(
            <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,fontWeight:600,color:C.danger}}>⚠ Overdue Tag Review</div>
              <div style={{fontSize:12,color:C.textSub}}>{r.project}</div>
              <div style={{fontSize:11,color:C.textMuted}}>{r.triggerDetail}</div>
            </div>
          ))}
          {myInvoices.filter(i=>i.status==="Overdue").map((inv,i)=>(
            <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,fontWeight:600,color:C.warning}}>⚠ Overdue Invoice</div>
              <div style={{fontSize:12,color:C.textSub}}>{inv.number} · {inv.customer}</div>
            </div>
          ))}
          {initAlerts.filter(a=>a.deliveryOwner===doName&&a.status==="Pending").map((a,i)=>(
            <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,fontWeight:600,color:C.info}}>ℹ Rate Alert</div>
              <div style={{fontSize:12,color:C.textSub}}>{a.serviceLine}</div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <div style={{fontWeight:700,marginBottom:12}}>My Tag Reviews</div>
        <Table cols={[
          {key:"project",label:"Project"},
          {key:"trigger",label:"Trigger",render:r=><Badge color={r.trigger==="Status Change"?"amber":"blue"}>{r.trigger}</Badge>},
          {key:"dueDate",label:"Due Date"},
          {key:"status",label:"Status",render:r=><Badge color={r.status==="Overdue"?"red":"amber"} dot>{r.status}</Badge>},
          {key:"actions",label:"",render:r=><Btn size="sm">Start Review</Btn>},
        ]} rows={myReviews}/>
      </Card>
    </div>
  );
}

// ─── PORTFOLIO HEAD DASHBOARD ──────────────────────────────────────────────
function PHDashboard(){
  const dos=["Jane Smith","Mike Kumar","Sara Lee","Tom Raj"];
  const totalFc=dos.reduce((s,d)=>s+getDoForecast(d),0);
  const totalAc=dos.reduce((s,d)=>s+getDoActual(d),0);
  const real=totalFc>0?totalAc/totalFc*100:0;
  const doColors={"Jane Smith":C.success,"Mike Kumar":C.primary,"Sara Lee":C.warning,"Tom Raj":C.danger};
  const doReals=dos.map(d=>{const f=getDoForecast(d),a=getDoActual(d);return{name:d,fc:f,ac:a,real:f>0?a/f*100:0,projects:getDoProjects(d).length};});

  return(
    <div>
      <SectionHeader title="Portfolio Head Dashboard" sub="Rachel Kumar · Pharma & Biotech Portfolio · April 2026"/>
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Portfolio Forecast" value={fmtM(totalFc)} sub="All DOs combined" accent={C.primary}/>
        <KpiCard label="Actuals YTD" value={fmtM(totalAc)} sub="Jan–Mar 2026" accent={C.success}/>
        <KpiCard label="Portfolio Realization" value={pct(real)} sub="vs 92% target" accent={real>=92?C.success:real>=80?C.warning:C.danger}/>
        <KpiCard label="Active Projects" value={PROJECTS.filter(p=>p.status==="Active").length} sub={`Across ${dos.length} Delivery Owners`} accent={C.primary}/>
        <KpiCard label="Open Exceptions" value={initTagReviews.filter(r=>r.status==="Overdue").length+INVOICES.filter(i=>i.status==="Overdue").length} sub="Tag reviews + overdue invoices" accent={C.danger}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16,marginBottom:20}}>
        {doReals.map(d=>{
          const color=d.real>=92?C.success:d.real>=80?C.warning:C.danger;
          const borderColor=d.real>=92?C.success:d.real>=80?C.warning:C.danger;
          return(
            <Card key={d.name} style={{borderLeft:`4px solid ${borderColor}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{d.name}</div>
                  <div style={{fontSize:12,color:C.textSub}}>{d.projects} projects</div>
                </div>
                <Badge color={d.real>=92?"green":d.real>=80?"amber":"red"} dot>{pct(d.real)} real.</Badge>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textSub,marginBottom:6}}>
                <span>Forecast: <strong>{fmtM(d.fc)}</strong></span>
                <span>Actual: <strong style={{color:C.text}}>{fmtM(d.ac)}</strong></span>
              </div>
              <MiniBar value={d.ac} max={d.fc} color={color}/>
            </Card>
          );
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Top Accounts by Realization</div>
          <Table cols={[
            {key:"name",label:"Customer"},
            {key:"revenue",label:"Forecast",right:true,render:r=>fmtM(r.revenue)},
            {key:"real",label:"Realization",right:true,render:r=>{const rl=r.actual/r.revenue*100||88;return<Badge color={rl>=92?"green":rl>=80?"amber":"red"}>{pct(rl)}</Badge>;}},
          ]} rows={CUSTOMERS.slice(0,5).map(c=>({...c,actual:c.revenue*0.88}))}/>
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Unbilled Backlog</div>
          {PROJECTS.filter(p=>p.forecast-p.actual>50000).slice(0,5).map((p,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{p.name}</div>
                <div style={{fontSize:11,color:C.textSub}}>{p.deliveryOwner}</div>
              </div>
              <span style={{fontWeight:700,color:C.warning}}>{fmtM(toUSD(p.forecast-p.actual,"USD"))}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── DIVISION HEAD DASHBOARD ───────────────────────────────────────────────
function DHDashboard(){
  const [divFilter,setDivFilter]=useState("Regulatory Affairs");
  const divProjects=divFilter==="All"?PROJECTS:PROJECTS.filter(p=>p.division===divFilter);
  const divFc=divProjects.reduce((s,p)=>s+toUSD(p.forecast,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
  const divAc=divProjects.reduce((s,p)=>s+toUSD(p.actual,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
  const real=divFc>0?divAc/divFc*100:0;

  const deptBreakdown=DEPARTMENTS.map(dept=>{
    const dp=divProjects.filter(p=>p.dept===dept);
    const fc=dp.reduce((s,p)=>s+toUSD(p.forecast,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
    const ac=dp.reduce((s,p)=>s+toUSD(p.actual,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD"),0);
    return{dept,fc,ac,real:fc>0?ac/fc*100:0,count:dp.length};
  }).filter(d=>d.count>0);

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.text}}>Division Head Dashboard</h2>
          <p style={{margin:"4px 0 0",color:C.textSub,fontSize:13}}>Amir Patel · Cross-functional visibility enabled · April 2026</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:12,color:C.textSub}}>Division:</span>
          {["All",...DIVISIONS].map(d=>(
            <button key={d} onClick={()=>setDivFilter(d)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${divFilter===d?C.primary:C.border}`,
              background:divFilter===d?C.primary:C.white,color:divFilter===d?C.white:C.textSub,fontSize:12,fontWeight:600,cursor:"pointer"}}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Division Forecast" value={fmtM(divFc)} sub={`${divFilter} · 2026`} accent={C.primary}/>
        <KpiCard label="Actuals YTD" value={fmtM(divAc)} sub="Jan–Mar 2026" accent={C.success}/>
        <KpiCard label="Realization" value={pct(real)} sub="vs 92% target" accent={real>=92?C.success:real>=80?C.warning:C.danger} badge={<Badge color={real>=92?"green":real>=80?"amber":"red"} dot>{pct(real)} vs 92% target</Badge>}/>
        <KpiCard label="Active Projects" value={divProjects.filter(p=>p.status==="Active").length} sub={`${divProjects.length} total`} accent={C.primary}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>By Department</div>
          {deptBreakdown.map(d=>(
            <div key={d.dept} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                <span style={{fontWeight:600}}>{d.dept}</span>
                <span style={{color:d.real>=92?C.success:d.real>=80?C.warning:C.danger,fontWeight:600}}>{pct(d.real)} · {fmtM(d.fc)}</span>
              </div>
              <MiniBar value={d.ac} max={d.fc||1} color={d.real>=92?C.success:d.real>=80?C.warning:C.danger}/>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Variance Hotspots</div>
          {divProjects.filter(p=>p.forecast>0).map(p=>{
            const fc=toUSD(p.forecast,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD");
            const ac=toUSD(p.actual,CONTRACTS.find(k=>k.id===p.contractId)?.currency||"USD");
            const rl=ac/fc*100;
            return{...p,fc,ac,rl};
          }).sort((a,b)=>a.rl-b.rl).slice(0,4).map((p,i)=>(
            <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:13,fontWeight:600}}>{p.name}</span>
                <Badge color={p.rl>=92?"green":p.rl>=80?"amber":"red"}>{pct(p.rl)}</Badge>
              </div>
              <div style={{fontSize:11,color:C.textSub}}>{p.deliveryOwner} · {p.dept}</div>
              <div style={{fontSize:11,color:C.danger}}>Gap: {fmtM(p.fc-p.ac)}</div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <div style={{fontWeight:700,marginBottom:12}}>Projects in Division</div>
        <Table cols={[
          {key:"name",label:"Project"},
          {key:"customer",label:"Customer"},
          {key:"deliveryOwner",label:"Delivery Owner"},
          {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="On Hold"?"amber":"gray"} dot>{r.status}</Badge>},
          {key:"forecast",label:"Forecast (USD)",right:true,render:r=>fmtM(toUSD(r.forecast,CONTRACTS.find(k=>k.id===r.contractId)?.currency||"USD"))},
          {key:"real",label:"Real.",right:true,render:r=>{const rl=r.actual/r.forecast*100;return<Badge color={rl>=92?"green":rl>=80?"amber":"red"}>{pct(rl)}</Badge>;}},
        ]} rows={divProjects}/>
      </Card>
    </div>
  );
}

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
function AdminDashboard(){
  const totalFc=totalForecastUSD(),totalAc=totalActualUSD(),real=getRealization();
  const failedSync=INVOICES.filter(i=>i.odooSync==="Failed");
  const activeUsers=USERS.filter(u=>u.status==="Active").length;
  const pendingUsers=USERS.filter(u=>u.status==="Pending").length;
  const missingTags=3,overdueReviews=initTagReviews.filter(r=>r.status==="Overdue").length;

  return(
    <div>
      <SectionHeader title="Admin Dashboard" sub="Full platform visibility · Sarah Chen · April 2026"/>
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Total Forecast 2026" value={fmtM(totalFc)} sub="All divisions · USD" accent={C.primary}/>
        <KpiCard label="Actuals YTD" value={fmtM(totalAc)} sub="Jan–Mar 2026" accent={C.success}/>
        <KpiCard label="Realization" value={pct(real)} sub="Company-wide" accent={real>=92?C.success:real>=80?C.warning:C.danger}/>
        <KpiCard label="Active Users" value={`${activeUsers}/${USERS.length}`} sub={`${pendingUsers} pending activation`} accent={C.primary}/>
        <KpiCard label="Platform Issues" value={overdueReviews+failedSync.length+missingTags} sub="Reviews + sync + data quality" accent={C.danger}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Data Integrity</div>
          {[
            {label:"Missing mandatory tags",count:missingTags,color:"red"},
            {label:"Overdue tag reviews",count:overdueReviews,color:"red"},
            {label:"Active SLs with no forecast",count:2,color:"amber"},
            {label:"Projects without service lines",count:1,color:"amber"},
            {label:"Contracts expiring <30 days",count:2,color:"amber"},
            {label:"Pending rate alerts",count:initAlerts.filter(a=>a.status==="Pending").length,color:"blue"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:C[item.color]}}/>
                <span style={{fontSize:12,color:C.text}}>{item.label}</span>
              </div>
              <Badge color={item.color}>{item.count}</Badge>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Platform Health</div>
          {[
            {service:"Odoo API",status:failedSync.length>0?"Warning":"OK",detail:failedSync.length>0?`${failedSync.length} failed syncs`:"All synced"},
            {service:"FX Rates (Apr 2026)",status:"Warning",detail:"7 pairs missing"},
            {service:"Database",status:"OK",detail:"Healthy"},
            {service:"Background Jobs",status:"OK",detail:"Running"},
            {service:"SSO / Auth",status:"OK",detail:"Connected"},
            {service:"Scheduled Reports",status:"OK",detail:"2 scheduled"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:12,color:C.text}}>{item.service}</span>
              <div style={{textAlign:"right"}}>
                <Badge color={item.status==="OK"?"green":item.status==="Warning"?"amber":"red"} dot>{item.status}</Badge>
                <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>{item.detail}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Odoo Sync Log</div>
          {failedSync.map((inv,i)=>(
            <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:600,color:C.danger}}>✕ {inv.number}</span>
                <Btn size="sm">Retry</Btn>
              </div>
              <div style={{fontSize:11,color:C.textMuted}}>Connection timeout — attempt 3/3</div>
            </div>
          ))}
          <div style={{marginTop:12,fontSize:12,color:C.textSub}}>✓ {INVOICES.filter(i=>i.odooSync==="Synced").length} invoices synced successfully</div>
        </Card>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Revenue by Division (USD)</div>
          {DIVISIONS.map((div,i)=>{
            const dp=PROJECTS.filter(p=>p.division===div);
            const fc=dp.reduce((s,p)=>s+toUSD(p.forecast,"USD"),0);
            const ac=dp.reduce((s,p)=>s+toUSD(p.actual,"USD"),0);
            const colors=[C.primary,C.success,C.warning,C.purple];
            return(
              <div key={div} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                  <span style={{fontWeight:600}}>{div}</span>
                  <span style={{color:C.textSub}}>{fmtM(fc)} · {pct(fc>0?ac/fc*100:0)}</span>
                </div>
                <MiniBar value={fc} max={totalFc||1} color={colors[i%4]}/>
              </div>
            );
          })}
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Concentration Risk</div>
          <Alert type="warning">Top 3 customers represent {pct(([2850000,1920000,1340000].reduce((a,b)=>a+b,0)/CUSTOMERS.reduce((s,c)=>s+c.revenue,0))*100)} of total forecast</Alert>
          <Table cols={[
            {key:"name",label:"Customer"},
            {key:"revenue",label:"Forecast",right:true,render:r=>fmtM(r.revenue)},
            {key:"pct",label:"% of Total",right:true,render:r=><Badge color={r.revenue/CUSTOMERS.reduce((s,c)=>s+c.revenue,0)>0.15?"amber":"gray"}>{pct(r.revenue/CUSTOMERS.reduce((s,c)=>s+c.revenue,0)*100)}</Badge>},
          ]} rows={CUSTOMERS.slice(0,5)}/>
        </Card>
      </div>
    </div>
  );
}

// ─── LEADERSHIP DASHBOARD ──────────────────────────────────────────────────
function LeadershipDashboard(){
  const fc=totalForecastUSD(),ac=totalActualUSD(),real=getRealization();
  const invTotal=invoiceTotalUSD(),invPaid=invoicePaidUSD();
  const insights=[
    {icon:"📉",headline:`Realization at ${pct(real)}`,detail:`Below the 92% company target by ${pct(92-real)}. AstraZeneca and GSK are the primary drag.`,severity:"warning"},
    {icon:"⚠",headline:"Concentration risk flagged",detail:`Johnson & Johnson + AstraZeneca + GSK represent ${pct(([2850000,1920000,1340000].reduce((a,b)=>a+b,0)/CUSTOMERS.reduce((s,c)=>s+c.revenue,0))*100)} of total forecast.`,severity:"warning"},
    {icon:"📈",headline:`8.3% growth vs prior year`,detail:"Driven by expansion in Regulatory Affairs and new Roche engagement in Q1.",severity:"info"},
  ];

  return(
    <div style={{maxWidth:1100}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.text}}>Leadership Dashboard</h2>
          <p style={{margin:"4px 0 0",color:C.textSub,fontSize:13}}>Board & Executive View · Read-only · April 2026</p>
        </div>
        <Badge color="gray">Read only</Badge>
      </div>

      {/* AI Insight Banner */}
      <Card style={{marginBottom:20,background:"linear-gradient(135deg,#0C1F3D,#1a3a6b)",border:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>✦ AI Insights — Generated Apr 9, 2026</span>
          <span style={{color:"rgba(255,255,255,0.4)",fontSize:11,cursor:"pointer"}}>View previous insights →</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {insights.map((ins,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.07)",borderRadius:8,padding:14}}>
              <div style={{fontSize:20,marginBottom:6}}>{ins.icon}</div>
              <div style={{color:C.white,fontWeight:700,fontSize:13,marginBottom:4}}>{ins.headline}</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:12,lineHeight:1.5}}>{ins.detail}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Total Forecast 2026" value={fmtM(fc)} sub="All divisions · USD" accent={C.primary} delta={8.3}/>
        <KpiCard label="Actuals YTD" value={fmtM(ac)} sub="Jan–Mar 2026" accent={C.success}/>
        <KpiCard label="Billing Realization" value={pct(real)} sub="vs 92% target" accent={real>=92?C.success:real>=80?C.warning:C.danger}/>
        <KpiCard label="Invoiced YTD" value={fmtM(invTotal)} sub={`${fmtM(invPaid)} collected`} accent={C.success}/>
        <KpiCard label="Active Customers" value={CUSTOMERS.filter(c=>c.status==="Active").length} sub={`${CUSTOMERS.filter(c=>c.strategic).length} strategic`} accent={C.primary}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:4}}>Revenue Trend 2026</div>
          <div style={{fontSize:12,color:C.textSub,marginBottom:12}}>Monthly forecast vs actuals · USD</div>
          <MiniTrendChart data={TREND_DATA} height={130} showLabels/>
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Risk & Attention</div>
          {[
            {label:`Realization ${pct(real)} vs 92% target`,severity:"danger"},
            {label:"1 Odoo sync failure pending",severity:"danger"},
            {label:"2 contracts expiring within 30 days",severity:"warning"},
            {label:`${initTagReviews.filter(r=>r.status==="Overdue").length} overdue tag reviews`,severity:"warning"},
            {label:"8.3% YoY revenue growth ✓",severity:"success"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:C[item.severity],flexShrink:0}}/>
              <span style={{fontSize:13,color:C.text}}>{item.label}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <div style={{fontWeight:700,marginBottom:12}}>Top 5 Customers</div>
        <Table cols={[
          {key:"name",label:"Customer"},
          {key:"type",label:"Type"},
          {key:"revenue",label:"Forecast",right:true,render:r=><strong>{fmtM(r.revenue)}</strong>},
          {key:"actual",label:"Actuals YTD",right:true,render:r=>fmtM(r.revenue*0.88)},
          {key:"real",label:"Realization",right:true,render:r=>{const rl=88;return<Badge color={rl>=92?"green":rl>=80?"amber":"red"}>{pct(rl)}</Badge>;}},
          {key:"strategic",label:"",render:r=>r.strategic?<Badge color="purple">Strategic</Badge>:null},
        ]} rows={CUSTOMERS.slice(0,5)}/>
      </Card>
    </div>
  );
}

// ─── EXCEPTION REPORTS ─────────────────────────────────────────────────────
function ExceptionReports(){
  const [tab,setTab]=useState("billing");
  const overdueInvoices=INVOICES.filter(i=>i.status==="Overdue");
  const failedSync=INVOICES.filter(i=>i.odooSync==="Failed");
  const overdueReviews=initTagReviews.filter(r=>r.status==="Overdue");
  const expiring=CONTRACTS.filter(c=>c.status==="Active"&&c.ref==="SOW-PFZ-2025");

  return(
    <div>
      <SectionHeader title="Exception Reports" sub="Platform-wide exceptions requiring attention"/>
      <Tabs tabs={[
        {key:"billing",label:"Billing Exceptions",count:overdueInvoices.length},
        {key:"dataquality",label:"Data Quality",count:3},
        {key:"contracts",label:"Contracts & Expiry",count:2},
        {key:"tagreviews",label:"Tag Reviews",count:overdueReviews.length},
        {key:"odoo",label:"Odoo Sync",count:failedSync.length},
      ]} active={tab} onChange={setTab}/>

      {tab==="billing"&&(
        <div>
          <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
            <KpiCard label="Overdue Invoices" value={overdueInvoices.length} sub="Past due date" accent={C.danger}/>
            <KpiCard label="Overdue Value" value={fmtM(overdueInvoices.reduce((s,i)=>s+toUSD(i.amount,i.currency),0))} sub="USD equivalent" accent={C.danger}/>
            <KpiCard label="Outstanding Total" value={fmtM(invoiceOutstandingUSD())} sub="Not yet due" accent={C.warning}/>
            <KpiCard label="Below 80% Realization" value={CUSTOMERS.filter(c=>c.revenue<500000).length} sub="Customers at risk" accent={C.warning}/>
          </div>
          <Card>
            <div style={{fontWeight:700,marginBottom:12}}>Overdue Invoices</div>
            <Table cols={[
              {key:"number",label:"Invoice"},
              {key:"customer",label:"Customer"},
              {key:"amount",label:"Amount",right:true,render:r=><strong>{r.currency} {fmtN(r.amount)}</strong>},
              {key:"due",label:"Due Date",render:r=><span style={{color:C.danger,fontWeight:600}}>{r.due}</span>},
              {key:"status",label:"Status",render:r=><Badge color="red" dot>{r.status}</Badge>},
              {key:"odooSync",label:"Odoo",render:r=><Badge color={r.odooSync==="Synced"?"green":"red"}>{r.odooSync}</Badge>},
              {key:"actions",label:"",render:r=><div style={{display:"flex",gap:4}}><Btn size="sm">Chase</Btn><Btn size="sm" variant="ghost">View</Btn></div>},
            ]} rows={overdueInvoices}/>
          </Card>
        </div>
      )}

      {tab==="dataquality"&&(
        <Card>
          <Alert type="warning">3 data quality issues require attention before month-end reporting.</Alert>
          <Table cols={[
            {key:"type",label:"Issue Type",render:r=><Badge color={r.severity==="Critical"?"red":"amber"}>{r.severity}</Badge>},
            {key:"description",label:"Description"},
            {key:"entity",label:"Entity"},
            {key:"owner",label:"Owner"},
            {key:"actions",label:"",render:r=><Btn size="sm">Fix →</Btn>},
          ]} rows={[
            {type:"Missing Tags",severity:"Critical",description:"Mandatory Division tag missing",entity:"Pfizer Labelling Hub / SL-009",owner:"Tom Raj"},
            {type:"No Forecast",severity:"Critical",description:"Active service line with no forecast entries",entity:"Roche Submission Support",owner:"Mike Kumar"},
            {type:"No Service Lines",severity:"Warning",description:"Project has no service lines",entity:"Abbott MedTech Review",owner:"Tom Raj"},
          ]}/>
        </Card>
      )}

      {tab==="contracts"&&(
        <Card>
          <Alert type="warning">2 contracts expiring within 30 days with open service lines and unbilled forecast.</Alert>
          <Table cols={[
            {key:"ref",label:"Contract"},
            {key:"customer",label:"Customer"},
            {key:"end",label:"Expiry Date",render:r=><span style={{color:C.danger,fontWeight:600}}>{r.end}</span>},
            {key:"value",label:"Value",right:true,render:r=><strong>{r.currency} {fmtN(r.value)}</strong>},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Expired"?"red":"amber"} dot>{r.status}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm">Renew</Btn>},
          ]} rows={CONTRACTS.filter(c=>["SOW-PFZ-2025","MSA-GSK-2023"].includes(c.ref))}/>
        </Card>
      )}

      {tab==="tagreviews"&&(
        <Card>
          <Alert type="danger">{overdueReviews.length} tag reviews are overdue. Delivery Owners must complete these before month-end.</Alert>
          <Table cols={[
            {key:"project",label:"Project"},
            {key:"deliveryOwner",label:"Delivery Owner"},
            {key:"trigger",label:"Trigger",render:r=><Badge color={r.trigger==="Status Change"?"amber":"blue"}>{r.trigger}</Badge>},
            {key:"dueDate",label:"Due Date"},
            {key:"daysOverdue",label:"Days Overdue",right:true,render:r=>r.daysOverdue>0?<span style={{color:C.danger,fontWeight:700}}>{r.daysOverdue}d</span>:<span style={{color:C.textMuted}}>—</span>},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Overdue"?"red":"amber"} dot>{r.status}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost">Nudge</Btn>},
          ]} rows={initTagReviews}/>
        </Card>
      )}

      {tab==="odoo"&&(
        <Card>
          {failedSync.length>0&&<Alert type="danger">{failedSync.length} invoice sync failure. Retry automatically attempted 3 times — manual intervention required.</Alert>}
          <div style={{display:"flex",gap:8,marginBottom:16}}><Btn size="sm">Retry All Failed</Btn></div>
          <Table cols={[
            {key:"number",label:"Invoice"},
            {key:"customer",label:"Customer"},
            {key:"amount",label:"Amount",right:true,render:r=>`${r.currency} ${fmtN(r.amount)}`},
            {key:"odooSync",label:"Sync Status",render:r=><Badge color={r.odooSync==="Synced"?"green":"red"} dot>{r.odooSync}</Badge>},
            {key:"error",label:"Error",render:r=>r.odooSync==="Failed"?<span style={{fontSize:11,color:C.danger}}>Connection timeout — 3 attempts</span>:<span style={{fontSize:11,color:C.success}}>Synced successfully</span>},
            {key:"actions",label:"",render:r=>r.odooSync==="Failed"?<Btn size="sm">Retry</Btn>:null},
          ]} rows={INVOICES}/>
        </Card>
      )}
    </div>
  );
}

// ─── TAG REVIEWS MODULE ────────────────────────────────────────────────────
function TagReviews(){
  const [reviews,setReviews]=useState(initTagReviews);
  const [activeReview,setActiveReview]=useState(null);
  const [reviewForm,setReviewForm]=useState({});
  const [filterStatus,setFilterStatus]=useState("All");

  const filtered=reviews.filter(r=>filterStatus==="All"?true:r.status===filterStatus);

  const openReview=(r)=>{setActiveReview(r);setReviewForm({...r.tags});};
  const completeReview=()=>{
    setReviews(prev=>prev.map(r=>r.id===activeReview.id?{...r,status:"Completed",tags:{...reviewForm}}:r));
    setActiveReview(null);
  };

  return(
    <div>
      <SectionHeader title="Tag Review Workflow" sub="Periodic tag accuracy reviews for all active projects"
        action={<Btn size="sm">+ Manual Review</Btn>}/>

      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Overdue" value={reviews.filter(r=>r.status==="Overdue").length} sub="Past due date" accent={C.danger}/>
        <KpiCard label="Pending" value={reviews.filter(r=>r.status==="Pending").length} sub="Due soon" accent={C.warning}/>
        <KpiCard label="Completed (Apr)" value={reviews.filter(r=>r.status==="Completed").length} sub="This month" accent={C.success}/>
        <KpiCard label="Next Scheduled" value="May 1" sub="Monthly cycle" accent={C.primary}/>
      </div>

      <Card>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["All","Overdue","Pending","Completed"].map(s=>(
            <button key={s} onClick={()=>setFilterStatus(s)} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${filterStatus===s?C.primary:C.border}`,
              background:filterStatus===s?C.primary:C.white,color:filterStatus===s?C.white:C.textSub,fontSize:12,fontWeight:600,cursor:"pointer"}}>{s}</button>
          ))}
        </div>
        <Table cols={[
          {key:"project",label:"Project"},
          {key:"customer",label:"Customer"},
          {key:"deliveryOwner",label:"Delivery Owner"},
          {key:"trigger",label:"Trigger",render:r=><Badge color={r.trigger==="Status Change"?"amber":r.trigger==="Manual"?"purple":"blue"}>{r.trigger}</Badge>},
          {key:"triggerDetail",label:"Detail",render:r=><span style={{fontSize:11,color:C.textSub}}>{r.triggerDetail}</span>},
          {key:"dueDate",label:"Due"},
          {key:"daysOverdue",label:"Overdue",right:true,render:r=>r.daysOverdue>0?<span style={{color:C.danger,fontWeight:700}}>{r.daysOverdue}d</span>:<span style={{color:C.textMuted}}>—</span>},
          {key:"status",label:"Status",render:r=><Badge color={r.status==="Overdue"?"red":r.status==="Pending"?"amber":r.status==="Completed"?"green":"gray"} dot>{r.status}</Badge>},
          {key:"actions",label:"",render:r=>r.status!=="Completed"?<Btn size="sm" onClick={()=>openReview(r)}>Review</Btn>:<span style={{fontSize:12,color:C.success}}>✓ Done</span>},
        ]} rows={filtered}/>
      </Card>

      <Modal open={!!activeReview} onClose={()=>setActiveReview(null)} title={`Tag Review — ${activeReview?.project}`} width={700}>
        {activeReview&&(
          <>
            <Alert type="warning">Tag reviews are non-delegable. You are reviewing as the assigned Delivery Owner.</Alert>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              <div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:C.textSub}}>Current Tags</div>
                {Object.entries(activeReview.tags).map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:12,color:C.textSub,textTransform:"capitalize"}}>{k}</span>
                    <Badge color="blue">{v}</Badge>
                  </div>
                ))}
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:C.textSub}}>Update Tags</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Select label="Division" value={reviewForm.division||""} onChange={v=>setReviewForm(p=>({...p,division:v}))} options={DIVISIONS.map(d=>({value:d,label:d}))}/>
                  <Select label="Department" value={reviewForm.dept||""} onChange={v=>setReviewForm(p=>({...p,dept:v}))} options={DEPARTMENTS.map(d=>({value:d,label:d}))}/>
                  <Select label="Country" value={reviewForm.country||""} onChange={v=>setReviewForm(p=>({...p,country:v}))} options={TAGS.country.map(d=>({value:d,label:d}))}/>
                  <Select label="Region" value={reviewForm.region||""} onChange={v=>setReviewForm(p=>({...p,region:v}))} options={TAGS.region.map(d=>({value:d,label:d}))}/>
                </div>
              </div>
            </div>
            <Input label="Review Notes (optional)" value={reviewForm.notes||""} onChange={v=>setReviewForm(p=>({...p,notes:v}))} placeholder="Any changes or observations..."/>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
              <Btn variant="ghost" onClick={()=>setActiveReview(null)}>Cancel</Btn>
              <Btn variant="success" onClick={completeReview}>Mark Complete</Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

// ─── USER MANAGEMENT ───────────────────────────────────────────────────────
function UserManagement(){
  const [users,setUsers]=useState(USERS);
  const [selected,setSelected]=useState(null);
  const [showInvite,setShowInvite]=useState(false);
  const [inviteForm,setInviteForm]=useState({name:"",email:"",role:"Delivery Owner",division:""});
  const [filterRole,setFilterRole]=useState("All");

  const roles=["All","Delivery Owner","Portfolio Head","Division Head","Admin","Leadership"];
  const filtered=users.filter(u=>filterRole==="All"?true:u.role===filterRole);

  const handleInvite=()=>{
    if(!inviteForm.name||!inviteForm.email)return;
    setUsers(prev=>[...prev,{id:"u"+Date.now(),...inviteForm,status:"Pending",lastLogin:"—",scope:[]}]);
    setShowInvite(false);
    setInviteForm({name:"",email:"",role:"Delivery Owner",division:""});
  };

  return(
    <div>
      <SectionHeader title="User Management" sub="Platform users, roles, and data scope"
        action={<div style={{display:"flex",gap:8}}><Btn size="sm" onClick={()=>setShowInvite(true)}>+ Invite User</Btn></div>}/>

      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Total Users" value={users.length} sub="Registered accounts" accent={C.primary}/>
        <KpiCard label="Active" value={users.filter(u=>u.status==="Active").length} sub="Logged in at least once" accent={C.success}/>
        <KpiCard label="Pending Activation" value={users.filter(u=>u.status==="Pending").length} sub="Invited, not yet logged in" accent={C.warning}/>
        <KpiCard label="Delivery Owners" value={users.filter(u=>u.role==="Delivery Owner").length} sub="Active DOs" accent={C.primary}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20}}>
        <Card style={{padding:0}}>
          <div style={{padding:"14px 20px",display:"flex",gap:8,alignItems:"center",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>
            {roles.map(r=>(
              <button key={r} onClick={()=>setFilterRole(r)} style={{padding:"4px 12px",borderRadius:20,border:`1.5px solid ${filterRole===r?C.primary:C.border}`,
                background:filterRole===r?C.primary:C.white,color:filterRole===r?C.white:C.textSub,fontSize:12,fontWeight:600,cursor:"pointer"}}>{r}</button>
            ))}
          </div>
          <Table cols={[
            {key:"name",label:"Name",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.email}</div></div>},
            {key:"role",label:"Role",render:r=><Badge color={r.role==="Admin"?"red":r.role==="Leadership"?"purple":r.role==="Division Head"?"amber":"blue"}>{r.role}</Badge>},
            {key:"division",label:"Division"},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"amber"} dot>{r.status}</Badge>},
            {key:"lastLogin",label:"Last Login",render:r=><span style={{fontSize:12,color:C.textMuted}}>{r.lastLogin}</span>},
          ]} rows={filtered} onRow={r=>setSelected(r)}/>
        </Card>

        {selected?(
          <Card>
            <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{selected.name}</div>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:16}}>{selected.email}</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Select label="Role" value={selected.role} onChange={v=>setSelected(p=>({...p,role:v}))} options={["Delivery Owner","Portfolio Head","Division Head","Admin","Leadership"].map(r=>({value:r,label:r}))}/>
              <Select label="Division" value={selected.division} onChange={v=>setSelected(p=>({...p,division:v}))} options={["All",...DIVISIONS].map(d=>({value:d,label:d}))}/>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:C.textSub,marginBottom:6}}>Data Scope</div>
                <div style={{background:C.bg,borderRadius:6,padding:10}}>
                  {selected.scope.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                    <span style={{fontSize:12}}>{s}</span>
                    <button style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:12}}>✕</button>
                  </div>)}
                  {selected.scope.length===0&&<span style={{fontSize:12,color:C.textMuted}}>No scope rules defined</span>}
                </div>
                <Btn size="sm" variant="secondary" style={{marginTop:8,width:"100%"}}>+ Add Scope Rule</Btn>
              </div>
              <Select label="Status" value={selected.status} onChange={v=>setSelected(p=>({...p,status:v}))} options={["Active","Suspended"].map(s=>({value:s,label:s}))}/>
            </div>
            <div style={{display:"flex",gap:8,marginTop:20}}>
              <Btn onClick={()=>{setUsers(prev=>prev.map(u=>u.id===selected.id?{...selected}:u));}} style={{flex:1}}>Save Changes</Btn>
              <Btn variant="ghost" onClick={()=>setSelected(null)}>Cancel</Btn>
            </div>
          </Card>
        ):(
          <Card style={{display:"flex",alignItems:"center",justifyContent:"center",color:C.textMuted,textAlign:"center"}}>
            <div><div style={{fontSize:32,marginBottom:8}}>👤</div><div style={{fontSize:13}}>Select a user to view and edit their profile, role, and data scope</div></div>
          </Card>
        )}
      </div>

      <Modal open={showInvite} onClose={()=>setShowInvite(false)} title="Invite New User" width={480}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Input label="Full Name" required value={inviteForm.name} onChange={v=>setInviteForm(p=>({...p,name:v}))} placeholder="e.g. Alex Johnson"/>
          <Input label="Work Email" required type="email" value={inviteForm.email} onChange={v=>setInviteForm(p=>({...p,email:v}))} placeholder="alex.johnson@freyr.com"/>
          <Select label="Role" required value={inviteForm.role} onChange={v=>setInviteForm(p=>({...p,role:v}))} options={["Delivery Owner","Portfolio Head","Division Head","Admin","Leadership"].map(r=>({value:r,label:r}))}/>
          <Select label="Division" value={inviteForm.division} onChange={v=>setInviteForm(p=>({...p,division:v}))} placeholder="Select division" options={DIVISIONS.map(d=>({value:d,label:d}))}/>
        </div>
        <Alert type="info" >User will receive an SSO login invitation. Data scope can be configured after activation.</Alert>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
          <Btn variant="ghost" onClick={()=>setShowInvite(false)}>Cancel</Btn>
          <Btn onClick={handleInvite} disabled={!inviteForm.name||!inviteForm.email}>Send Invitation</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── CUSTOMERS MODULE ──────────────────────────────────────────────────────
function Customers(){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [customers,setCustomers]=useState(CUSTOMERS);
  const [search,setSearch]=useState("");
  const [form,setForm]=useState({name:"",type:"Pharma",region:"North America",country:"US",status:"Active",strategic:false});

  const filtered=customers.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));

  return(
    <div>
      <SectionHeader title="Customers" sub={`${customers.filter(c=>c.status==="Active").length} active accounts`}
        action={<Btn size="sm" onClick={()=>setShowNew(true)}>+ New Customer</Btn>}/>
      {view==="list"&&(
        <Card style={{padding:0}}>
          <div style={{padding:"14px 20px",display:"flex",gap:12,borderBottom:`1px solid ${C.border}`}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers..." style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          </div>
          <Table cols={[
            {key:"name",label:"Customer",render:r=><div><div style={{fontWeight:600}}>{r.name}{r.strategic&&<Badge color="purple" style={{marginLeft:6}}>Strategic</Badge>}</div><div style={{fontSize:11,color:C.textMuted}}>{r.type} · {r.country}</div></div>},
            {key:"region",label:"Region"},
            {key:"projects",label:"Projects",right:true},
            {key:"revenue",label:"Forecast",right:true,render:r=><strong>{fmtM(r.revenue)}</strong>},
            {key:"deliveryOwner",label:"Delivery Owner"},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"gray"} dot>{r.status}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setSelected(r);setView("detail");}}>View →</Btn>},
          ]} rows={filtered}/>
        </Card>
      )}
      {view==="detail"&&selected&&(
        <div>
          <Btn variant="ghost" size="sm" onClick={()=>setView("list")} style={{marginBottom:16}}>← Back to list</Btn>
          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
            <Card>
              <div style={{fontSize:20,fontWeight:700,marginBottom:4}}>{selected.name}</div>
              <div style={{fontSize:13,color:C.textSub,marginBottom:16}}>{selected.type} · {selected.region} · {selected.country}</div>
              <Tabs tabs={[{key:"overview",label:"Overview"},{key:"projects",label:"Projects"},{key:"invoices",label:"Invoices"}]} active="overview" onChange={()=>{}}/>
              <Table cols={[
                {key:"name",label:"Project"},
                {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"amber"} dot>{r.status}</Badge>},
                {key:"forecast",label:"Forecast",right:true,render:r=>fmtM(r.forecast)},
                {key:"actual",label:"Actual YTD",right:true,render:r=>fmtM(r.actual)},
              ]} rows={PROJECTS.filter(p=>p.customer===selected.name)}/>
            </Card>
            <Card>
              <div style={{fontWeight:700,marginBottom:12}}>Account Summary</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[["Delivery Owner",selected.deliveryOwner],["Status",selected.status],["Type",selected.type],["Region",selected.region],["Projects",selected.projects],["Total Forecast",fmtM(selected.revenue)]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
                    <span style={{color:C.textSub}}>{l}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="New Customer">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}><Input label="Customer Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="e.g. Pfizer Inc."/></div>
          <Select label="Customer Type" required value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={TAGS.customerType.map(t=>({value:t,label:t}))}/>
          <Select label="Region" required value={form.region} onChange={v=>setForm(p=>({...p,region:v}))} options={TAGS.region.map(r=>({value:r,label:r}))}/>
          <Select label="Country" required value={form.country} onChange={v=>setForm(p=>({...p,country:v}))} options={TAGS.country.map(c=>({value:c,label:c}))}/>
          <Select label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={["Active","Inactive"].map(s=>({value:s,label:s}))}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={()=>{if(form.name){setCustomers(p=>[...p,{...form,id:"c"+Date.now(),revenue:0,projects:0,deliveryOwner:"—"}]);setShowNew(false);}}} disabled={!form.name}>Save Customer</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── CONTRACTS MODULE ──────────────────────────────────────────────────────
function Contracts(){
  const [contracts,setContracts]=useState(CONTRACTS);
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [form,setForm]=useState({customerId:"c1",customer:"Johnson & Johnson",ref:"",type:"MSA",value:"",currency:"USD",start:"",end:"",status:"Active"});

  return(
    <div>
      <SectionHeader title="Contracts" sub={`${contracts.filter(c=>c.status==="Active").length} active contracts`}
        action={<Btn size="sm" onClick={()=>setShowNew(true)}>+ New Contract</Btn>}/>
      <Card style={{padding:0}}>
        <Table cols={[
          {key:"ref",label:"Contract Ref",render:r=><strong>{r.ref}</strong>},
          {key:"customer",label:"Customer"},
          {key:"type",label:"Type",render:r=><Badge color="blue">{r.type}</Badge>},
          {key:"currency",label:"CCY"},
          {key:"value",label:"Value",right:true,render:r=><strong>{r.currency} {fmtN(r.value)}</strong>},
          {key:"end",label:"Expiry",render:r=><span style={{color:["SOW-PFZ-2025","MSA-GSK-2023"].includes(r.ref)?C.warning:r.status==="Expired"?C.danger:C.text}}>{r.end}</span>},
          {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="Expired"?"red":"amber"} dot>{r.status}</Badge>},
          {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>setSelected(r)}>View</Btn>},
        ]} rows={contracts}/>
      </Card>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.ref||""} width={560}>
        {selected&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["Customer",selected.customer],["Type",selected.type],["Value",`${selected.currency} ${fmtN(selected.value)}`],["Period",`${selected.start} → ${selected.end}`],["Status",selected.status]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.textSub}}>{l}</span><strong>{v}</strong>
            </div>
          ))}
          <div style={{fontWeight:700,marginTop:8}}>Linked Projects</div>
          {PROJECTS.filter(p=>p.contractId===selected.id).map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <span>{p.name}</span><Badge color={p.status==="Active"?"green":"amber"} dot>{p.status}</Badge>
            </div>
          ))}
        </div>}
      </Modal>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="New Contract">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Select label="Customer" required value={form.customerId} onChange={v=>{const c=CUSTOMERS.find(c=>c.id===v);setForm(p=>({...p,customerId:v,customer:c?.name||""}));}} options={CUSTOMERS.map(c=>({value:c.id,label:c.name}))}/>
          <Input label="Contract Reference" required value={form.ref} onChange={v=>setForm(p=>({...p,ref:v}))} placeholder="e.g. MSA-ABC-2026"/>
          <Select label="Contract Type" value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={["MSA","SOW","NDA","Framework"].map(t=>({value:t,label:t}))}/>
          <Select label="Currency" value={form.currency} onChange={v=>setForm(p=>({...p,currency:v}))} options={CURRENCIES.map(c=>({value:c,label:c}))}/>
          <Input label="Contract Value" type="number" value={form.value} onChange={v=>setForm(p=>({...p,value:v}))} placeholder="Optional ceiling value"/>
          <Select label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={["Active","Expired"].map(s=>({value:s,label:s}))}/>
          <Input label="Start Date" required type="date" value={form.start} onChange={v=>setForm(p=>({...p,start:v}))}/>
          <Input label="End Date" type="date" value={form.end} onChange={v=>setForm(p=>({...p,end:v}))}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={()=>{if(form.ref&&form.customerId){setContracts(p=>[...p,{...form,id:"k"+Date.now(),value:parseFloat(form.value)||0}]);setShowNew(false);}}} disabled={!form.ref}>Save Contract</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── PROJECTS MODULE ───────────────────────────────────────────────────────
function Projects(){
  const [projects,setProjects]=useState(PROJECTS);
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [form,setForm]=useState({contractId:"k1",customer:"Johnson & Johnson",name:"",division:"Regulatory Affairs",dept:"Global RA",status:"Active",deliveryOwner:"Jane Smith",start:"",end:""});

  const divColors={"Regulatory Affairs":C.primary,"Clinical Writing":C.success,"Publishing":C.warning,"PV & Safety":C.purple};
  const filtered=projects.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.customer.toLowerCase().includes(search.toLowerCase()));

  return(
    <div>
      <SectionHeader title="Projects" sub={`${projects.filter(p=>p.status==="Active").length} active projects`}
        action={<Btn size="sm" onClick={()=>setShowNew(true)}>+ New Project</Btn>}/>
      <Card style={{padding:0}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects or customers..." style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
        </div>
        <Table cols={[
          {key:"name",label:"Project",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.customer}</div></div>},
          {key:"division",label:"Division",render:r=><Badge color={r.division==="Regulatory Affairs"?"blue":r.division==="Clinical Writing"?"green":r.division==="Publishing"?"amber":"purple"}>{r.division}</Badge>},
          {key:"deliveryOwner",label:"Delivery Owner"},
          {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="On Hold"?"amber":"gray"} dot>{r.status}</Badge>},
          {key:"forecast",label:"Forecast",right:true,render:r=>fmtM(toUSD(r.forecast,CONTRACTS.find(k=>k.id===r.contractId)?.currency||"USD"))},
          {key:"actual",label:"Actual YTD",right:true,render:r=>fmtM(toUSD(r.actual,CONTRACTS.find(k=>k.id===r.contractId)?.currency||"USD"))},
          {key:"real",label:"Real.",right:true,render:r=>{const rl=r.actual/r.forecast*100;return<Badge color={rl>=92?"green":rl>=80?"amber":"red"}>{pct(rl)}</Badge>;}},
          {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>setSelected(r)}>View</Btn>},
        ]} rows={filtered}/>
      </Card>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name||""} width={680}>
        {selected&&<div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
            <Badge color="blue">{selected.division}</Badge>
            <Badge color={selected.status==="Active"?"green":"amber"} dot>{selected.status}</Badge>
            <span style={{fontSize:13,color:C.textSub}}>DO: <strong>{selected.deliveryOwner}</strong></span>
            <span style={{fontSize:13,color:C.textSub}}>Customer: <strong>{selected.customer}</strong></span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <KpiCard label="Forecast" value={fmtM(toUSD(selected.forecast,CONTRACTS.find(k=>k.id===selected.contractId)?.currency||"USD"))} sub="USD equivalent" accent={C.primary}/>
            <KpiCard label="Actual YTD" value={fmtM(toUSD(selected.actual,CONTRACTS.find(k=>k.id===selected.contractId)?.currency||"USD"))} sub="Jan–Mar 2026" accent={C.success}/>
          </div>
          <div style={{fontWeight:700,marginBottom:8}}>Service Lines</div>
          <Table cols={[
            {key:"name",label:"Service Line"},
            {key:"commercialType",label:"Type",render:r=><Badge color="blue">{r.commercialType}</Badge>},
            {key:"division",label:"Division"},
            {key:"currency",label:"CCY"},
          ]} rows={SERVICE_LINES_LIST.filter(s=>s.projectId===selected.id)}/>
        </div>}
      </Modal>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="New Project">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}><Input label="Project Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="e.g. AZ Global RA Support"/></div>
          <Select label="Contract" required value={form.contractId} onChange={v=>{const c=CONTRACTS.find(c=>c.id===v);setForm(p=>({...p,contractId:v,customer:c?.customer||""}));}} options={CONTRACTS.map(c=>({value:c.id,label:`${c.ref} — ${c.customer}`}))}/>
          <Select label="Division" required value={form.division} onChange={v=>setForm(p=>({...p,division:v}))} options={DIVISIONS.map(d=>({value:d,label:d}))}/>
          <Select label="Department" required value={form.dept} onChange={v=>setForm(p=>({...p,dept:v}))} options={DEPARTMENTS.map(d=>({value:d,label:d}))}/>
          <Select label="Delivery Owner" required value={form.deliveryOwner} onChange={v=>setForm(p=>({...p,deliveryOwner:v}))} options={USERS.filter(u=>u.role==="Delivery Owner").map(u=>({value:u.name,label:u.name}))}/>
          <Input label="Start Date" type="date" value={form.start} onChange={v=>setForm(p=>({...p,start:v}))}/>
          <Input label="End Date" type="date" value={form.end} onChange={v=>setForm(p=>({...p,end:v}))}/>
          <Select label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={["Active","On Hold","Closed"].map(s=>({value:s,label:s}))}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={()=>{if(form.name){setProjects(p=>[...p,{...form,id:"p"+Date.now(),forecast:0,actual:0}]);setShowNew(false);}}} disabled={!form.name}>Save Project</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── SERVICE LINES MODULE ──────────────────────────────────────────────────
function ServiceLines(){
  const [sls,setSls]=useState(SERVICE_LINES_LIST);
  const [showNew,setShowNew]=useState(false);
  const [selected,setSelected]=useState(null);
  const [form,setForm]=useState({name:"",projectId:"p1",project:"J&J RA Global Support",customer:"Johnson & Johnson",commercialType:"T&M Managed",division:"Regulatory Affairs",dept:"Global RA",currency:"USD",deliveryOwner:"Jane Smith"});

  return(
    <div>
      <SectionHeader title="Service Lines" sub={`${sls.length} service lines across ${PROJECTS.length} projects`}
        action={<Btn size="sm" onClick={()=>setShowNew(true)}>+ New Service Line</Btn>}/>
      <Card style={{padding:0}}>
        <Table cols={[
          {key:"name",label:"Service Line",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.project}</div></div>},
          {key:"customer",label:"Customer"},
          {key:"commercialType",label:"Commercial Type",render:r=><Badge color={r.commercialType.includes("T&M")?"blue":r.commercialType==="Fixed Price"?"green":r.commercialType==="Unit-Based"?"amber":"purple"}>{r.commercialType}</Badge>},
          {key:"division",label:"Division"},
          {key:"currency",label:"CCY"},
          {key:"deliveryOwner",label:"Delivery Owner"},
          {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>setSelected(r)}>View</Btn>},
        ]} rows={sls}/>
      </Card>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name||""} width={560}>
        {selected&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["Project",selected.project],["Customer",selected.customer],["Commercial Type",selected.commercialType],["Division",selected.division],["Department",selected.dept],["Currency",selected.currency],["Delivery Owner",selected.deliveryOwner]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.textSub}}>{l}</span><strong>{v}</strong>
            </div>
          ))}
        </div>}
      </Modal>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="New Service Line">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}><Input label="Service Line Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="e.g. HA Query Support"/></div>
          <Select label="Project" required value={form.projectId} onChange={v=>{const pr=PROJECTS.find(p=>p.id===v);setForm(p=>({...p,projectId:v,project:pr?.name||"",customer:pr?.customer||""}));}} options={PROJECTS.map(p=>({value:p.id,label:p.name}))}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,gridColumn:"1/-1"}}>
            {["Fixed Price","T&M Staffing","T&M Managed","Unit-Based","Recurring"].map(ct=>(
              <button key={ct} onClick={()=>setForm(p=>({...p,commercialType:ct}))} style={{padding:"10px 8px",borderRadius:8,border:`2px solid ${form.commercialType===ct?C.primary:C.border}`,background:form.commercialType===ct?C.primaryLight:C.white,cursor:"pointer",fontSize:12,fontWeight:600,color:form.commercialType===ct?C.primary:C.textSub}}>{ct}</button>
            ))}
          </div>
          <Select label="Division" required value={form.division} onChange={v=>setForm(p=>({...p,division:v}))} options={DIVISIONS.map(d=>({value:d,label:d}))}/>
          <Select label="Department" required value={form.dept} onChange={v=>setForm(p=>({...p,dept:v}))} options={DEPARTMENTS.map(d=>({value:d,label:d}))}/>
          <Select label="Currency" required value={form.currency} onChange={v=>setForm(p=>({...p,currency:v}))} options={CURRENCIES.map(c=>({value:c,label:c}))}/>
          <Select label="Delivery Owner" required value={form.deliveryOwner} onChange={v=>setForm(p=>({...p,deliveryOwner:v}))} options={USERS.filter(u=>u.role==="Delivery Owner").map(u=>({value:u.name,label:u.name}))}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={()=>{if(form.name){setSls(p=>[...p,{...form,id:"sl"+Date.now()}]);setShowNew(false);}}} disabled={!form.name}>Save Service Line</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── INVOICES MODULE ───────────────────────────────────────────────────────
function Invoices(){
  const [invoices,setInvoices]=useState(INVOICES);
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [form,setForm]=useState({customer:"Johnson & Johnson",project:"J&J RA Global Support",amount:"",currency:"USD",due:"",notes:""});

  const statusColor=s=>s==="Paid"?"green":s==="Outstanding"?"blue":s==="Overdue"?"red":"gray";

  return(
    <div>
      <SectionHeader title="Invoices" sub="Invoice tracking and Odoo sync status"
        action={<Btn size="sm" onClick={()=>setShowNew(true)}>+ New Invoice</Btn>}/>
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Total Invoiced" value={fmtM(invoiceTotalUSD())} sub="All invoices · USD" accent={C.primary}/>
        <KpiCard label="Collected" value={fmtM(invoicePaidUSD())} sub="Paid invoices" accent={C.success}/>
        <KpiCard label="Outstanding" value={fmtM(invoiceOutstandingUSD())} sub="Unpaid (incl. overdue)" accent={C.warning}/>
        <KpiCard label="Sync Failures" value={invoices.filter(i=>i.odooSync==="Failed").length} sub="Odoo sync errors" accent={C.danger}/>
      </div>
      <Card style={{padding:0}}>
        <Table cols={[
          {key:"number",label:"Invoice No.",render:r=><strong>{r.number}</strong>},
          {key:"customer",label:"Customer"},
          {key:"serviceLine",label:"Service Line"},
          {key:"amount",label:"Amount",right:true,render:r=><strong>{r.currency} {fmtN(r.amount)}</strong>},
          {key:"due",label:"Due",render:r=><span style={{color:r.status==="Overdue"?C.danger:C.text}}>{r.due}</span>},
          {key:"status",label:"Status",render:r=><Badge color={statusColor(r.status)} dot>{r.status}</Badge>},
          {key:"odooSync",label:"Odoo",render:r=><Badge color={r.odooSync==="Synced"?"green":"red"}>{r.odooSync}</Badge>},
          {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>setSelected(r)}>View</Btn>},
        ]} rows={invoices}/>
      </Card>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.number||""} width={560}>
        {selected&&<div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>
            <Badge color={selected.odooSync==="Synced"?"green":"red"}>{selected.odooSync}</Badge>
          </div>
          {selected.odooSync==="Failed"&&<Alert type="danger">Odoo sync failed. Automatic retry exhausted. Click Retry to attempt again.</Alert>}
          {[["Customer",selected.customer],["Project",selected.project],["Service Line",selected.serviceLine],["Amount",`${selected.currency} ${fmtN(selected.amount)}`],["Issued",selected.issued],["Due",selected.due],["Paid",selected.paid||"—"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.textSub}}>{l}</span><strong>{v}</strong>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:16}}>
            {selected.odooSync==="Failed"&&<Btn size="sm">Retry Sync</Btn>}
            {selected.status!=="Paid"&&<Btn size="sm" variant="success">Mark Paid</Btn>}
          </div>
        </div>}
      </Modal>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="New Invoice">
        <Alert type="info">Invoice number will be auto-generated in format FRUS2026XXXX on submission.</Alert>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Select label="Customer" required value={form.customer} onChange={v=>setForm(p=>({...p,customer:v}))} options={CUSTOMERS.map(c=>({value:c.name,label:c.name}))}/>
          <Select label="Project" required value={form.project} onChange={v=>setForm(p=>({...p,project:v}))} options={PROJECTS.map(p=>({value:p.name,label:p.name}))}/>
          <Input label="Amount" required type="number" value={form.amount} onChange={v=>setForm(p=>({...p,amount:v}))} placeholder="e.g. 50000"/>
          <Select label="Currency" value={form.currency} onChange={v=>setForm(p=>({...p,currency:v}))} options={CURRENCIES.map(c=>({value:c,label:c}))}/>
          <Input label="Due Date" required type="date" value={form.due} onChange={v=>setForm(p=>({...p,due:v}))}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={()=>{if(form.amount&&form.customer){setInvoices(p=>[...p,{...form,id:"i"+Date.now(),number:`FRUS2026${1835+p.length}`,amount:parseFloat(form.amount),status:"Outstanding",issued:new Date().toISOString().slice(0,10),paid:null,odooSync:"Pending"}]);setShowNew(false);}}} disabled={!form.amount}>Submit Invoice</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── TAG MASTER ────────────────────────────────────────────────────────────
function TagMaster(){
  const [activeCategory,setActiveCategory]=useState("division");
  const [customTags,setCustomTags]=useState(TAGS);
  const [showNew,setShowNew]=useState(false);
  const [newTag,setNewTag]=useState("");
  const cats=Object.keys(customTags);
  const catLabels={division:"Division",department:"Department",country:"Country",region:"Region",customerType:"Customer Type",accountType:"Account Type"};

  return(
    <div>
      <SectionHeader title="Tag Master" sub="Manage tag categories and values for classification and reporting"/>
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20}}>
        <Card style={{padding:0}}>
          {cats.map(cat=>(
            <div key={cat} onClick={()=>setActiveCategory(cat)} style={{padding:"11px 16px",cursor:"pointer",background:activeCategory===cat?C.primaryLight:"transparent",borderLeft:activeCategory===cat?`3px solid ${C.primary}`:"3px solid transparent",fontSize:13,fontWeight:activeCategory===cat?700:400,color:activeCategory===cat?C.primary:C.text}}>
              {catLabels[cat]||cat}
              <span style={{marginLeft:8,background:C.bg,borderRadius:10,padding:"1px 7px",fontSize:11,color:C.textSub}}>{customTags[cat].length}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:15}}>{catLabels[activeCategory]||activeCategory} Tags</div>
            <Btn size="sm" onClick={()=>setShowNew(true)}>+ New Tag</Btn>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {customTags[activeCategory].map((tag,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,background:C.primaryLight,color:C.primary,padding:"5px 12px",borderRadius:20,fontSize:13,fontWeight:600}}>
                {tag}
                <button onClick={()=>setCustomTags(p=>({...p,[activeCategory]:p[activeCategory].filter(t=>t!==tag)}))} style={{background:"none",border:"none",cursor:"pointer",color:C.primary,fontSize:14,lineHeight:1}}>×</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title={`Add ${catLabels[activeCategory]||activeCategory} Tag`} width={400}>
        <Input label="Tag Value" required value={newTag} onChange={setNewTag} placeholder="Enter tag value"/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={()=>{if(newTag){setCustomTags(p=>({...p,[activeCategory]:[...p[activeCategory],newTag]}));setNewTag("");setShowNew(false);}}} disabled={!newTag}>Add Tag</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── RATE CARD ─────────────────────────────────────────────────────────────
function RateCard(){
  const [tab,setTab]=useState("standard");
  const [rates,setRates]=useState(initRates);
  const [overrides]=useState(initOverrides);
  const [alerts,setAlerts]=useState(initAlerts);
  const [showAddRate,setShowAddRate]=useState(false);
  const [showHistory,setShowHistory]=useState(false);
  const [historyRate,setHistoryRate]=useState(null);
  const [filterStatus,setFilterStatus]=useState("Active");
  const [form,setForm]=useState({role:"",grade:"",location:"",currency:"USD",unit:"Hour",rate:"",effectiveFrom:"2026-01-01",effectiveTo:"",status:"Active"});
  const activeRates=rates.filter(r=>filterStatus==="All"?true:r.status===filterStatus);
  const pendingAlerts=alerts.filter(a=>a.status==="Pending").length;
  const deviationBadge=d=>{const a=Math.abs(d);return a>15?"red":a>5?"amber":"gray";};
  return(
    <div>
      <SectionHeader title="Rate Card Master" sub="Standard rates, project overrides, and rate update alerts"
        action={<div style={{display:"flex",gap:8}}><Btn variant="secondary" size="sm" onClick={()=>setShowHistory(true)}>📜 Rate History</Btn><Btn size="sm" onClick={()=>setShowAddRate(true)}>+ New Rate</Btn></div>}/>
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Active Standard Rates" value={rates.filter(r=>r.status==="Active").length} sub="Across all roles & locations" accent={C.primary}/>
        <KpiCard label="Project Overrides" value={overrides.length} sub="Negotiated deviations" accent={C.warning}/>
        <KpiCard label="Pending Rate Alerts" value={pendingAlerts} sub="Awaiting DO acknowledgement" accent={C.danger} badge={pendingAlerts>0?<Badge color="red" dot>Action needed</Badge>:null}/>
        <KpiCard label="Rate Revisions (2026)" value={4} sub="Last revision: Jan 2026" accent={C.success}/>
      </div>
      <Tabs tabs={[{key:"standard",label:"Standard Rates"},{key:"overrides",label:"Project Overrides"},{key:"alerts",label:"Rate Alerts",count:pendingAlerts}]} active={tab} onChange={setTab}/>
      {tab==="standard"&&<Card>
        <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"center"}}>
          <Select value={filterStatus} onChange={setFilterStatus} options={["Active","Retired","All"]} style={{width:140}}/>
          <div style={{flex:1}}/><span style={{fontSize:12,color:C.textMuted}}>{activeRates.length} rates shown</span>
        </div>
        <Table cols={[
          {key:"role",label:"Role"},{key:"grade",label:"Grade"},{key:"location",label:"Location"},{key:"currency",label:"Currency"},{key:"unit",label:"Unit"},
          {key:"rate",label:"Rate",right:true,render:r=><strong>{r.currency} {fmtN(r.rate)}/{r.unit}</strong>},
          {key:"effectiveFrom",label:"Effective From"},{key:"effectiveTo",label:"To",render:r=>r.effectiveTo||<span style={{color:C.textMuted}}>Open</span>},
          {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"gray"}>{r.status}</Badge>},
          {key:"actions",label:"",render:r=><div style={{display:"flex",gap:6}}><Btn variant="ghost" size="sm">Edit</Btn><Btn variant="ghost" size="sm" onClick={()=>{setHistoryRate(r);setShowHistory(true);}}>History</Btn></div>},
        ]} rows={activeRates}/>
      </Card>}
      {tab==="overrides"&&<Card>
        <Alert type="info">Project overrides represent negotiated deviations from the standard rate card. Deviations &gt;15% are flagged.</Alert>
        <Table cols={[
          {key:"serviceLine",label:"Service Line"},{key:"customer",label:"Customer"},{key:"role",label:"Role"},
          {key:"stdRate",label:"Std Rate",right:true,render:r=><span style={{color:C.textMuted}}>{r.currency} {fmtN(r.stdRate)}/{r.unit}</span>},
          {key:"overrideRate",label:"Override",right:true,render:r=><strong>{r.currency} {fmtN(r.overrideRate)}/{r.unit}</strong>},
          {key:"deviation",label:"Deviation",right:true,render:r=><Badge color={deviationBadge(r.deviation)}>{r.deviation>0?"+":""}{r.deviation.toFixed(1)}%</Badge>},
          {key:"reason",label:"Reason",render:r=><span style={{fontSize:12,color:C.textSub}}>{r.reason}</span>},
        ]} rows={overrides}/>
      </Card>}
      {tab==="alerts"&&<Card>
        <Alert type="warning">{pendingAlerts} service lines pending review after January 2026 rate revision.</Alert>
        <div style={{marginBottom:16}}><Btn variant="secondary" size="sm">Send All Reminders</Btn></div>
        <Table cols={[
          {key:"serviceLine",label:"Service Line"},{key:"deliveryOwner",label:"Delivery Owner"},{key:"role",label:"Role"},
          {key:"oldRate",label:"Previous",right:true,render:r=><span style={{color:C.textMuted}}>{r.currency} {fmtN(r.oldRate)}</span>},
          {key:"newRate",label:"New Rate",right:true,render:r=><strong style={{color:C.primary}}>{r.currency} {fmtN(r.newRate)}</strong>},
          {key:"status",label:"Status",render:r=><Badge color={r.status==="Acknowledged"?"green":"red"} dot>{r.status}</Badge>},
          {key:"actions",label:"",render:r=>r.status==="Pending"?<div style={{display:"flex",gap:6}}><Btn size="sm" onClick={()=>setAlerts(p=>p.map(a=>a.id===r.id?{...a,status:"Acknowledged"}:a))}>Apply</Btn><Btn variant="ghost" size="sm">Nudge</Btn></div>:<span style={{fontSize:12,color:C.success}}>✓</span>},
        ]} rows={alerts}/>
      </Card>}
      <Modal open={showAddRate} onClose={()=>setShowAddRate(false)} title="Add Standard Rate">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Select label="Role" required value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} options={ROLES.map(r=>({value:r,label:r}))} placeholder="Select role"/>
          <Select label="Grade" required value={form.grade} onChange={v=>setForm(p=>({...p,grade:v}))} options={GRADES.map(g=>({value:g,label:g}))} placeholder="Select grade"/>
          <Select label="Location" required value={form.location} onChange={v=>setForm(p=>({...p,location:v}))} options={LOCATIONS.map(l=>({value:l,label:l}))} placeholder="Select location"/>
          <Select label="Currency" required value={form.currency} onChange={v=>setForm(p=>({...p,currency:v}))} options={CURRENCIES.map(c=>({value:c,label:c}))}/>
          <Select label="Unit" required value={form.unit} onChange={v=>setForm(p=>({...p,unit:v}))} options={["Hour","Day","Page","Word","Module","Unit"].map(u=>({value:u,label:u}))}/>
          <Input label="Rate" required type="number" value={form.rate} onChange={v=>setForm(p=>({...p,rate:v}))} placeholder="e.g. 185" hint={form.rate?`${form.currency} ${fmtN(parseFloat(form.rate)||0)} / ${form.unit}`:""}/>
          <Input label="Effective From" required type="date" value={form.effectiveFrom} onChange={v=>setForm(p=>({...p,effectiveFrom:v}))}/>
          <Input label="Effective To" type="date" value={form.effectiveTo} onChange={v=>setForm(p=>({...p,effectiveTo:v}))}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowAddRate(false)}>Cancel</Btn>
          <Btn onClick={()=>{if(form.role&&form.grade&&form.location&&form.rate){setRates(p=>[...p,{...form,id:"r"+Date.now(),rate:parseFloat(form.rate)}]);setShowAddRate(false);}}} disabled={!form.role||!form.rate}>Save Rate</Btn>
        </div>
      </Modal>
      <Modal open={showHistory} onClose={()=>{setShowHistory(false);setHistoryRate(null);}} title={historyRate?`Rate History — ${historyRate.role}`:"Audit Log"} width={700}>
        <Alert type="info">Rate history is immutable and cannot be edited or deleted.</Alert>
        <Table cols={[
          {key:"event",label:"Event",render:(_,i)=>i===0?"Rate Updated":"Rate Created"},
          {key:"role",label:"Role",render:()=>historyRate?.role||"Various"},
          {key:"old",label:"Previous",render:(r,i)=>i===0?`${historyRate?.currency||"USD"} ${fmtN((historyRate?.rate||185)*0.943)}`:"—"},
          {key:"new",label:"New",render:()=><strong>{historyRate?.currency||"USD"} {fmtN(historyRate?.rate||185)}</strong>},
          {key:"by",label:"By",render:()=>"Admin"},
          {key:"at",label:"Date",render:(_,i)=>i===0?"2026-01-02":"2025-01-05"},
        ]} rows={historyRate?[historyRate,historyRate]:rates.slice(0,3)}/>
      </Modal>
    </div>
  );
}

// ─── FX RATES ──────────────────────────────────────────────────────────────
function FxRates(){
  const [tab,setTab]=useState("current");
  const [fxRates,setFxRates]=useState(initFxRates);
  const [showAdd,setShowAdd]=useState(false);
  const [addForm,setAddForm]=useState({pair:"GBP/USD",from:"GBP",to:"USD",month:"Apr 2026",rate:""});
  const currentMonth="Apr 2026";
  const getRateForMonth=(pair,month)=>fxRates.find(r=>r.pair===pair&&r.month===month);
  const missingCurrent=FX_PAIRS.filter(p=>!getRateForMonth(p,currentMonth));
  const handleAddRates=()=>{
    if(!addForm.rate)return;
    const existing=fxRates.find(r=>r.pair===addForm.pair&&r.month===addForm.month);
    if(existing){setFxRates(p=>p.map(r=>r.pair===addForm.pair&&r.month===addForm.month?{...r,rate:parseFloat(addForm.rate),enteredAt:"2026-04-09"}:r));}
    else{setFxRates(p=>[...p,{id:"fx"+Date.now(),...addForm,rate:parseFloat(addForm.rate),enteredBy:"Admin",enteredAt:"2026-04-09"}]);}
    setShowAdd(false);
  };
  return(
    <div>
      <SectionHeader title="FX Rate Master" sub="Monthly average exchange rates for USD reporting conversion" action={<Btn size="sm" onClick={()=>setShowAdd(true)}>+ Add Rates</Btn>}/>
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Active Pairs" value={FX_PAIRS.length} sub="Tracked for conversion" accent={C.primary}/>
        <KpiCard label="Missing (Apr 2026)" value={missingCurrent.length} accent={missingCurrent.length>0?C.danger:C.success} badge={missingCurrent.length>0?<Badge color="red" dot>Action required</Badge>:<Badge color="green" dot>All current</Badge>}/>
        <KpiCard label="Reporting Currency" value="USD" sub="All reports converted to USD" accent={C.success}/>
      </div>
      {missingCurrent.length>0&&<Alert type="warning"><strong>Missing rates for {currentMonth}:</strong> {missingCurrent.join(", ")}. <button style={{background:"none",border:"none",color:C.warning,cursor:"pointer",fontWeight:700,textDecoration:"underline"}} onClick={()=>setShowAdd(true)}>Enter now →</button></Alert>}
      <Tabs tabs={[{key:"current",label:`${currentMonth} Rates`},{key:"grid",label:"Rate Grid (2026)"},{key:"history",label:"Audit History"}]} active={tab} onChange={setTab}/>
      {tab==="current"&&<Card>
        <Table cols={[
          {key:"pair",label:"Currency Pair",render:r=><strong>{r}</strong>},
          {key:"rate",label:`Rate (${currentMonth})`,right:true,render:r=>{const e=getRateForMonth(r,currentMonth);return e?<span>1 {r.replace("/USD","")} = <strong>{e.rate.toFixed(4)} USD</strong></span>:<Badge color="red" dot>Missing</Badge>;}},
          {key:"status",label:"Status",render:r=>getRateForMonth(r,currentMonth)?<Badge color="green">Entered</Badge>:<Badge color="red">Missing</Badge>},
          {key:"actions",label:"",render:r=>{const e=getRateForMonth(r,currentMonth);return<Btn size="sm" variant={e?"ghost":"primary"} onClick={()=>{setAddForm({pair:r,from:r.replace("/USD",""),to:"USD",month:currentMonth,rate:e?.rate??""});setShowAdd(true);}}>{e?"Edit":"Enter Rate"}</Btn>;}},
        ]} rows={FX_PAIRS}/>
      </Card>}
      {tab==="grid"&&<Card style={{padding:0}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>
              <th style={{padding:"10px 14px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"left",fontWeight:700,position:"sticky",left:0,zIndex:1}}>Pair</th>
              {MONTHS_2026.map((m,i)=><th key={m} style={{padding:"10px 10px",background:i===CUR_MONTH_IDX?C.primaryLight:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right",fontWeight:600,color:i===CUR_MONTH_IDX?C.primary:C.textSub,whiteSpace:"nowrap"}}>{m}</th>)}
            </tr></thead>
            <tbody>{FX_PAIRS.map(pair=>(
              <tr key={pair} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"8px 14px",fontWeight:700,background:C.white,position:"sticky",left:0}}>{pair}</td>
                {MONTHS_2026.map((m,i)=>{const e=getRateForMonth(pair,m);const isPast=i<CUR_MONTH_IDX;const isCurrent=i===CUR_MONTH_IDX;return(
                  <td key={m} style={{padding:"8px 10px",textAlign:"right",background:isCurrent?C.primaryLight:"transparent"}}>
                    {isPast&&!e&&<span style={{color:C.danger,fontSize:11}}>✕</span>}
                    {e&&<span style={{color:isPast?C.textSub:C.text}}>{e.rate.toFixed(4)}</span>}
                    {i>CUR_MONTH_IDX&&!e&&<input type="number" step="0.0001" placeholder="—" style={{width:70,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 4px",fontSize:11,textAlign:"right"}}/>}
                    {isCurrent&&!e&&<button onClick={()=>{setAddForm({pair,from:pair.replace("/USD",""),to:"USD",month:m,rate:""});setShowAdd(true);}} style={{background:C.primary,color:C.white,border:"none",borderRadius:4,padding:"2px 8px",fontSize:11,cursor:"pointer"}}>Enter</button>}
                  </td>
                );})}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>}
      {tab==="history"&&<Card>
        <Alert type="info">FX rate history is permanently locked once the month ends.</Alert>
        <Table cols={[
          {key:"pair",label:"Pair",render:r=><strong>{r.pair}</strong>},{key:"month",label:"Month"},
          {key:"rate",label:"Rate",right:true,render:r=><strong>{r.rate.toFixed(4)}</strong>},
          {key:"formula",label:"Formula",render:r=><span style={{color:C.textSub}}>1 {r.from} = {r.rate.toFixed(4)} {r.to}</span>},
          {key:"enteredBy",label:"By"},{key:"enteredAt",label:"Date"},
          {key:"locked",label:"Status",render:()=><Badge color="gray">Locked</Badge>},
        ]} rows={[...fxRates].sort((a,b)=>b.enteredAt.localeCompare(a.enteredAt))}/>
      </Card>}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Enter FX Rate" width={520}>
        <Alert type="info">Monthly average rates lock permanently once the month ends.</Alert>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Select label="Currency Pair" required value={addForm.pair} onChange={v=>setAddForm(p=>({...p,pair:v,from:v.replace("/USD","")}))} options={FX_PAIRS.map(p=>({value:p,label:p}))}/>
          <Select label="Month" required value={addForm.month} onChange={v=>setAddForm(p=>({...p,month:v}))} options={MONTHS_2026.map(m=>({value:m,label:m}))}/>
          <div style={{gridColumn:"1/-1"}}>
            <Input label={`Exchange Rate (1 ${addForm.from} → USD)`} required type="number" step="0.0001" value={addForm.rate} onChange={v=>setAddForm(p=>({...p,rate:v}))} placeholder="e.g. 1.2680"/>
            {addForm.rate&&<div style={{marginTop:8,padding:"10px 12px",background:C.primaryLight,borderRadius:6,fontSize:13}}>1 {addForm.from} = <strong>{parseFloat(addForm.rate).toFixed(4)} USD</strong></div>}
          </div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn onClick={handleAddRates}>Save Rate</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── FORECAST ──────────────────────────────────────────────────────────────
function Forecast(){
  const [selectedSl,setSelectedSl]=useState(SERVICE_LINES_LIST[0]);
  const [versions,setVersions]=useState(initForecastVersions);
  const [entries,setEntries]=useState(initForecastEntries);
  const [activeVersionId,setActiveVersionId]=useState("v2");
  const [showVersionMgr,setShowVersionMgr]=useState(false);
  const [showCompare,setShowCompare]=useState(false);
  const [showNewVersion,setShowNewVersion]=useState(false);
  const [compareVers,setCompareVers]=useState({a:"v1",b:"v2"});
  const [showActuals,setShowActuals]=useState(true);
  const [newVerForm,setNewVerForm]=useState({name:"",type:"Working",reason:"",copyFrom:""});
  const slVersions=versions[selectedSl.id]||[];
  const activeVersion=slVersions.find(v=>v.id===activeVersionId)||slVersions[slVersions.length-1];
  const slEntries=entries[selectedSl.id]||{};
  const activeEntries=slEntries[activeVersionId]||{};
  const totalForecast=Object.values(activeEntries).reduce((s,e)=>s+(e.amount||0),0);
  const totalActual=Object.values(activeEntries).reduce((s,e)=>s+(e.actual||0),0);
  const variance=totalActual-totalForecast;
  const realization=totalForecast>0?totalActual/totalForecast*100:0;
  const isT_M=["T&M Managed","T&M Staffing"].includes(selectedSl.commercialType);
  const isUnit=selectedSl.commercialType==="Unit-Based";
  const versionColor=type=>type==="Baseline"?C.text:type==="Working"?C.primary:C.purple;
  const versionBadge=type=>type==="Baseline"?"gray":type==="Working"?"blue":"purple";
  const monthColColor=i=>i<CUR_MONTH_IDX?"#f8fafc":i===CUR_MONTH_IDX?"#edf4fd":C.white;
  const handleEntryChange=(month,field,val)=>{
    setEntries(prev=>{
      const slE={...(prev[selectedSl.id]||{})};const verE={...(slE[activeVersionId]||{})};const cell={...(verE[month]||{})};
      cell[field]=parseFloat(val)||0;
      if((isT_M||isUnit)&&field!=="amount")cell.amount=Math.round((cell.qty||0)*(cell.rate||0));
      verE[month]=cell;slE[activeVersionId]=verE;return{...prev,[selectedSl.id]:slE};
    });
  };
  const handleCreateVersion=()=>{
    if(!newVerForm.name)return;
    const newId="v"+Date.now();
    const copyEntries=newVerForm.copyFrom?slEntries[newVerForm.copyFrom]:{};
    setVersions(prev=>({...prev,[selectedSl.id]:[...(prev[selectedSl.id]||[]).map(v=>({...v,isWorking:false})),{id:newId,name:newVerForm.name,type:newVerForm.type,reason:newVerForm.reason,createdBy:"Jane Smith",createdAt:"2026-04-09",locked:false,isWorking:true}]}));
    setEntries(prev=>({...prev,[selectedSl.id]:{...(prev[selectedSl.id]||{}),[newId]:JSON.parse(JSON.stringify(copyEntries))}}));
    setActiveVersionId(newId);setShowNewVersion(false);setNewVerForm({name:"",type:"Working",reason:"",copyFrom:""});
  };
  return(
    <div>
      <SectionHeader title="Forecast Entry" sub="Monthly revenue forecast by service line with version management"
        action={<div style={{display:"flex",gap:8}}>
          <Btn variant="secondary" size="sm" onClick={()=>setShowCompare(true)}>⇄ Compare</Btn>
          <Btn variant="secondary" size="sm" onClick={()=>setShowVersionMgr(true)}>📋 Versions</Btn>
          <Btn size="sm" onClick={()=>setShowNewVersion(true)}>+ New Version</Btn>
        </div>}/>
      <Card style={{marginBottom:20}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          <Select label="Service Line" value={selectedSl.id} onChange={v=>{const sl=SERVICE_LINES_LIST.find(s=>s.id===v);setSelectedSl(sl);const vers=versions[sl.id]||[];const wv=vers.find(v2=>v2.isWorking)||vers[vers.length-1];if(wv)setActiveVersionId(wv.id);}} options={SERVICE_LINES_LIST.map(s=>({value:s.id,label:`${s.name} — ${s.customer}`}))} style={{minWidth:320}}/>
          <div style={{display:"flex",gap:6}}>
            {slVersions.map(v=><button key={v.id} onClick={()=>setActiveVersionId(v.id)} style={{padding:"6px 14px",borderRadius:20,border:`2px solid ${activeVersionId===v.id?versionColor(v.type):C.border}`,background:activeVersionId===v.id?versionColor(v.type):C.white,color:activeVersionId===v.id?C.white:C.textSub,fontWeight:600,fontSize:12,cursor:"pointer"}}>{v.name} {v.locked?"🔒":""}</button>)}
          </div>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:C.textSub,marginLeft:"auto"}}><input type="checkbox" checked={showActuals} onChange={e=>setShowActuals(e.target.checked)}/>Show actuals</label>
        </div>
        <div style={{display:"flex",gap:16,marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`,flexWrap:"wrap"}}>
          <div style={{fontSize:12,color:C.textSub}}>Type: <Badge color="blue">{selectedSl.commercialType}</Badge></div>
          <div style={{fontSize:12,color:C.textSub}}>Division: <strong>{selectedSl.division}</strong></div>
          <div style={{fontSize:12,color:C.textSub}}>Currency: <strong>{selectedSl.currency}</strong></div>
          {activeVersion&&<div style={{fontSize:12,color:C.textSub}}>Version: <Badge color={versionBadge(activeVersion.type)}>{activeVersion.name}</Badge></div>}
        </div>
      </Card>
      <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
        <KpiCard label="Total Forecast" value={fmtM(totalForecast)} accent={C.primary}/>
        <KpiCard label="Actuals YTD" value={fmtM(totalActual)} accent={C.success}/>
        <KpiCard label="Variance" value={fmtM(Math.abs(variance))} accent={variance>=0?C.success:C.danger} badge={<Badge color={variance>=0?"green":"red"} dot>{variance>=0?"Ahead":"Behind"}</Badge>}/>
        <KpiCard label="Realization" value={pct(realization)} accent={realization>=95?C.success:realization>=80?C.warning:C.danger} badge={<Badge color={realization>=95?"green":realization>=80?"amber":"red"} dot>{realization>=95?"On track":realization>=80?"Watch":"At risk"}</Badge>}/>
      </div>
      {activeVersion?.locked&&<Alert type="info">This version is locked and read-only.</Alert>}
      <Card style={{padding:0}}>
        <div style={{padding:"14px 16px",display:"flex",gap:10,alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontWeight:700,fontSize:14}}>Monthly Forecast Grid</span>
          <div style={{flex:1}}/>
          {!activeVersion?.locked&&<><Btn variant="ghost" size="sm">Fill Down</Btn><Btn variant="ghost" size="sm">Repeat Flat</Btn></>}
          <Btn variant="secondary" size="sm">Export CSV</Btn>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>
              <th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"left",minWidth:100,position:"sticky",left:0}}>Month</th>
              {isT_M&&<th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right",minWidth:80}}>Hours</th>}
              {isUnit&&<th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right",minWidth:80}}>Units</th>}
              {(isT_M||isUnit)&&<th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right",minWidth:90}}>Rate</th>}
              <th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right",minWidth:110}}>Forecast ({selectedSl.currency})</th>
              {showActuals&&<><th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right",minWidth:110}}>Actual</th>
              <th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right",minWidth:90}}>Variance</th>
              <th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right",minWidth:70}}>Real.%</th></>}
              <th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"left",minWidth:140}}>Note</th>
            </tr></thead>
            <tbody>
              {MONTHS_2026.map((month,i)=>{
                const e=activeEntries[month]||{qty:0,rate:0,amount:0,actual:null,note:""};
                const isPast=i<CUR_MONTH_IDX,isCurrent=i===CUR_MONTH_IDX;
                const locked=e.locked||activeVersion?.locked;
                const var_=e.actual!=null?e.actual-e.amount:null;
                const real=e.amount>0&&e.actual!=null?e.actual/e.amount*100:null;
                return(
                  <tr key={month} style={{borderBottom:`1px solid ${C.border}`,background:monthColColor(i)}}>
                    <td style={{padding:"7px 12px",fontWeight:isCurrent?700:500,color:isCurrent?C.primary:C.text,position:"sticky",left:0,background:monthColColor(i)}}>
                      {month}{isCurrent&&<span style={{fontSize:10,background:C.primary,color:C.white,borderRadius:4,padding:"1px 5px",marginLeft:4}}>NOW</span>}
                      {isPast&&<span style={{fontSize:10,color:C.textMuted,marginLeft:4}}>🔒</span>}
                    </td>
                    {isT_M&&<td style={{padding:"4px 6px",textAlign:"right"}}>{locked?<span style={{color:C.textSub}}>{fmtN(e.qty||0)}</span>:<input type="number" value={e.qty||""} onChange={ev=>handleEntryChange(month,"qty",ev.target.value)} style={{width:70,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 6px",textAlign:"right",fontSize:12}}/>}</td>}
                    {isUnit&&<td style={{padding:"4px 6px",textAlign:"right"}}>{locked?<span style={{color:C.textSub}}>{fmtN(e.qty||0)}</span>:<input type="number" value={e.qty||""} onChange={ev=>handleEntryChange(month,"qty",ev.target.value)} style={{width:70,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 6px",textAlign:"right",fontSize:12}}/>}</td>}
                    {(isT_M||isUnit)&&<td style={{padding:"4px 6px",textAlign:"right"}}>{locked?<span style={{color:C.textSub}}>{fmtN(e.rate||0)}</span>:<input type="number" value={e.rate||""} onChange={ev=>handleEntryChange(month,"rate",ev.target.value)} style={{width:76,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 6px",textAlign:"right",fontSize:12}}/>}</td>}
                    <td style={{padding:"4px 6px",textAlign:"right"}}>
                      {locked||(isT_M||isUnit)?<strong style={{color:(isT_M||isUnit)?C.primary:C.text}}>{e.amount?fmtN(e.amount):<span style={{color:C.textMuted}}>—</span>}</strong>:<input type="number" value={e.amount||""} onChange={ev=>handleEntryChange(month,"amount",ev.target.value)} style={{width:100,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 6px",textAlign:"right",fontSize:12}}/>}
                    </td>
                    {showActuals&&<>
                      <td style={{padding:"7px 12px",textAlign:"right",color:e.actual!=null?C.text:C.textMuted}}>{e.actual!=null?fmtN(Math.round(e.actual)):"—"}</td>
                      <td style={{padding:"7px 12px",textAlign:"right"}}>{var_!=null?<span style={{color:var_>=0?C.success:C.danger,fontWeight:600}}>{var_>=0?"+":""}{fmtN(Math.round(var_))}</span>:"—"}</td>
                      <td style={{padding:"7px 12px",textAlign:"right"}}>{real!=null?<span style={{color:real>=95?C.success:real>=80?C.warning:C.danger,fontWeight:600}}>{pct(real)}</span>:"—"}</td>
                    </>}
                    <td style={{padding:"4px 6px"}}>{locked?<span style={{color:C.textMuted,fontSize:11}}>{e.note||""}</span>:<input value={e.note||""} onChange={ev=>handleEntryChange(month,"note",ev.target.value)} placeholder="Note" style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 6px",fontSize:11}}/>}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot><tr style={{background:C.primaryLight,fontWeight:700}}>
              <td style={{padding:"9px 12px",color:C.primary,position:"sticky",left:0,background:C.primaryLight}}>TOTAL</td>
              {isT_M&&<td style={{padding:"9px 12px",textAlign:"right"}}>{fmtN(Object.values(activeEntries).reduce((s,e)=>s+(e.qty||0),0))}</td>}
              {isUnit&&<td style={{padding:"9px 12px",textAlign:"right"}}>{fmtN(Object.values(activeEntries).reduce((s,e)=>s+(e.qty||0),0))}</td>}
              {(isT_M||isUnit)&&<td/>}
              <td style={{padding:"9px 12px",textAlign:"right",color:C.primary}}>{fmtN(totalForecast)}</td>
              {showActuals&&<><td style={{padding:"9px 12px",textAlign:"right"}}>{fmtN(Math.round(totalActual))}</td>
              <td style={{padding:"9px 12px",textAlign:"right",color:variance>=0?C.success:C.danger}}>{variance>=0?"+":""}{fmtN(Math.round(variance))}</td>
              <td style={{padding:"9px 12px",textAlign:"right",color:realization>=95?C.success:realization>=80?C.warning:C.danger}}>{pct(realization)}</td></>}
              <td/>
            </tr></tfoot>
          </table>
        </div>
      </Card>
      <Modal open={showVersionMgr} onClose={()=>setShowVersionMgr(false)} title={`Forecast Versions — ${selectedSl.name}`} width={760}>
        <Table cols={[
          {key:"name",label:"Version",render:r=><span style={{fontWeight:700,color:versionColor(r.type)}}>{r.name} {r.isWorking&&<Badge color="blue">Working</Badge>} {r.locked&&"🔒"}</span>},
          {key:"type",label:"Type",render:r=><Badge color={versionBadge(r.type)}>{r.type}</Badge>},
          {key:"createdBy",label:"Created By"},{key:"createdAt",label:"Created"},
          {key:"reason",label:"Reason",render:r=><span style={{fontSize:12,color:C.textSub}}>{r.reason}</span>},
          {key:"total",label:"Total",right:true,render:r=>{const e=slEntries[r.id]||{};return<strong>{fmtN(Object.values(e).reduce((s,e2)=>s+(e2.amount||0),0))}</strong>;}},
          {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setActiveVersionId(r.id);setShowVersionMgr(false);}}>View</Btn>},
        ]} rows={slVersions}/>
      </Modal>
      <Modal open={showCompare} onClose={()=>setShowCompare(false)} title="Compare Forecast Versions" width={860}>
        <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"flex-end"}}>
          <Select label="Version A" value={compareVers.a} onChange={v=>setCompareVers(p=>({...p,a:v}))} options={slVersions.map(v=>({value:v.id,label:v.name}))} style={{width:200}}/>
          <Select label="Version B" value={compareVers.b} onChange={v=>setCompareVers(p=>({...p,b:v}))} options={slVersions.map(v=>({value:v.id,label:v.name}))} style={{width:200}}/>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>
              <th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"left"}}>Month</th>
              <th style={{padding:"8px 12px",background:"#e8f0fa",borderBottom:`1.5px solid ${C.border}`,textAlign:"right"}}>{slVersions.find(v=>v.id===compareVers.a)?.name}</th>
              <th style={{padding:"8px 12px",background:"#ede9fe",borderBottom:`1.5px solid ${C.border}`,textAlign:"right"}}>{slVersions.find(v=>v.id===compareVers.b)?.name}</th>
              <th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right"}}>Actuals</th>
              <th style={{padding:"8px 12px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:"right"}}>Δ</th>
            </tr></thead>
            <tbody>{MONTHS_2026.map((m,i)=>{
              const eA=(slEntries[compareVers.a]||{})[m]||{},eB=(slEntries[compareVers.b]||{})[m]||{};
              const diff=(eB.amount||0)-(eA.amount||0);
              return<tr key={m} style={{borderBottom:`1px solid ${C.border}`,background:i===CUR_MONTH_IDX?C.primaryLight:"transparent"}}>
                <td style={{padding:"7px 12px"}}>{m}</td>
                <td style={{padding:"7px 12px",textAlign:"right",background:"#f0f4fc"}}>{fmtN(eA.amount||0)}</td>
                <td style={{padding:"7px 12px",textAlign:"right",background:"#f5f3ff"}}>{fmtN(eB.amount||0)}</td>
                <td style={{padding:"7px 12px",textAlign:"right",color:C.textSub}}>{eA.actual!=null?fmtN(Math.round(eA.actual)):"—"}</td>
                <td style={{padding:"7px 12px",textAlign:"right",color:diff>0?C.success:diff<0?C.danger:C.textMuted,fontWeight:600}}>{diff!==0?`${diff>0?"+":""}${fmtN(diff)}`:"—"}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </Modal>
      <Modal open={showNewVersion} onClose={()=>setShowNewVersion(false)} title="Create New Forecast Version" width={520}>
        <Alert type="info">Baseline versions are always immutable. New versions can be copied from existing ones.</Alert>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Input label="Version Name" required value={newVerForm.name} onChange={v=>setNewVerForm(p=>({...p,name:v}))} placeholder="e.g. Q3 Revision"/>
          <Select label="Version Type" required value={newVerForm.type} onChange={v=>setNewVerForm(p=>({...p,type:v}))} options={["Working","Locked"].map(t=>({value:t,label:t}))}/>
          <Input label="Reason" value={newVerForm.reason} onChange={v=>setNewVerForm(p=>({...p,reason:v}))} placeholder="Why is this version being created?"/>
          <Select label="Copy entries from" value={newVerForm.copyFrom} onChange={v=>setNewVerForm(p=>({...p,copyFrom:v}))} placeholder="Start blank" options={slVersions.map(v=>({value:v.id,label:v.name}))}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNewVersion(false)}>Cancel</Btn>
          <Btn onClick={handleCreateVersion} disabled={!newVerForm.name}>Create Version</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── APP SHELL ─────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);
  const groups=[...new Set(NAV.map(n=>n.group))];
  const exceptionCount=initTagReviews.filter(r=>r.status==="Overdue").length+INVOICES.filter(i=>i.status==="Overdue").length;
  const notifCount=exceptionCount+initAlerts.filter(a=>a.status==="Pending").length;

  const renderPage=()=>{
    if(page==="dashboard")return<Dashboard onNav={setPage}/>;
    if(page==="do-dashboard")return<DODashboard/>;
    if(page==="ph-dashboard")return<PHDashboard/>;
    if(page==="dh-dashboard")return<DHDashboard/>;
    if(page==="admin-dashboard")return<AdminDashboard/>;
    if(page==="leadership")return<LeadershipDashboard/>;
    if(page==="customers")return<Customers/>;
    if(page==="contracts")return<Contracts/>;
    if(page==="projects")return<Projects/>;
    if(page==="service-lines")return<ServiceLines/>;
    if(page==="rate-card")return<RateCard/>;
    if(page==="fx-rates")return<FxRates/>;
    if(page==="forecast")return<Forecast/>;
    if(page==="invoices")return<Invoices/>;
    if(page==="exceptions")return<ExceptionReports/>;
    if(page==="tag-reviews")return<TagReviews/>;
    if(page==="users")return<UserManagement/>;
    if(page==="tags")return<TagMaster/>;
    return null;
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.bg,color:C.text}}>
      {/* Sidebar */}
      <div style={{width:collapsed?56:220,background:C.sidebar,display:"flex",flexDirection:"column",transition:"width 0.2s",flexShrink:0,overflowX:"hidden"}}>
        <div style={{padding:collapsed?"18px 12px":"18px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(c=>!c)}>
          <div style={{width:28,height:28,background:C.primary,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:C.white,fontWeight:900,fontSize:13}}>FP</span>
          </div>
          {!collapsed&&<span style={{color:C.white,fontWeight:700,fontSize:15,whiteSpace:"nowrap"}}>Freyr Pulse</span>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"10px 0"}}>
          {groups.map(group=>(
            <div key={group}>
              {!collapsed&&<div style={{padding:"10px 20px 4px",fontSize:10,fontWeight:700,color:"rgba(168,189,214,0.5)",textTransform:"uppercase",letterSpacing:1}}>{group}</div>}
              {NAV.filter(n=>n.group===group).map(n=>(
                <div key={n.key} onClick={()=>setPage(n.key)} title={collapsed?n.label:""}
                  style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"9px 14px":"9px 20px",cursor:"pointer",borderLeft:page===n.key?`3px solid ${C.primary}`:"3px solid transparent",background:page===n.key?"rgba(33,118,199,0.15)":"transparent",transition:"all 0.1s"}}>
                  <span style={{fontSize:15,flexShrink:0}}>{n.icon}</span>
                  {!collapsed&&<span style={{color:page===n.key?C.white:C.sidebarText,fontWeight:page===n.key?600:400,fontSize:13,whiteSpace:"nowrap"}}>{n.label}</span>}
                  {!collapsed&&n.key==="exceptions"&&exceptionCount>0&&<span style={{marginLeft:"auto",background:C.danger,color:C.white,borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{exceptionCount}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:collapsed?"14px 12px":"14px 20px",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:C.primary,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:C.white,fontWeight:700,fontSize:12}}>JS</span>
          </div>
          {!collapsed&&<div><div style={{color:C.white,fontSize:12,fontWeight:600}}>Jane Smith</div><div style={{color:C.sidebarText,fontSize:11}}>Delivery Owner</div></div>}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:54,background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 24px",gap:16,flexShrink:0}}>
          <div style={{flex:1,display:"flex",gap:6,fontSize:13,color:C.textMuted}}>
            <span>Freyr Pulse</span><span>/</span><span style={{color:C.text,fontWeight:600}}>{NAV.find(n=>n.key===page)?.label}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <Badge color="blue">April 2026</Badge>
            <div style={{position:"relative",cursor:"pointer"}}>
              <span style={{fontSize:18}}>🔔</span>
              <span style={{position:"absolute",top:-4,right:-4,background:C.danger,color:C.white,borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{notifCount}</span>
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:28}}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
