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
const isValidEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const currentYear = () => new Date().getFullYear();
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthsList = (year=2026) => MONTHS.map((m,i)=>({label:`${m} ${year}`,value:`${year}-${String(i+1).padStart(2,"0")}`}));
const ALL_MONTHS = monthsList(2026);

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
const COMMERCIAL_TYPES = ["Fixed Price","T&M Staffing","T&M Managed","Unit-Based","Recurring-Subscription"];
const BILLING_BASES = ["Upfront","Milestone","Monthly","Quarterly","Hourly","Daily","Per Unit","Per Slab","Annual","Ad hoc"];
const FORECAST_BASES = ["Milestone","Straight-line","Hours","Units","Slab","Override"];
const FORECAST_VERSIONS = ["Current","Reforecast 1","Reforecast 2","Reforecast 3"];
const INVOICE_STATUSES = ["Draft","Active","Cancelled","Paid"];
const PAYMENT_TERMS_OPTIONS = ["NET 30","NET 45","NET 60","NET 90","Custom"];
const EMP_STATUSES = ["Active","Inactive","Notice","Contractor"];
const CUSTOMER_STATUSES = ["Active","Inactive"];

// Invoice sequence counter (per entity prefix per year)
const invoiceSequences = {};
const nextInvoiceNumber = (prefix) => {
  const year = currentYear();
  const key = `${prefix}-${year}`;
  if(!invoiceSequences[key]) invoiceSequences[key] = 0;
  invoiceSequences[key]++;
  return `${prefix}${year}${String(invoiceSequences[key]).padStart(4,"0")}`;
};

// Add due date from payment terms
const calcDueDate = (invoiceDate, paymentTerms) => {
  if(!invoiceDate||!paymentTerms) return "";
  const days = parseInt(paymentTerms.replace(/[^0-9]/g,""))||30;
  const d = new Date(invoiceDate);
  d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
};

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
                    </div>:<span style={{color:C.textMuted,fontStyle:"italic",fontSize:12}}>Bank details not configured — add them so they appear on invoice footers.</span>}
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
          {taxRates.length===0&&<Card><div style={{textAlign:"center",padding:"40px 0",color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>🧾</div><div style={{fontWeight:600,marginBottom:4}}>No tax rates configured</div><div style={{fontSize:13}}>Add tax rates for the countries you invoice in.</div></div></Card>}
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
          {[["Platform","Freyr Pulse"],["Version","Session B"],["Deployment","Vercel"],["Repository","github.com/manojfreyr/freyr-pulse"],["Frontend","React (single file)"],["Backend","None — prototype"],["Data","Session only"],["Reporting Currency","USD"]].map(([l,v])=>(
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
        {taxForm.percentage&&<Alert type="info">At {taxForm.percentage}%, an invoice of $10,000 would have {taxForm.name||"tax"} of ${((parseFloat(taxForm.percentage)||0)/100*10000).toFixed(2)}.</Alert>}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>setShowNewTax(false)}>Cancel</Btn><Btn onClick={saveTax} disabled={!taxForm.name||!taxForm.country||!taxForm.percentage}>Save Tax Rate</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════════════════
function Customers({tags,users,customers,setCustomers,contracts}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blank());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");

  function blank(){return {name:"",addressLine1:"",addressLine2:"",city:"",state:"",zip:"",country:"",psaStart:"",psaEnd:"",customerType:"",accountOwner:"",status:"Active",notes:""};}

  const customerTypes=tags["Customer Type"]||[];
  const countries=tags["Work Country"]||[];
  const activeUsers=users.filter(u=>u.status==="Active");

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    else if(customers.some(c=>c.name.toLowerCase()===form.name.trim().toLowerCase()))e.name="Customer already exists";
    if(!form.addressLine1.trim())e.addressLine1="Required";
    if(!form.city.trim())e.city="Required";
    if(!form.state.trim())e.state="Required";
    if(!form.zip.trim())e.zip="Required";
    if(!form.country)e.country="Required";
    if(!form.customerType)e.customerType="Required";
    if(!form.accountOwner)e.accountOwner="Required";
    if(form.psaStart&&form.psaEnd&&form.psaStart>form.psaEnd)e.psaEnd="Must be on or after start date";
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    setCustomers(p=>[...p,{...form,id:genId("CUST"),createdAt:today(),name:form.name.trim()}]);
    setShowNew(false);setForm(blank());setErrors({});
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
    const mst=filterStatus==="All"||c.status===filterStatus;
    return ms&&mst;
  });

  const getCustContracts=id=>contracts.filter(k=>k.customerId===id);

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Customers" sub={`${customers.filter(c=>c.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{setForm(blank());setErrors({});setShowNew(true);}}>+ New Customer</Btn>}/>
        <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{flex:1,minWidth:200,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All","Active","Inactive"]} style={{width:130}}/>
        </div>
        {customers.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>🏢</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No customers yet</div><Btn onClick={()=>{setForm(blank());setErrors({});setShowNew(true);}}>+ Add First Customer</Btn></div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"id",label:"ID",render:r=><span style={{fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.id}</span>},
            {key:"name",label:"Customer",render:r=>{const w=psaWarning(r);return<div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.customerType} · {r.country}</div>{w&&<Badge color={w.type==="danger"?"red":"amber"}>{w.msg}</Badge>}</div>;}},
            {key:"accountOwner",label:"Account Owner"},
            {key:"contracts",label:"Contracts",right:true,render:r=><strong>{getCustContracts(r.id).length}</strong>},
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
                {key:"freyrEntity",label:"Freyr Entity"},
                {key:"currency",label:"CCY"},
                {key:"value",label:"Value",right:true,render:r=>r.value?`${r.currency} ${fmtN(r.value)}`:"—"},
                {key:"paymentTermsDisplay",label:"Terms"},
                {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="Draft"?"blue":"gray"} dot>{r.status}</Badge>},
                {key:"endDate",label:"End Date"},
              ]} rows={getCustContracts(selected.id)}/>}
            </Card>}
            {detailTab==="documents"&&<Card><UploadPlaceholder label="MSA / PSA Document"/></Card>}
          </div>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Account Details</div>
            {[["Customer ID",<span style={{fontFamily:"monospace",fontSize:11}}>{selected.id}</span>],["Account Owner",selected.accountOwner],["Customer Type",<Badge color="blue">{selected.customerType}</Badge>],["Status",<Badge color={selected.status==="Active"?"green":"gray"} dot>{selected.status}</Badge>],["Country",selected.country],["Created",selected.createdAt],["Contracts",getCustContracts(selected.id).length]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
            ))}
          </Card>
        </div>
      </div>}

      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});}} title="New Customer" width={720}>
        <FormSection title="Customer Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Customer Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. Johnson & Johnson"/></div>
            <Select label="Customer Type" required value={form.customerType} onChange={v=>setForm(p=>({...p,customerType:v}))} placeholder="Select type" options={customerTypes.map(t=>({value:t,label:t}))} error={errors.customerType}/>
            <Select label="Account Owner" required value={form.accountOwner} onChange={v=>setForm(p=>({...p,accountOwner:v}))} placeholder="Select user" options={activeUsers.map(u=>({value:u.name,label:`${u.name} (${u.role})`}))} error={errors.accountOwner}/>
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
            <Select label="Country" required value={form.country} onChange={v=>setForm(p=>({...p,country:v}))} placeholder="Select country" options={countries.map(c=>({value:c,label:c}))} error={errors.country}/>
          </div>
        </FormSection>
        <FormSection title="PSA / Master Agreement">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Input label="PSA Start Date" type="date" value={form.psaStart} onChange={v=>setForm(p=>({...p,psaStart:v}))}/>
            <Input label="PSA End Date" type="date" value={form.psaEnd} onChange={v=>setForm(p=>({...p,psaEnd:v}))} error={errors.psaEnd}/>
          </div>
        </FormSection>
        <FormSection title="Notes"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Additional notes…"/></FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Customer</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTRACTS
// ═══════════════════════════════════════════════════════════════════════════
function Contracts({tags,customers,contracts,setContracts,entities}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blank());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");

  function blank(){return {contractName:"",customerId:"",customerName:"",ref:"",startDate:"",endDate:"",value:"",currency:"USD",paymentTerms:"NET 30",customPaymentTerms:"",freyrEntity:"",status:"Draft",tags:{},notes:""};}

  const activeCustomers=customers.filter(c=>c.status==="Active");
  const activeEntities=entities.filter(e=>e.active);

  const validate=()=>{
    const e={};
    if(!form.contractName.trim())e.contractName="Required";
    if(!form.customerId)e.customerId="Required";
    if(!form.startDate)e.startDate="Required";
    if(!form.endDate)e.endDate="Required";
    if(form.startDate&&form.endDate&&form.startDate>form.endDate)e.endDate="End must be after start";
    if(!form.currency)e.currency="Required";
    if(!form.paymentTerms)e.paymentTerms="Required";
    if(form.paymentTerms==="Custom"&&!form.customPaymentTerms.trim())e.customPaymentTerms="Specify custom terms";
    if(!form.freyrEntity)e.freyrEntity="Required";
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const pt=form.paymentTerms==="Custom"?form.customPaymentTerms:form.paymentTerms;
    setContracts(p=>[...p,{...form,id:genId("CONT"),createdAt:today(),paymentTermsDisplay:pt,value:form.value?parseFloat(form.value):null}]);
    setShowNew(false);setForm(blank());setErrors({});
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
    return ms&&mst;
  });

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Contracts" sub={`${contracts.filter(c=>c.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{if(!customers.length){alert("Create a customer first.");return;}setForm(blank());setErrors({});setShowNew(true);}}>+ New Contract</Btn>}/>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All",...CONTRACT_STATUSES]} style={{width:150}}/>
        </div>
        {contracts.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>📋</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No contracts yet</div>{customers.length===0&&<Alert type="warning">Create a customer first.</Alert>}{customers.length>0&&<Btn onClick={()=>{setForm(blank());setErrors({});setShowNew(true);}}>+ Add First Contract</Btn>}</div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"id",label:"ID",render:r=><span style={{fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.id}</span>},
            {key:"contractName",label:"Contract",render:r=><div><div style={{fontWeight:600}}>{r.contractName}</div><div style={{fontSize:11,color:C.textMuted}}>{r.customerName}{r.ref?` · ${r.ref}`:""}</div>{expiryWarn(r)&&<Badge color={expiryWarn(r).type==="danger"?"red":"amber"}>{expiryWarn(r).msg}</Badge>}</div>},
            {key:"freyrEntity",label:"Freyr Entity"},
            {key:"currency",label:"CCY"},
            {key:"value",label:"Value",right:true,render:r=>r.value?`${r.currency} ${fmtN(r.value)}`:"—"},
            {key:"paymentTermsDisplay",label:"Terms"},
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
        </div>
        {expiryWarn(selected)&&<Alert type={expiryWarn(selected).type}>{expiryWarn(selected).msg} — End: {selected.endDate}</Alert>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            <Tabs tabs={[{key:"overview",label:"Overview"},{key:"documents",label:"Documents"}]} active={detailTab} onChange={setDetailTab}/>
            {detailTab==="overview"&&<Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <FormSection title="Commercial Terms">
                  {[["Currency",selected.currency],["Payment Terms",selected.paymentTermsDisplay||selected.paymentTerms],["Value",selected.value?`${selected.currency} ${fmtN(selected.value)}`:"Not specified"],["Freyr Entity",selected.freyrEntity]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><strong>{v}</strong></div>
                  ))}
                </FormSection>
                <FormSection title="Period">
                  {[["Start",selected.startDate],["End",selected.endDate],["Status",selected.status]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><strong>{v}</strong></div>
                  ))}
                </FormSection>
              </div>
              {selected.notes&&<div style={{marginTop:12,padding:12,background:C.bg,borderRadius:6,fontSize:13,color:C.textSub}}>{selected.notes}</div>}
            </Card>}
            {detailTab==="documents"&&<Card><UploadPlaceholder label="Contract Document"/></Card>}
          </div>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Contract Summary</div>
            {[["Contract ID",<span style={{fontFamily:"monospace",fontSize:11}}>{selected.id}</span>],["Customer",selected.customerName],["Freyr Entity",selected.freyrEntity],["Currency",selected.currency],["Value",selected.value?`${selected.currency} ${fmtN(selected.value)}`:"—"],["Terms",selected.paymentTermsDisplay||selected.paymentTerms],["Created",selected.createdAt]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600,textAlign:"right",maxWidth:160}}>{v}</span></div>
            ))}
          </Card>
        </div>
      </div>}

      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});}} title="New Contract" width={760}>
        <FormSection title="Contract Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Contract Name" required value={form.contractName} onChange={v=>setForm(p=>({...p,contractName:v}))} error={errors.contractName} placeholder="e.g. J&J Master Services Agreement 2026"/></div>
            <Select label="Customer" required value={form.customerId} onChange={v=>{const c=customers.find(c=>c.id===v);setForm(p=>({...p,customerId:v,customerName:c?.name||""}));}} placeholder="Select customer" options={activeCustomers.map(c=>({value:c.id,label:c.name}))} error={errors.customerId}/>
            <Input label="Reference / SOW Number" value={form.ref} onChange={v=>setForm(p=>({...p,ref:v}))} placeholder="e.g. MSA-JNJ-2026 (optional)"/>
          </div>
        </FormSection>
        <FormSection title="Commercial Terms">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Select label="Freyr Entity" required value={form.freyrEntity} onChange={v=>setForm(p=>({...p,freyrEntity:v}))} placeholder="Select entity" options={activeEntities.map(e=>({value:e.name,label:`${e.name} (${e.prefix})`}))} error={errors.freyrEntity}/>
            <Select label="Currency" required value={form.currency} onChange={v=>setForm(p=>({...p,currency:v}))} options={CURRENCIES.map(c=>({value:c,label:c}))} error={errors.currency}/>
            <Select label="Payment Terms" required value={form.paymentTerms} onChange={v=>setForm(p=>({...p,paymentTerms:v}))} options={PAYMENT_TERMS_OPTIONS.map(t=>({value:t,label:t}))} error={errors.paymentTerms}/>
            {form.paymentTerms==="Custom"&&<Input label="Custom Terms" required value={form.customPaymentTerms} onChange={v=>setForm(p=>({...p,customPaymentTerms:v}))} placeholder="e.g. NET 75" error={errors.customPaymentTerms}/>}
            <Input label="Contract Value (optional)" type="number" value={form.value} onChange={v=>setForm(p=>({...p,value:v}))} placeholder="Leave blank if not applicable"/>
            <Select label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={CONTRACT_STATUSES.map(s=>({value:s,label:s}))}/>
          </div>
        </FormSection>
        <FormSection title="Contract Period">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Input label="Start Date" required type="date" value={form.startDate} onChange={v=>setForm(p=>({...p,startDate:v}))} error={errors.startDate}/>
            <Input label="End Date" required type="date" value={form.endDate} onChange={v=>setForm(p=>({...p,endDate:v}))} error={errors.endDate}/>
          </div>
        </FormSection>
        <FormSection title="Notes"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Commercial notes, scope limitations…"/></FormSection>
        <FormSection title="Contract Document"><UploadPlaceholder label="Contract / SOW"/></FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Contract</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════════════════
function Projects({tags,users,customers,contracts,projects,setProjects,serviceLines}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blank());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");

  function blank(){return {contractId:"",contractName:"",customerId:"",customerName:"",name:"",deliveryOwner:"",startDate:"",endDate:"",status:"Draft",tags:{},scopeNotes:""};}

  const activeContracts=contracts.filter(c=>["Active","Draft"].includes(c.status));
  const activeUsers=users.filter(u=>u.status==="Active");

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    if(!form.contractId)e.contractId="Required";
    if(!form.deliveryOwner)e.deliveryOwner="Required";
    if(!form.status)e.status="Required";
    if(form.startDate&&form.endDate&&form.startDate>form.endDate)e.endDate="End must be after start";
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    setProjects(p=>[...p,{...form,id:genId("PROJ"),createdAt:today(),name:form.name.trim()}]);
    setShowNew(false);setForm(blank());setErrors({});
  };

  const getProjSLs=id=>serviceLines.filter(s=>s.projectId===id);

  const statusColor=s=>s==="Active"?"green":s==="Draft"?"blue":s==="On Hold"?"amber":s==="Closed"?"gray":"red";

  const filtered=projects.filter(p=>{
    const ms=p.name.toLowerCase().includes(search.toLowerCase())||p.customerName?.toLowerCase().includes(search.toLowerCase());
    const mst=filterStatus==="All"||p.status===filterStatus;
    return ms&&mst;
  });

  const MultiTagSelect=({cat})=>{
    const opts=tags[cat]||[];
    const selected_=(form.tags[cat]||[]);
    const toggle=(v)=>setForm(p=>({...p,tags:{...p.tags,[cat]:selected_.includes(v)?selected_.filter(x=>x!==v):[...selected_,v]}}));
    return(
      <div>
        <label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:6}}>{cat}</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {opts.map(o=><button key={o} onClick={()=>toggle(o)} style={{padding:"3px 10px",borderRadius:20,border:`1.5px solid ${selected_.includes(o)?C.primary:C.border}`,background:selected_.includes(o)?C.primary:C.white,color:selected_.includes(o)?C.white:C.textSub,fontSize:11,fontWeight:600,cursor:"pointer"}}>{o}</button>)}
        </div>
      </div>
    );
  };

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Projects" sub={`${projects.filter(p=>p.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{if(!contracts.length){alert("Create a contract first.");return;}setForm(blank());setErrors({});setShowNew(true);}}>+ New Project</Btn>}/>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects…" style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All",...PROJECT_STATUSES]} style={{width:150}}/>
        </div>
        {projects.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>📁</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No projects yet</div>{contracts.length===0&&<Alert type="warning">Create a contract first.</Alert>}{contracts.length>0&&<Btn onClick={()=>{setForm(blank());setErrors({});setShowNew(true);}}>+ Add First Project</Btn>}</div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"id",label:"ID",render:r=><span style={{fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.id}</span>},
            {key:"name",label:"Project",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.customerName} · {r.contractName}</div></div>},
            {key:"deliveryOwner",label:"Delivery Owner"},
            {key:"sls",label:"Service Lines",right:true,render:r=><strong>{getProjSLs(r.id).length}</strong>},
            {key:"startDate",label:"Start"},
            {key:"endDate",label:"End"},
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
              {getProjSLs(selected.id).length===0?<div style={{textAlign:"center",padding:"40px",color:C.textMuted,fontSize:13}}>No service lines yet. Create one from the Service Lines module.</div>:
              <Table cols={[
                {key:"name",label:"Service Line",render:r=><strong>{r.name}</strong>},
                {key:"commercialType",label:"Commercial Type",render:r=><Badge color="blue">{r.commercialType}</Badge>},
                {key:"billingBasis",label:"Billing Basis"},
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

      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});}} title="New Project" width={720}>
        <FormSection title="Project Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Project Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. J&J RA Global Support"/></div>
            <Select label="Contract" required value={form.contractId} onChange={v=>{const c=contracts.find(c=>c.id===v);setForm(p=>({...p,contractId:v,contractName:c?.contractName||"",customerId:c?.customerId||"",customerName:c?.customerName||""}));}} placeholder="Select contract" options={activeContracts.map(c=>({value:c.id,label:`${c.contractName} — ${c.customerName}`}))} error={errors.contractId}/>
            <Select label="Delivery Owner" required value={form.deliveryOwner} onChange={v=>setForm(p=>({...p,deliveryOwner:v}))} placeholder="Select user" options={activeUsers.map(u=>({value:u.name,label:`${u.name} (${u.role})`}))} error={errors.deliveryOwner}/>
            <Input label="Start Date" type="date" value={form.startDate} onChange={v=>setForm(p=>({...p,startDate:v}))}/>
            <Input label="End Date" type="date" value={form.endDate} onChange={v=>setForm(p=>({...p,endDate:v}))} error={errors.endDate}/>
            <Select label="Status" required value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={PROJECT_STATUSES.map(s=>({value:s,label:s}))} error={errors.status}/>
          </div>
        </FormSection>
        <FormSection title="Scope Notes">
          <Textarea value={form.scopeNotes} onChange={v=>setForm(p=>({...p,scopeNotes:v}))} placeholder="High-level description of what this project covers…" rows={3}/>
        </FormSection>
        <FormSection title="Project-level Tags (optional)">
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {["Division","Region","Work Country"].map(cat=>tags[cat]&&(
              <MultiTagSelect key={cat} cat={cat}/>
            ))}
          </div>
        </FormSection>
        <Alert type="info">Do not assign Commercial Type at project level. Mixed commercial models are handled through individual Service Lines.</Alert>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Project</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE LINES
// ═══════════════════════════════════════════════════════════════════════════
function ServiceLines({tags,users,contracts,projects,serviceLines,setServiceLines,forecasts}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blank());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");
  const [milestones,setMilestones]=useState([]);
  const [newMs,setNewMs]=useState({name:"",dueDate:"",value:""});

  function blank(){return {name:"",projectId:"",projectName:"",contractId:"",contractName:"",customerId:"",customerName:"",currency:"",commercialType:"",billingBasis:"",rate:"",unitsDriver:"",division:"",department:"",country:"",region:"",status:"Draft",notes:""};}

  const activeProjects=projects.filter(p=>["Active","Draft"].includes(p.status));
  const activeUsers=users.filter(u=>u.status==="Active");

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    if(!form.projectId)e.projectId="Required";
    if(!form.commercialType)e.commercialType="Required";
    if(!form.billingBasis)e.billingBasis="Required";
    if(!form.status)e.status="Required";
    // Hard block: Active requires forecast
    if(form.status==="Active"){
      const hasForecast=forecasts.some(f=>f.tempSlName===form.name.trim())||false;
      // We'll check after save via a flag — for new SL, block Active on creation
      e._activeBlock="Cannot set to Active on creation — add forecast entries first, then update status.";
    }
    // Milestone validation for Fixed Price
    if(form.commercialType==="Fixed Price"&&form.billingBasis==="Milestone"){
      if(milestones.length===0)e.milestones="At least one milestone is required for Fixed Price / Milestone billing";
    }
    setErrors(e);
    // Remove the active block from actual blocking logic — show as warning
    const realErrors={...e};delete realErrors._activeBlock;
    return Object.keys(realErrors).length===0;
  };

  const save=()=>{
    if(!validate())return;
    if(form.status==="Active"){
      alert("Cannot create a Service Line with Active status. Save as Draft first, add forecast entries in the Forecast module, then update the status to Active.");
      return;
    }
    const sl={...form,id:genId("SL"),createdAt:today(),name:form.name.trim(),milestones:form.commercialType==="Fixed Price"&&form.billingBasis==="Milestone"?milestones:[]};
    setServiceLines(p=>[...p,sl]);
    setShowNew(false);setForm(blank());setMilestones([]);setErrors({});
  };

  const addMilestone=()=>{
    if(!newMs.name||!newMs.value)return;
    setMilestones(p=>[...p,{id:genId("MS"),name:newMs.name,dueDate:newMs.dueDate,value:parseFloat(newMs.value)}]);
    setNewMs({name:"",dueDate:"",value:""});
  };

  const msTotal=milestones.reduce((s,m)=>s+m.value,0);

  const getSLForecasts=id=>forecasts.filter(f=>f.serviceLineId===id);
  const getSLActuals=id=>{
    const fcs=getSLForecasts(id);
    return fcs.reduce((s,f)=>s+(f.actual||0),0);
  };
  const getSLForecastTotal=id=>{
    const fcs=getSLForecasts(id);
    return fcs.reduce((s,f)=>s+(f.forecastAmount||0),0);
  };

  const statusColor=s=>s==="Active"?"green":s==="Draft"?"blue":s==="On Hold"?"amber":"gray";
  const ctColor=ct=>ct==="Fixed Price"?"green":ct==="T&M Managed"||ct==="T&M Staffing"?"blue":ct==="Unit-Based"?"amber":"purple";

  const filtered=serviceLines.filter(s=>{
    const ms=s.name.toLowerCase().includes(search.toLowerCase())||s.customerName?.toLowerCase().includes(search.toLowerCase());
    const mst=filterStatus==="All"||s.status===filterStatus;
    return ms&&mst;
  });

  const isFixedMilestone=form.commercialType==="Fixed Price"&&form.billingBasis==="Milestone";
  const isRateBased=["Hourly","Daily","Per Unit","Per Slab"].includes(form.billingBasis);

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Service Lines" sub={`${serviceLines.filter(s=>s.status==="Active").length} active`}
          action={<Btn size="sm" onClick={()=>{if(!projects.length){alert("Create a project first.");return;}setForm(blank());setMilestones([]);setErrors({});setShowNew(true);}}>+ New Service Line</Btn>}/>
        <Alert type="info">Service Lines must be saved as Draft first. Add forecast entries in the Forecast module, then set status to Active.</Alert>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search service lines…" style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
          <Select value={filterStatus} onChange={setFilterStatus} options={["All",...SL_STATUSES]} style={{width:150}}/>
        </div>
        {serviceLines.length===0?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>⚙</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No service lines yet</div>{projects.length===0&&<Alert type="warning">Create a project first.</Alert>}{projects.length>0&&<Btn onClick={()=>{setForm(blank());setMilestones([]);setErrors({});setShowNew(true);}}>+ Add First Service Line</Btn>}</div></Card>:
        <Card style={{padding:0}}>
          <Table cols={[
            {key:"id",label:"ID",render:r=><span style={{fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.id}</span>},
            {key:"name",label:"Service Line",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:C.textMuted}}>{r.customerName} · {r.projectName}</div></div>},
            {key:"commercialType",label:"Commercial Type",render:r=><Badge color={ctColor(r.commercialType)}>{r.commercialType}</Badge>},
            {key:"billingBasis",label:"Billing Basis"},
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
          <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.name}</h2><div style={{fontSize:13,color:C.textSub}}>{selected.customerName} · {selected.projectName}</div></div>
          <Badge color={ctColor(selected.commercialType)}>{selected.commercialType}</Badge>
          <Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>
        </div>
        {getSLForecastTotal(selected.id)===0&&selected.status!=="Active"&&<Alert type="warning">No forecast entries yet. Add forecasts in the Forecast module. This service line cannot be set to Active until forecasts exist.</Alert>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            <Tabs tabs={[{key:"overview",label:"Overview"},{key:"forecast",label:`Forecast (${getSLForecasts(selected.id).length} entries)`},{key:"milestones",label:"Milestones"}]} active={detailTab} onChange={setDetailTab}/>
            {detailTab==="overview"&&<Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {[["Project",selected.projectName],["Customer",selected.customerName],["Contract",selected.contractName],["Commercial Type",selected.commercialType],["Billing Basis",selected.billingBasis],["Currency",selected.currency],selected.rate&&["Rate",`${selected.currency} ${fmtN(selected.rate)}`],selected.unitsDriver&&["Units/Hours Driver",selected.unitsDriver],selected.division&&["Division",selected.division],selected.department&&["Department",selected.department],selected.country&&["Country",selected.country],selected.region&&["Region",selected.region]].filter(Boolean).map(([l,v])=>(
                  <div key={l} style={{paddingBottom:8,borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:13,fontWeight:600,marginTop:2}}>{v}</div></div>
                ))}
              </div>
              {selected.notes&&<div style={{marginTop:12,padding:12,background:C.bg,borderRadius:6,fontSize:13}}>{selected.notes}</div>}
            </Card>}
            {detailTab==="forecast"&&<Card style={{padding:0}}>
              {getSLForecasts(selected.id).length===0?<div style={{textAlign:"center",padding:"40px",color:C.textMuted}}><div style={{fontSize:13}}>No forecast entries. Go to the Forecast module to add entries for this service line.</div></div>:
              <Table cols={[
                {key:"month",label:"Month"},
                {key:"forecastBasis",label:"Basis"},
                {key:"forecastQuantity",label:"Qty",right:true},
                {key:"forecastRate",label:"Rate",right:true},
                {key:"forecastAmount",label:"Forecast",right:true,render:r=><strong>{fmtN(r.forecastAmount)}</strong>},
                {key:"actual",label:"Actual",right:true,render:r=>r.actual!=null?<span style={{color:C.success}}>{fmtN(r.actual)}</span>:<span style={{color:C.textMuted}}>—</span>},
                {key:"version",label:"Version"},
              ]} rows={getSLForecasts(selected.id)}/>}
            </Card>}
            {detailTab==="milestones"&&<Card>
              {selected.milestones?.length>0?<Table cols={[
                {key:"name",label:"Milestone"},
                {key:"dueDate",label:"Due Date"},
                {key:"value",label:"Value",right:true,render:r=><strong>{selected.currency} {fmtN(r.value)}</strong>},
              ]} rows={selected.milestones}/>:<div style={{textAlign:"center",padding:"30px",color:C.textMuted,fontSize:13}}>{selected.commercialType==="Fixed Price"&&selected.billingBasis==="Milestone"?"No milestones defined.":"Milestones only apply to Fixed Price / Milestone billing."}</div>}
            </Card>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Card>
              <div style={{fontWeight:700,marginBottom:16}}>Financial Summary</div>
              {[["Forecast Total",`${selected.currency} ${fmtN(getSLForecastTotal(selected.id))}`],["Actuals Total",`${selected.currency} ${fmtN(getSLActuals(selected.id))}`],["Forecast Entries",getSLForecasts(selected.id).length],["Created",selected.createdAt]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><strong>{v}</strong></div>
              ))}
            </Card>
            <Card>
              <div style={{fontWeight:700,marginBottom:12}}>Update Status</div>
              {["Draft","On Hold","Closed"].map(s=>(
                <Btn key={s} variant={selected.status===s?"primary":"secondary"} size="sm" style={{width:"100%",marginBottom:8}} onClick={()=>{setServiceLines(p=>p.map(sl=>sl.id===selected.id?{...sl,status:s}:sl));setSelected(prev=>({...prev,status:s}));}}>{s}</Btn>
              ))}
              <Btn variant={selected.status==="Active"?"primary":"secondary"} size="sm" style={{width:"100%",marginBottom:8,borderColor:getSLForecastTotal(selected.id)===0?C.danger:C.primary}} onClick={()=>{
                if(getSLForecastTotal(selected.id)===0){alert("Cannot set to Active — no forecast entries exist. Add forecasts in the Forecast module first.");return;}
                setServiceLines(p=>p.map(sl=>sl.id===selected.id?{...sl,status:"Active"}:sl));
                setSelected(prev=>({...prev,status:"Active"}));
              }}>Active {getSLForecastTotal(selected.id)===0?"🔒":""}</Btn>
              {getSLForecastTotal(selected.id)===0&&<div style={{fontSize:11,color:C.danger,textAlign:"center"}}>Add forecasts to unlock Active</div>}
            </Card>
          </div>
        </div>
      </div>}

      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});setMilestones([]);}} title="New Service Line" width={760}>
        <FormSection title="Service Line Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}><Input label="Service Line Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. HA Query Support"/></div>
            <Select label="Project" required value={form.projectId} onChange={v=>{
              const pr=projects.find(p=>p.id===v);
              const ct=contracts.find(c=>c.id===pr?.contractId);
              setForm(p=>({...p,projectId:v,projectName:pr?.name||"",contractId:pr?.contractId||"",contractName:pr?.contractName||"",customerId:pr?.customerId||"",customerName:pr?.customerName||"",currency:ct?.currency||""}));
            }} placeholder="Select project" options={activeProjects.map(p=>({value:p.id,label:`${p.name} — ${p.customerName}`}))} error={errors.projectId}/>
            <Input label="Currency" value={form.currency} readOnly hint="Auto-populated from contract"/>
          </div>
        </FormSection>

        <FormSection title="Commercial Model">
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:8}}>Commercial Type <span style={{color:C.danger}}>*</span></label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {COMMERCIAL_TYPES.map(ct=>(
                <button key={ct} onClick={()=>setForm(p=>({...p,commercialType:ct,billingBasis:""}))} style={{padding:"10px 8px",borderRadius:8,border:`2px solid ${form.commercialType===ct?C.primary:C.border}`,background:form.commercialType===ct?C.primaryLight:C.white,cursor:"pointer",fontSize:12,fontWeight:600,color:form.commercialType===ct?C.primary:C.textSub,textAlign:"center"}}>{ct}</button>
              ))}
            </div>
            {errors.commercialType&&<div style={{fontSize:11,color:C.danger,marginTop:4}}>{errors.commercialType}</div>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Select label="Billing Basis" required value={form.billingBasis} onChange={v=>setForm(p=>({...p,billingBasis:v}))} placeholder="Select billing basis" options={BILLING_BASES.map(b=>({value:b,label:b}))} error={errors.billingBasis}/>
            <Select label="Status" required value={form.status} onChange={v=>{
              if(v==="Active"){alert("Cannot create as Active. Save as Draft, add forecasts, then set Active.");return;}
              setForm(p=>({...p,status:v}));
            }} options={SL_STATUSES.filter(s=>s!=="Active").map(s=>({value:s,label:s}))} error={errors.status}/>
          </div>
          {isRateBased&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:12}}>
            <Input label="Rate" type="number" value={form.rate} onChange={v=>setForm(p=>({...p,rate:v}))} placeholder="e.g. 185" hint={`Rate per ${form.billingBasis.toLowerCase().replace("per ","")||"unit"}`}/>
            <Input label="Units / Hours Driver" value={form.unitsDriver} onChange={v=>setForm(p=>({...p,unitsDriver:v}))} placeholder="e.g. 120 hours/month"/>
          </div>}
        </FormSection>

        {isFixedMilestone&&<FormSection title="Milestones">
          <Alert type="info">For Fixed Price / Milestone billing, define all milestones here. The sum of milestone values represents the total service line value.</Alert>
          {milestones.length>0&&<table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:12}}>
            <thead><tr>{["Milestone Name","Due Date","Value",""].map(h=><th key={h} style={{padding:"6px 10px",background:C.bg,borderBottom:`1px solid ${C.border}`,textAlign:"left",fontWeight:600,color:C.textSub,fontSize:11}}>{h}</th>)}</tr></thead>
            <tbody>{milestones.map((m,i)=><tr key={m.id} style={{borderBottom:`1px solid ${C.border}`}}>
              <td style={{padding:"6px 10px"}}>{m.name}</td>
              <td style={{padding:"6px 10px"}}>{m.dueDate||"—"}</td>
              <td style={{padding:"6px 10px",fontWeight:600}}>{form.currency} {fmtN(m.value)}</td>
              <td style={{padding:"6px 10px"}}><button onClick={()=>setMilestones(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:13}}>×</button></td>
            </tr>)}</tbody>
            <tfoot><tr><td colSpan={2} style={{padding:"6px 10px",fontWeight:700,fontSize:12}}>Total</td><td style={{padding:"6px 10px",fontWeight:700,color:C.primary}}>{form.currency} {fmtN(msTotal)}</td><td/></tr></tfoot>
          </table>}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,alignItems:"flex-end"}}>
            <Input label="Milestone Name" value={newMs.name} onChange={v=>setNewMs(p=>({...p,name:v}))} placeholder="e.g. 50% Signoff"/>
            <Input label="Due Date" type="date" value={newMs.dueDate} onChange={v=>setNewMs(p=>({...p,dueDate:v}))}/>
            <Input label="Value" type="number" value={newMs.value} onChange={v=>setNewMs(p=>({...p,value:v}))} placeholder="e.g. 25000"/>
            <Btn size="sm" onClick={addMilestone} disabled={!newMs.name||!newMs.value} style={{marginTop:20}}>+ Add</Btn>
          </div>
          {errors.milestones&&<Alert type="danger">{errors.milestones}</Alert>}
        </FormSection>}

        <FormSection title="Classification Tags (optional)">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {["Division","Department","Work Country","Region"].map(cat=>tags[cat]&&(
              <Select key={cat} label={cat} value={form[cat.toLowerCase().replace(" ","")]||form[cat==="Work Country"?"country":cat.toLowerCase()]} onChange={v=>setForm(p=>({...p,[cat==="Work Country"?"country":cat.toLowerCase()]:v}))} placeholder={`Select ${cat}`} options={(tags[cat]||[]).map(t=>({value:t,label:t}))}/>
            ))}
          </div>
        </FormSection>

        <FormSection title="Notes"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Any notes about this service line…"/></FormSection>

        <Alert type="warning">New service lines are saved as Draft. You must add forecast entries in the Forecast module before setting status to Active.</Alert>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});setMilestones([]);}}>Cancel</Btn><Btn onClick={save}>Save as Draft</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FORECAST
// ═══════════════════════════════════════════════════════════════════════════
function Forecast({serviceLines,forecasts,setForecasts,users}){
  const [selectedSl,setSelectedSl]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState(blankFc());
  const [errors,setErrors]=useState({});
  const [filterSl,setFilterSl]=useState("");
  const [version,setVersion]=useState("Current");

  function blankFc(){return {serviceLineId:"",month:"",forecastQuantity:"",forecastRate:"",forecastAmount:"",forecastBasis:"Straight-line",version:"Current",notes:""};}

  const getSlForecasts=(slId,ver)=>forecasts.filter(f=>f.serviceLineId===slId&&(ver?f.version===ver:true));

  const validate=()=>{
    const e={};
    if(!form.serviceLineId)e.serviceLineId="Required";
    if(!form.month)e.month="Required";
    if(!form.forecastAmount&&form.forecastAmount!==0)e.forecastAmount="Required — enter 0 if no revenue this month";
    if(form.forecastAmount!==""&&parseFloat(form.forecastAmount)<0)e.forecastAmount="Must be 0 or greater";
    // Check duplicate month+version
    if(form.serviceLineId&&form.month&&form.version){
      const dup=forecasts.find(f=>f.serviceLineId===form.serviceLineId&&f.month===form.month&&f.version===form.version);
      if(dup)e.month="A forecast entry already exists for this month and version. Delete the existing entry to replace it.";
    }
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const sl=serviceLines.find(s=>s.id===form.serviceLineId);
    const qty=form.forecastQuantity?parseFloat(form.forecastQuantity):null;
    const rate=form.forecastRate?parseFloat(form.forecastRate):null;
    const amt=parseFloat(form.forecastAmount)||0;
    const fc={
      id:genId("FC"),serviceLineId:form.serviceLineId,slName:sl?.name||"",projectName:sl?.projectName||"",customerName:sl?.customerName||"",
      currency:sl?.currency||"USD",month:form.month,forecastQuantity:qty,forecastRate:rate,forecastAmount:amt,
      forecastBasis:form.forecastBasis,version:form.version,notes:form.notes,
      actual:null,createdBy:"Sarah Chen",createdAt:today(),updatedAt:today(),
    };
    setForecasts(p=>[...p,fc]);
    setShowAdd(false);setForm(blankFc());setErrors({});
  };

  const deleteEntry=(id)=>{if(window.confirm("Delete this forecast entry?"))setForecasts(p=>p.filter(f=>f.id!==id));};

  const setActual=(id,val)=>setForecasts(p=>p.map(f=>f.id===id?{...f,actual:val===""?null:parseFloat(val),updatedAt:today()}:f));

  const slOptions=serviceLines.map(s=>({value:s.id,label:`${s.name} — ${s.customerName}`}));

  const displaySl=selectedSl?serviceLines.find(s=>s.id===selectedSl):null;
  const slFc=selectedSl?getSlForecasts(selectedSl,version):[];
  const totalFc=slFc.reduce((s,f)=>s+(f.forecastAmount||0),0);
  const totalAct=slFc.reduce((s,f)=>s+(f.actual||0),0);
  const real=totalFc>0?totalAct/totalFc*100:0;

  // Group all forecasts by customer for summary
  const summary=useMemo(()=>{
    const map={};
    forecasts.forEach(f=>{
      if(!map[f.customerName])map[f.customerName]={customer:f.customerName,forecast:0,actual:0};
      map[f.customerName].forecast+=f.forecastAmount||0;
      map[f.customerName].actual+=f.actual||0;
    });
    return Object.values(map);
  },[forecasts]);

  return(
    <div>
      <SectionHeader title="Forecast" sub="Revenue forecast entries by service line — planned revenue only, never overwritten by actuals"
        action={<Btn size="sm" onClick={()=>{setForm(blankFc());setErrors({});setShowAdd(true);}}>+ Add Forecast Entry</Btn>}/>

      <Alert type="info">Forecast entries represent planned revenue. Actuals come from invoices only and are recorded separately. One entry per month per service line per version.</Alert>

      {forecasts.length===0&&<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:40,marginBottom:12}}>📊</div><div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No forecast entries yet</div><div style={{fontSize:13,marginBottom:20}}>Add monthly forecast entries for each service line. A service line must have at least one forecast entry before it can be set to Active.</div>{serviceLines.length===0&&<Alert type="warning">Create service lines first.</Alert>}{serviceLines.length>0&&<Btn onClick={()=>{setForm(blankFc());setErrors({});setShowAdd(true);}}>+ Add First Forecast Entry</Btn>}</div></Card>}

      {forecasts.length>0&&<>
        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:20,marginBottom:20}}>
          <Card style={{padding:0}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:12,color:C.textSub,textTransform:"uppercase"}}>Service Lines</div>
            {serviceLines.length===0?<div style={{padding:"20px",color:C.textMuted,fontSize:13}}>No service lines yet.</div>:
            serviceLines.map(sl=>{
              const fc=getSlForecasts(sl.id,"Current");
              const t=fc.reduce((s,f)=>s+(f.forecastAmount||0),0);
              return<div key={sl.id} onClick={()=>setSelectedSl(sl.id)} style={{padding:"10px 16px",cursor:"pointer",borderLeft:selectedSl===sl.id?`3px solid ${C.primary}`:"3px solid transparent",background:selectedSl===sl.id?C.primaryLight:"transparent"}}>
                <div style={{fontSize:13,fontWeight:600}}>{sl.name}</div>
                <div style={{fontSize:11,color:C.textMuted}}>{sl.customerName}</div>
                <div style={{fontSize:11,color:t>0?C.primary:C.danger,marginTop:2}}>{t>0?`${sl.currency} ${fmtN(t)} forecast`:"No forecast entries"} {t===0&&"⚠"}</div>
              </div>;
            })}
          </Card>
          <div>
            {!selectedSl?<Card><div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>←</div><div style={{fontSize:13}}>Select a service line to view its forecast</div></div></Card>:<>
              <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
                <div style={{fontWeight:700,fontSize:16,flex:1}}>{displaySl?.name} <span style={{color:C.textSub,fontWeight:400,fontSize:13}}>· {displaySl?.customerName}</span></div>
                <div style={{display:"flex",gap:6}}>
                  {FORECAST_VERSIONS.map(v=><button key={v} onClick={()=>setVersion(v)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${version===v?C.primary:C.border}`,background:version===v?C.primary:C.white,color:version===v?C.white:C.textSub,fontSize:11,fontWeight:600,cursor:"pointer"}}>{v}</button>)}
                </div>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
                <KpiCard label="Total Forecast" value={`${displaySl?.currency} ${fmtN(totalFc)}`} accent={C.primary}/>
                <KpiCard label="Total Actuals" value={`${displaySl?.currency} ${fmtN(totalAct)}`} accent={C.success}/>
                <KpiCard label="Realization" value={pct(real)} accent={real>=90?C.success:real>=75?C.warning:C.danger}/>
              </div>
              <Card style={{padding:0}}>
                <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:700}}>Forecast Entries — {version}</span>
                  <Btn size="sm" onClick={()=>{setForm(f=>({...blankFc(),serviceLineId:selectedSl,version}));setErrors({});setShowAdd(true);}}>+ Add Entry</Btn>
                </div>
                <Table cols={[
                  {key:"month",label:"Month",render:r=>{const m=ALL_MONTHS.find(m=>m.value===r.month);return m?.label||r.month;}},
                  {key:"forecastBasis",label:"Basis",render:r=><Badge color="gray">{r.forecastBasis}</Badge>},
                  {key:"forecastQuantity",label:"Qty",right:true,render:r=>r.forecastQuantity!=null?fmtN(r.forecastQuantity):"—"},
                  {key:"forecastRate",label:"Rate",right:true,render:r=>r.forecastRate!=null?fmtN(r.forecastRate):"—"},
                  {key:"forecastAmount",label:`Forecast (${displaySl?.currency})`,right:true,render:r=><strong>{fmtN(r.forecastAmount)}</strong>},
                  {key:"actual",label:"Actual (from invoices)",right:true,render:r=>(
                    <input type="number" value={r.actual??""} onChange={e=>setActual(r.id,e.target.value)} placeholder="—"
                      style={{width:90,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 6px",textAlign:"right",fontSize:12,background:C.successBg}}/>
                  )},
                  {key:"variance",label:"Variance",right:true,render:r=>{if(r.actual==null)return"—";const v=r.actual-r.forecastAmount;return<span style={{color:v>=0?C.success:C.danger,fontWeight:600}}>{v>=0?"+":""}{fmtN(v)}</span>;}},
                  {key:"notes",label:"Notes",render:r=><span style={{fontSize:11,color:C.textSub}}>{r.notes||"—"}</span>},
                  {key:"actions",label:"",render:r=><button onClick={()=>deleteEntry(r.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:13}}>×</button>},
                ]} rows={slFc.sort((a,b)=>a.month.localeCompare(b.month))} emptyMsg="No entries for this version. Click '+ Add Entry'."/>
                {slFc.length>0&&<div style={{padding:"10px 14px",background:C.primaryLight,display:"flex",gap:24,fontSize:13,fontWeight:600}}>
                  <span>Total Forecast: <strong>{displaySl?.currency} {fmtN(totalFc)}</strong></span>
                  <span>Total Actuals: <strong>{displaySl?.currency} {fmtN(totalAct)}</strong></span>
                  <span style={{color:real>=90?C.success:real>=75?C.warning:C.danger}}>Realization: <strong>{pct(real)}</strong></span>
                </div>}
              </Card>
            </>}
          </div>
        </div>

        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Forecast Summary by Customer (Current Version)</div>
          <Table cols={[
            {key:"customer",label:"Customer",render:r=><strong>{r.customer}</strong>},
            {key:"forecast",label:"Forecast (USD)",right:true,render:r=><strong>{fmtN(r.forecast)}</strong>},
            {key:"actual",label:"Actuals (USD)",right:true,render:r=>fmtN(r.actual)},
            {key:"variance",label:"Variance",right:true,render:r=>{const v=r.actual-r.forecast;return<span style={{color:v>=0?C.success:C.danger,fontWeight:600}}>{v>=0?"+":""}{fmtN(v)}</span>;}},
            {key:"real",label:"Realization",right:true,render:r=>{const rl=r.forecast>0?r.actual/r.forecast*100:0;return<Badge color={rl>=90?"green":rl>=75?"amber":"red"}>{pct(rl)}</Badge>;}},
          ]} rows={summary} emptyMsg="No forecast data."/>
        </Card>
      </>}

      <Modal open={showAdd} onClose={()=>{setShowAdd(false);setErrors({});}} title="Add Forecast Entry" width={600}>
        <Alert type="info">One entry per month per service line per version. Forecast amount must be ≥ 0. Actuals are recorded separately from invoices.</Alert>
        <FormSection title="Service Line & Period">
          <FormRow>
            <Select label="Service Line" required value={form.serviceLineId} onChange={v=>{const sl=serviceLines.find(s=>s.id===v);setForm(p=>({...p,serviceLineId:v,slCurrency:sl?.currency||""}));}} placeholder="Select service line" options={slOptions} error={errors.serviceLineId}/>
            <Select label="Month" required value={form.month} onChange={v=>setForm(p=>({...p,month:v}))} placeholder="Select month" options={ALL_MONTHS.map(m=>({value:m.value,label:m.label}))} error={errors.month}/>
          </FormRow>
          <FormRow>
            <Select label="Forecast Version" value={form.version} onChange={v=>setForm(p=>({...p,version:v}))} options={FORECAST_VERSIONS.map(v=>({value:v,label:v}))}/>
            <Select label="Forecast Basis" value={form.forecastBasis} onChange={v=>setForm(p=>({...p,forecastBasis:v}))} options={FORECAST_BASES.map(b=>({value:b,label:b}))}/>
          </FormRow>
        </FormSection>
        <FormSection title="Amounts">
          <FormRow>
            <Input label="Forecast Quantity (optional)" type="number" value={form.forecastQuantity} onChange={v=>setForm(p=>({...p,forecastQuantity:v}))} placeholder="e.g. 120 hours"/>
            <Input label="Forecast Rate (optional)" type="number" value={form.forecastRate} onChange={v=>setForm(p=>({...p,forecastRate:v}))} placeholder="e.g. 185"/>
          </FormRow>
          <Input label="Forecast Amount" required type="number" value={form.forecastAmount} onChange={v=>setForm(p=>({...p,forecastAmount:v}))} error={errors.forecastAmount} placeholder="Planned revenue for this month (enter 0 if none)" hint="This is planned revenue only. Actuals will come from invoices."/>
        </FormSection>
        <FormSection title="Notes"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Any notes or assumptions…" rows={2}/></FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowAdd(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Forecast Entry</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════════════════════════════════════
function Invoices({tags,customers,contracts,projects,serviceLines,invoices,setInvoices,setForecasts,forecasts,entities,taxRates}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [showCreditMemo,setShowCreditMemo]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blankInv());
  const [errors,setErrors]=useState({});
  const [lines,setLines]=useState([blankLine()]);
  const [cmForm,setCmForm]=useState({originalInvoiceId:"",reason:"",lines:[]});

  function blankInv(){return {customerId:"",customerName:"",customerAddress:"",contractId:"",contractName:"",freyrEntity:"",currency:"",paymentTerms:"",invoiceDate:today(),dueDate:"",billingPeriodStart:"",billingPeriodEnd:"",status:"Draft",taxId:"",taxAmount:0,notes:""};}
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
    if(!form.status)e.status="Required";
    if(lines.every(l=>!l.amount||parseFloat(l.amount)<=0))e.lines="At least one line with amount > 0 is required";
    lines.forEach((l,i)=>{if(l.amount&&parseFloat(l.amount)<0)e[`line${i}`]=`Line ${i+1}: Amount cannot be negative`;});
    setErrors(e);return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const entity=entities.find(e=>e.name===form.freyrEntity);
    const invNum=entity?nextInvoiceNumber(entity.prefix):`INV-${Date.now()}`;
    const inv={
      ...form,id:genId("INV"),invoiceNumber:invNum,createdAt:today(),
      lines:lines.filter(l=>l.amount&&parseFloat(l.amount)>0).map(l=>({...l,amount:parseFloat(l.amount)})),
      lineTotal,taxAmount,grandTotal,taxRate:selectedTax?.percentage||0,taxName:selectedTax?.name||"",
      odooSync:"Pending",
    };
    setInvoices(p=>[...p,inv]);
    // Record actuals against forecast entries
    inv.lines.forEach(line=>{
      if(line.serviceLineId&&form.invoiceDate){
        const month=form.invoiceDate.slice(0,7);
        setForecasts(p=>p.map(f=>{
          if(f.serviceLineId===line.serviceLineId&&f.month===month){
            return{...f,actual:(f.actual||0)+line.amount};
          }
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
        updated.slName=sl?.name||"";updated.commercialType=sl?.commercialType||"";updated.billingBasis=sl?.billingBasis||"";updated.service=sl?.name||"";
      }
      if((field==="quantity"||field==="rate")&&updated.quantity&&updated.rate){
        updated.amount=String(parseFloat(updated.quantity)*parseFloat(updated.rate));
      }
      return updated;
    }));
  };

  const statusColor=s=>s==="Paid"?"green":s==="Active"?"blue":s==="Cancelled"?"gray":"amber";

  const filtered=invoices.filter(inv=>{
    const ms=inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase())||inv.customerName?.toLowerCase().includes(search.toLowerCase());
    const mst=filterStatus==="All"||inv.status===filterStatus;
    return ms&&mst;
  });

  const totalOutstanding=invoices.filter(i=>["Draft","Active"].includes(i.status)).reduce((s,i)=>s+(i.grandTotal||0),0);
  const totalPaid=invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+(i.grandTotal||0),0);

  return(
    <div>
      {view==="list"&&<>
        <SectionHeader title="Invoices" sub="Invoice management and Odoo sync"
          action={<div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" size="sm" onClick={()=>setShowCreditMemo(true)}>+ Credit Memo</Btn>
            <Btn size="sm" onClick={()=>{if(!customers.length){alert("Create a customer first.");return;}setForm(blankInv());setLines([blankLine()]);setErrors({});setShowNew(true);}}>+ New Invoice</Btn>
          </div>}/>
        <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
          <KpiCard label="Total Outstanding" value={`$${fmtN(totalOutstanding)}`} sub="Draft + Active" accent={C.warning}/>
          <KpiCard label="Total Paid" value={`$${fmtN(totalPaid)}`} sub="Paid invoices" accent={C.success}/>
          <KpiCard label="Total Invoices" value={invoices.length} sub="All statuses" accent={C.primary}/>
          <KpiCard label="Pending Odoo Sync" value={invoices.filter(i=>i.odooSync==="Pending").length} sub="Awaiting sync" accent={invoices.filter(i=>i.odooSync==="Pending").length>0?C.warning:C.success}/>
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
            {key:"lineTotal",label:"Subtotal",right:true,render:r=>`${r.currency} ${fmtN(r.lineTotal)}`},
            {key:"taxAmount",label:"Tax",right:true,render:r=>r.taxAmount>0?`${r.currency} ${fmtN(r.taxAmount)}`:"—"},
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
          <Badge color={selected.odooSync==="Synced"?"green":selected.odooSync==="Failed"?"red":"amber"}>{selected.odooSync}</Badge>
        </div>

        {/* Invoice preview */}
        <Card style={{marginBottom:20}}>
          <div style={{borderBottom:`2px solid ${C.primary}`,paddingBottom:16,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontWeight:900,fontSize:22,color:C.primary}}>INVOICE</div>
              <div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,marginTop:4}}>{selected.invoiceNumber}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontWeight:700,fontSize:15}}>{selected.freyrEntity}</div>
              <div style={{fontSize:12,color:C.textSub,marginTop:4,maxWidth:200}}>
                {entities.find(e=>e.name===selected.freyrEntity)?.address||""}
              </div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:16}}>
            <div>
              <div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Bill To</div>
              <div style={{fontWeight:700}}>{selected.customerName}</div>
              <div style={{fontSize:13,color:C.textSub,lineHeight:1.8}}>{selected.customerAddress}</div>
            </div>
            <div>
              {[["Invoice Date",selected.invoiceDate],["Due Date",selected.dueDate||"—"],["Payment Terms",selected.paymentTerms||"—"],["Contract",selected.contractName],["Billing Period",selected.billingPeriodStart?`${selected.billingPeriodStart} to ${selected.billingPeriodEnd}`:"—"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"3px 0"}}><span style={{color:C.textSub}}>{l}:</span><strong>{v}</strong></div>
              ))}
            </div>
          </div>

          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,marginBottom:16}}>
            <thead><tr style={{background:C.primary}}>
              {["Service Line","Commercial Type","Billing Basis","Billing Trigger","Qty","Rate","Amount"].map(h=><th key={h} style={{padding:"8px 12px",color:C.white,fontWeight:600,textAlign:h==="Amount"||h==="Qty"||h==="Rate"?"right":"left",fontSize:11}}>{h}</th>)}
            </tr></thead>
            <tbody>{(selected.lines||[]).map((l,i)=><tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.bg:C.white}}>
              <td style={{padding:"8px 12px",fontWeight:600}}>{l.slName||l.service}</td>
              <td style={{padding:"8px 12px"}}><Badge color="blue">{l.commercialType}</Badge></td>
              <td style={{padding:"8px 12px"}}>{l.billingBasis}</td>
              <td style={{padding:"8px 12px",fontSize:12,color:C.textSub}}>{l.billingTrigger||"—"}</td>
              <td style={{padding:"8px 12px",textAlign:"right"}}>{l.quantity||"—"}</td>
              <td style={{padding:"8px 12px",textAlign:"right"}}>{l.rate?`${selected.currency} ${fmtN(l.rate)}`:"—"}</td>
              <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700}}>{selected.currency} {fmtN(l.amount)}</td>
            </tr>)}</tbody>
            <tfoot>
              <tr><td colSpan={6} style={{padding:"8px 12px",textAlign:"right",fontWeight:600}}>Subtotal</td><td style={{padding:"8px 12px",textAlign:"right",fontWeight:700}}>{selected.currency} {fmtN(selected.lineTotal)}</td></tr>
              {selected.taxAmount>0&&<tr><td colSpan={6} style={{padding:"8px 12px",textAlign:"right",color:C.textSub}}>{selected.taxName} ({selected.taxRate}%)</td><td style={{padding:"8px 12px",textAlign:"right"}}>{selected.currency} {fmtN(selected.taxAmount)}</td></tr>}
              <tr style={{background:C.primaryLight}}><td colSpan={6} style={{padding:"10px 12px",textAlign:"right",fontWeight:700,fontSize:15}}>TOTAL</td><td style={{padding:"10px 12px",textAlign:"right",fontWeight:900,fontSize:15,color:C.primary}}>{selected.currency} {fmtN(selected.grandTotal)}</td></tr>
            </tfoot>
          </table>

          {/* Bank details footer */}
          {selectedEntity?.bankName&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,fontSize:12,color:C.textSub}}>
            <div style={{fontWeight:700,marginBottom:4,color:C.text}}>Payment Details</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[["Bank",selectedEntity.bankName],["Account Name",selectedEntity.accountName],["Account No.",selectedEntity.accountNumber],["SWIFT",selectedEntity.swift||"—"],selectedEntity.iban&&["IBAN",selectedEntity.iban]].filter(Boolean).map(([l,v])=>(
                <div key={l}><div style={{fontWeight:600,color:C.text}}>{l}</div><div>{v}</div></div>
              ))}
            </div>
          </div>}
          {!selectedEntity?.bankName&&<Alert type="warning">Bank details not configured for {selected.freyrEntity}. Go to Settings to add bank details — they will appear here on the invoice.</Alert>}
        </Card>

        <div style={{display:"flex",gap:8}}>
          {selected.status!=="Paid"&&selected.status!=="Cancelled"&&(
            <Btn variant="success" onClick={()=>{setInvoices(p=>p.map(i=>i.id===selected.id?{...i,status:"Paid",odooSync:"Synced"}:i));setSelected(p=>({...p,status:"Paid",odooSync:"Synced"}));}}>Mark as Paid</Btn>
          )}
          {selected.status==="Draft"&&(
            <Btn onClick={()=>{setInvoices(p=>p.map(i=>i.id===selected.id?{...i,status:"Active",odooSync:"Synced"}:i));setSelected(p=>({...p,status:"Active",odooSync:"Synced"}));}}>Submit Invoice</Btn>
          )}
          {selected.status!=="Cancelled"&&<Btn variant="danger" onClick={()=>{if(window.confirm("Cancel this invoice?")){setInvoices(p=>p.map(i=>i.id===selected.id?{...i,status:"Cancelled"}:i));setSelected(p=>({...p,status:"Cancelled"}));}}}>Cancel</Btn>}
        </div>
      </div>}

      {/* New Invoice Modal */}
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
            <div>
              <label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:4}}>Freyr Entity</label>
              <div style={{padding:"7px 11px",border:`1.5px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.bg,color:form.freyrEntity?C.text:C.textMuted}}>{form.freyrEntity||"Auto-populated from contract"}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginTop:12}}>
            <Input label="Invoice Date" required type="date" value={form.invoiceDate} onChange={v=>{
              const due=calcDueDate(v,form.paymentTerms);
              setForm(p=>({...p,invoiceDate:v,dueDate:due}));
            }} error={errors.invoiceDate}/>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:4}}>Payment Terms</label>
              <div style={{padding:"7px 11px",border:`1.5px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.bg}}>{form.paymentTerms||"—"}</div>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:C.textSub,display:"block",marginBottom:4}}>Due Date <span style={{fontSize:11,color:C.textMuted}}>(auto-calculated)</span></label>
              <div style={{padding:"7px 11px",border:`1.5px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.bg,fontWeight:form.dueDate?700:400,color:form.dueDate?C.primary:C.textMuted}}>{form.dueDate||"Set invoice date + contract required"}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:12}}>
            <Input label="Billing Period Start" type="date" value={form.billingPeriodStart} onChange={v=>setForm(p=>({...p,billingPeriodStart:v}))}/>
            <Input label="Billing Period End" type="date" value={form.billingPeriodEnd} onChange={v=>setForm(p=>({...p,billingPeriodEnd:v}))}/>
          </div>
          {form.customerAddress&&<div style={{marginTop:12,padding:10,background:C.bg,borderRadius:6,fontSize:12,color:C.textSub}}><strong>Bill To:</strong> {form.customerAddress}</div>}
        </FormSection>

        <FormSection title="Invoice Lines">
          {errors.lines&&<Alert type="danger">{errors.lines}</Alert>}
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr>{["Service Line","Commercial Type","Billing Basis","Billing Trigger / Milestone","Qty","Rate","Amount",""].map(h=><th key={h} style={{padding:"6px 8px",background:C.bg,borderBottom:`1px solid ${C.border}`,textAlign:"left",fontWeight:600,color:C.textSub,fontSize:11}}>{h}</th>)}</tr></thead>
              <tbody>{lines.map((l,i)=>(
                <tr key={l.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"4px 6px",minWidth:200}}>
                    <select value={l.serviceLineId} onChange={e=>updateLine(i,"serviceLineId",e.target.value)} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:12,background:C.white}}>
                      <option value="">Select service line</option>
                      {getSLsForContract(form.contractId).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </td>
                  <td style={{padding:"4px 6px",minWidth:120}}><input value={l.commercialType} readOnly style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11,background:C.bg}}/></td>
                  <td style={{padding:"4px 6px",minWidth:100}}><input value={l.billingBasis} readOnly style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11,background:C.bg}}/></td>
                  <td style={{padding:"4px 6px",minWidth:160}}><input value={l.billingTrigger} onChange={e=>updateLine(i,"billingTrigger",e.target.value)} placeholder="e.g. 50% signoff, 125 hrs" style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11}}/></td>
                  <td style={{padding:"4px 6px",minWidth:70}}><input type="number" value={l.quantity} onChange={e=>updateLine(i,"quantity",e.target.value)} placeholder="—" style={{width:60,border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11,textAlign:"right"}}/></td>
                  <td style={{padding:"4px 6px",minWidth:80}}><input type="number" value={l.rate} onChange={e=>updateLine(i,"rate",e.target.value)} placeholder="—" style={{width:70,border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11,textAlign:"right"}}/></td>
                  <td style={{padding:"4px 6px",minWidth:100}}><input type="number" value={l.amount} onChange={e=>updateLine(i,"amount",e.target.value)} placeholder="0" style={{width:90,border:`1.5px solid ${C.primary}`,borderRadius:4,padding:"4px 6px",fontSize:12,fontWeight:600,textAlign:"right"}}/></td>
                  <td style={{padding:"4px 6px"}}>{lines.length>1&&<button onClick={()=>setLines(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:16}}>×</button>}</td>
                </tr>
              ))}</tbody>
              <tfoot>
                <tr><td colSpan={6} style={{padding:"8px",textAlign:"right",fontWeight:600,fontSize:12}}>Subtotal</td><td style={{padding:"8px",fontWeight:700,fontSize:13}}>{form.currency||"—"} {fmtN(lineTotal)}</td><td/></tr>
                {taxAmount>0&&<tr><td colSpan={6} style={{padding:"4px 8px",textAlign:"right",color:C.textSub,fontSize:12}}>{selectedTax?.name} ({selectedTax?.percentage}%)</td><td style={{padding:"4px 8px",fontSize:12}}>{form.currency} {fmtN(taxAmount)}</td><td/></tr>}
                <tr style={{background:C.primaryLight}}><td colSpan={6} style={{padding:"10px 8px",textAlign:"right",fontWeight:700}}>TOTAL</td><td style={{padding:"10px 8px",fontWeight:900,color:C.primary,fontSize:15}}>{form.currency||"—"} {fmtN(grandTotal)}</td><td/></tr>
              </tfoot>
            </table>
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn variant="secondary" size="sm" onClick={()=>setLines(p=>[...p,blankLine()])}>+ Add Line</Btn>
          </div>
        </FormSection>

        <FormSection title="Tax">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Select label="Tax Rate (optional)" value={form.taxId} onChange={v=>setForm(p=>({...p,taxId:v}))} placeholder="No tax / Select tax rate" options={taxRates.filter(t=>t.active).map(t=>({value:t.id,label:`${t.name} — ${t.country} (${t.percentage}%)`}))}/>
            {form.taxId&&<div style={{padding:"7px 11px",border:`1.5px solid ${C.border}`,borderRadius:6,fontSize:13,background:C.bg}}><strong>Tax: {form.currency} {fmtN(taxAmount)}</strong> ({selectedTax?.percentage}% of {fmtN(lineTotal)})</div>}
          </div>
          {taxRates.length===0&&<Alert type="info">No tax rates configured. Add them in Settings → Tax Master.</Alert>}
        </FormSection>

        <FormSection title="Invoice Status">
          <Select label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={INVOICE_STATUSES.map(s=>({value:s,label:s}))}/>
        </FormSection>

        <FormSection title="Notes"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Any notes for this invoice…" rows={2}/></FormSection>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Invoice</Btn></div>
      </Modal>

      {/* Credit Memo Modal */}
      <Modal open={showCreditMemo} onClose={()=>setShowCreditMemo(false)} title="New Credit Memo" width={600}>
        <Alert type="info">Credit memos must reference a specific original invoice. The credit amount reduces the actual revenue recorded against the linked service lines.</Alert>
        <FormSection title="Original Invoice">
          <Select label="Original Invoice" required value={cmForm.originalInvoiceId} onChange={v=>setCmForm(p=>({...p,originalInvoiceId:v}))} placeholder="Select invoice to credit" options={invoices.filter(i=>i.status!=="Cancelled").map(i=>({value:i.id,label:`${i.invoiceNumber} — ${i.customerName} (${i.currency} ${fmtN(i.grandTotal)})`}))}/>
        </FormSection>
        {cmForm.originalInvoiceId&&(()=>{const orig=invoices.find(i=>i.id===cmForm.originalInvoiceId);return orig&&<div style={{padding:12,background:C.bg,borderRadius:6,fontSize:13,marginBottom:16}}>
          <div style={{fontWeight:700,marginBottom:4}}>{orig.invoiceNumber} — {orig.customerName}</div>
          <div style={{color:C.textSub}}>Original amount: {orig.currency} {fmtN(orig.grandTotal)} · Status: {orig.status}</div>
        </div>;})()}
        <FormSection title="Credit Details">
          <Textarea label="Reason for Credit Memo" required value={cmForm.reason} onChange={v=>setCmForm(p=>({...p,reason:v}))} placeholder="e.g. Billing error — hours overcounted by 20" rows={2}/>
        </FormSection>
        <Alert type="warning">Credit memo amounts will be recorded as negative actuals against the referenced service lines, reducing the realized revenue for those entries.</Alert>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={()=>setShowCreditMemo(false)}>Cancel</Btn>
          <Btn onClick={()=>{
            if(!cmForm.originalInvoiceId||!cmForm.reason){alert("Select an invoice and provide a reason.");return;}
            const orig=invoices.find(i=>i.id===cmForm.originalInvoiceId);
            const cm={id:genId("CM"),invoiceNumber:`CM-${orig.invoiceNumber}`,type:"Credit Memo",originalInvoiceId:cmForm.originalInvoiceId,customerName:orig.customerName,contractName:orig.contractName,freyrEntity:orig.freyrEntity,currency:orig.currency,invoiceDate:today(),reason:cmForm.reason,lines:orig.lines,lineTotal:-orig.lineTotal,taxAmount:-orig.taxAmount,grandTotal:-orig.grandTotal,taxRate:orig.taxRate,taxName:orig.taxName,status:"Active",odooSync:"Pending",createdAt:today()};
            setInvoices(p=>[...p,cm]);
            setCmForm({originalInvoiceId:"",reason:"",lines:[]});
            setShowCreditMemo(false);
          }}>Issue Credit Memo</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPLOYEES
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
    if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))e.email="Invalid email format";
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
            {key:"id",label:"ID",render:r=><span style={{fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.id}</span>},
            {key:"name",label:"Employee",render:r=><div><div style={{fontWeight:600}}>{r.name}</div>{r.email&&<div style={{fontSize:11,color:C.textMuted}}>{r.email}</div>}</div>},
            {key:"baseDivision",label:"Division",render:r=>r.baseDivision?<Badge color="blue">{r.baseDivision}</Badge>:"—"},
            {key:"baseDepartment",label:"Department",render:r=>r.baseDepartment||"—"},
            {key:"baseCountry",label:"Country",render:r=>r.baseCountry||"—"},
            {key:"reportingManager",label:"Reporting Manager",render:r=>r.reportingManager||"—"},
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
        <Card>
          {[["Employee ID",<span style={{fontFamily:"monospace",fontSize:12}}>{selected.id}</span>],["Status",<Badge color={sc(selected.status)} dot>{selected.status}</Badge>],["Reporting Manager",selected.reportingManager||"—"],["Base Country",selected.baseCountry||"—"],["Base Division",selected.baseDivision?<Badge color="blue">{selected.baseDivision}</Badge>:"—"],["Base Department",selected.baseDepartment||"—"],["Created",selected.createdAt]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
          ))}
        </Card>
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
          <Select label="Reporting Manager" value={form.reportingManager} onChange={v=>setForm(p=>({...p,reportingManager:v}))} placeholder="Select (optional)" options={activeUsers.map(u=>({value:u.name,label:`${u.name} (${u.role})`}))} hint="Reporting Manager is assigned as reviewer for monthly tag reviews"/>
        </FormSection>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn><Btn onClick={save}>Save Employee</Btn></div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function Dashboard({customers,contracts,projects,serviceLines,forecasts,invoices,onNav}){
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
      <SectionHeader title="Platform Overview" sub="Freyr Pulse"/>
      {isEmpty&&<Card style={{marginBottom:20,background:"linear-gradient(135deg,#0C1F3D,#1a3a6b)",border:"none"}}>
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:48,marginBottom:12}}>🚀</div>
          <div style={{color:C.white,fontWeight:700,fontSize:20,marginBottom:8}}>Welcome to Freyr Pulse</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:14,marginBottom:24}}>Start by configuring Tags and Settings, then add your first customer.</div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <Btn onClick={()=>onNav("tags")} style={{background:C.white,color:C.primary}}>1. Configure Tags</Btn>
            <Btn onClick={()=>onNav("settings")} style={{background:"rgba(255,255,255,0.15)",color:C.white,border:"1px solid rgba(255,255,255,0.3)"}}>2. Set Up Entities</Btn>
            <Btn onClick={()=>onNav("customers")} style={{background:"rgba(255,255,255,0.15)",color:C.white,border:"1px solid rgba(255,255,255,0.3)"}}>3. Add Customers</Btn>
          </div>
        </div>
      </Card>}

      <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
        <KpiCard label="Active Customers" value={activeC} accent={C.primary}/>
        <KpiCard label="Active Contracts" value={activeCont} accent={C.success}/>
        <KpiCard label="Active Projects" value={activeP} accent={C.primary}/>
        <KpiCard label="Active Service Lines" value={activeSL} sub={draftSL>0?`${draftSL} draft`:""} accent={C.success}/>
        <KpiCard label="Total Forecast" value={`$${fmtN(totalFc)}`} sub="All service lines" accent={C.primary}/>
        <KpiCard label="Outstanding Invoices" value={`$${fmtN(invOutstanding)}`} accent={C.warning}/>
      </div>

      {noFcSL>0&&<Alert type="warning">{noFcSL} draft service line{noFcSL>1?"s":""} with no forecast entries. <button onClick={()=>onNav("forecast")} style={{background:"none",border:"none",color:C.warning,cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>Add forecasts →</button></Alert>}
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
// PLACEHOLDERS for Session C
// ═══════════════════════════════════════════════════════════════════════════
function Placeholder({name,note}){
  return<div>
    <SectionHeader title={name}/>
    <Card><div style={{padding:"60px 40px",textAlign:"center",color:C.textMuted}}>
      <div style={{fontSize:48,marginBottom:16}}>🔧</div>
      <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>{name}</div>
      <div style={{fontSize:13,maxWidth:400,margin:"0 auto",lineHeight:1.6}}>{note||"Coming in Session C."}</div>
    </div></Card>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);

  const [tags,setTags]=useState(INITIAL_TAGS);
  const [entities,setEntities]=useState(INITIAL_ENTITIES);
  const [taxRates,setTaxRates]=useState([]);
  const [users]=useState(INITIAL_USERS);
  const [customers,setCustomers]=useState([]);
  const [contracts,setContracts]=useState([]);
  const [projects,setProjects]=useState([]);
  const [serviceLines,setServiceLines]=useState([]);
  const [forecasts,setForecasts]=useState([]);
  const [invoices,setInvoices]=useState([]);
  const [employees,setEmployees]=useState([]);

  const groups=[...new Set(NAV.map(n=>n.group))];

  const noFcCount=serviceLines.filter(s=>s.status==="Draft"&&forecasts.filter(f=>f.serviceLineId===s.id).length===0).length;

  const renderPage=()=>{
    if(page==="dashboard")return<Dashboard customers={customers} contracts={contracts} projects={projects} serviceLines={serviceLines} forecasts={forecasts} invoices={invoices} onNav={setPage}/>;
    if(page==="tags")return<TagMaster tags={tags} setTags={setTags}/>;
    if(page==="settings")return<Settings entities={entities} setEntities={setEntities} taxRates={taxRates} setTaxRates={setTaxRates}/>;
    if(page==="customers")return<Customers tags={tags} users={users} customers={customers} setCustomers={setCustomers} contracts={contracts}/>;
    if(page==="contracts")return<Contracts tags={tags} customers={customers} contracts={contracts} setContracts={setContracts} entities={entities}/>;
    if(page==="projects")return<Projects tags={tags} users={users} customers={customers} contracts={contracts} projects={projects} setProjects={setProjects} serviceLines={serviceLines}/>;
    if(page==="service-lines")return<ServiceLines tags={tags} users={users} contracts={contracts} projects={projects} serviceLines={serviceLines} setServiceLines={setServiceLines} forecasts={forecasts}/>;
    if(page==="forecast")return<Forecast serviceLines={serviceLines} forecasts={forecasts} setForecasts={setForecasts} users={users}/>;
    if(page==="invoices")return<Invoices tags={tags} customers={customers} contracts={contracts} projects={projects} serviceLines={serviceLines} invoices={invoices} setInvoices={setInvoices} setForecasts={setForecasts} forecasts={forecasts} entities={entities} taxRates={taxRates}/>;
    if(page==="employees")return<Employees tags={tags} users={users} employees={employees} setEmployees={setEmployees}/>;
    if(page==="tag-reviews")return<Placeholder name="Tag Reviews" note="Tag review workflow coming in Session C — extended to cover both projects and employees, with reviewer = Reporting Manager for employees."/>;
    if(page==="users")return<Placeholder name="User Management" note="User management coming in Session C with proper role and scope enforcement."/>;
    return null;
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.bg,color:C.text}}>
      <div style={{width:collapsed?56:230,background:C.sidebar,display:"flex",flexDirection:"column",transition:"width 0.2s",flexShrink:0,overflowX:"hidden"}}>
        <div style={{padding:collapsed?"16px 12px":"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(c=>!c)}>
          <div style={{width:30,height:30,background:C.primary,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:C.white,fontWeight:900,fontSize:13}}>FP</span></div>
          {!collapsed&&<span style={{color:C.white,fontWeight:700,fontSize:15,whiteSpace:"nowrap"}}>Freyr Pulse</span>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {groups.map(group=>(
            <div key={group}>
              {!collapsed&&<div style={{padding:"10px 20px 3px",fontSize:10,fontWeight:700,color:"rgba(168,189,214,0.45)",textTransform:"uppercase",letterSpacing:1}}>{group}</div>}
              {NAV.filter(n=>n.group===group).map(n=>(
                <div key={n.key} onClick={()=>setPage(n.key)} title={collapsed?n.label:""}
                  style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"9px 13px":"8px 20px",cursor:"pointer",borderLeft:page===n.key?`3px solid ${C.primary}`:"3px solid transparent",background:page===n.key?"rgba(33,118,199,0.15)":"transparent",transition:"all 0.1s"}}>
                  <span style={{fontSize:14,flexShrink:0}}>{n.icon}</span>
                  {!collapsed&&<span style={{color:page===n.key?C.white:C.sidebarText,fontWeight:page===n.key?600:400,fontSize:13,whiteSpace:"nowrap",flex:1}}>{n.label}</span>}
                  {!collapsed&&n.key==="service-lines"&&noFcCount>0&&<span style={{background:C.warning,color:C.white,borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{noFcCount}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:collapsed?"12px":"12px 20px",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:C.primary,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:C.white,fontWeight:700,fontSize:12}}>SC</span></div>
          {!collapsed&&<div><div style={{color:C.white,fontSize:12,fontWeight:600}}>Sarah Chen</div><div style={{color:C.sidebarText,fontSize:11}}>Admin</div></div>}
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:52,background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 24px",gap:16,flexShrink:0}}>
          <div style={{flex:1,display:"flex",gap:6,fontSize:13,color:C.textMuted}}>
            <span>Freyr Pulse</span><span>/</span><span style={{color:C.text,fontWeight:600}}>{NAV.find(n=>n.key===page)?.label||"Dashboard"}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:12,color:C.textMuted}}>{customers.length} customers · {contracts.length} contracts · {projects.length} projects · {serviceLines.length} service lines</span>
            <div style={{width:1,height:20,background:C.border}}/>
            <span style={{fontSize:12,color:C.textSub,fontWeight:600}}>Session B</span>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:28}}>{renderPage()}</div>
      </div>
    </div>
  );
}
