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
const genId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
const today = () => new Date().toISOString().slice(0,10);
const currentYear = () => new Date().getFullYear();
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthsList = (year=2026) => MONTHS.map((m,i)=>({label:`${m} ${year}`,value:`${year}-${String(i+1).padStart(2,"0")}`}));
const YEAR_MONTHS = [...monthsList(2025),...monthsList(2026),...monthsList(2027),...monthsList(2028)];

// Invoice sequence counter (per entity prefix per year)
const invoiceSequences = {};
const nextInvoiceNumber = (prefix) => {
  const year = currentYear();
  const key = `${prefix}-${year}`;
  if(!invoiceSequences[key]) invoiceSequences[key] = 0;
  invoiceSequences[key]++;
  return `${prefix}${year}${String(invoiceSequences[key]).padStart(4,"0")}`;
};

const calcDueDate = (invoiceDate, paymentTerms) => {
  if(!invoiceDate||!paymentTerms) return "";
  const days = parseInt(paymentTerms.replace(/[^0-9]/g,""))||30;
  const d = new Date(invoiceDate);
  d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
};

// ─── World Countries ────────────────────────────────────────────────────────
const WORLD_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin",
  "Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia",
  "Comoros","Congo (DRC)","Congo (Republic)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark",
  "Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea",
  "Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana",
  "Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland",
  "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
  "Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya",
  "Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta",
  "Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro",
  "Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger",
  "Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino",
  "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain",
  "Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand",
  "Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu",
  "Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

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

const KpiCard=({label,value,sub,accent=C.primary,badge})=>(
  <Card style={{borderTop:`3px solid ${accent}`,flex:1,minWidth:150}}>
    <div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
    <div style={{fontSize:22,fontWeight:700,color:C.text,margin:"6px 0 4px"}}>{value}</div>
    {sub&&<div style={{fontSize:12,color:C.textSub}}>{sub}</div>}
    {badge&&<div style={{marginTop:6}}>{badge}</div>}
  </Card>
);

const Input=({label,value,onChange,type="text",placeholder,required,readOnly,style,hint,error})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textSub}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <input type={type} value={value||""} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder} readOnly={readOnly}
      style={{border:`1.5px solid ${error?C.danger:C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,color:C.text,background:readOnly?C.bg:C.white,outline:"none",...style}}/>
    {error&&<div style={{fontSize:11,color:C.danger}}>{error}</div>}
    {hint&&!error&&<div style={{fontSize:11,color:C.textMuted}}>{hint}</div>}
  </div>
);

const Textarea=({label,value,onChange,placeholder,required,rows=3,readOnly})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textSub}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <textarea value={value||""} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder} rows={rows} readOnly={readOnly}
      style={{border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,color:C.text,background:readOnly?C.bg:C.white,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
  </div>
);

const Select=({label,value,onChange,options,required,style,placeholder,error,disabled})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textSub}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <select value={value||""} onChange={e=>onChange?.(e.target.value)} disabled={disabled}
      style={{border:`1.5px solid ${error?C.danger:C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,color:value?C.text:C.textMuted,background:disabled?C.bg:C.white,outline:"none",...style}}>
      {placeholder&&<option value="">{placeholder}</option>}
      {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
    </select>
    {error&&<div style={{fontSize:11,color:C.danger}}>{error}</div>}
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

const Table=({cols,rows,onRow,emptyMsg="No records found"})=>(
  <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead><tr>{cols.map(c=><th key={c.key} style={{padding:"9px 14px",background:C.bg,borderBottom:`1.5px solid ${C.border}`,textAlign:c.right?"right":"left",fontWeight:600,color:C.textSub,fontSize:11,textTransform:"uppercase",letterSpacing:0.4,whiteSpace:"nowrap"}}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.map((r,i)=>(
          <tr key={r.id||i} onClick={()=>onRow?.(r)} style={{borderBottom:`1px solid ${C.border}`,cursor:onRow?"pointer":undefined,transition:"background 0.1s"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {cols.map(c=><td key={c.key} style={{padding:"10px 14px",color:C.text,textAlign:c.right?"right":"left"}}>{c.render?c.render(r,i):r[c.key]}</td>)}
          </tr>
        ))}
        {rows.length===0&&<tr><td colSpan={cols.length} style={{padding:"40px 14px",textAlign:"center",color:C.textMuted,fontSize:13}}>{emptyMsg}</td></tr>}
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

const Alert=({type="info",children,onClose})=>{
  const t={info:{bg:C.infoBg,text:C.info,icon:"ℹ"},warning:{bg:C.warningBg,text:C.warning,icon:"⚠"},danger:{bg:C.dangerBg,text:C.danger,icon:"✕"},success:{bg:C.successBg,text:C.success,icon:"✓"}};
  const cfg=t[type];
  return <div style={{background:cfg.bg,color:cfg.text,borderRadius:8,padding:"10px 14px",fontSize:13,fontWeight:500,display:"flex",gap:8,alignItems:"flex-start",marginBottom:16}}>
    <span style={{flexShrink:0}}>{cfg.icon}</span><div style={{flex:1}}>{children}</div>
    {onClose&&<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:cfg.text,fontSize:16,padding:0}}>×</button>}
  </div>;
};

const UploadPlaceholder=({label="Document"})=>(
  <div style={{border:`2px dashed ${C.border}`,borderRadius:8,padding:"20px",textAlign:"center",cursor:"pointer",background:C.bg}}
    onClick={()=>alert("File upload requires backend storage. This is a placeholder.")}>
    <div style={{fontSize:24,marginBottom:6}}>📎</div>
    <div style={{fontSize:13,color:C.textSub,fontWeight:600}}>Upload {label}</div>
    <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>Placeholder — no storage yet</div>
  </div>
);

const FormRow=({children,cols=2})=>(
  <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:16,marginBottom:16}}>{children}</div>
);

const FormSection=({title,children})=>(
  <div style={{marginBottom:24}}>
    <div style={{fontSize:12,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:0.8,marginBottom:12,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>{title}</div>
    {children}
  </div>
);

// Multi-select tag component
const MultiSelect=({label,required,options,selected=[],onChange,error})=>{
  const toggle=(v)=>onChange(selected.includes(v)?selected.filter(x=>x!==v):[...selected,v]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {label&&<label style={{fontSize:12,fontWeight:600,color:C.textSub}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:8,border:`1.5px solid ${error?C.danger:C.border}`,borderRadius:6,background:C.white,minHeight:40}}>
        {options.map(o=>(
          <button key={o} onClick={()=>toggle(o)} type="button" style={{padding:"3px 10px",borderRadius:20,border:`1.5px solid ${selected.includes(o)?C.primary:C.border}`,background:selected.includes(o)?C.primary:C.white,color:selected.includes(o)?C.white:C.textSub,fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.1s"}}>{o}</button>
        ))}
        {options.length===0&&<span style={{fontSize:12,color:C.textMuted,padding:"2px 4px"}}>No options available</span>}
      </div>
      {error&&<div style={{fontSize:11,color:C.danger}}>{error}</div>}
      {selected.length>0&&<div style={{fontSize:11,color:C.textSub}}>{selected.length} selected: {selected.join(", ")}</div>}
    </div>
  );
};

// ─── SEED / INITIAL DATA ───────────────────────────────────────────────────
const INITIAL_TAGS = {
  "Work Country":["India","China","USA","Canada","EU-UK","EU-Germany","EU-Poland","EU-Other","UAE","Japan","Korea","Other","Colombia","LatAm (Other)","Middle East","South Africa"],
  "Region":["AMR","EUA","MoW"],
  "Division":["MPR","MDV","CON","FDL","CFS","SLS"],
  "Department":["MPR-Artwork","MPR-Consulting","MPR-Excellence Group","MPR-Labelling","MPR-Medical and Scientific Communication","MPR-Medical Writing","MPR-Pharmacovigilance","MPR-Publishing and Submission","MPR-Regulatory Affairs","MDV-Regulatory Affairs Delivery","MDV-Excellence Group","MDV-Leadership Group","CON-Business Operations","CON-Chemical Safety Regulatory Affairs","CON-Cosmetics","CON-Food and Dietary Supplements","CON-Excellence Group","CON-Leadership Group","CFS-Administration","CFS-Compliance and Validation","CFS-Finance","CFS-Freyr Academy","CFS-Human Resources","CFS-IT","CFS-Legal","CFS-Marketing","CFS-Regional Operations","CFS-FreyrX","CFS-Leadership Team","CFS-Transition Management","FF-GRI","FF-RIMS","FF-SUBMISSIONS"],
  "Service":["MPR-Publishing","MPR-Submissions Planning","MPR-Label Change Management","MPR-Label Content Management Services","MPR-AW Change Management","MPR-Reg Affairs Strategy","MPR-Reg Affairs Submissions","MPR-Regulatory Strategy","MPR-Market Access","MPR-Local Reg Affairs","MDV-AW Change Management","MDV-Reg Affairs Submissions","MDV-Market Access","MDV-Local Reg Affairs","COS-Market Access","FDS-Market Access","COS-Reg Affairs","FDS-Reg Affairs","CSRA-Market Access","CSRA-Reg Affairs"],
  "Customer Type":["Strategic Accounts","Focussed Accounts","SMB"],
  "Operations":["Revenue","Cost"],
};

const INITIAL_ENTITIES = [
  {id:"ent-1",name:"Freyr US",prefix:"FRUS",currency:"USD",address:"123 Business Ave, New York, NY 10001, USA",bankName:"",accountName:"",accountNumber:"",swift:"",iban:"",active:true},
  {id:"ent-2",name:"Freyr India",prefix:"FRIN",currency:"INR",address:"456 Tech Park, Hyderabad, Telangana 500081, India",bankName:"",accountName:"",accountNumber:"",swift:"",iban:"",active:true},
  {id:"ent-3",name:"Freyr Germany",prefix:"FRDE",currency:"EUR",address:"789 Business Strasse, Frankfurt, 60311, Germany",bankName:"",accountName:"",accountNumber:"",swift:"",iban:"",active:true},
];

const INITIAL_USERS = [
  {id:"usr-1",name:"Jane Smith",email:"jane.smith@freyr.com",role:"Delivery Owner",status:"Active"},
  {id:"usr-2",name:"Mike Kumar",email:"mike.kumar@freyr.com",role:"Delivery Owner",status:"Active"},
  {id:"usr-3",name:"Sara Lee",email:"sara.lee@freyr.com",role:"Delivery Owner",status:"Active"},
  {id:"usr-4",name:"Tom Raj",email:"tom.raj@freyr.com",role:"Delivery Owner",status:"Active"},
  {id:"usr-5",name:"Rachel Kumar",email:"rachel.kumar@freyr.com",role:"Portfolio Head",status:"Active"},
  {id:"usr-6",name:"Amir Patel",email:"amir.patel@freyr.com",role:"Division Head",status:"Active"},
  {id:"usr-7",name:"Sarah Chen",email:"sarah.chen@freyr.com",role:"Admin",status:"Active"},
  {id:"usr-8",name:"David Osei",email:"david.osei@freyr.com",role:"Leadership",status:"Active"},
];

const CURRENCIES = ["USD","GBP","EUR","CHF","JPY","CAD","AUD","INR","SGD","AED"];
const CONTRACT_STATUSES = ["Draft","Active","On Hold","Closed","Cancelled"];
const PROJECT_STATUSES = ["Draft","Active","On Hold","Closed","Cancelled"];
const SL_STATUSES = ["Draft","Active","On Hold","Closed"];
const COMMERCIAL_TYPES = ["Fixed Price","T&M Staffing","T&M Managed","Transaction Based","Recurring-Subscription"];
const FORECAST_VERSIONS = ["Current","Reforecast 1","Reforecast 2","Reforecast 3"];
const INVOICE_STATUSES = ["Draft","Active","Cancelled","Paid"];
const PAYMENT_TERMS_OPTIONS = ["NET 30","NET 45","NET 60","NET 90","Custom"];
const EMP_STATUSES = ["Active","Inactive","Notice","Contractor"];
const CUSTOMER_STATUSES = ["Active","Inactive"];
const USER_ROLES = ["Delivery Owner","Portfolio Head","Division Head","Admin","Leadership"];

// ─── NAV ───────────────────────────────────────────────────────────────────
const NAV = [
  {key:"dashboard",label:"Dashboard",icon:"◼",group:"Overview"},
  {key:"customers",label:"Customers",icon:"🏢",group:"Delivery"},
  {key:"contracts",label:"Contracts",icon:"📋",group:"Delivery"},
  {key:"projects",label:"Projects",icon:"📁",group:"Delivery"},
  {key:"service-lines",label:"Service Lines",icon:"⚙",group:"Delivery"},
  {key:"forecast",label:"Forecast",icon:"📊",group:"Finance"},
  {key:"invoices",label:"Invoices",icon:"🧾",group:"Finance"},
  {key:"employees",label:"Employees",icon:"👥",group:"People"},
  {key:"reporting",label:"Reporting",icon:"📈",group:"Admin"},
  {key:"tag-reviews",label:"Tag Reviews",icon:"🔁",group:"Admin"},
  {key:"users",label:"User Management",icon:"👤",group:"Admin"},
  {key:"tags",label:"Tag Master",icon:"🏷",group:"Admin"},
  {key:"settings",label:"Settings",icon:"⚙",group:"Admin"},
];

// ═══════════════════════════════════════════════════════════════════════════
// TAG MASTER
// ═══════════════════════════════════════════════════════════════════════════
function TagMaster({tags,setTags}){
  const [activeCategory,setActiveCategory]=useState(Object.keys(tags)[0]);
  const [showNewCat,setShowNewCat]=useState(false);
  const [showNewTag,setShowNewTag]=useState(false);
  const [newCatName,setNewCatName]=useState("");
  const [newTagVal,setNewTagVal]=useState("");
  const [search,setSearch]=useState("");
  const [editingTag,setEditingTag]=useState(null);
  const [editVal,setEditVal]=useState("");

  const filtered=(tags[activeCategory]||[]).filter(t=>t.toLowerCase().includes(search.toLowerCase()));

  const addCategory=()=>{
    if(!newCatName.trim()||tags[newCatName])return;
    setTags(p=>({...p,[newCatName.trim()]:[]}));
    setActiveCategory(newCatName.trim());
    setNewCatName("");setShowNewCat(false);
  };

  const addTag=()=>{
    if(!newTagVal.trim())return;
    if((tags[activeCategory]||[]).includes(newTagVal.trim())){alert("Tag already exists.");return;}
    setTags(p=>({...p,[activeCategory]:[...(p[activeCategory]||[]),newTagVal.trim()]}));
    setNewTagVal("");setShowNewTag(false);
  };

  const removeTag=(cat,tag)=>{
    if(!window.confirm(`Remove "${tag}" from ${cat}?`))return;
    setTags(p=>({...p,[cat]:p[cat].filter(t=>t!==tag)}));
  };

  const saveEdit=()=>{
    if(!editVal.trim())return;
    setTags(p=>({...p,[activeCategory]:p[activeCategory].map(t=>t===editingTag?editVal.trim():t)}));
    setEditingTag(null);setEditVal("");
  };

  return(
    <div>
      <SectionHeader title="Tag Master" sub="Single source of truth for all classification tags"
        action={<div style={{display:"flex",gap:8}}>
          <Btn variant="secondary" size="sm" onClick={()=>setShowNewCat(true)}>+ New Category</Btn>
          <Btn size="sm" onClick={()=>setShowNewTag(true)}>+ New Tag</Btn>
        </div>}/>
      <Alert type="info">All dropdowns across every module pull live from these tags. Changes reflect immediately everywhere.</Alert>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20}}>
        <Card style={{padding:0}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:12,color:C.textSub,textTransform:"uppercase",letterSpacing:0.5}}>Categories ({Object.keys(tags).length})</div>
          {Object.keys(tags).map(cat=>(
            <div key={cat} onClick={()=>{setActiveCategory(cat);setSearch("");}} style={{padding:"10px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",
              background:activeCategory===cat?C.primaryLight:"transparent",borderLeft:activeCategory===cat?`3px solid ${C.primary}`:"3px solid transparent",
              fontSize:13,fontWeight:activeCategory===cat?700:400,color:activeCategory===cat?C.primary:C.text}}>
              <span>{cat}</span>
              <span style={{background:C.bg,borderRadius:10,padding:"1px 8px",fontSize:11,color:C.textSub,fontWeight:600}}>{(tags[cat]||[]).length}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:15}}>{activeCategory} <span style={{fontWeight:400,color:C.textMuted,fontSize:13}}>({filtered.length})</span></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{border:`1.5px solid ${C.border}`,borderRadius:6,padding:"6px 10px",fontSize:12,outline:"none",width:180}}/>
          </div>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.textMuted,fontSize:13}}>No tags. Click "+ New Tag" to add one.</div>}
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {filtered.map(tag=>(
              <div key={tag} style={{display:"flex",alignItems:"center",background:C.primaryLight,borderRadius:20,overflow:"hidden",border:`1px solid ${C.primaryMid}`}}>
                {editingTag===tag?(
                  <>
                    <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus
                      style={{border:"none",background:"transparent",padding:"5px 10px",fontSize:12,fontWeight:600,color:C.primary,outline:"none",width:160}}
                      onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape"){setEditingTag(null);setEditVal("");}}}/>
                    <button onClick={saveEdit} style={{background:C.primary,border:"none",color:C.white,padding:"5px 8px",cursor:"pointer",fontSize:11}}>✓</button>
                    <button onClick={()=>{setEditingTag(null);setEditVal("");}} style={{background:"transparent",border:"none",color:C.textSub,padding:"5px 6px",cursor:"pointer",fontSize:11}}>✕</button>
                  </>
                ):(
                  <>
                    <span style={{padding:"5px 12px",fontSize:12,fontWeight:600,color:C.primary}}>{tag}</span>
                    <button onClick={()=>{setEditingTag(tag);setEditVal(tag);}} style={{background:"transparent",border:"none",cursor:"pointer",color:C.textSub,padding:"5px 4px",fontSize:11}}>✏</button>
                    <button onClick={()=>removeTag(activeCategory,tag)} style={{background:"transparent",border:"none",cursor:"pointer",color:C.danger,padding:"5px 8px",fontSize:13}}>×</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Modal open={showNewCat} onClose={()=>{setShowNewCat(false);setNewCatName("");}} title="New Tag Category" width={440}>
        <Input label="Category Name" required value={newCatName} onChange={setNewCatName} placeholder="e.g. Account Priority"/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNewCat(false)}>Cancel</Btn>
          <Btn onClick={addCategory} disabled={!newCatName.trim()}>Create Category</Btn>
        </div>
      </Modal>
      <Modal open={showNewTag} onClose={()=>{setShowNewTag(false);setNewTagVal("");}} title={`New Tag — ${activeCategory}`} width={440}>
        <Input label="Tag Value" required value={newTagVal} onChange={setNewTagVal} placeholder="Enter tag value" hint={`Will be added to "${activeCategory}"`}/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>setShowNewTag(false)}>Cancel</Btn>
          <Btn onClick={addTag} disabled={!newTagVal.trim()}>Add Tag</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function Settings({entities,setEntities,taxRates,setTaxRates}){
  const [tab,setTab]=useState("entities");
  const [showNewEntity,setShowNewEntity]=useState(false);
  const [showEditEntity,setShowEditEntity]=useState(false);
  const [showNewTax,setShowNewTax]=useState(false);
  const [selectedEntity,setSelectedEntity]=useState(null);
  const [entityForm,setEntityForm]=useState(blankEntityForm());
  const [taxForm,setTaxForm]=useState({name:"",country:"",percentage:"",taxNumberLabel:"",active:true});
  const [entityErrors,setEntityErrors]=useState({});

  function blankEntityForm(){return {name:"",prefix:"",currency:"USD",address:"",bankName:"",accountName:"",accountNumber:"",swift:"",iban:""};}

  const validateEntity=()=>{
    const e={};
    if(!entityForm.name.trim())e.name="Required";
    if(!entityForm.prefix.trim())e.prefix="Required";
    if(entityForm.prefix.trim().length>6)e.prefix="Max 6 characters";
    setEntityErrors(e);return Object.keys(e).length===0;
  };

  const saveEntity=()=>{
    if(!validateEntity())return;
    if(showEditEntity&&selectedEntity){setEntities(p=>p.map(e=>e.id===selectedEntity.id?{...e,...entityForm,prefix:entityForm.prefix.toUpperCase()}:e));}
    else{setEntities(p=>[...p,{...entityForm,id:genId("ENT"),active:true,prefix:entityForm.prefix.toUpperCase()}]);}
    setShowNewEntity(false);setShowEditEntity(false);setSelectedEntity(null);setEntityForm(blankEntityForm());setEntityErrors({});
  };

  const editEntity=(ent)=>{setSelectedEntity(ent);setEntityForm({name:ent.name,prefix:ent.prefix,currency:ent.currency,address:ent.address,bankName:ent.bankName,accountName:ent.accountName,accountNumber:ent.accountNumber,swift:ent.swift,iban:ent.iban});setShowEditEntity(true);};

  const saveTax=()=>{
    if(!taxForm.name||!taxForm.country||!taxForm.percentage)return;
    setTaxRates(p=>[...p,{...taxForm,id:genId("TAX"),percentage:parseFloat(taxForm.percentage)}]);
    setTaxForm({name:"",country:"",percentage:"",taxNumberLabel:"",active:true});setShowNewTax(false);
  };

  const EForm=()=>(
    <>
      <FormSection title="Entity Details">
        <FormRow>
          <Input label="Entity Name" required value={entityForm.name} onChange={v=>setEntityForm(p=>({...p,name:v}))} placeholder="e.g. Freyr Singapore" error={entityErrors.name}/>
          <Input label="Invoice Prefix" required value={entityForm.prefix} onChange={v=>setEntityForm(p=>({...p,prefix:v.toUpperCase()}))} placeholder="e.g. FRSG" error={entityErrors.prefix} hint="Used in invoice numbers"/>
        </FormRow>
        <FormRow>
          <Select label="Default Currency" value={entityForm.currency} onChange={v=>setEntityForm(p=>({...p,currency:v}))} options={CURRENCIES.map(c=>({value:c,label:c}))}/>
        </FormRow>
        <Textarea label="Registered Address" value={entityForm.address} onChange={v=>setEntityForm(p=>({...p,address:v}))} placeholder="Full registered address" rows={2}/>
      </FormSection>
      <FormSection title="Bank Details (shown on invoice footer)">
        <FormRow>
          <Input label="Bank Name" value={entityForm.bankName} onChange={v=>setEntityForm(p=>({...p,bankName:v}))} placeholder="e.g. JP Morgan Chase"/>
          <Input label="Account Name" value={entityForm.accountName} onChange={v=>setEntityForm(p=>({...p,accountName:v}))} placeholder="e.g. Freyr LLC"/>
        </FormRow>
        <FormRow>
          <Input label="Account Number" value={entityForm.accountNumber} onChange={v=>setEntityForm(p=>({...p,accountNumber:v}))} placeholder="e.g. 1234567890"/>
          <Input label="SWIFT / BIC" value={entityForm.swift} onChange={v=>setEntityForm(p=>({...p,swift:v}))} placeholder="e.g. CHASUS33"/>
        </FormRow>
        <Input label="IBAN (if applicable)" value={entityForm.iban} onChange={v=>setEntityForm(p=>({...p,iban:v}))} placeholder="e.g. DE89 3704 0044 0532 0130 00"/>
      </FormSection>
    </>
  );

  return(
    <div>
      <SectionHeader title="Settings" sub="Platform configuration — Freyr entities, tax rates"/>
      <Tabs tabs={[{key:"entities",label:"Freyr Entities"},{key:"tax",label:"Tax Master"},{key:"about",label:"System Info"}]} active={tab} onChange={setTab}/>
      {tab==="entities"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}><Btn size="sm" onClick={()=>{setEntityForm(blankEntityForm());setEntityErrors({});setShowNewEntity(true);}}>+ New Entity</Btn></div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {entities.map(ent=>(
              <Card key={ent.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:16}}>{ent.name}</div>
                    <div style={{display:"flex",gap:8,marginTop:4}}><Badge color="blue">Prefix: {ent.prefix}</Badge><Badge color="gray">{ent.currency}</Badge><Badge color="green" dot>Active</Badge></div>
                  </div>
                  <Btn variant="secondary" size="sm" onClick={()=>editEntity(ent)}>Edit</Btn>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,fontSize:13}}>
                  <div>
                    <div style={{color:C.textMuted,fontSize:11,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Address</div>
                    <div style={{color:C.textSub}}>{ent.address||<span style={{color:C.textMuted,fontStyle:"italic"}}>Not set</span>}</div>
                  </div>
                  <div>
                    <div style={{color:C.textMuted,fontSize:11,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Bank Details</div>
                    {ent.bankName?<div style={{color:C.textSub,lineHeight:1.8}}>
                      <div><strong>Bank:</strong> {ent.bankName}</div>
                      <div><strong>Account:</strong> {ent.accountName} — {ent.accountNumber}</div>
                      {ent.swift&&<div><strong>SWIFT:</strong> {ent.swift}</div>}
                      {ent.iban&&<div><strong>IBAN:</strong> {ent.iban}</div>}
                    </div>:<span style={{color:C.textMuted,fontStyle:"italic",fontSize:12}}>Bank details not configured.</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {tab==="tax"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <Alert type="info">Tax rates defined here are available when creating invoices.</Alert>
            <Btn size="sm" onClick={()=>setShowNewTax(true)} style={{flexShrink:0,marginLeft:12}}>+ New Tax Rate</Btn>
          </div>
          {taxRates.length===0&&<Card><div style={{textAlign:"center",padding:"40px 0",color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>🧾</div><div style={{fontWeight:600,marginBottom:4}}>No tax rates configured</div></div></Card>}
          {taxRates.length>0&&<Table cols={[
            {key:"name",label:"Tax Name",render:r=><strong>{r.name}</strong>},
            {key:"country",label:"Country"},
            {key:"percentage",label:"Rate",right:true,render:r=><Badge color="blue">{r.percentage}%</Badge>},
            {key:"taxNumberLabel",label:"Tax Label",render:r=>r.taxNumberLabel||"—"},
            {key:"active",label:"Status",render:r=><Badge color={r.active?"green":"gray"} dot>{r.active?"Active":"Inactive"}</Badge>},
            {key:"actions",label:"",render:r=><div style={{display:"flex",gap:6}}>
              <Btn variant="ghost" size="sm" onClick={()=>setTaxRates(p=>p.map(t=>t.id===r.id?{...t,active:!t.active}:t))}>{r.active?"Deactivate":"Activate"}</Btn>
              <Btn variant="ghost" size="sm" onClick={()=>setTaxRates(p=>p.filter(t=>t.id!==r.id))}>Remove</Btn>
            </div>},
          ]} rows={taxRates}/>}
        </div>
      )}
      {tab==="about"&&<Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          {[["Platform","Freyr Pulse"],["Version","Session C"],["Deployment","Vercel"],["Repository","github.com/manojfreyr/freyr-pulse"],["Frontend","React (single file)"],["Backend","None — prototype"],["Data","Session only"],["Reporting Currency","USD"]].map(([l,v])=>(
            <div key={l} style={{paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",marginBottom:2}}>{l}</div>
              <div style={{fontSize:13,fontWeight:600,color:C.text}}>{v}</div>
            </div>
          ))}
        </div>
      </Card>}
      <Modal open={showNewEntity||showEditEntity} onClose={()=>{setShowNewEntity(false);setShowEditEntity(false);setSelectedEntity(null);setEntityErrors({});}} title={showEditEntity?`Edit — ${selectedEntity?.name}`:"New Freyr Entity"} width={680}>
        <EForm/><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNewEntity(false);setShowEditEntity(false);setEntityErrors({});}}>Cancel</Btn><Btn onClick={saveEntity}>Save Entity</Btn></div>
      </Modal>
      <Modal open={showNewTax} onClose={()=>setShowNewTax(false)} title="New Tax Rate" width={480}>
        <FormRow><Input label="Tax Name" required value={taxForm.name} onChange={v=>setTaxForm(p=>({...p,name:v}))} placeholder="e.g. VAT"/><Input label="Country" required value={taxForm.country} onChange={v=>setTaxForm(p=>({...p,country:v}))} placeholder="e.g. Germany"/></FormRow>
        <FormRow><Input label="Percentage (%)" required type="number" value={taxForm.percentage} onChange={v=>setTaxForm(p=>({...p,percentage:v}))} placeholder="e.g. 19"/><Input label="Tax Number Label" value={taxForm.taxNumberLabel} onChange={v=>setTaxForm(p=>({...p,taxNumberLabel:v}))} placeholder="e.g. VAT Number"/></FormRow>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>setShowNewTax(false)}>Cancel</Btn><Btn onClick={saveTax} disabled={!taxForm.name||!taxForm.country||!taxForm.percentage}>Save Tax Rate</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMERS — Session C: derived Account/Delivery Owners, world countries, edit
// ═══════════════════════════════════════════════════════════════════════════
function Customers({tags,users,customers,setCustomers,contracts,projects,onNav}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [editMode,setEditMode]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blank());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");

  function blank(){return {name:"",addressLine1:"",addressLine2:"",city:"",state:"",zip:"",country:"",psaStart:"",psaEnd:"",customerType:"",status:"Active",notes:""};}

  const customerTypes=tags["Customer Type"]||[];

  // Derived: Account Owners from contracts
  const getAccountOwners=(custId)=>{
    const ctrs=contracts.filter(c=>c.customerId===custId);
    return [...new Set(ctrs.map(c=>c.accountOwner).filter(Boolean))];
  };

  // Derived: Delivery Owners from projects
  const getDeliveryOwners=(custId)=>{
    const projs=projects.filter(p=>p.customerId===custId);
    return [...new Set(projs.map(p=>p.deliveryOwner).filter(Boolean))];
  };

  const getCustContracts=(custId)=>contracts.filter(c=>c.customerId===custId);

  const validate=(isEdit=false)=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    else if(!isEdit&&customers.some(c=>c.name.toLowerCase()===form.name.trim().toLowerCase()))e.name="Customer already exists";
    else if(isEdit&&customers.some(c=>c.name.toLowerCase()===form.name.trim().toLowerCase()&&c.id!==selected?.id))e.name="Customer name already in use";
    if(!form.addressLine1.trim())e.addressLine1="Required";
    if(!form.city.trim())e.city="Required";
    if(!form.state.trim())e.state="Required";
    if(!form.zip.trim())e.zip="Required";
    if(!form.country)e.country="Required";
    if(!form.customerType)e.customerType="Required";
    if(form.psaStart&&form.psaEnd&&form.psaStart>form.psaEnd)e.psaEnd="Must be on or after start date";
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate(editMode))return;
    if(editMode&&selected){
      const updated={...selected,...form,name:form.name.trim()};
      setCustomers(p=>p.map(c=>c.id===selected.id?updated:c));
      setSelected(updated);
    } else {
      setCustomers(p=>[...p,{...form,id:genId("CUST"),createdAt:today(),name:form.name.trim()}]);
    }
    setShowForm(false);setForm(blank());setErrors({});setEditMode(false);
  };

  const openEdit=(cust)=>{
    setForm({name:cust.name,addressLine1:cust.addressLine1||"",addressLine2:cust.addressLine2||"",city:cust.city||"",state:cust.state||"",zip:cust.zip||"",country:cust.country||"",psaStart:cust.psaStart||"",psaEnd:cust.psaEnd||"",customerType:cust.customerType||"",status:cust.status||"Active",notes:cust.notes||""});
    setEditMode(true);setErrors({});setShowForm(true);
  };

  const psaWarning=(c)=>{
    if(!c.psaEnd)return null;
    const days=Math.ceil((new Date(c.psaEnd)-new Date())/(1000*60*60*24));
    if(days<0)return{type:"danger",msg:"PSA expired"};
    if(days<=30)return{type:"warning",msg:`PSA expires in ${days} days`};
    return null;
  };

  const filtered=customers.filter(c=>{
    const ms=c.name.toLowerCase().includes(search.toLowerCase())||c.country?.toLowerCase().includes(search.toLowerCase());
    return ms&&(filterStatus==="All"||c.status===filterStatus);
  });

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Customers" sub={`${customers.filter(c=>c.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{setForm(blank());setErrors({});setEditMode(false);setShowForm(true);}}>+ New Customer</Btn>}/>
        <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers…" style={{flex:1,minWidth:200,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All","Active","Inactive"]} style={{width:130}}/>
        </div>
        {customers.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>🏢</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No customers yet</div><Btn onClick={()=>{setForm(blank());setErrors({});setEditMode(false);setShowForm(true);}}>+ Add First Customer</Btn></div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"name",label:"Customer",render:r=>{
              const w=psaWarning(r);
              const aos=getAccountOwners(r.id);
              const dos=getDeliveryOwners(r.id);
              return<div>
                <div style={{fontWeight:600}}>{r.name}</div>
                <div style={{fontSize:11,color:C.textMuted}}>{r.id} · {r.customerType}</div>
                {w&&<Badge color={w.type==="danger"?"red":"amber"}>{w.msg}</Badge>}
              </div>;
            }},
            {key:"customerType",label:"Type",render:r=><Badge color="blue">{r.customerType}</Badge>},
            {key:"accountOwners",label:"Account Owner(s)",render:r=>{
              const aos=getAccountOwners(r.id);
              return aos.length>0?<div style={{fontSize:12}}>{aos.join(", ")}</div>:<span style={{color:C.textMuted,fontSize:12}}>—</span>;
            }},
            {key:"deliveryOwners",label:"Delivery Owner(s)",render:r=>{
              const dos=getDeliveryOwners(r.id);
              return dos.length>0?<div style={{fontSize:12}}>{dos.join(", ")}</div>:<span style={{color:C.textMuted,fontSize:12}}>—</span>;
            }},
            {key:"contracts",label:"Contracts",right:true,render:r=>{
              const cnt=getCustContracts(r.id).length;
              return<button onClick={e=>{e.stopPropagation();onNav("contracts",{filterCustomerId:r.id});}} style={{background:"none",border:"none",cursor:"pointer",color:C.primary,fontWeight:700,fontSize:13,textDecoration:"underline"}}>{cnt}</button>;
            }},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"gray"} dot>{r.status}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setSelected(r);setDetailTab("overview");setView("detail");}}>View →</Btn>},
          ]} rows={filtered} emptyMsg="No customers match your search."/>
        </Card>}
      </>}

      {view==="detail"&&selected&&<div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
          <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.name}</h2><div style={{fontSize:13,color:C.textSub}}>{selected.customerType} · {selected.country}</div></div>
          <Badge color={selected.status==="Active"?"green":"gray"} dot>{selected.status}</Badge>
          <Btn variant="secondary" size="sm" onClick={()=>openEdit(selected)}>Edit</Btn>
        </div>
        {psaWarning(selected)&&<Alert type={psaWarning(selected).type}>{psaWarning(selected).msg} — PSA End: {selected.psaEnd}</Alert>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            <Tabs tabs={[{key:"overview",label:"Overview"},{key:"contracts",label:`Contracts (${getCustContracts(selected.id).length})`},{key:"documents",label:"Documents"}]} active={detailTab} onChange={setDetailTab}/>
            {detailTab==="overview"&&<Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <FormSection title="Billing Address">
                  <div style={{fontSize:13,lineHeight:2}}><div>{selected.addressLine1}</div>{selected.addressLine2&&<div>{selected.addressLine2}</div>}<div>{selected.city}{selected.state?`, ${selected.state}`:""} {selected.zip}</div><div>{selected.country}</div></div>
                </FormSection>
                <FormSection title="PSA">
                  {selected.psaStart||selected.psaEnd?<div style={{fontSize:13,lineHeight:2}}>{selected.psaStart&&<div><strong>Start:</strong> {selected.psaStart}</div>}{selected.psaEnd&&<div><strong>End:</strong> {selected.psaEnd}</div>}</div>:<div style={{fontSize:13,color:C.textMuted,fontStyle:"italic"}}>No PSA dates</div>}
                </FormSection>
              </div>
              {selected.notes&&<div style={{padding:12,background:C.bg,borderRadius:6,fontSize:13,color:C.textSub}}>{selected.notes}</div>}
            </Card>}
            {detailTab==="contracts"&&<Card style={{padding:0}}>
              {getCustContracts(selected.id).length===0?<div style={{textAlign:"center",padding:"40px",color:C.textMuted,fontSize:13}}>No contracts yet.</div>:
              <Table cols={[
                {key:"contractName",label:"Contract",render:r=><strong>{r.contractName}</strong>},
                {key:"accountOwner",label:"Account Owner"},
                {key:"freyrEntity",label:"Freyr Entity"},
                {key:"currency",label:"CCY"},
                {key:"value",label:"Value",right:true,render:r=>r.value?`${r.currency} ${fmtN(r.value)}`:"—"},
                {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="Draft"?"blue":"gray"} dot>{r.status}</Badge>},
                {key:"endDate",label:"End Date"},
              ]} rows={getCustContracts(selected.id)}/>}
            </Card>}
            {detailTab==="documents"&&<Card><UploadPlaceholder label="MSA / PSA Document"/></Card>}
          </div>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Account Details</div>
            {[
              ["Customer ID",<span style={{fontFamily:"monospace",fontSize:11}}>{selected.id}</span>],
              ["Customer Type",<Badge color="blue">{selected.customerType}</Badge>],
              ["Status",<Badge color={selected.status==="Active"?"green":"gray"} dot>{selected.status}</Badge>],
              ["Country",selected.country],
              ["Account Owner(s)",getAccountOwners(selected.id).join(", ")||"—"],
              ["Delivery Owner(s)",getDeliveryOwners(selected.id).join(", ")||"—"],
              ["Contracts",getCustContracts(selected.id).length],
              ["Created",selected.createdAt],
            ].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600,textAlign:"right",maxWidth:180,wordBreak:"break-word"}}>{v}</span></div>
            ))}
          </Card>
        </div>
      </div>}

      <Modal open={showForm} onClose={()=>{setShowForm(false);setErrors({});setEditMode(false);}} title={editMode?"Edit Customer":"New Customer"} width={720}>
        <FormSection title="Customer Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Customer Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. Johnson & Johnson"/></div>
            <Select label="Customer Type" required value={form.customerType} onChange={v=>setForm(p=>({...p,customerType:v}))} placeholder="Select type" options={customerTypes.map(t=>({value:t,label:t}))} error={errors.customerType}/>
            <Select label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={CUSTOMER_STATUSES.map(s=>({value:s,label:s}))}/>
          </div>
        </FormSection>
        <FormSection title="Billing Address">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Address Line 1" required value={form.addressLine1} onChange={v=>setForm(p=>({...p,addressLine1:v}))} error={errors.addressLine1} placeholder="Street address"/></div>
            <div style={{gridColumn:"span 2"}}><Input label="Address Line 2" value={form.addressLine2} onChange={v=>setForm(p=>({...p,addressLine2:v}))} placeholder="Suite, floor (optional)"/></div>
            <Input label="City" required value={form.city} onChange={v=>setForm(p=>({...p,city:v}))} error={errors.city}/>
            <Input label="State / Province" required value={form.state} onChange={v=>setForm(p=>({...p,state:v}))} error={errors.state}/>
            <Input label="ZIP / Postal Code" required value={form.zip} onChange={v=>setForm(p=>({...p,zip:v}))} error={errors.zip}/>
            <Select label="Country" required value={form.country} onChange={v=>setForm(p=>({...p,country:v}))} placeholder="Select country" options={WORLD_COUNTRIES.map(c=>({value:c,label:c}))} error={errors.country}/>
          </div>
        </FormSection>
        <FormSection title="PSA / Master Agreement">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Input label="PSA Start Date" type="date" value={form.psaStart} onChange={v=>setForm(p=>({...p,psaStart:v}))}/>
            <Input label="PSA End Date" type="date" value={form.psaEnd} onChange={v=>setForm(p=>({...p,psaEnd:v}))} error={errors.psaEnd}/>
          </div>
        </FormSection>
        <FormSection title="Notes"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Additional notes…"/></FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowForm(false);setErrors({});setEditMode(false);}}>Cancel</Btn><Btn onClick={save}>{editMode?"Save Changes":"Save Customer"}</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTRACTS — Session C: Account Owner at contract level, mandatory value, edit
// ═══════════════════════════════════════════════════════════════════════════
function Contracts({tags,users,customers,contracts,setContracts,entities,projects,serviceLines,onNav,filterCustomerId}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [editMode,setEditMode]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [filterCust,setFilterCust]=useState(filterCustomerId||"");
  const [form,setForm]=useState(blank());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");

  function blank(){return {contractName:"",customerId:"",customerName:"",accountOwner:"",ref:"",startDate:"",endDate:"",value:"",currency:"USD",paymentTerms:"NET 30",customPaymentTerms:"",freyrEntity:"",status:"Draft",tags:[],notes:""};}

  const activeCustomers=customers.filter(c=>c.status==="Active");
  const activeEntities=entities.filter(e=>e.active);
  const activeUsers=users.filter(u=>u.status==="Active");

  // Derived delivery owners from projects linked to this contract
  const getDeliveryOwners=(contractId)=>{
    const projs=projects.filter(p=>p.contractId===contractId);
    return [...new Set(projs.map(p=>p.deliveryOwner).filter(Boolean))];
  };

  const validate=(isEdit=false)=>{
    const e={};
    if(!form.contractName.trim())e.contractName="Required";
    if(!form.customerId)e.customerId="Required";
    if(!form.accountOwner)e.accountOwner="Required";
    if(!form.startDate)e.startDate="Required";
    if(!form.endDate)e.endDate="Required";
    if(form.startDate&&form.endDate&&form.startDate>form.endDate)e.endDate="End must be after start";
    if(!form.currency)e.currency="Required";
    if(!form.paymentTerms)e.paymentTerms="Required";
    if(form.paymentTerms==="Custom"&&!form.customPaymentTerms.trim())e.customPaymentTerms="Specify custom terms";
    if(!form.freyrEntity)e.freyrEntity="Required";
    if(!form.value||isNaN(parseFloat(form.value))||parseFloat(form.value)<=0)e.value="Contract value is required";
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate(editMode))return;
    const pt=form.paymentTerms==="Custom"?form.customPaymentTerms:form.paymentTerms;
    if(editMode&&selected){
      const updated={...selected,...form,paymentTermsDisplay:pt,value:parseFloat(form.value)};
      setContracts(p=>p.map(c=>c.id===selected.id?updated:c));
      setSelected(updated);
    } else {
      setContracts(p=>[...p,{...form,id:genId("CONT"),createdAt:today(),paymentTermsDisplay:pt,value:parseFloat(form.value)}]);
    }
    setShowForm(false);setForm(blank());setErrors({});setEditMode(false);
  };

  const openEdit=(ctr)=>{
    setForm({contractName:ctr.contractName,customerId:ctr.customerId,customerName:ctr.customerName,accountOwner:ctr.accountOwner||"",ref:ctr.ref||"",startDate:ctr.startDate||"",endDate:ctr.endDate||"",value:ctr.value?.toString()||"",currency:ctr.currency||"USD",paymentTerms:ctr.paymentTermsDisplay||ctr.paymentTerms||"NET 30",customPaymentTerms:"",freyrEntity:ctr.freyrEntity||"",status:ctr.status||"Draft",tags:ctr.tags||[],notes:ctr.notes||""});
    setEditMode(true);setErrors({});setShowForm(true);
  };

  const expiryWarn=(c)=>{
    if(!c.endDate||["Closed","Cancelled"].includes(c.status))return null;
    const days=Math.ceil((new Date(c.endDate)-new Date())/(1000*60*60*24));
    if(days<0)return{type:"danger",msg:`Expired ${Math.abs(days)}d ago`};
    if(days<=30)return{type:"warning",msg:`Expires in ${days}d`};
    return null;
  };

  const filtered=contracts.filter(c=>{
    const ms=c.contractName?.toLowerCase().includes(search.toLowerCase())||c.customerName?.toLowerCase().includes(search.toLowerCase());
    const mst=filterStatus==="All"||c.status===filterStatus;
    const mfc=!filterCust||c.customerId===filterCust;
    return ms&&mst&&mfc;
  });

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Contracts" sub={`${contracts.filter(c=>c.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{if(!customers.length){alert("Create a customer first.");return;}setForm(blank());setErrors({});setEditMode(false);setShowForm(true);}}>+ New Contract</Btn>}/>
        {filterCust&&<Alert type="info">Filtered to: <strong>{customers.find(c=>c.id===filterCust)?.name}</strong> <button onClick={()=>setFilterCust("")} style={{background:"none",border:"none",cursor:"pointer",color:C.info,fontWeight:700}}>Clear filter ×</button></Alert>}
        <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All",...CONTRACT_STATUSES]} style={{width:150}}/>
          <Select value={filterCust} onChange={setFilterCust} placeholder="All customers" options={customers.map(c=>({value:c.id,label:c.name}))} style={{width:200}}/>
        </div>
        {contracts.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>📋</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No contracts yet</div>{customers.length===0&&<Alert type="warning">Create a customer first.</Alert>}{customers.length>0&&<Btn onClick={()=>{setForm(blank());setErrors({});setEditMode(false);setShowForm(true);}}>+ Add First Contract</Btn>}</div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"contractName",label:"Contract",render:r=><div><div style={{fontWeight:600}}>{r.contractName}</div><div style={{fontSize:11,color:C.textMuted}}>{r.id} · {r.customerName}</div>{expiryWarn(r)&&<Badge color={expiryWarn(r).type==="danger"?"red":"amber"}>{expiryWarn(r).msg}</Badge>}</div>},
            {key:"accountOwner",label:"Account Owner",render:r=>r.accountOwner||<span style={{color:C.textMuted}}>—</span>},
            {key:"deliveryOwners",label:"Delivery Owner(s)",render:r=>{const dos=getDeliveryOwners(r.id);return dos.length>0?<div style={{fontSize:12}}>{dos.join(", ")}</div>:<span style={{color:C.textMuted,fontSize:12}}>—</span>;}},
            {key:"freyrEntity",label:"Freyr Entity"},
            {key:"currency",label:"CCY"},
            {key:"value",label:"Value",right:true,render:r=><strong>{r.currency} {fmtN(r.value)}</strong>},
            {key:"endDate",label:"End Date"},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="Draft"?"blue":r.status==="On Hold"?"amber":"gray"} dot>{r.status}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setSelected(r);setDetailTab("overview");setView("detail");}}>View →</Btn>},
          ]} rows={filtered}/>
        </Card>}
      </>}

      {view==="detail"&&selected&&<div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
          <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.contractName}</h2><div style={{fontSize:13,color:C.textSub}}>{selected.customerName}{selected.ref?` · ${selected.ref}`:""}</div></div>
          <Badge color={selected.status==="Active"?"green":selected.status==="Draft"?"blue":"gray"} dot>{selected.status}</Badge>
          <Btn variant="secondary" size="sm" onClick={()=>openEdit(selected)}>Edit</Btn>
        </div>
        {expiryWarn(selected)&&<Alert type={expiryWarn(selected).type}>{expiryWarn(selected).msg} — End: {selected.endDate}</Alert>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            <Tabs tabs={[{key:"overview",label:"Overview"},{key:"documents",label:"Documents"}]} active={detailTab} onChange={setDetailTab}/>
            {detailTab==="overview"&&<Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <FormSection title="Commercial Terms">
                  {[["Account Owner",selected.accountOwner||"—"],["Currency",selected.currency],["Payment Terms",selected.paymentTermsDisplay||selected.paymentTerms],["Value",`${selected.currency} ${fmtN(selected.value)}`],["Freyr Entity",selected.freyrEntity]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><strong>{v}</strong></div>
                  ))}
                </FormSection>
                <FormSection title="Period">
                  {[["Start",selected.startDate],["End",selected.endDate],["Status",selected.status],["Delivery Owner(s)",getDeliveryOwners(selected.id).join(", ")||"—"]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><strong style={{textAlign:"right",maxWidth:160,wordBreak:"break-word"}}>{v}</strong></div>
                  ))}
                </FormSection>
              </div>
              {selected.notes&&<div style={{marginTop:12,padding:12,background:C.bg,borderRadius:6,fontSize:13,color:C.textSub}}>{selected.notes}</div>}
            </Card>}
            {detailTab==="documents"&&<Card><UploadPlaceholder label="Contract Document"/></Card>}
          </div>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Contract Summary</div>
            {[["Contract ID",<span style={{fontFamily:"monospace",fontSize:11}}>{selected.id}</span>],["Customer",selected.customerName],["Account Owner",selected.accountOwner||"—"],["Freyr Entity",selected.freyrEntity],["Currency",selected.currency],["Value",`${selected.currency} ${fmtN(selected.value)}`],["Terms",selected.paymentTermsDisplay||selected.paymentTerms],["Created",selected.createdAt]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600,textAlign:"right",maxWidth:160,wordBreak:"break-word"}}>{v}</span></div>
            ))}
          </Card>
        </div>
      </div>}

      <Modal open={showForm} onClose={()=>{setShowForm(false);setErrors({});setEditMode(false);}} title={editMode?"Edit Contract":"New Contract"} width={760}>
        <FormSection title="Contract Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Contract Name" required value={form.contractName} onChange={v=>setForm(p=>({...p,contractName:v}))} error={errors.contractName} placeholder="e.g. J&J Master Services Agreement 2026"/></div>
            <Select label="Customer" required value={form.customerId} onChange={v=>{const c=customers.find(c=>c.id===v);setForm(p=>({...p,customerId:v,customerName:c?.name||""}));}} placeholder="Select customer" options={activeCustomers.map(c=>({value:c.id,label:c.name}))} error={errors.customerId} disabled={editMode}/>
            <Input label="Reference / SOW Number" value={form.ref} onChange={v=>setForm(p=>({...p,ref:v}))} placeholder="e.g. MSA-JNJ-2026 (optional)"/>
          </div>
        </FormSection>
        <FormSection title="Commercial Terms">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Select label="Account Owner" required value={form.accountOwner} onChange={v=>setForm(p=>({...p,accountOwner:v}))} placeholder="Select user" options={activeUsers.map(u=>({value:u.name,label:`${u.name} (${u.role})`}))} error={errors.accountOwner}/>
            <Select label="Freyr Entity" required value={form.freyrEntity} onChange={v=>setForm(p=>({...p,freyrEntity:v}))} placeholder="Select entity" options={activeEntities.map(e=>({value:e.name,label:`${e.name} (${e.prefix})`}))} error={errors.freyrEntity}/>
            <Select label="Currency" required value={form.currency} onChange={v=>setForm(p=>({...p,currency:v}))} options={CURRENCIES.map(c=>({value:c,label:c}))} error={errors.currency}/>
            <Select label="Payment Terms" required value={form.paymentTerms} onChange={v=>setForm(p=>({...p,paymentTerms:v}))} options={PAYMENT_TERMS_OPTIONS.map(t=>({value:t,label:t}))} error={errors.paymentTerms}/>
            {form.paymentTerms==="Custom"&&<Input label="Custom Terms" required value={form.customPaymentTerms} onChange={v=>setForm(p=>({...p,customPaymentTerms:v}))} placeholder="e.g. NET 75" error={errors.customPaymentTerms}/>}
            <Input label="Contract Value" required type="number" value={form.value} onChange={v=>setForm(p=>({...p,value:v}))} placeholder="e.g. 250000" error={errors.value} hint="Mandatory — total contract value"/>
            <Select label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={CONTRACT_STATUSES.map(s=>({value:s,label:s}))}/>
          </div>
        </FormSection>
        <FormSection title="Contract Period">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Input label="Start Date" required type="date" value={form.startDate} onChange={v=>setForm(p=>({...p,startDate:v}))} error={errors.startDate}/>
            <Input label="End Date" required type="date" value={form.endDate} onChange={v=>setForm(p=>({...p,endDate:v}))} error={errors.endDate}/>
          </div>
        </FormSection>
        <FormSection title="Notes"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Commercial notes…"/></FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowForm(false);setErrors({});setEditMode(false);}}>Cancel</Btn><Btn onClick={save}>{editMode?"Save Changes":"Save Contract"}</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS — Session C: cascade Customer→Contract→Project, date validation, interactive SL count
// ═══════════════════════════════════════════════════════════════════════════
function Projects({tags,users,customers,contracts,projects,setProjects,serviceLines,onNav}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [editMode,setEditMode]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blank());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");

  function blank(){return {customerId:"",customerName:"",contractId:"",contractName:"",name:"",deliveryOwner:"",startDate:"",endDate:"",status:"Draft",tags:{},scopeNotes:""};}

  const activeUsers=users.filter(u=>u.status==="Active");
  const activeContracts=contracts.filter(c=>["Active","Draft"].includes(c.status));

  // Contracts filtered to selected customer
  const contractsForCustomer=(custId)=>activeContracts.filter(c=>c.customerId===custId);

  const validate=(isEdit=false)=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    if(!form.customerId)e.customerId="Required";
    if(!form.contractId)e.contractId="Required";
    if(!form.deliveryOwner)e.deliveryOwner="Required";
    if(!form.status)e.status="Required";
    if(form.startDate&&form.endDate&&form.startDate>form.endDate)e.endDate="End must be after start";
    // Date validation within contract dates
    const ctr=contracts.find(c=>c.id===form.contractId);
    if(ctr){
      if(form.startDate&&ctr.startDate&&form.startDate<ctr.startDate)e.startDate=`Must be on/after contract start (${ctr.startDate})`;
      if(form.endDate&&ctr.endDate&&form.endDate>ctr.endDate)e.endDate=`Must be on/before contract end (${ctr.endDate})`;
    }
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate(editMode))return;
    if(editMode&&selected){
      const updated={...selected,...form,name:form.name.trim()};
      setProjects(p=>p.map(pr=>pr.id===selected.id?updated:pr));
      setSelected(updated);
    } else {
      setProjects(p=>[...p,{...form,id:genId("PROJ"),createdAt:today(),name:form.name.trim()}]);
    }
    setShowForm(false);setForm(blank());setErrors({});setEditMode(false);
  };

  const openEdit=(proj)=>{
    setForm({customerId:proj.customerId,customerName:proj.customerName,contractId:proj.contractId,contractName:proj.contractName,name:proj.name,deliveryOwner:proj.deliveryOwner,startDate:proj.startDate||"",endDate:proj.endDate||"",status:proj.status,tags:proj.tags||{},scopeNotes:proj.scopeNotes||""});
    setEditMode(true);setErrors({});setShowForm(true);
  };

  const getProjSLs=(id)=>serviceLines.filter(s=>s.projectId===id);
  const statusColor=s=>s==="Active"?"green":s==="Draft"?"blue":s==="On Hold"?"amber":s==="Closed"?"gray":"red";

  const filtered=projects.filter(p=>{
    const ms=p.name.toLowerCase().includes(search.toLowerCase())||p.customerName?.toLowerCase().includes(search.toLowerCase());
    return ms&&(filterStatus==="All"||p.status===filterStatus);
  });

  const MultiTagSelect=({cat})=>{
    const opts=tags[cat]||[];
    const sel=(form.tags[cat]||[]);
    const toggle=(v)=>setForm(p=>({...p,tags:{...p.tags,[cat]:sel.includes(v)?sel.filter(x=>x!==v):[...sel,v]}}));
    return(
      <div>
        <label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:6}}>{cat}</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {opts.map(o=><button key={o} type="button" onClick={()=>toggle(o)} style={{padding:"3px 10px",borderRadius:20,border:`1.5px solid ${sel.includes(o)?C.primary:C.border}`,background:sel.includes(o)?C.primary:C.white,color:sel.includes(o)?C.white:C.textSub,fontSize:11,fontWeight:600,cursor:"pointer"}}>{o}</button>)}
        </div>
      </div>
    );
  };

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Projects" sub={`${projects.filter(p=>p.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{if(!contracts.length){alert("Create a contract first.");return;}setForm(blank());setErrors({});setEditMode(false);setShowForm(true);}}>+ New Project</Btn>}/>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects…" style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All",...PROJECT_STATUSES]} style={{width:150}}/>
        </div>
        {projects.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>📁</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No projects yet</div>{contracts.length===0&&<Alert type="warning">Create a contract first.</Alert>}{contracts.length>0&&<Btn onClick={()=>{setForm(blank());setErrors({});setEditMode(false);setShowForm(true);}}>+ Add First Project</Btn>}</div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"name",label:"Project",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.id} · {r.customerName} · {r.contractName}</div></div>},
            {key:"deliveryOwner",label:"Delivery Owner"},
            {key:"sls",label:"Service Lines",right:true,render:r=>{
              const cnt=getProjSLs(r.id).length;
              return<button onClick={e=>{e.stopPropagation();onNav("service-lines",{filterProjectId:r.id});}} style={{background:"none",border:"none",cursor:"pointer",color:C.primary,fontWeight:700,fontSize:13,textDecoration:"underline"}}>{cnt}</button>;
            }},
            {key:"startDate",label:"Start",render:r=>r.startDate||"—"},
            {key:"endDate",label:"End",render:r=>r.endDate||"—"},
            {key:"status",label:"Status",render:r=><Badge color={statusColor(r.status)} dot>{r.status}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setSelected(r);setDetailTab("overview");setView("detail");}}>View →</Btn>},
          ]} rows={filtered}/>
        </Card>}
      </>}

      {view==="detail"&&selected&&<div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
          <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.name}</h2><div style={{fontSize:13,color:C.textSub}}>{selected.customerName} · {selected.contractName}</div></div>
          <Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>
          <Btn variant="secondary" size="sm" onClick={()=>openEdit(selected)}>Edit</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            <Tabs tabs={[{key:"overview",label:"Overview"},{key:"sls",label:`Service Lines (${getProjSLs(selected.id).length})`},{key:"tags",label:"Tags"}]} active={detailTab} onChange={setDetailTab}/>
            {detailTab==="overview"&&<Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                {[["Contract",selected.contractName],["Customer",selected.customerName],["Delivery Owner",selected.deliveryOwner],["Start",selected.startDate||"—"],["End",selected.endDate||"—"],["Created",selected.createdAt]].map(([l,v])=>(
                  <div key={l} style={{paddingBottom:8,borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:13,fontWeight:600,marginTop:2}}>{v}</div></div>
                ))}
              </div>
              {selected.scopeNotes&&<div><div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:6}}>SCOPE NOTES</div><div style={{padding:12,background:C.bg,borderRadius:6,fontSize:13,color:C.text,lineHeight:1.6}}>{selected.scopeNotes}</div></div>}
            </Card>}
            {detailTab==="sls"&&<Card style={{padding:0}}>
              {getProjSLs(selected.id).length===0?<div style={{textAlign:"center",padding:"40px",color:C.textMuted,fontSize:13}}>No service lines yet.</div>:
              <Table cols={[
                {key:"service",label:"Service",render:r=><strong>{r.service}</strong>},
                {key:"commercialType",label:"Commercial Type",render:r=><Badge color="blue">{r.commercialType}</Badge>},
                {key:"currency",label:"CCY"},
                {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="Draft"?"blue":"amber"} dot>{r.status}</Badge>},
              ]} rows={getProjSLs(selected.id)}/>}
            </Card>}
            {detailTab==="tags"&&<Card>
              {Object.keys(selected.tags||{}).length===0?<div style={{textAlign:"center",padding:"30px",color:C.textMuted,fontSize:13}}>No project-level tags assigned.</div>:
              <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                {Object.entries(selected.tags||{}).map(([cat,vals])=>(Array.isArray(vals)?vals:[vals]).map(v=>(
                  <div key={`${cat}-${v}`}><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",marginBottom:2}}>{cat}</div><Badge color="blue">{v}</Badge></div>
                )))}
              </div>}
            </Card>}
          </div>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Project Details</div>
            {[["Project ID",<span style={{fontFamily:"monospace",fontSize:11}}>{selected.id}</span>],["Status",<Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>],["Delivery Owner",selected.deliveryOwner],["Service Lines",getProjSLs(selected.id).length],["Created",selected.createdAt]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
            ))}
          </Card>
        </div>
      </div>}

      <Modal open={showForm} onClose={()=>{setShowForm(false);setErrors({});setEditMode(false);}} title={editMode?"Edit Project":"New Project"} width={720}>
        <FormSection title="Project Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Project Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. J&J RA Global Support"/></div>
            {/* Step 1: Pick Customer */}
            <Select label="Customer" required value={form.customerId} onChange={v=>{
              const c=customers.find(c=>c.id===v);
              setForm(p=>({...p,customerId:v,customerName:c?.name||"",contractId:"",contractName:""}));
            }} placeholder="Select customer" options={customers.filter(c=>c.status==="Active").map(c=>({value:c.id,label:c.name}))} error={errors.customerId} disabled={editMode}/>
            {/* Step 2: Pick Contract filtered to customer */}
            <Select label="Contract" required value={form.contractId} onChange={v=>{
              const c=contracts.find(c=>c.id===v);
              setForm(p=>({...p,contractId:v,contractName:c?.contractName||""}));
            }} placeholder={form.customerId?"Select contract":"Select customer first"} options={contractsForCustomer(form.customerId).map(c=>({value:c.id,label:c.contractName}))} error={errors.contractId} disabled={!form.customerId||editMode}/>
            <Select label="Delivery Owner" required value={form.deliveryOwner} onChange={v=>setForm(p=>({...p,deliveryOwner:v}))} placeholder="Select user" options={activeUsers.map(u=>({value:u.name,label:`${u.name} (${u.role})`}))} error={errors.deliveryOwner}/>
            <Select label="Status" required value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={PROJECT_STATUSES.map(s=>({value:s,label:s}))} error={errors.status}/>
            <Input label="Start Date" type="date" value={form.startDate} onChange={v=>setForm(p=>({...p,startDate:v}))} error={errors.startDate} hint={form.contractId?`Contract: ${contracts.find(c=>c.id===form.contractId)?.startDate||""}→${contracts.find(c=>c.id===form.contractId)?.endDate||""}`:undefined}/>
            <Input label="End Date" type="date" value={form.endDate} onChange={v=>setForm(p=>({...p,endDate:v}))} error={errors.endDate}/>
          </div>
        </FormSection>
        <FormSection title="Scope Notes">
          <Textarea value={form.scopeNotes} onChange={v=>setForm(p=>({...p,scopeNotes:v}))} placeholder="High-level description of what this project covers…" rows={3}/>
        </FormSection>
        <FormSection title="Project-level Tags (optional)">
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {["Division","Region","Work Country"].map(cat=>tags[cat]&&<MultiTagSelect key={cat} cat={cat}/>)}
          </div>
        </FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowForm(false);setErrors({});setEditMode(false);}}>Cancel</Btn><Btn onClick={save}>{editMode?"Save Changes":"Save Project"}</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE LINES — Session C: Complete redesign per spec
// Cascade: Customer → Contract → Project
// Commercial type as dropdown, mandatory multi-select tags
// Forecast entry within creation form
// ═══════════════════════════════════════════════════════════════════════════
function ServiceLines({tags,users,customers,contracts,projects,serviceLines,setServiceLines,forecasts,setForecasts,onNav,filterProjectId}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [filterProjId,setFilterProjId]=useState(filterProjectId||"");
  const [detailTab,setDetailTab]=useState("overview");

  // Form state
  const [form,setForm]=useState(blankForm());
  const [errors,setErrors]=useState({});
  // Fixed Price milestones
  const [milestones,setMilestones]=useState([]);
  const [newMs,setNewMs]=useState({name:"",pct:"",dueDate:""});
  // T&M resource roles
  const [resourceRoles,setResourceRoles]=useState([]);
  const [newRole,setNewRole]=useState({role:"",workLocation:"",hourlyRate:""});
  // Forecast entries in form
  const [fcEntries,setFcEntries]=useState([]);
  const [newFc,setNewFc]=useState({month:"",amount:""});

  function blankForm(){return {
    customerId:"",customerName:"",contractId:"",contractName:"",projectId:"",projectName:"",
    service:"",commercialType:"",currency:"",status:"Draft",
    // Fixed Price
    totalServiceCost:"",
    // T&M
    totalServiceCostTM:"",
    // Transaction Based
    unitName:"",unitCost:"",
    // Recurring
    billingBasis:"", // ARR | MRR | OTS
    arrValue:"",mrrValue:"",otsValue:"",
    // Tags (mandatory)
    division:[],department:[],workCountry:[],region:[],
    notes:"",
  };}

  const serviceOptions=tags["Service"]||[];
  const workCountryOptions=tags["Work Country"]||[];
  const divisionOptions=tags["Division"]||[];
  const departmentOptions=tags["Department"]||[];
  const regionOptions=tags["Region"]||[];

  // Cascade helpers
  const contractsForCustomer=(custId)=>contracts.filter(c=>["Active","Draft"].includes(c.status)&&c.customerId===custId);
  const projectsForContract=(contractId)=>projects.filter(p=>["Active","Draft"].includes(p.status)&&p.contractId===contractId);

  const getSLForecasts=(slId)=>forecasts.filter(f=>f.serviceLineId===slId);
  const getSLForecastTotal=(slId)=>getSLForecasts(slId).reduce((s,f)=>s+(f.forecastAmount||0),0);

  // Milestone calc
  const msInvoiceAmount=(ms,totalCost)=>((parseFloat(ms.pct)||0)/100)*(parseFloat(totalCost)||0);
  const msTotal=milestones.reduce((s,m)=>s+msInvoiceAmount(m,form.totalServiceCost),0);
  const totalCostNum=parseFloat(form.totalServiceCost)||0;
  const msDiff=Math.abs(msTotal-totalCostNum);

  // Forecast running total (in-form)
  const fcTotal=fcEntries.reduce((s,f)=>s+(parseFloat(f.amount)||0),0);

  const validate=()=>{
    const e={};
    if(!form.customerId)e.customerId="Required";
    if(!form.contractId)e.contractId="Required";
    if(!form.projectId)e.projectId="Required";
    if(!form.service)e.service="Required";
    if(!form.commercialType)e.commercialType="Required";
    // Mandatory tags
    if(!form.division.length)e.division="Required — select at least one Division";
    if(!form.department.length)e.department="Required — select at least one Department";
    if(!form.workCountry.length)e.workCountry="Required — select at least one Work Country";
    if(!form.region.length)e.region="Required — select at least one Region";
    // Commercial type specifics
    if(form.commercialType==="Fixed Price"){
      if(!form.totalServiceCost)e.totalServiceCost="Required";
      if(milestones.length===0)e.milestones="Add at least one milestone";
      else if(msDiff>0.01)e.milestones=`Milestone amounts (${fmtN(msTotal)}) must equal Total Service Cost (${fmtN(totalCostNum)})`;
    }
    if(form.commercialType==="Transaction Based"){
      if(!form.unitName)e.unitName="Required";
      if(!form.unitCost)e.unitCost="Required";
    }
    if(form.commercialType==="Recurring-Subscription"){
      if(!form.billingBasis)e.billingBasis="Select ARR, MRR, or OTS";
    }
    // Active requires forecast
    if(form.status==="Active"&&fcEntries.length===0)e.status="Cannot activate — add at least one forecast entry below";
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const sl={
      ...form,
      id:genId("SL"),createdAt:today(),
      milestones:form.commercialType==="Fixed Price"?milestones:[],
      resourceRoles:["T&M Staffing","T&M Managed"].includes(form.commercialType)?resourceRoles:[],
    };
    setServiceLines(p=>[...p,sl]);
    // Save forecast entries
    if(fcEntries.length>0){
      const newFcs=fcEntries.map(f=>({
        id:genId("FC"),serviceLineId:sl.id,slName:sl.service,projectName:sl.projectName,customerName:sl.customerName,
        currency:sl.currency,month:f.month,forecastAmount:parseFloat(f.amount)||0,
        forecastBasis:"Manual",version:"Current",actual:null,createdAt:today(),updatedAt:today(),
      }));
      setForecasts(p=>[...p,...newFcs]);
    }
    setShowNew(false);resetForm();
  };

  const resetForm=()=>{
    setForm(blankForm());setErrors({});setMilestones([]);setNewMs({name:"",pct:"",dueDate:""});
    setResourceRoles([]);setNewRole({role:"",workLocation:"",hourlyRate:""});
    setFcEntries([]);setNewFc({month:"",amount:""});
  };

  const addMilestone=()=>{
    if(!newMs.name||!newMs.pct)return;
    setMilestones(p=>[...p,{id:genId("MS"),name:newMs.name,pct:parseFloat(newMs.pct),dueDate:newMs.dueDate}]);
    setNewMs({name:"",pct:"",dueDate:""});
  };

  const addRole=()=>{
    if(!newRole.role)return;
    setResourceRoles(p=>[...p,{id:genId("RR"),...newRole}]);
    setNewRole({role:"",workLocation:"",hourlyRate:""});
  };

  const addFcEntry=()=>{
    if(!newFc.month||!newFc.amount)return;
    if(fcEntries.some(f=>f.month===newFc.month)){alert("A forecast entry for this month already exists.");return;}
    setFcEntries(p=>[...p,{month:newFc.month,amount:newFc.amount}]);
    setNewFc({month:"",amount:""});
  };

  const statusColor=s=>s==="Active"?"green":s==="Draft"?"blue":s==="On Hold"?"amber":"gray";
  const ctColor=ct=>ct==="Fixed Price"?"green":["T&M Managed","T&M Staffing"].includes(ct)?"blue":ct==="Transaction Based"?"amber":"purple";

  const filtered=serviceLines.filter(s=>{
    const ms=s.service?.toLowerCase().includes(search.toLowerCase())||s.customerName?.toLowerCase().includes(search.toLowerCase());
    const mst=filterStatus==="All"||s.status===filterStatus;
    const mpj=!filterProjId||s.projectId===filterProjId;
    return ms&&mst&&mpj;
  });

  const TagBlock=({field,label,options,required})=>(
    <MultiSelect label={label} required={required} options={options} selected={form[field]||[]}
      onChange={v=>setForm(p=>({...p,[field]:v}))} error={errors[field]}/>
  );

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Service Lines" sub={`${serviceLines.filter(s=>s.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{if(!projects.length){alert("Create a project first.");return;}resetForm();setShowNew(true);}}>+ New Service Line</Btn>}/>
        {filterProjId&&<Alert type="info">Filtered to project: <strong>{projects.find(p=>p.id===filterProjId)?.name}</strong> <button onClick={()=>setFilterProjId("")} style={{background:"none",border:"none",cursor:"pointer",color:C.info,fontWeight:700}}>Clear ×</button></Alert>}
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search service lines…" style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All",...SL_STATUSES]} style={{width:150}}/>
        </div>
        {serviceLines.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>⚙</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No service lines yet</div>{projects.length===0&&<Alert type="warning">Create a project first.</Alert>}{projects.length>0&&<Btn onClick={()=>{resetForm();setShowNew(true);}}>+ Add First Service Line</Btn>}</div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"service",label:"Service",render:r=><div><div style={{fontWeight:600}}>{r.service}</div><div style={{fontSize:11,color:C.textMuted}}>{r.id} · {r.customerName} · {r.projectName}</div></div>},
            {key:"commercialType",label:"Commercial Type",render:r=><Badge color={ctColor(r.commercialType)}>{r.commercialType}</Badge>},
            {key:"currency",label:"CCY"},
            {key:"forecast",label:"Forecast",right:true,render:r=>{const t=getSLForecastTotal(r.id);return t>0?<strong>{fmtN(t)}</strong>:<Badge color="amber">No forecast</Badge>;}},
            {key:"status",label:"Status",render:r=><Badge color={statusColor(r.status)} dot>{r.status}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setSelected(r);setDetailTab("overview");setView("detail");}}>View →</Btn>},
          ]} rows={filtered}/>
        </Card>}
      </>}

      {view==="detail"&&selected&&<div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
          <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.service}</h2><div style={{fontSize:13,color:C.textSub}}>{selected.customerName} · {selected.projectName}</div></div>
          <Badge color={ctColor(selected.commercialType)}>{selected.commercialType}</Badge>
          <Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>
        </div>
        {getSLForecastTotal(selected.id)===0&&<Alert type="warning">No forecast entries. A service line cannot be Active without at least one forecast entry.</Alert>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            <Tabs tabs={[{key:"overview",label:"Overview"},{key:"forecast",label:`Forecast (${getSLForecasts(selected.id).length})`},{key:"milestones",label:"Milestones/Roles"}]} active={detailTab} onChange={setDetailTab}/>
            {detailTab==="overview"&&<Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                {[["Project",selected.projectName],["Customer",selected.customerName],["Contract",selected.contractName],["Service",selected.service],["Commercial Type",selected.commercialType],["Currency",selected.currency],
                  ...(selected.commercialType==="Fixed Price"?[["Total Service Cost",`${selected.currency} ${fmtN(selected.totalServiceCost)}`]]:[]),
                  ...(selected.commercialType==="Transaction Based"?[["Unit/Transaction Name",selected.unitName],["Unit/Transaction Cost",`${selected.currency} ${fmtN(selected.unitCost)}`]]:[]),
                  ...(selected.commercialType==="Recurring-Subscription"?[["Billing Basis",selected.billingBasis],[selected.billingBasis,`${selected.currency} ${fmtN(selected[selected.billingBasis?.toLowerCase()+"Value"]||0)}`]]:[]),
                ].map(([l,v])=>(
                  <div key={l} style={{paddingBottom:8,borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:13,fontWeight:600,marginTop:2}}>{v}</div></div>
                ))}
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:8,textTransform:"uppercase"}}>Tags</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {[...( selected.division||[]).map(v=>({cat:"Division",v})),...(selected.department||[]).map(v=>({cat:"Dept",v})),...(selected.workCountry||[]).map(v=>({cat:"Work Country",v})),...(selected.region||[]).map(v=>({cat:"Region",v}))].map(({cat,v})=>(
                    <div key={`${cat}-${v}`}><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase"}}>{cat}</div><Badge color="blue">{v}</Badge></div>
                  ))}
                </div>
              </div>
              {selected.notes&&<div style={{padding:12,background:C.bg,borderRadius:6,fontSize:13}}>{selected.notes}</div>}
            </Card>}
            {detailTab==="forecast"&&<Card style={{padding:0}}>
              {getSLForecasts(selected.id).length===0?<div style={{textAlign:"center",padding:"40px",color:C.textMuted}}><div style={{fontSize:13}}>No forecast entries. Go to the Forecast module to add entries for this service line.</div></div>:
              <Table cols={[
                {key:"month",label:"Month",render:r=>{const m=YEAR_MONTHS.find(m=>m.value===r.month);return m?.label||r.month;}},
                {key:"forecastAmount",label:`Forecast (${selected.currency})`,right:true,render:r=><strong>{fmtN(r.forecastAmount)}</strong>},
                {key:"actual",label:"Actual",right:true,render:r=>r.actual!=null?<span style={{color:C.success}}>{fmtN(r.actual)}</span>:<span style={{color:C.textMuted}}>—</span>},
                {key:"version",label:"Version"},
              ]} rows={getSLForecasts(selected.id).sort((a,b)=>a.month.localeCompare(b.month))}/>}
            </Card>}
            {detailTab==="milestones"&&<Card>
              {selected.commercialType==="Fixed Price"&&selected.milestones?.length>0&&<>
                <div style={{fontWeight:700,marginBottom:12}}>Milestones</div>
                <Table cols={[
                  {key:"name",label:"Milestone"},
                  {key:"pct",label:"%",right:true,render:r=>`${r.pct}%`},
                  {key:"invoiceAmt",label:"Invoice Amount",right:true,render:r=><strong>{selected.currency} {fmtN(msInvoiceAmount(r,selected.totalServiceCost))}</strong>},
                  {key:"dueDate",label:"Due Date",render:r=>r.dueDate||"—"},
                ]} rows={selected.milestones}/>
              </>}
              {["T&M Staffing","T&M Managed"].includes(selected.commercialType)&&selected.resourceRoles?.length>0&&<>
                <div style={{fontWeight:700,marginBottom:12}}>Resource Roles</div>
                <Table cols={[
                  {key:"role",label:"Resource Role"},
                  {key:"workLocation",label:"Work Location"},
                  {key:"hourlyRate",label:"Hourly Rate",right:true,render:r=>r.hourlyRate?`${selected.currency} ${fmtN(r.hourlyRate)}`:"—"},
                ]} rows={selected.resourceRoles}/>
              </>}
              {!["Fixed Price","T&M Staffing","T&M Managed"].includes(selected.commercialType)&&<div style={{textAlign:"center",padding:"30px",color:C.textMuted,fontSize:13}}>Not applicable for {selected.commercialType}.</div>}
            </Card>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Card>
              <div style={{fontWeight:700,marginBottom:16}}>Financial Summary</div>
              {[["Forecast Total",`${selected.currency} ${fmtN(getSLForecastTotal(selected.id))}`],["Forecast Entries",getSLForecasts(selected.id).length],["Created",selected.createdAt]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><strong>{v}</strong></div>
              ))}
            </Card>
            <Card>
              <div style={{fontWeight:700,marginBottom:12}}>Update Status</div>
              {["Draft","On Hold","Closed"].map(s=>(
                <Btn key={s} variant={selected.status===s?"primary":"secondary"} size="sm" style={{width:"100%",marginBottom:8}} onClick={()=>{setServiceLines(p=>p.map(sl=>sl.id===selected.id?{...sl,status:s}:sl));setSelected(prev=>({...prev,status:s}));}}>{s}</Btn>
              ))}
              <Btn variant={selected.status==="Active"?"primary":"secondary"} size="sm" style={{width:"100%",marginBottom:8}} onClick={()=>{
                if(getSLForecastTotal(selected.id)===0){alert("Cannot set to Active — no forecast entries exist.");return;}
                setServiceLines(p=>p.map(sl=>sl.id===selected.id?{...sl,status:"Active"}:sl));
                setSelected(prev=>({...prev,status:"Active"}));
              }}>Active {getSLForecastTotal(selected.id)===0?"🔒":""}</Btn>
              {getSLForecastTotal(selected.id)===0&&<div style={{fontSize:11,color:C.danger,textAlign:"center"}}>Add forecasts to unlock Active</div>}
            </Card>
          </div>
        </div>
      </div>}

      {/* New Service Line Modal */}
      <Modal open={showNew} onClose={()=>{setShowNew(false);resetForm();}} title="New Service Line" width={800}>
        {/* Step 1: Cascade */}
        <FormSection title="1. Customer → Contract → Project">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <Select label="Customer" required value={form.customerId} onChange={v=>{
              const c=customers.find(c=>c.id===v);
              setForm(p=>({...p,customerId:v,customerName:c?.name||"",contractId:"",contractName:"",projectId:"",projectName:"",currency:""}));
            }} placeholder="Select customer" options={customers.filter(c=>c.status==="Active").map(c=>({value:c.id,label:c.name}))} error={errors.customerId}/>
            <Select label="Contract" required value={form.contractId} onChange={v=>{
              const c=contracts.find(c=>c.id===v);
              setForm(p=>({...p,contractId:v,contractName:c?.contractName||"",projectId:"",projectName:"",currency:c?.currency||""}));
            }} placeholder={form.customerId?"Select contract":"Customer first"} options={contractsForCustomer(form.customerId).map(c=>({value:c.id,label:c.contractName}))} error={errors.contractId} disabled={!form.customerId}/>
            <Select label="Project" required value={form.projectId} onChange={v=>{
              const p=projects.find(p=>p.id===v);
              setForm(f=>({...f,projectId:v,projectName:p?.name||""}));
            }} placeholder={form.contractId?"Select project":"Contract first"} options={projectsForContract(form.contractId).map(p=>({value:p.id,label:p.name}))} error={errors.projectId} disabled={!form.contractId}/>
          </div>
          {form.currency&&<div style={{marginTop:8,padding:"6px 12px",background:C.infoBg,borderRadius:6,fontSize:12,color:C.info}}>Currency auto-populated from contract: <strong>{form.currency}</strong></div>}
        </FormSection>

        {/* Step 2: Service & Commercial Type */}
        <FormSection title="2. Service Details">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Select label="Service" required value={form.service} onChange={v=>setForm(p=>({...p,service:v}))} placeholder="Select service from Tag Master" options={serviceOptions.map(s=>({value:s,label:s}))} error={errors.service}/>
            <Select label="Commercial Type" required value={form.commercialType} onChange={v=>setForm(p=>({...p,commercialType:v,billingBasis:""}))} placeholder="Select commercial type" options={COMMERCIAL_TYPES.map(t=>({value:t,label:t}))} error={errors.commercialType}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Currency" value={form.currency} readOnly hint="Auto-populated from contract"/>
            <Select label="Status" value={form.status} onChange={v=>{
              if(v==="Active"&&fcEntries.length===0){alert("Cannot set Active — add at least one forecast entry in the Forecast section below.");return;}
              setForm(p=>({...p,status:v}));
            }} options={SL_STATUSES.map(s=>({value:s,label:s}))} error={errors.status}/>
          </div>
        </FormSection>

        {/* Step 3: Commercial Type specific fields */}
        {form.commercialType==="Fixed Price"&&<FormSection title="3. Fixed Price Details">
          <Input label="Total Service Cost" required type="number" value={form.totalServiceCost} onChange={v=>setForm(p=>({...p,totalServiceCost:v}))} placeholder="e.g. 150000" error={errors.totalServiceCost}/>
          <div style={{marginTop:12}}>
            <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:8}}>MILESTONES (must sum to Total Service Cost)</div>
            {milestones.length>0&&<table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:12}}>
              <thead><tr>{["Milestone Name","Billing %","Invoice Amount","Due Date",""].map(h=><th key={h} style={{padding:"6px 10px",background:C.bg,borderBottom:`1px solid ${C.border}`,textAlign:"left",fontWeight:600,color:C.textSub,fontSize:11}}>{h}</th>)}</tr></thead>
              <tbody>{milestones.map((m,i)=><tr key={m.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"6px 10px"}}>{m.name}</td>
                <td style={{padding:"6px 10px"}}>{m.pct}%</td>
                <td style={{padding:"6px 10px",fontWeight:600}}>{form.currency} {fmtN(msInvoiceAmount(m,form.totalServiceCost))}</td>
                <td style={{padding:"6px 10px"}}>{m.dueDate||"—"}</td>
                <td style={{padding:"6px 10px"}}><button onClick={()=>setMilestones(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:13}}>×</button></td>
              </tr>)}</tbody>
              <tfoot><tr><td colSpan={2} style={{padding:"6px 10px",fontWeight:700}}>Total</td><td style={{padding:"6px 10px",fontWeight:700,color:msDiff<0.01?C.success:C.danger}}>{form.currency} {fmtN(msTotal)} {msDiff<0.01?"✓":`≠ ${fmtN(totalCostNum)}`}</td><td colSpan={2}/></tr></tfoot>
            </table>}
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,alignItems:"flex-end"}}>
              <Input label="Milestone Name" value={newMs.name} onChange={v=>setNewMs(p=>({...p,name:v}))} placeholder="e.g. Kickoff signoff"/>
              <Input label="Billing %" type="number" value={newMs.pct} onChange={v=>setNewMs(p=>({...p,pct:v}))} placeholder="e.g. 25"/>
              <Input label="Due Date" type="date" value={newMs.dueDate} onChange={v=>setNewMs(p=>({...p,dueDate:v}))}/>
              <Btn size="sm" onClick={addMilestone} disabled={!newMs.name||!newMs.pct} style={{marginTop:20}}>+ Add</Btn>
            </div>
            {errors.milestones&&<Alert type="danger">{errors.milestones}</Alert>}
          </div>
        </FormSection>}

        {["T&M Staffing","T&M Managed"].includes(form.commercialType)&&<FormSection title="3. Resource Roles">
          <Input label="Total Service Cost (optional)" type="number" value={form.totalServiceCostTM} onChange={v=>setForm(p=>({...p,totalServiceCostTM:v}))} placeholder="Optional ceiling value"/>
          <div style={{marginTop:12}}>
            <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:8}}>RESOURCE ROLES</div>
            {resourceRoles.length>0&&<table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:12}}>
              <thead><tr>{["Role","Work Location","Hourly Rate",""].map(h=><th key={h} style={{padding:"6px 10px",background:C.bg,borderBottom:`1px solid ${C.border}`,textAlign:"left",fontWeight:600,color:C.textSub,fontSize:11}}>{h}</th>)}</tr></thead>
              <tbody>{resourceRoles.map((r,i)=><tr key={r.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"6px 10px"}}>{r.role}</td>
                <td style={{padding:"6px 10px"}}>{r.workLocation||"—"}</td>
                <td style={{padding:"6px 10px",fontWeight:600}}>{r.hourlyRate?`${form.currency} ${fmtN(r.hourlyRate)}`:"—"}</td>
                <td style={{padding:"6px 10px"}}><button onClick={()=>setResourceRoles(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:13}}>×</button></td>
              </tr>)}</tbody>
            </table>}
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,alignItems:"flex-end"}}>
              <Input label="Resource Role" value={newRole.role} onChange={v=>setNewRole(p=>({...p,role:v}))} placeholder="e.g. Senior RA Specialist"/>
              <Select label="Work Location" value={newRole.workLocation} onChange={v=>setNewRole(p=>({...p,workLocation:v}))} placeholder="Select" options={workCountryOptions.map(c=>({value:c,label:c}))}/>
              <Input label="Hourly Rate" type="number" value={newRole.hourlyRate} onChange={v=>setNewRole(p=>({...p,hourlyRate:v}))} placeholder="e.g. 185"/>
              <Btn size="sm" onClick={addRole} disabled={!newRole.role} style={{marginTop:20}}>+ Add</Btn>
            </div>
          </div>
        </FormSection>}

        {form.commercialType==="Transaction Based"&&<FormSection title="3. Transaction Details">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Unit/Transaction Name" required value={form.unitName} onChange={v=>setForm(p=>({...p,unitName:v}))} placeholder="e.g. Submission Package" error={errors.unitName}/>
            <Input label="Unit/Transaction Cost" required type="number" value={form.unitCost} onChange={v=>setForm(p=>({...p,unitCost:v}))} placeholder="e.g. 5000" error={errors.unitCost}/>
          </div>
        </FormSection>}

        {form.commercialType==="Recurring-Subscription"&&<FormSection title="3. Recurring Subscription">
          <Alert type="info">Select ONE billing basis only. ARR, MRR, and OTS are mutually exclusive — no conversion between them.</Alert>
          <div style={{display:"flex",gap:12,marginBottom:12}}>
            {["ARR","MRR","OTS"].map(b=>(
              <button key={b} type="button" onClick={()=>setForm(p=>({...p,billingBasis:b}))} style={{padding:"8px 20px",borderRadius:8,border:`2px solid ${form.billingBasis===b?C.primary:C.border}`,background:form.billingBasis===b?C.primary:C.white,color:form.billingBasis===b?C.white:C.textSub,fontWeight:700,cursor:"pointer",fontSize:13}}>{b}</button>
            ))}
          </div>
          {errors.billingBasis&&<div style={{fontSize:11,color:C.danger,marginBottom:8}}>{errors.billingBasis}</div>}
          {form.billingBasis&&<Input label={`${form.billingBasis} Value`} type="number" value={form[form.billingBasis.toLowerCase()+"Value"]||""} onChange={v=>setForm(p=>({...p,[form.billingBasis.toLowerCase()+"Value"]:v}))} placeholder={`e.g. ${form.billingBasis==="ARR"?"120000":form.billingBasis==="MRR"?"10000":"50000"}`}/>}
        </FormSection>}

        {/* Step 4: Mandatory Tags */}
        <FormSection title="4. Classification Tags (all mandatory)">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <TagBlock field="division" label="Division" options={divisionOptions} required/>
            <TagBlock field="department" label="Department" options={departmentOptions} required/>
            <TagBlock field="workCountry" label="Work Country" options={workCountryOptions} required/>
            <TagBlock field="region" label="Region" options={regionOptions} required/>
          </div>
        </FormSection>

        {/* Step 5: Forecast in creation form */}
        <FormSection title="5. Forecast Entries (add at least one to enable Active status)">
          <Alert type="info">Enter month-on-month forecast amounts. You can add entries for any month/year. At least one entry is required before setting status to Active.</Alert>
          {fcEntries.length>0&&<table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:12}}>
            <thead><tr>{["Month","Forecast Amount",""].map(h=><th key={h} style={{padding:"6px 10px",background:C.bg,borderBottom:`1px solid ${C.border}`,textAlign:"left",fontWeight:600,color:C.textSub,fontSize:11}}>{h}</th>)}</tr></thead>
            <tbody>{fcEntries.sort((a,b)=>a.month.localeCompare(b.month)).map((f,i)=><tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
              <td style={{padding:"6px 10px"}}>{YEAR_MONTHS.find(m=>m.value===f.month)?.label||f.month}</td>
              <td style={{padding:"6px 10px",fontWeight:600}}>{form.currency} {fmtN(f.amount)}</td>
              <td style={{padding:"6px 10px"}}><button onClick={()=>setFcEntries(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:13}}>×</button></td>
            </tr>)}</tbody>
            <tfoot><tr><td style={{padding:"6px 10px",fontWeight:700}}>Running Total</td><td style={{padding:"6px 10px",fontWeight:700,color:C.primary}}>{form.currency} {fmtN(fcTotal)}</td><td/></tr></tfoot>
          </table>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"flex-end"}}>
            <Select label="Month" value={newFc.month} onChange={v=>setNewFc(p=>({...p,month:v}))} placeholder="Select month" options={YEAR_MONTHS.map(m=>({value:m.value,label:m.label}))}/>
            <Input label="Forecast Amount" type="number" value={newFc.amount} onChange={v=>setNewFc(p=>({...p,amount:v}))} placeholder="e.g. 25000"/>
            <Btn size="sm" onClick={addFcEntry} disabled={!newFc.month||!newFc.amount} style={{marginTop:20}}>+ Add</Btn>
          </div>
          {fcEntries.length===0&&form.status==="Active"&&<Alert type="danger">You must add at least one forecast entry to save as Active.</Alert>}
        </FormSection>

        <FormSection title="6. Notes">
          <Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Any notes about this service line…"/>
        </FormSection>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={()=>{setShowNew(false);resetForm();}}>Cancel</Btn>
          <Btn onClick={save}>Save Service Line</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FORECAST MODULE — Session C: view/update, version management, rollup summaries
// ═══════════════════════════════════════════════════════════════════════════
function Forecast({serviceLines,forecasts,setForecasts}){
  const [selectedSl,setSelectedSl]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState(blankFc());
  const [errors,setErrors]=useState({});
  const [version,setVersion]=useState("Current");
  const [summaryTab,setSummaryTab]=useState("customer");

  function blankFc(){return {serviceLineId:"",month:"",forecastAmount:"",version:"Current",notes:""};}

  const getSlForecasts=(slId,ver)=>forecasts.filter(f=>f.serviceLineId===slId&&(ver?f.version===ver:true));

  const validate=()=>{
    const e={};
    if(!form.serviceLineId)e.serviceLineId="Required";
    if(!form.month)e.month="Required";
    if(!form.forecastAmount&&form.forecastAmount!==0)e.forecastAmount="Required (enter 0 if no revenue)";
    if(form.forecastAmount!==""&&parseFloat(form.forecastAmount)<0)e.forecastAmount="Must be ≥ 0";
    if(form.serviceLineId&&form.month&&form.version){
      const dup=forecasts.find(f=>f.serviceLineId===form.serviceLineId&&f.month===form.month&&f.version===form.version);
      if(dup)e.month="Entry already exists for this month and version.";
    }
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const sl=serviceLines.find(s=>s.id===form.serviceLineId);
    const fc={
      id:genId("FC"),serviceLineId:form.serviceLineId,slName:sl?.service||"",projectName:sl?.projectName||"",customerName:sl?.customerName||"",
      currency:sl?.currency||"USD",month:form.month,forecastAmount:parseFloat(form.forecastAmount)||0,
      forecastBasis:"Manual",version:form.version,notes:form.notes,
      actual:null,createdAt:today(),updatedAt:today(),
    };
    setForecasts(p=>[...p,fc]);
    setShowAdd(false);setForm(blankFc());setErrors({});
  };

  const deleteEntry=(id)=>{if(window.confirm("Delete this forecast entry?"))setForecasts(p=>p.filter(f=>f.id!==id));};
  const setActual=(id,val)=>setForecasts(p=>p.map(f=>f.id===id?{...f,actual:val===""?null:parseFloat(val),updatedAt:today()}:f));

  const displaySl=selectedSl?serviceLines.find(s=>s.id===selectedSl):null;
  const slFc=selectedSl?getSlForecasts(selectedSl,version):[];
  const totalFc=slFc.reduce((s,f)=>s+(f.forecastAmount||0),0);
  const totalAct=slFc.reduce((s,f)=>s+(f.actual||0),0);
  const real=totalFc>0?totalAct/totalFc*100:0;

  // Summary by customer
  const summaryByCustomer=useMemo(()=>{
    const map={};
    forecasts.forEach(f=>{
      if(!map[f.customerName])map[f.customerName]={customer:f.customerName,forecast:0,actual:0};
      map[f.customerName].forecast+=f.forecastAmount||0;
      map[f.customerName].actual+=f.actual||0;
    });
    return Object.values(map).sort((a,b)=>b.forecast-a.forecast);
  },[forecasts]);

  // Summary by division — from service line tags
  const summaryByDivision=useMemo(()=>{
    const map={};
    forecasts.forEach(f=>{
      const sl=serviceLines.find(s=>s.id===f.serviceLineId);
      const divs=sl?.division||["Unknown"];
      divs.forEach(div=>{
        if(!map[div])map[div]={division:div,forecast:0,actual:0};
        map[div].forecast+=f.forecastAmount||0;
        map[div].actual+=f.actual||0;
      });
    });
    return Object.values(map).sort((a,b)=>b.forecast-a.forecast);
  },[forecasts,serviceLines]);

  // Summary by service
  const summaryByService=useMemo(()=>{
    const map={};
    forecasts.forEach(f=>{
      const sl=serviceLines.find(s=>s.id===f.serviceLineId);
      const svc=sl?.service||f.slName||"Unknown";
      if(!map[svc])map[svc]={service:svc,forecast:0,actual:0};
      map[svc].forecast+=f.forecastAmount||0;
      map[svc].actual+=f.actual||0;
    });
    return Object.values(map).sort((a,b)=>b.forecast-a.forecast);
  },[forecasts,serviceLines]);

  const SummaryTable=({rows,keyField,keyLabel})=>(
    <Table cols={[
      {key:keyField,label:keyLabel,render:r=><strong>{r[keyField]}</strong>},
      {key:"forecast",label:"Forecast (USD)",right:true,render:r=><strong>{fmtN(r.forecast)}</strong>},
      {key:"actual",label:"Actuals (USD)",right:true,render:r=>fmtN(r.actual)},
      {key:"variance",label:"Variance",right:true,render:r=>{const v=r.actual-r.forecast;return<span style={{color:v>=0?C.success:C.danger,fontWeight:600}}>{v>=0?"+":""}{fmtN(v)}</span>;}},
      {key:"real",label:"Realization",right:true,render:r=>{const rl=r.forecast>0?r.actual/r.forecast*100:0;return<Badge color={rl>=90?"green":rl>=75?"amber":"red"}>{pct(rl)}</Badge>;}},
    ]} rows={rows} emptyMsg="No forecast data."/>
  );

  return(
    <div>
      <SectionHeader title="Forecast" sub="Revenue forecast entries by service line — planned revenue only"
        action={<Btn size="sm" onClick={()=>{setForm(blankFc());setErrors({});setShowAdd(true);}}>+ Add Forecast Entry</Btn>}/>
      <Alert type="info">Forecast entries represent planned revenue. Actuals come from invoices only. One entry per month per service line per version.</Alert>

      {forecasts.length===0&&<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>📊</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No forecast entries yet</div><div style={{fontSize:13,marginBottom:20}}>Add monthly forecast entries. Service lines can also create forecast entries during creation.</div>{serviceLines.length===0&&<Alert type="warning">Create service lines first.</Alert>}{serviceLines.length>0&&<Btn onClick={()=>{setForm(blankFc());setErrors({});setShowAdd(true);}}>+ Add First Forecast Entry</Btn>}</div></Card>}

      {forecasts.length>0&&<>
        <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:20,marginBottom:24}}>
          <Card style={{padding:0}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:12,color:C.textSub,textTransform:"uppercase"}}>Service Lines ({serviceLines.length})</div>
            <div style={{overflowY:"auto",maxHeight:500}}>
              {serviceLines.map(sl=>{
                const fc=getSlForecasts(sl.id,"Current");
                const t=fc.reduce((s,f)=>s+(f.forecastAmount||0),0);
                return<div key={sl.id} onClick={()=>setSelectedSl(sl.id)} style={{padding:"10px 16px",cursor:"pointer",borderLeft:selectedSl===sl.id?`3px solid ${C.primary}`:"3px solid transparent",background:selectedSl===sl.id?C.primaryLight:"transparent",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{fontSize:13,fontWeight:600}}>{sl.service}</div>
                  <div style={{fontSize:11,color:C.textMuted}}>{sl.customerName} · {sl.commercialType}</div>
                  <div style={{fontSize:11,color:t>0?C.primary:C.danger,marginTop:2}}>{t>0?`${sl.currency} ${fmtN(t)} forecast`:"No forecast ⚠"}</div>
                </div>;
              })}
            </div>
          </Card>
          <div>
            {!selectedSl?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>←</div><div style={{fontSize:13}}>Select a service line to view/edit its forecast</div></div></Card>:<>
              <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{fontWeight:700,fontSize:16,flex:1}}>{displaySl?.service} <span style={{color:C.textSub,fontWeight:400,fontSize:13}}>· {displaySl?.customerName}</span></div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {FORECAST_VERSIONS.map(v=><button key={v} type="button" onClick={()=>setVersion(v)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${version===v?C.primary:C.border}`,background:version===v?C.primary:C.white,color:version===v?C.white:C.textSub,fontSize:11,fontWeight:600,cursor:"pointer"}}>{v}</button>)}
                </div>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
                <KpiCard label="Total Forecast" value={`${displaySl?.currency} ${fmtN(totalFc)}`} accent={C.primary}/>
                <KpiCard label="Total Actuals" value={`${displaySl?.currency} ${fmtN(totalAct)}`} accent={C.success}/>
                <KpiCard label="Realization" value={pct(real)} accent={real>=90?C.success:real>=75?C.warning:C.danger}/>
              </div>
              <Card style={{padding:0}}>
                <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:700}}>Entries — {version}</span>
                  <Btn size="sm" onClick={()=>{setForm(f=>({...blankFc(),serviceLineId:selectedSl,version}));setErrors({});setShowAdd(true);}}>+ Add Entry</Btn>
                </div>
                <Table cols={[
                  {key:"month",label:"Month",render:r=>{const m=YEAR_MONTHS.find(m=>m.value===r.month);return m?.label||r.month;}},
                  {key:"forecastAmount",label:`Forecast (${displaySl?.currency})`,right:true,render:r=><strong>{fmtN(r.forecastAmount)}</strong>},
                  {key:"actual",label:"Actual (from invoices)",right:true,render:r=>(
                    <input type="number" value={r.actual??""} onChange={e=>setActual(r.id,e.target.value)} placeholder="—"
                      style={{width:90,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 6px",textAlign:"right",fontSize:12,background:C.successBg}}/>
                  )},
                  {key:"variance",label:"Variance",right:true,render:r=>{if(r.actual==null)return"—";const v=r.actual-r.forecastAmount;return<span style={{color:v>=0?C.success:C.danger,fontWeight:600}}>{v>=0?"+":""}{fmtN(v)}</span>;}},
                  {key:"notes",label:"Notes",render:r=><span style={{fontSize:11,color:C.textSub}}>{r.notes||"—"}</span>},
                  {key:"actions",label:"",render:r=><button onClick={()=>deleteEntry(r.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:13}}>×</button>},
                ]} rows={slFc.sort((a,b)=>a.month.localeCompare(b.month))} emptyMsg="No entries for this version."/>
                {slFc.length>0&&<div style={{padding:"10px 14px",background:C.primaryLight,display:"flex",gap:24,fontSize:13,fontWeight:600}}>
                  <span>Forecast: <strong>{displaySl?.currency} {fmtN(totalFc)}</strong></span>
                  <span>Actuals: <strong>{displaySl?.currency} {fmtN(totalAct)}</strong></span>
                  <span style={{color:real>=90?C.success:real>=75?C.warning:C.danger}}>Realization: <strong>{pct(real)}</strong></span>
                </div>}
              </Card>
            </>}
          </div>
        </div>

        {/* Summary rollups */}
        <Card>
          <div style={{fontWeight:700,marginBottom:12,fontSize:16}}>Forecast Summary — All Versions</div>
          <Tabs tabs={[{key:"customer",label:"By Customer"},{key:"division",label:"By Division"},{key:"service",label:"By Service"}]} active={summaryTab} onChange={setSummaryTab}/>
          {summaryTab==="customer"&&<SummaryTable rows={summaryByCustomer} keyField="customer" keyLabel="Customer"/>}
          {summaryTab==="division"&&<SummaryTable rows={summaryByDivision} keyField="division" keyLabel="Division"/>}
          {summaryTab==="service"&&<SummaryTable rows={summaryByService} keyField="service" keyLabel="Service"/>}
        </Card>
      </>}

      <Modal open={showAdd} onClose={()=>{setShowAdd(false);setErrors({});}} title="Add Forecast Entry" width={560}>
        <Alert type="info">One entry per month per service line per version. Forecast amount must be ≥ 0. Actuals come from invoices.</Alert>
        <FormRow>
          <Select label="Service Line" required value={form.serviceLineId} onChange={v=>setForm(p=>({...p,serviceLineId:v}))} placeholder="Select service line" options={serviceLines.map(s=>({value:s.id,label:`${s.service} — ${s.customerName}`}))} error={errors.serviceLineId}/>
          <Select label="Month" required value={form.month} onChange={v=>setForm(p=>({...p,month:v}))} placeholder="Select month" options={YEAR_MONTHS.map(m=>({value:m.value,label:m.label}))} error={errors.month}/>
        </FormRow>
        <FormRow>
          <Select label="Version" value={form.version} onChange={v=>setForm(p=>({...p,version:v}))} options={FORECAST_VERSIONS.map(v=>({value:v,label:v}))}/>
          <Input label="Forecast Amount" required type="number" value={form.forecastAmount} onChange={v=>setForm(p=>({...p,forecastAmount:v}))} error={errors.forecastAmount} placeholder="Planned revenue (0 if none)"/>
        </FormRow>
        <Textarea label="Notes" value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Assumptions or notes…" rows={2}/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}><Btn variant="ghost" onClick={()=>{setShowAdd(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Entry</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INVOICES — Session C: keep Session B logic
// ═══════════════════════════════════════════════════════════════════════════
function Invoices({customers,contracts,serviceLines,invoices,setInvoices,setForecasts,forecasts,entities,taxRates}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [showCreditMemo,setShowCreditMemo]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blankInv());
  const [errors,setErrors]=useState({});
  const [lines,setLines]=useState([blankLine()]);
  const [cmForm,setCmForm]=useState({originalInvoiceId:"",reason:""});

  function blankInv(){return {customerId:"",customerName:"",customerAddress:"",contractId:"",contractName:"",freyrEntity:"",currency:"",paymentTerms:"",invoiceDate:today(),dueDate:"",billingPeriodStart:"",billingPeriodEnd:"",status:"Draft",taxId:"",notes:""};}
  function blankLine(){return {id:genId("IL"),serviceLineId:"",slName:"",service:"",commercialType:"",billingBasis:"",quantity:"",rate:"",amount:"",billingTrigger:""};}

  const activeCustomers=customers.filter(c=>c.status==="Active");
  const getContractsForCustomer=custId=>contracts.filter(c=>c.customerId===custId&&["Active","Draft"].includes(c.status));
  const getSLsForContract=contractId=>serviceLines.filter(s=>s.contractId===contractId);

  const lineTotal=lines.reduce((s,l)=>s+(parseFloat(l.amount)||0),0);
  const selectedTax=taxRates.find(t=>t.id===form.taxId);
  const taxAmount=selectedTax?(lineTotal*(selectedTax.percentage/100)):0;
  const grandTotal=lineTotal+taxAmount;
  const selectedEntity=entities.find(e=>e.name===form.freyrEntity);

  const validate=()=>{
    const e={};
    if(!form.customerId)e.customerId="Required";
    if(!form.contractId)e.contractId="Required";
    if(!form.invoiceDate)e.invoiceDate="Required";
    if(lines.every(l=>!l.amount||parseFloat(l.amount)<=0))e.lines="At least one line with amount > 0 required";
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const entity=entities.find(e=>e.name===form.freyrEntity);
    const invNum=entity?nextInvoiceNumber(entity.prefix):`INV-${Date.now()}`;
    const inv={...form,id:genId("INV"),invoiceNumber:invNum,createdAt:today(),
      lines:lines.filter(l=>l.amount&&parseFloat(l.amount)>0).map(l=>({...l,amount:parseFloat(l.amount)})),
      lineTotal,taxAmount,grandTotal,taxRate:selectedTax?.percentage||0,taxName:selectedTax?.name||"",odooSync:"Pending"};
    setInvoices(p=>[...p,inv]);
    inv.lines.forEach(line=>{
      if(line.serviceLineId&&form.invoiceDate){
        const month=form.invoiceDate.slice(0,7);
        setForecasts(p=>p.map(f=>{
          if(f.serviceLineId===line.serviceLineId&&f.month===month)return{...f,actual:(f.actual||0)+line.amount};
          return f;
        }));
      }
    });
    setShowNew(false);setForm(blankInv());setLines([blankLine()]);setErrors({});
  };

  const updateLine=(idx,field,val)=>{
    setLines(p=>p.map((l,i)=>{
      if(i!==idx)return l;
      const updated={...l,[field]:val};
      if(field==="serviceLineId"){
        const sl=serviceLines.find(s=>s.id===val);
        updated.slName=sl?.service||"";updated.commercialType=sl?.commercialType||"";updated.service=sl?.service||"";
      }
      if((field==="quantity"||field==="rate")&&updated.quantity&&updated.rate)updated.amount=String(parseFloat(updated.quantity)*parseFloat(updated.rate));
      return updated;
    }));
  };

  const statusColor=s=>s==="Paid"?"green":s==="Active"?"blue":s==="Cancelled"?"gray":"amber";
  const filtered=invoices.filter(inv=>{
    const ms=inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase())||inv.customerName?.toLowerCase().includes(search.toLowerCase());
    return ms&&(filterStatus==="All"||inv.status===filterStatus);
  });

  const totalOutstanding=invoices.filter(i=>["Draft","Active"].includes(i.status)).reduce((s,i)=>s+(i.grandTotal||0),0);
  const totalPaid=invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+(i.grandTotal||0),0);

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Invoices" sub="Invoice management"
          action={<div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" size="sm" onClick={()=>setShowCreditMemo(true)}>+ Credit Memo</Btn>
            <Btn size="sm" onClick={()=>{if(!customers.length){alert("Create a customer first.");return;}setForm(blankInv());setLines([blankLine()]);setErrors({});setShowNew(true);}}>+ New Invoice</Btn>
          </div>}/>
        <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
          <KpiCard label="Outstanding" value={`$${fmtN(totalOutstanding)}`} sub="Draft + Active" accent={C.warning}/>
          <KpiCard label="Total Paid" value={`$${fmtN(totalPaid)}`} accent={C.success}/>
          <KpiCard label="Total Invoices" value={invoices.length} accent={C.primary}/>
          <KpiCard label="Pending Odoo Sync" value={invoices.filter(i=>i.odooSync==="Pending").length} accent={invoices.filter(i=>i.odooSync==="Pending").length>0?C.warning:C.success}/>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by invoice number or customer…" style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All",...INVOICE_STATUSES]} style={{width:150}}/>
        </div>
        {invoices.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>🧾</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No invoices yet</div>{customers.length===0&&<Alert type="warning">Create a customer and contract first.</Alert>}{customers.length>0&&<Btn onClick={()=>{setForm(blankInv());setLines([blankLine()]);setErrors({});setShowNew(true);}}>+ Create First Invoice</Btn>}</div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"invoiceNumber",label:"Invoice No.",render:r=><strong style={{fontFamily:"monospace"}}>{r.invoiceNumber}</strong>},
            {key:"customerName",label:"Customer"},
            {key:"freyrEntity",label:"Freyr Entity"},
            {key:"invoiceDate",label:"Date"},
            {key:"dueDate",label:"Due",render:r=>{
              if(!r.dueDate)return"—";
              const overdue=r.status!=="Paid"&&r.dueDate<today();
              return<span style={{color:overdue?C.danger:C.text,fontWeight:overdue?700:400}}>{r.dueDate}{overdue?" ⚠":""}</span>;
            }},
            {key:"grandTotal",label:"Total",right:true,render:r=><strong>{r.currency} {fmtN(r.grandTotal)}</strong>},
            {key:"status",label:"Status",render:r=><Badge color={statusColor(r.status)} dot>{r.status}</Badge>},
            {key:"odooSync",label:"Odoo",render:r=><Badge color={r.odooSync==="Synced"?"green":r.odooSync==="Failed"?"red":"amber"}>{r.odooSync}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setSelected(r);setView("detail");}}>View →</Btn>},
          ]} rows={filtered}/>
        </Card>}
      </>}

      {view==="detail"&&selected&&<div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
          <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:700,fontFamily:"monospace"}}>{selected.invoiceNumber}</h2><div style={{fontSize:13,color:C.textSub}}>{selected.customerName} · {selected.contractName}</div></div>
          <Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>
          <Badge color={selected.odooSync==="Synced"?"green":"amber"}>{selected.odooSync}</Badge>
        </div>
        <Card style={{marginBottom:20}}>
          <div style={{borderBottom:`2px solid ${C.primary}`,paddingBottom:16,marginBottom:16,display:"flex",justifyContent:"space-between"}}>
            <div><div style={{fontWeight:900,fontSize:22,color:C.primary}}>INVOICE</div><div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,marginTop:4}}>{selected.invoiceNumber}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:700,fontSize:15}}>{selected.freyrEntity}</div><div style={{fontSize:12,color:C.textSub,marginTop:4,maxWidth:200}}>{entities.find(e=>e.name===selected.freyrEntity)?.address||""}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:16}}>
            <div><div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Bill To</div><div style={{fontWeight:700}}>{selected.customerName}</div><div style={{fontSize:13,color:C.textSub,lineHeight:1.8}}>{selected.customerAddress}</div></div>
            <div>{[["Invoice Date",selected.invoiceDate],["Due Date",selected.dueDate||"—"],["Payment Terms",selected.paymentTerms||"—"],["Contract",selected.contractName]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"3px 0"}}><span style={{color:C.textSub}}>{l}:</span><strong>{v}</strong></div>
            ))}</div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,marginBottom:16}}>
            <thead><tr style={{background:C.primary}}>{["Service","Commercial Type","Billing Trigger","Qty","Rate","Amount"].map(h=><th key={h} style={{padding:"8px 12px",color:C.white,fontWeight:600,textAlign:h==="Amount"||h==="Qty"||h==="Rate"?"right":"left",fontSize:11}}>{h}</th>)}</tr></thead>
            <tbody>{(selected.lines||[]).map((l,i)=><tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.bg:C.white}}>
              <td style={{padding:"8px 12px",fontWeight:600}}>{l.slName||l.service}</td>
              <td style={{padding:"8px 12px"}}><Badge color="blue">{l.commercialType}</Badge></td>
              <td style={{padding:"8px 12px",fontSize:12,color:C.textSub}}>{l.billingTrigger||"—"}</td>
              <td style={{padding:"8px 12px",textAlign:"right"}}>{l.quantity||"—"}</td>
              <td style={{padding:"8px 12px",textAlign:"right"}}>{l.rate?`${selected.currency} ${fmtN(l.rate)}`:"—"}</td>
              <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700}}>{selected.currency} {fmtN(l.amount)}</td>
            </tr>)}</tbody>
            <tfoot>
              <tr><td colSpan={5} style={{padding:"8px 12px",textAlign:"right",fontWeight:600}}>Subtotal</td><td style={{padding:"8px 12px",textAlign:"right",fontWeight:700}}>{selected.currency} {fmtN(selected.lineTotal)}</td></tr>
              {selected.taxAmount>0&&<tr><td colSpan={5} style={{padding:"8px 12px",textAlign:"right",color:C.textSub}}>{selected.taxName} ({selected.taxRate}%)</td><td style={{padding:"8px 12px",textAlign:"right"}}>{selected.currency} {fmtN(selected.taxAmount)}</td></tr>}
              <tr style={{background:C.primaryLight}}><td colSpan={5} style={{padding:"10px 12px",textAlign:"right",fontWeight:700,fontSize:15}}>TOTAL</td><td style={{padding:"10px 12px",textAlign:"right",fontWeight:900,fontSize:15,color:C.primary}}>{selected.currency} {fmtN(selected.grandTotal)}</td></tr>
            </tfoot>
          </table>
          {selectedEntity?.bankName&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,fontSize:12,color:C.textSub}}>
            <div style={{fontWeight:700,marginBottom:4,color:C.text}}>Payment Details</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[["Bank",selectedEntity.bankName],["Account Name",selectedEntity.accountName],["Account No.",selectedEntity.accountNumber],["SWIFT",selectedEntity.swift||"—"],selectedEntity.iban&&["IBAN",selectedEntity.iban]].filter(Boolean).map(([l,v])=>(
                <div key={l}><div style={{fontWeight:600,color:C.text}}>{l}</div><div>{v}</div></div>
              ))}
            </div>
          </div>}
          {!selectedEntity?.bankName&&<Alert type="warning">Bank details not configured for {selected.freyrEntity}. Add them in Settings.</Alert>}
        </Card>
        <div style={{display:"flex",gap:8}}>
          {selected.status!=="Paid"&&selected.status!=="Cancelled"&&(<Btn variant="success" onClick={()=>{setInvoices(p=>p.map(i=>i.id===selected.id?{...i,status:"Paid",odooSync:"Synced"}:i));setSelected(p=>({...p,status:"Paid",odooSync:"Synced"}));}}>Mark as Paid</Btn>)}
          {selected.status==="Draft"&&(<Btn onClick={()=>{setInvoices(p=>p.map(i=>i.id===selected.id?{...i,status:"Active",odooSync:"Synced"}:i));setSelected(p=>({...p,status:"Active",odooSync:"Synced"}));}}>Submit Invoice</Btn>)}
          {selected.status!=="Cancelled"&&<Btn variant="danger" onClick={()=>{if(window.confirm("Cancel this invoice?")){setInvoices(p=>p.map(i=>i.id===selected.id?{...i,status:"Cancelled"}:i));setSelected(p=>({...p,status:"Cancelled"}));}}}>Cancel</Btn>}
        </div>
      </div>}

      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});}} title="New Invoice" width={900}>
        <FormSection title="Invoice Header">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            <Select label="Customer" required value={form.customerId} onChange={v=>{
              const c=customers.find(c=>c.id===v);
              const addr=[c?.addressLine1,c?.addressLine2,c?.city,c?.state,c?.zip,c?.country].filter(Boolean).join(", ");
              setForm(p=>({...p,customerId:v,customerName:c?.name||"",customerAddress:addr,contractId:"",contractName:"",freyrEntity:"",currency:"",paymentTerms:""}));
              setLines([blankLine()]);
            }} placeholder="Select customer" options={activeCustomers.map(c=>({value:c.id,label:c.name}))} error={errors.customerId}/>
            <Select label="Contract" required value={form.contractId} onChange={v=>{
              const c=contracts.find(c=>c.id===v);
              setForm(p=>({...p,contractId:v,contractName:c?.contractName||"",freyrEntity:c?.freyrEntity||"",currency:c?.currency||"",paymentTerms:c?.paymentTermsDisplay||c?.paymentTerms||""}));
              setLines([blankLine()]);
            }} placeholder="Select contract" options={getContractsForCustomer(form.customerId).map(c=>({value:c.id,label:c.contractName}))} error={errors.contractId} disabled={!form.customerId}/>
            <div><label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:4}}>Freyr Entity</label><div style={{padding:"7px 11px",border:`1.5px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.bg,color:form.freyrEntity?C.text:C.textMuted}}>{form.freyrEntity||"Auto-populated from contract"}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginTop:12}}>
            <Input label="Invoice Date" required type="date" value={form.invoiceDate} onChange={v=>{const due=calcDueDate(v,form.paymentTerms);setForm(p=>({...p,invoiceDate:v,dueDate:due}));}} error={errors.invoiceDate}/>
            <div><label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:4}}>Payment Terms</label><div style={{padding:"7px 11px",border:`1.5px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.bg}}>{form.paymentTerms||"—"}</div></div>
            <div><label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:4}}>Due Date <span style={{fontSize:11,color:C.textMuted}}>(auto)</span></label><div style={{padding:"7px 11px",border:`1.5px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.bg,fontWeight:form.dueDate?700:400,color:form.dueDate?C.primary:C.textMuted}}>{form.dueDate||"Set invoice date + contract"}</div></div>
          </div>
        </FormSection>
        <FormSection title="Invoice Lines">
          {errors.lines&&<Alert type="danger">{errors.lines}</Alert>}
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr>{["Service Line","Commercial Type","Billing Trigger","Qty","Rate","Amount",""].map(h=><th key={h} style={{padding:"6px 8px",background:C.bg,borderBottom:`1px solid ${C.border}`,textAlign:"left",fontWeight:600,color:C.textSub,fontSize:11}}>{h}</th>)}</tr></thead>
              <tbody>{lines.map((l,i)=>(
                <tr key={l.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"4px 6px",minWidth:200}}>
                    <select value={l.serviceLineId} onChange={e=>updateLine(i,"serviceLineId",e.target.value)} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:12,background:C.white}}>
                      <option value="">Select service line</option>
                      {getSLsForContract(form.contractId).map(s=><option key={s.id} value={s.id}>{s.service}</option>)}
                    </select>
                  </td>
                  <td style={{padding:"4px 6px",minWidth:110}}><input value={l.commercialType} readOnly style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11,background:C.bg}}/></td>
                  <td style={{padding:"4px 6px",minWidth:150}}><input value={l.billingTrigger} onChange={e=>updateLine(i,"billingTrigger",e.target.value)} placeholder="e.g. 50% signoff" style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11}}/></td>
                  <td style={{padding:"4px 6px",minWidth:70}}><input type="number" value={l.quantity} onChange={e=>updateLine(i,"quantity",e.target.value)} placeholder="—" style={{width:60,border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11,textAlign:"right"}}/></td>
                  <td style={{padding:"4px 6px",minWidth:80}}><input type="number" value={l.rate} onChange={e=>updateLine(i,"rate",e.target.value)} placeholder="—" style={{width:70,border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11,textAlign:"right"}}/></td>
                  <td style={{padding:"4px 6px",minWidth:100}}><input type="number" value={l.amount} onChange={e=>updateLine(i,"amount",e.target.value)} placeholder="0" style={{width:90,border:`1.5px solid ${C.primary}`,borderRadius:4,padding:"4px 6px",fontSize:12,fontWeight:600,textAlign:"right"}}/></td>
                  <td style={{padding:"4px 6px"}}>{lines.length>1&&<button onClick={()=>setLines(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:16}}>×</button>}</td>
                </tr>
              ))}</tbody>
              <tfoot>
                <tr><td colSpan={5} style={{padding:"8px",textAlign:"right",fontWeight:600,fontSize:12}}>Subtotal</td><td style={{padding:"8px",fontWeight:700}}>{form.currency||"—"} {fmtN(lineTotal)}</td><td/></tr>
                {taxAmount>0&&<tr><td colSpan={5} style={{padding:"4px 8px",textAlign:"right",color:C.textSub}}>{selectedTax?.name} ({selectedTax?.percentage}%)</td><td style={{padding:"4px 8px"}}>{form.currency} {fmtN(taxAmount)}</td><td/></tr>}
                <tr style={{background:C.primaryLight}}><td colSpan={5} style={{padding:"10px 8px",textAlign:"right",fontWeight:700}}>TOTAL</td><td style={{padding:"10px 8px",fontWeight:900,color:C.primary,fontSize:15}}>{form.currency||"—"} {fmtN(grandTotal)}</td><td/></tr>
              </tfoot>
            </table>
          </div>
          <div style={{marginTop:8}}><Btn variant="secondary" size="sm" onClick={()=>setLines(p=>[...p,blankLine()])}>+ Add Line</Btn></div>
        </FormSection>
        <FormSection title="Tax">
          <Select label="Tax Rate (optional)" value={form.taxId} onChange={v=>setForm(p=>({...p,taxId:v}))} placeholder="No tax" options={taxRates.filter(t=>t.active).map(t=>({value:t.id,label:`${t.name} — ${t.country} (${t.percentage}%)`}))}/>
        </FormSection>
        <FormSection title="Notes"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} rows={2}/></FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Invoice</Btn></div>
      </Modal>

      <Modal open={showCreditMemo} onClose={()=>setShowCreditMemo(false)} title="New Credit Memo" width={560}>
        <Alert type="info">Credit memos reference a specific original invoice.</Alert>
        <Select label="Original Invoice" required value={cmForm.originalInvoiceId} onChange={v=>setCmForm(p=>({...p,originalInvoiceId:v}))} placeholder="Select invoice" options={invoices.filter(i=>i.status!=="Cancelled").map(i=>({value:i.id,label:`${i.invoiceNumber} — ${i.customerName} (${i.currency} ${fmtN(i.grandTotal)})`}))}/>
        <div style={{marginBottom:12}}/>
        <Textarea label="Reason" required value={cmForm.reason} onChange={v=>setCmForm(p=>({...p,reason:v}))} placeholder="e.g. Billing error — hours overcounted" rows={2}/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
          <Btn variant="ghost" onClick={()=>setShowCreditMemo(false)}>Cancel</Btn>
          <Btn onClick={()=>{
            if(!cmForm.originalInvoiceId||!cmForm.reason){alert("Select an invoice and provide a reason.");return;}
            const orig=invoices.find(i=>i.id===cmForm.originalInvoiceId);
            const cm={id:genId("CM"),invoiceNumber:`CM-${orig.invoiceNumber}`,type:"Credit Memo",originalInvoiceId:cmForm.originalInvoiceId,customerName:orig.customerName,contractName:orig.contractName,freyrEntity:orig.freyrEntity,currency:orig.currency,invoiceDate:today(),reason:cmForm.reason,lines:orig.lines,lineTotal:-orig.lineTotal,taxAmount:-orig.taxAmount,grandTotal:-orig.grandTotal,taxRate:orig.taxRate,taxName:orig.taxName,status:"Active",odooSync:"Pending",createdAt:today()};
            setInvoices(p=>[...p,cm]);
            setCmForm({originalInvoiceId:"",reason:""});setShowCreditMemo(false);
          }}>Issue Credit Memo</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPLOYEES — kept from Session B
// ═══════════════════════════════════════════════════════════════════════════
function Employees({tags,users,employees,setEmployees}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blank());
  const [errors,setErrors]=useState({});

  function blank(){return {name:"",email:"",status:"Active",baseCountry:"",baseDivision:"",baseDepartment:"",reportingManager:""};}

  const countries=tags["Work Country"]||[];
  const divisions=tags["Division"]||[];
  const departments=tags["Department"]||[];
  const activeUsers=users.filter(u=>u.status==="Active");

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))e.email="Invalid email";
    if(!form.status)e.status="Required";
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    setEmployees(p=>[...p,{...form,id:genId("EMP"),createdAt:today()}]);
    setShowNew(false);setForm(blank());setErrors({});
  };

  const sc=s=>s==="Active"?"green":s==="Inactive"?"gray":s==="Notice"?"amber":"purple";
  const filtered=employees.filter(e=>{
    const ms=e.name.toLowerCase().includes(search.toLowerCase())||e.email?.toLowerCase().includes(search.toLowerCase());
    return ms&&(filterStatus==="All"||e.status===filterStatus);
  });

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Employees" sub={`${employees.filter(e=>e.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{setForm(blank());setErrors({});setShowNew(true);}}>+ New Employee</Btn>}/>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All",...EMP_STATUSES]} style={{width:150}}/>
        </div>
        {employees.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>👥</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No employees yet</div><Btn onClick={()=>{setForm(blank());setErrors({});setShowNew(true);}}>+ Add First Employee</Btn></div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"name",label:"Employee",render:r=><div><div style={{fontWeight:600}}>{r.name}</div>{r.email&&<div style={{fontSize:11,color:C.textMuted}}>{r.email}</div>}</div>},
            {key:"baseDivision",label:"Division",render:r=>r.baseDivision?<Badge color="blue">{r.baseDivision}</Badge>:"—"},
            {key:"baseDepartment",label:"Department",render:r=>r.baseDepartment||"—"},
            {key:"baseCountry",label:"Country",render:r=>r.baseCountry||"—"},
            {key:"reportingManager",label:"Manager",render:r=>r.reportingManager||"—"},
            {key:"status",label:"Status",render:r=><Badge color={sc(r.status)} dot>{r.status}</Badge>},
            {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setSelected(r);setView("detail");}}>View →</Btn>},
          ]} rows={filtered}/>
        </Card>}
      </>}
      {view==="detail"&&selected&&<div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
          <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.name}</h2>{selected.email&&<div style={{fontSize:13,color:C.textSub}}>{selected.email}</div>}</div>
          <Badge color={sc(selected.status)} dot>{selected.status}</Badge>
        </div>
        <Card>{[["Employee ID",<span style={{fontFamily:"monospace",fontSize:12}}>{selected.id}</span>],["Status",<Badge color={sc(selected.status)} dot>{selected.status}</Badge>],["Reporting Manager",selected.reportingManager||"—"],["Base Country",selected.baseCountry||"—"],["Base Division",selected.baseDivision?<Badge color="blue">{selected.baseDivision}</Badge>:"—"],["Base Department",selected.baseDepartment||"—"],["Created",selected.createdAt]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
        ))}</Card>
      </div>}
      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});}} title="New Employee" width={640}>
        <FormSection title="Employee Details">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Full Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. Alex Johnson"/></div>
            <Input label="Email Address" type="email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} error={errors.email} placeholder="e.g. alex@freyr.com"/>
            <Select label="Employment Status" required value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={EMP_STATUSES.map(s=>({value:s,label:s}))} error={errors.status}/>
          </div>
        </FormSection>
        <FormSection title="Home Base (optional)">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Select label="Base Country" value={form.baseCountry} onChange={v=>setForm(p=>({...p,baseCountry:v}))} placeholder="Select country" options={countries.map(c=>({value:c,label:c}))}/>
            <Select label="Base Division" value={form.baseDivision} onChange={v=>setForm(p=>({...p,baseDivision:v}))} placeholder="Select division" options={divisions.map(d=>({value:d,label:d}))}/>
            <div style={{gridColumn:"span 2"}}><Select label="Base Department" value={form.baseDepartment} onChange={v=>setForm(p=>({...p,baseDepartment:v}))} placeholder="Select department" options={departments.map(d=>({value:d,label:d}))}/></div>
          </div>
        </FormSection>
        <FormSection title="Reporting">
          <Select label="Reporting Manager" value={form.reportingManager} onChange={v=>setForm(p=>({...p,reportingManager:v}))} placeholder="Select (optional)" options={activeUsers.map(u=>({value:u.name,label:`${u.name} (${u.role})`}))} hint="Used as reviewer for monthly tag reviews"/>
        </FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Employee</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORTING DASHBOARD — Session C: new module, live data from all modules
// ═══════════════════════════════════════════════════════════════════════════
function Reporting({customers,contracts,projects,serviceLines,forecasts,invoices,employees,tags}){
  const [tab,setTab]=useState("overview");

  // KPIs
  const totalForecast=forecasts.reduce((s,f)=>s+(f.forecastAmount||0),0);
  const totalActuals=forecasts.reduce((s,f)=>s+(f.actual||0),0);
  const totalInvoiced=invoices.filter(i=>!["Cancelled"].includes(i.status)).reduce((s,i)=>s+(i.grandTotal||0),0);
  const totalPaid=invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+(i.grandTotal||0),0);
  const realization=totalForecast>0?totalActuals/totalForecast*100:0;

  // Forecast vs actuals by customer
  const byCustomer=useMemo(()=>{
    const map={};
    customers.forEach(c=>{map[c.id]={name:c.name,type:c.customerType,forecast:0,actual:0,invoiced:0};});
    forecasts.forEach(f=>{
      const sl=serviceLines.find(s=>s.id===f.serviceLineId);
      if(sl&&map[sl.customerId]){map[sl.customerId].forecast+=f.forecastAmount||0;map[sl.customerId].actual+=f.actual||0;}
    });
    invoices.filter(i=>i.status!=="Cancelled").forEach(inv=>{
      if(map[inv.customerId])map[inv.customerId].invoiced+=inv.grandTotal||0;
    });
    return Object.values(map).sort((a,b)=>b.forecast-a.forecast);
  },[customers,forecasts,serviceLines,invoices]);

  // By division
  const byDivision=useMemo(()=>{
    const map={};
    forecasts.forEach(f=>{
      const sl=serviceLines.find(s=>s.id===f.serviceLineId);
      const divs=sl?.division||["Unclassified"];
      divs.forEach(div=>{
        if(!map[div])map[div]={division:div,forecast:0,actual:0,slCount:0};
        map[div].forecast+=f.forecastAmount||0;
        map[div].actual+=f.actual||0;
      });
    });
    serviceLines.forEach(sl=>{(sl.division||["Unclassified"]).forEach(div=>{if(map[div])map[div].slCount++;});});
    return Object.values(map).sort((a,b)=>b.forecast-a.forecast);
  },[forecasts,serviceLines]);

  // By service
  const byService=useMemo(()=>{
    const map={};
    forecasts.forEach(f=>{
      const sl=serviceLines.find(s=>s.id===f.serviceLineId);
      const svc=sl?.service||"Unknown";
      if(!map[svc])map[svc]={service:svc,forecast:0,actual:0};
      map[svc].forecast+=f.forecastAmount||0;
      map[svc].actual+=f.actual||0;
    });
    return Object.values(map).sort((a,b)=>b.forecast-a.forecast);
  },[forecasts,serviceLines]);

  // Pipeline: contracts expiring in 60 days
  const expiring=contracts.filter(c=>{
    if(!c.endDate||c.status!=="Active")return false;
    const d=Math.ceil((new Date(c.endDate)-new Date())/(1000*60*60*24));
    return d>=0&&d<=60;
  }).sort((a,b)=>new Date(a.endDate)-new Date(b.endDate));

  // Service lines with no forecast
  const slNoForecast=serviceLines.filter(s=>forecasts.filter(f=>f.serviceLineId===s.id).length===0);

  // Commercial type mix
  const ctMix=useMemo(()=>{
    const map={};
    serviceLines.forEach(sl=>{
      if(!map[sl.commercialType])map[sl.commercialType]={type:sl.commercialType,count:0,forecast:0};
      map[sl.commercialType].count++;
      map[sl.commercialType].forecast+=forecasts.filter(f=>f.serviceLineId===sl.id).reduce((s,f)=>s+(f.forecastAmount||0),0);
    });
    return Object.values(map).sort((a,b)=>b.forecast-a.forecast);
  },[serviceLines,forecasts]);

  const SummaryRow=({label,value,sub,color=C.primary})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
      <div><div style={{fontSize:13,fontWeight:600}}>{label}</div>{sub&&<div style={{fontSize:11,color:C.textMuted}}>{sub}</div>}</div>
      <div style={{fontSize:14,fontWeight:700,color}}>{value}</div>
    </div>
  );

  return(
    <div>
      <SectionHeader title="Reporting Dashboard" sub="Live data from all modules — forecast vs actuals, pipeline, and operations"/>
      <Tabs tabs={[{key:"overview",label:"Overview"},{key:"customer",label:"By Customer"},{key:"division",label:"By Division"},{key:"service",label:"By Service"},{key:"pipeline",label:"Pipeline"}]} active={tab} onChange={setTab}/>

      {tab==="overview"&&<>
        <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
          <KpiCard label="Total Forecast" value={`$${fmtN(totalForecast)}`} sub="All service lines" accent={C.primary}/>
          <KpiCard label="Total Actuals" value={`$${fmtN(totalActuals)}`} sub="From forecast entries" accent={C.success}/>
          <KpiCard label="Realization" value={pct(realization)} sub="Actuals / Forecast" accent={realization>=90?C.success:realization>=75?C.warning:C.danger}/>
          <KpiCard label="Total Invoiced" value={`$${fmtN(totalInvoiced)}`} sub="Non-cancelled invoices" accent={C.primary}/>
          <KpiCard label="Total Collected" value={`$${fmtN(totalPaid)}`} sub="Paid invoices" accent={C.success}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <Card>
            <div style={{fontWeight:700,marginBottom:12}}>Platform Summary</div>
            <SummaryRow label="Active Customers" value={customers.filter(c=>c.status==="Active").length}/>
            <SummaryRow label="Active Contracts" value={contracts.filter(c=>c.status==="Active").length}/>
            <SummaryRow label="Active Projects" value={projects.filter(p=>p.status==="Active").length}/>
            <SummaryRow label="Active Service Lines" value={serviceLines.filter(s=>s.status==="Active").length}/>
            <SummaryRow label="Draft Service Lines" value={serviceLines.filter(s=>s.status==="Draft").length} color={C.warning}/>
            <SummaryRow label="SLs Without Forecast" value={slNoForecast.length} color={slNoForecast.length>0?C.danger:C.success}/>
            <SummaryRow label="Total Employees" value={employees.filter(e=>e.status==="Active").length}/>
          </Card>
          <Card>
            <div style={{fontWeight:700,marginBottom:12}}>Commercial Type Mix</div>
            {ctMix.length===0?<div style={{textAlign:"center",padding:"30px",color:C.textMuted,fontSize:13}}>No service lines yet.</div>:
            ctMix.map(r=>(
              <div key={r.type} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                  <span style={{fontWeight:600}}>{r.type}</span>
                  <span style={{color:C.textSub}}>{r.count} SL{r.count!==1?"s":""} · ${fmtN(r.forecast)}</span>
                </div>
                <div style={{height:6,background:C.bg,borderRadius:3}}>
                  <div style={{height:6,borderRadius:3,background:C.primary,width:`${totalForecast>0?Math.min(100,r.forecast/totalForecast*100):0}%`}}/>
                </div>
              </div>
            ))}
          </Card>
        </div>
        {slNoForecast.length>0&&<Card style={{marginTop:20}}>
          <div style={{fontWeight:700,marginBottom:12,color:C.danger}}>⚠ Service Lines Without Forecast ({slNoForecast.length})</div>
          <Table cols={[
            {key:"service",label:"Service",render:r=><strong>{r.service}</strong>},
            {key:"customerName",label:"Customer"},
            {key:"projectName",label:"Project"},
            {key:"commercialType",label:"Commercial Type",render:r=><Badge color="blue">{r.commercialType}</Badge>},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Draft"?"blue":"amber"} dot>{r.status}</Badge>},
          ]} rows={slNoForecast}/>
        </Card>}
      </>}

      {tab==="customer"&&<Card style={{padding:0}}>
        <Table cols={[
          {key:"name",label:"Customer",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><Badge color="blue">{r.type}</Badge></div>},
          {key:"forecast",label:"Forecast (USD)",right:true,render:r=><strong>${fmtN(r.forecast)}</strong>},
          {key:"actual",label:"Actuals (USD)",right:true,render:r=>`$${fmtN(r.actual)}`},
          {key:"invoiced",label:"Invoiced (USD)",right:true,render:r=>`$${fmtN(r.invoiced)}`},
          {key:"variance",label:"Variance",right:true,render:r=>{const v=r.actual-r.forecast;return<span style={{color:v>=0?C.success:C.danger,fontWeight:600}}>{v>=0?"+":""}{fmtN(v)}</span>;}},
          {key:"real",label:"Realization",right:true,render:r=>{const rl=r.forecast>0?r.actual/r.forecast*100:0;return<Badge color={rl>=90?"green":rl>=75?"amber":"red"}>{pct(rl)}</Badge>;}},
        ]} rows={byCustomer} emptyMsg="No data available."/>
      </Card>}

      {tab==="division"&&<Card style={{padding:0}}>
        <Table cols={[
          {key:"division",label:"Division",render:r=><strong>{r.division}</strong>},
          {key:"slCount",label:"Service Lines",right:true},
          {key:"forecast",label:"Forecast (USD)",right:true,render:r=><strong>${fmtN(r.forecast)}</strong>},
          {key:"actual",label:"Actuals (USD)",right:true,render:r=>`$${fmtN(r.actual)}`},
          {key:"variance",label:"Variance",right:true,render:r=>{const v=r.actual-r.forecast;return<span style={{color:v>=0?C.success:C.danger,fontWeight:600}}>{v>=0?"+":""}{fmtN(v)}</span>;}},
          {key:"real",label:"Realization",right:true,render:r=>{const rl=r.forecast>0?r.actual/r.forecast*100:0;return<Badge color={rl>=90?"green":rl>=75?"amber":"red"}>{pct(rl)}</Badge>;}},
        ]} rows={byDivision} emptyMsg="No data. Add division tags to service lines."/>
      </Card>}

      {tab==="service"&&<Card style={{padding:0}}>
        <Table cols={[
          {key:"service",label:"Service",render:r=><strong>{r.service}</strong>},
          {key:"forecast",label:"Forecast (USD)",right:true,render:r=><strong>${fmtN(r.forecast)}</strong>},
          {key:"actual",label:"Actuals (USD)",right:true,render:r=>`$${fmtN(r.actual)}`},
          {key:"variance",label:"Variance",right:true,render:r=>{const v=r.actual-r.forecast;return<span style={{color:v>=0?C.success:C.danger,fontWeight:600}}>{v>=0?"+":""}{fmtN(v)}</span>;}},
          {key:"real",label:"Realization",right:true,render:r=>{const rl=r.forecast>0?r.actual/r.forecast*100:0;return<Badge color={rl>=90?"green":rl>=75?"amber":"red"}>{pct(rl)}</Badge>;}},
        ]} rows={byService} emptyMsg="No data available."/>
      </Card>}

      {tab==="pipeline"&&<>
        <Card style={{marginBottom:20}}>
          <div style={{fontWeight:700,marginBottom:12}}>Contracts Expiring Within 60 Days</div>
          {expiring.length===0?<div style={{textAlign:"center",padding:"30px",color:C.textMuted,fontSize:13}}>No contracts expiring within 60 days.</div>:
          <Table cols={[
            {key:"contractName",label:"Contract",render:r=><strong>{r.contractName}</strong>},
            {key:"customerName",label:"Customer"},
            {key:"accountOwner",label:"Account Owner"},
            {key:"value",label:"Value",right:true,render:r=>`${r.currency} ${fmtN(r.value)}`},
            {key:"endDate",label:"Expires",render:r=>{
              const d=Math.ceil((new Date(r.endDate)-new Date())/(1000*60*60*24));
              return<span style={{color:d<=30?C.danger:C.warning,fontWeight:700}}>{r.endDate} ({d}d left)</span>;
            }},
            {key:"status",label:"Status",render:r=><Badge color="amber" dot>{r.status}</Badge>},
          ]} rows={expiring}/>}
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Invoice Collection Status</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {[["Draft",C.textMuted],["Active",C.primary],["Paid",C.success],["Cancelled",C.danger]].map(([s,color])=>{
              const invs=invoices.filter(i=>i.status===s);
              const total=invs.reduce((sum,i)=>sum+(i.grandTotal||0),0);
              return<div key={s} style={{padding:16,background:C.bg,borderRadius:8,textAlign:"center"}}>
                <div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>{s}</div>
                <div style={{fontSize:20,fontWeight:700,color}}>{invs.length}</div>
                <div style={{fontSize:12,color:C.textSub,marginTop:2}}>${fmtN(total)}</div>
              </div>;
            })}
          </div>
        </Card>
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAG REVIEWS — Session C: monthly project + employee reviews
// ═══════════════════════════════════════════════════════════════════════════
function TagReviews({projects,employees,users,tags}){
  const [tab,setTab]=useState("projects");
  const [reviewMonth,setReviewMonth]=useState(YEAR_MONTHS.find(m=>m.value===today().slice(0,7))?.value||YEAR_MONTHS[12].value);
  const [reviews,setReviews]=useState({});
  const [showReview,setShowReview]=useState(null);
  const [reviewForm,setReviewForm]=useState({status:"",notes:""});

  const key=(type,id)=>`${type}-${id}-${reviewMonth}`;

  const getReview=(type,id)=>reviews[key(type,id)]||null;

  const saveReview=()=>{
    setReviews(p=>({...p,[key(showReview.type,showReview.id)]:{...reviewForm,reviewedAt:today(),reviewedBy:"Sarah Chen"}}));
    setShowReview(null);setReviewForm({status:"",notes:""});
  };

  const ReviewStatus=({type,id})=>{
    const r=getReview(type,id);
    return r?<Badge color={r.status==="Approved"?"green":r.status==="Flagged"?"red":"amber"} dot>{r.status}</Badge>:<Badge color="gray">Pending</Badge>;
  };

  return(
    <div>
      <SectionHeader title="Tag Reviews" sub="Monthly review cycle for project tags and employee tags"/>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
        <Select label="" value={reviewMonth} onChange={setReviewMonth} options={YEAR_MONTHS.map(m=>({value:m.value,label:m.label}))} style={{width:180}}/>
        <div style={{fontSize:13,color:C.textSub}}>Reviewing tags for: <strong>{YEAR_MONTHS.find(m=>m.value===reviewMonth)?.label}</strong></div>
      </div>
      <Alert type="info">Reviewers are Delivery Owners for project reviews and Reporting Managers for employee reviews. Reviews are monthly and track tag accuracy.</Alert>
      <Tabs tabs={[{key:"projects",label:`Project Reviews (${projects.length})`},{key:"employees",label:`Employee Reviews (${employees.length})`}]} active={tab} onChange={setTab}/>

      {tab==="projects"&&<Card style={{padding:0}}>
        <Table cols={[
          {key:"name",label:"Project",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.customerName} · {r.contractName}</div></div>},
          {key:"deliveryOwner",label:"Reviewer (Delivery Owner)"},
          {key:"tags",label:"Tags",render:r=>{
            const allTags=Object.entries(r.tags||{}).flatMap(([cat,vals])=>(Array.isArray(vals)?vals:[vals]).map(v=>`${cat}: ${v}`));
            return allTags.length>0?<div style={{fontSize:11,color:C.textSub}}>{allTags.slice(0,2).join(" · ")}{allTags.length>2?` +${allTags.length-2} more`:""}</div>:<span style={{color:C.textMuted,fontSize:11}}>No tags</span>;
          }},
          {key:"status",label:"Review Status",render:r=><ReviewStatus type="project" id={r.id}/>},
          {key:"actions",label:"",render:r=><Btn size="sm" variant={getReview("project",r.id)?"ghost":"primary"} onClick={()=>{const rv=getReview("project",r.id);setReviewForm({status:rv?.status||"",notes:rv?.notes||""});setShowReview({type:"project",id:r.id,name:r.name,tags:r.tags||{}});}}>
            {getReview("project",r.id)?"Edit Review":"Start Review"}
          </Btn>},
        ]} rows={projects} emptyMsg="No projects to review."/>
      </Card>}

      {tab==="employees"&&<Card style={{padding:0}}>
        <Table cols={[
          {key:"name",label:"Employee",render:r=><div><div style={{fontWeight:600}}>{r.name}</div>{r.email&&<div style={{fontSize:11,color:C.textMuted}}>{r.email}</div>}</div>},
          {key:"reportingManager",label:"Reviewer (Reporting Manager)",render:r=>r.reportingManager||<span style={{color:C.textMuted}}>Not assigned</span>},
          {key:"tags",label:"Tags",render:r=>{
            const t=[r.baseDivision&&`Division: ${r.baseDivision}`,r.baseDepartment&&`Dept: ${r.baseDepartment}`,r.baseCountry&&`Country: ${r.baseCountry}`].filter(Boolean);
            return t.length>0?<div style={{fontSize:11,color:C.textSub}}>{t.join(" · ")}</div>:<span style={{color:C.textMuted,fontSize:11}}>No tags</span>;
          }},
          {key:"status",label:"Review Status",render:r=><ReviewStatus type="employee" id={r.id}/>},
          {key:"actions",label:"",render:r=><Btn size="sm" variant={getReview("employee",r.id)?"ghost":"primary"} onClick={()=>{const rv=getReview("employee",r.id);setReviewForm({status:rv?.status||"",notes:rv?.notes||""});setShowReview({type:"employee",id:r.id,name:r.name});}}>
            {getReview("employee",r.id)?"Edit Review":"Start Review"}
          </Btn>},
        ]} rows={employees} emptyMsg="No employees to review."/>
      </Card>}

      <Modal open={!!showReview} onClose={()=>setShowReview(null)} title={`Review — ${showReview?.name}`} width={520}>
        <div style={{marginBottom:12,padding:12,background:C.bg,borderRadius:6,fontSize:13,color:C.textSub}}>
          <strong>Month:</strong> {YEAR_MONTHS.find(m=>m.value===reviewMonth)?.label} · <strong>Type:</strong> {showReview?.type==="project"?"Project":"Employee"} tag review
        </div>
        {showReview?.tags&&Object.keys(showReview.tags).length>0&&<div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:8}}>CURRENT TAGS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {Object.entries(showReview.tags).map(([cat,vals])=>(Array.isArray(vals)?vals:[vals]).map(v=><Badge key={`${cat}-${v}`} color="blue">{cat}: {v}</Badge>))}
          </div>
        </div>}
        <FormSection title="Review Decision">
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {["Approved","Flagged","Needs Update"].map(s=>(
              <button key={s} type="button" onClick={()=>setReviewForm(p=>({...p,status:s}))} style={{padding:"8px 16px",borderRadius:8,border:`2px solid ${reviewForm.status===s?C.primary:C.border}`,background:reviewForm.status===s?C.primary:C.white,color:reviewForm.status===s?C.white:C.textSub,fontWeight:600,cursor:"pointer",fontSize:12}}>{s}</button>
            ))}
          </div>
          <Textarea label="Review Notes" value={reviewForm.notes} onChange={v=>setReviewForm(p=>({...p,notes:v}))} placeholder="Any observations, corrections, or flags…" rows={3}/>
        </FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={()=>setShowReview(null)}>Cancel</Btn>
          <Btn onClick={saveReview} disabled={!reviewForm.status}>Save Review</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT — Session C: user list, role display, invite user
// ═══════════════════════════════════════════════════════════════════════════
function UserManagement({users,setUsers}){
  const [showInvite,setShowInvite]=useState(false);
  const [search,setSearch]=useState("");
  const [form,setForm]=useState({name:"",email:"",role:"Delivery Owner"});
  const [errors,setErrors]=useState({});

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    if(!form.email.trim())e.email="Required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))e.email="Invalid email format";
    else if(users.some(u=>u.email.toLowerCase()===form.email.toLowerCase()))e.email="Email already in use";
    if(!form.role)e.role="Required";
    setErrors(e);return Object.keys(e).length===0;
  };

  const invite=()=>{
    if(!validate())return;
    setUsers(p=>[...p,{...form,id:genId("USR"),status:"Active",createdAt:today()}]);
    setShowInvite(false);setForm({name:"",email:"",role:"Delivery Owner"});setErrors({});
  };

  const toggleStatus=(id)=>setUsers(p=>p.map(u=>u.id===id?{...u,status:u.status==="Active"?"Inactive":"Active"}:u));

  const filtered=users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())||u.role.toLowerCase().includes(search.toLowerCase()));

  const roleColor=role=>role==="Admin"?"red":role==="Leadership"?"purple":role==="Division Head"?"amber":role==="Portfolio Head"?"blue":"gray";

  return(
    <div>
      <SectionHeader title="User Management" sub={`${users.filter(u=>u.status==="Active").length} active users`}
        action={<Btn size="sm" onClick={()=>{setForm({name:"",email:"",role:"Delivery Owner"});setErrors({});setShowInvite(true);}}>+ Invite User</Btn>}/>
      <Alert type="info">User roles control what each user can access and edit across Freyr Pulse. In this prototype, role restrictions are displayed but not enforced.</Alert>
      <div style={{marginBottom:16}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email, or role…" style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
      </div>
      <Card style={{padding:0}}>
        <Table cols={[
          {key:"name",label:"User",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.email}</div></div>},
          {key:"role",label:"Role",render:r=><Badge color={roleColor(r.role)}>{r.role}</Badge>},
          {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"gray"} dot>{r.status}</Badge>},
          {key:"scope",label:"Scope",render:r=>{
            const scopes={
              "Delivery Owner":"Own projects & service lines",
              "Portfolio Head":"All projects across portfolio",
              "Division Head":"All projects in division",
              "Admin":"Full platform access",
              "Leadership":"Read-only all modules",
            };
            return<span style={{fontSize:12,color:C.textSub}}>{scopes[r.role]||"—"}</span>;
          }},
          {key:"actions",label:"",render:r=><div style={{display:"flex",gap:6}}>
            <Btn size="sm" variant="ghost" onClick={()=>toggleStatus(r.id)}>{r.status==="Active"?"Deactivate":"Activate"}</Btn>
          </div>},
        ]} rows={filtered}/>
      </Card>
      <Modal open={showInvite} onClose={()=>setShowInvite(false)} title="Invite User" width={480}>
        <Alert type="info">In production, an invitation email would be sent. In this prototype, the user is added directly.</Alert>
        <FormRow>
          <Input label="Full Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. Alice Johnson"/>
          <Input label="Email Address" required type="email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} error={errors.email} placeholder="e.g. alice@freyr.com"/>
        </FormRow>
        <Select label="Role" required value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} options={USER_ROLES.map(r=>({value:r,label:r}))} error={errors.role}/>
        <div style={{marginTop:12,padding:12,background:C.bg,borderRadius:6,fontSize:12,color:C.textSub}}>
          {form.role==="Delivery Owner"&&"Can create and edit their own projects, service lines, and forecast entries."}
          {form.role==="Portfolio Head"&&"Can view and edit all projects and service lines across the portfolio."}
          {form.role==="Division Head"&&"Can view all projects within their division."}
          {form.role==="Admin"&&"Full access to all modules including Settings, Tag Master, and User Management."}
          {form.role==="Leadership"&&"Read-only access to all modules for reporting and oversight."}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
          <Btn variant="ghost" onClick={()=>setShowInvite(false)}>Cancel</Btn>
          <Btn onClick={invite}>Invite User</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD — Session C: live data from all modules
// ═══════════════════════════════════════════════════════════════════════════
function Dashboard({customers,contracts,projects,serviceLines,forecasts,invoices,employees,onNav}){
  const activeC=customers.filter(c=>c.status==="Active").length;
  const activeCont=contracts.filter(c=>c.status==="Active").length;
  const activeP=projects.filter(p=>p.status==="Active").length;
  const activeSL=serviceLines.filter(s=>s.status==="Active").length;
  const draftSL=serviceLines.filter(s=>s.status==="Draft").length;
  const noFcSL=serviceLines.filter(s=>s.status==="Draft"&&forecasts.filter(f=>f.serviceLineId===s.id).length===0).length;
  const totalFc=forecasts.reduce((s,f)=>s+(f.forecastAmount||0),0);
  const totalAct=forecasts.reduce((s,f)=>s+(f.actual||0),0);
  const invOutstanding=invoices.filter(i=>["Draft","Active"].includes(i.status)).reduce((s,i)=>s+(i.grandTotal||0),0);
  const expiring=contracts.filter(c=>{if(!c.endDate||c.status!=="Active")return false;const d=Math.ceil((new Date(c.endDate)-new Date())/(1000*60*60*24));return d>=0&&d<=30;}).length;
  const isEmpty=customers.length===0;

  return(
    <div>
      <SectionHeader title="Platform Overview" sub="Freyr Pulse — Session C"/>
      {isEmpty&&<Card style={{marginBottom:20,background:"linear-gradient(135deg,#0C1F3D,#1a3a6b)",border:"none"}}>
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:48,marginBottom:12}}>🚀</div>
          <div style={{color:"#fff",fontWeight:700,fontSize:20,marginBottom:8}}>Welcome to Freyr Pulse</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:14,marginBottom:24}}>Start by configuring Tags and Settings, then add your first customer.</div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <Btn onClick={()=>onNav("tags")} style={{background:"#fff",color:C.primary}}>1. Configure Tags</Btn>
            <Btn onClick={()=>onNav("settings")} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)"}}>2. Set Up Entities</Btn>
            <Btn onClick={()=>onNav("customers")} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)"}}>3. Add Customers</Btn>
          </div>
        </div>
      </Card>}
      <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
        <KpiCard label="Active Customers" value={activeC} accent={C.primary}/>
        <KpiCard label="Active Contracts" value={activeCont} accent={C.success}/>
        <KpiCard label="Active Projects" value={activeP} accent={C.primary}/>
        <KpiCard label="Active Service Lines" value={activeSL} sub={draftSL>0?`${draftSL} draft`:""} accent={C.success}/>
        <KpiCard label="Total Forecast" value={`$${fmtN(totalFc)}`} accent={C.primary}/>
        <KpiCard label="Outstanding Invoices" value={`$${fmtN(invOutstanding)}`} accent={C.warning}/>
      </div>
      {noFcSL>0&&<Alert type="warning">{noFcSL} draft service line{noFcSL>1?"s":""} with no forecast. <button onClick={()=>onNav("forecast")} style={{background:"none",border:"none",color:C.warning,cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>Add forecasts →</button></Alert>}
      {expiring>0&&<Alert type="warning">{expiring} contract{expiring>1?"s":""} expiring within 30 days. <button onClick={()=>onNav("contracts")} style={{background:"none",border:"none",color:C.warning,cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>View contracts →</button></Alert>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Recent Customers</div>
          {customers.length===0?<div style={{textAlign:"center",padding:"30px 0",color:C.textMuted,fontSize:13}}><button onClick={()=>onNav("customers")} style={{background:"none",border:"none",color:C.primary,cursor:"pointer",fontWeight:600}}>Add first customer →</button></div>:
          <Table cols={[
            {key:"name",label:"Customer",render:r=><strong>{r.name}</strong>},
            {key:"customerType",label:"Type",render:r=><Badge color="blue">{r.customerType}</Badge>},
            {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"gray"} dot>{r.status}</Badge>},
          ]} rows={[...customers].reverse().slice(0,5)}/>}
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Forecast vs Actuals</div>
          {forecasts.length===0?<div style={{textAlign:"center",padding:"30px 0",color:C.textMuted,fontSize:13}}><button onClick={()=>onNav("forecast")} style={{background:"none",border:"none",color:C.primary,cursor:"pointer",fontWeight:600}}>Add forecast entries →</button></div>:
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}><span>Total Forecast</span><strong>${fmtN(totalFc)}</strong></div>
            <div style={{height:8,background:C.bg,borderRadius:4,marginBottom:12}}><div style={{height:8,borderRadius:4,background:C.primary,width:"100%"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}><span>Total Actuals</span><strong style={{color:C.success}}>${fmtN(totalAct)}</strong></div>
            <div style={{height:8,background:C.bg,borderRadius:4,marginBottom:12}}><div style={{height:8,borderRadius:4,background:C.success,width:`${Math.min(100,totalFc>0?totalAct/totalFc*100:0)}%`}}/></div>
            <div style={{fontSize:13,color:C.textSub,textAlign:"right"}}>Realization: <strong style={{color:totalFc>0&&totalAct/totalFc>=0.9?C.success:C.warning}}>{pct(totalFc>0?totalAct/totalFc*100:0)}</strong></div>
          </div>}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP ROOT — Session C
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("dashboard");
  const [pageParams,setPageParams]=useState({});
  const [collapsed,setCollapsed]=useState(false);

  const [tags,setTags]=useState(INITIAL_TAGS);
  const [entities,setEntities]=useState(INITIAL_ENTITIES);
  const [taxRates,setTaxRates]=useState([]);
  const [users,setUsers]=useState(INITIAL_USERS);
  const [customers,setCustomers]=useState([]);
  const [contracts,setContracts]=useState([]);
  const [projects,setProjects]=useState([]);
  const [serviceLines,setServiceLines]=useState([]);
  const [forecasts,setForecasts]=useState([]);
  const [invoices,setInvoices]=useState([]);
  const [employees,setEmployees]=useState([]);

  const navigate=(key,params={})=>{setPage(key);setPageParams(params);};

  const groups=[...new Set(NAV.map(n=>n.group))];
  const noFcCount=serviceLines.filter(s=>s.status==="Draft"&&forecasts.filter(f=>f.serviceLineId===s.id).length===0).length;

  const renderPage=()=>{
    if(page==="dashboard")return<Dashboard customers={customers} contracts={contracts} projects={projects} serviceLines={serviceLines} forecasts={forecasts} invoices={invoices} employees={employees} onNav={navigate}/>;
    if(page==="tags")return<TagMaster tags={tags} setTags={setTags}/>;
    if(page==="settings")return<Settings entities={entities} setEntities={setEntities} taxRates={taxRates} setTaxRates={setTaxRates}/>;
    if(page==="customers")return<Customers tags={tags} users={users} customers={customers} setCustomers={setCustomers} contracts={contracts} projects={projects} onNav={navigate}/>;
    if(page==="contracts")return<Contracts tags={tags} users={users} customers={customers} contracts={contracts} setContracts={setContracts} entities={entities} projects={projects} serviceLines={serviceLines} onNav={navigate} filterCustomerId={pageParams.filterCustomerId}/>;
    if(page==="projects")return<Projects tags={tags} users={users} customers={customers} contracts={contracts} projects={projects} setProjects={setProjects} serviceLines={serviceLines} onNav={navigate}/>;
    if(page==="service-lines")return<ServiceLines tags={tags} users={users} customers={customers} contracts={contracts} projects={projects} serviceLines={serviceLines} setServiceLines={setServiceLines} forecasts={forecasts} setForecasts={setForecasts} onNav={navigate} filterProjectId={pageParams.filterProjectId}/>;
    if(page==="forecast")return<Forecast serviceLines={serviceLines} forecasts={forecasts} setForecasts={setForecasts}/>;
    if(page==="invoices")return<Invoices customers={customers} contracts={contracts} serviceLines={serviceLines} invoices={invoices} setInvoices={setInvoices} setForecasts={setForecasts} forecasts={forecasts} entities={entities} taxRates={taxRates}/>;
    if(page==="employees")return<Employees tags={tags} users={users} employees={employees} setEmployees={setEmployees}/>;
    if(page==="reporting")return<Reporting customers={customers} contracts={contracts} projects={projects} serviceLines={serviceLines} forecasts={forecasts} invoices={invoices} employees={employees} tags={tags}/>;
    if(page==="tag-reviews")return<TagReviews projects={projects} employees={employees} users={users} tags={tags}/>;
    if(page==="users")return<UserManagement users={users} setUsers={setUsers}/>;
    return null;
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.bg,color:C.text}}>
      <div style={{width:collapsed?56:230,background:C.sidebar,display:"flex",flexDirection:"column",transition:"width 0.2s",flexShrink:0,overflowX:"hidden"}}>
        <div style={{padding:collapsed?"16px 12px":"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(c=>!c)}>
          <div style={{width:30,height:30,background:C.primary,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontWeight:900,fontSize:13}}>FP</span></div>
          {!collapsed&&<span style={{color:"#fff",fontWeight:700,fontSize:15,whiteSpace:"nowrap"}}>Freyr Pulse</span>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {groups.map(group=>(
            <div key={group}>
              {!collapsed&&<div style={{padding:"10px 20px 3px",fontSize:10,fontWeight:700,color:"rgba(168,189,214,0.45)",textTransform:"uppercase",letterSpacing:1}}>{group}</div>}
              {NAV.filter(n=>n.group===group).map(n=>(
                <div key={n.key} onClick={()=>navigate(n.key)} title={collapsed?n.label:""}
                  style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"9px 13px":"8px 20px",cursor:"pointer",borderLeft:page===n.key?`3px solid ${C.primary}`:"3px solid transparent",background:page===n.key?"rgba(33,118,199,0.15)":"transparent",transition:"all 0.1s"}}>
                  <span style={{fontSize:14,flexShrink:0}}>{n.icon}</span>
                  {!collapsed&&<span style={{color:page===n.key?"#fff":C.sidebarText,fontWeight:page===n.key?600:400,fontSize:13,whiteSpace:"nowrap",flex:1}}>{n.label}</span>}
                  {!collapsed&&n.key==="service-lines"&&noFcCount>0&&<span style={{background:C.warning,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{noFcCount}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:collapsed?"12px":"12px 20px",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:C.primary,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontWeight:700,fontSize:12}}>SC</span></div>
          {!collapsed&&<div><div style={{color:"#fff",fontSize:12,fontWeight:600}}>Sarah Chen</div><div style={{color:C.sidebarText,fontSize:11}}>Admin</div></div>}
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:52,background:"#fff",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 24px",gap:16,flexShrink:0}}>
          <div style={{flex:1,display:"flex",gap:6,fontSize:13,color:C.textMuted}}>
            <span>Freyr Pulse</span><span>/</span><span style={{color:C.text,fontWeight:600}}>{NAV.find(n=>n.key===page)?.label||"Dashboard"}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:12,color:C.textMuted}}>{customers.length} customers · {contracts.length} contracts · {projects.length} projects · {serviceLines.length} service lines</span>
            <div style={{width:1,height:20,background:C.border}}/>
            <span style={{fontSize:12,color:C.textSub,fontWeight:600}}>Session C</span>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:28}}>{renderPage()}</div>
      </div>
    </div>
  );
}
