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

const Textarea=({label,value,onChange,placeholder,required,rows=3})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textSub}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <textarea value={value||""} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder} rows={rows}
      style={{border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,color:C.text,background:C.white,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
  </div>
);

const Select=({label,value,onChange,options,required,style,placeholder,error})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textSub}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <select value={value||""} onChange={e=>onChange?.(e.target.value)}
      style={{border:`1.5px solid ${error?C.danger:C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,color:value?C.text:C.textMuted,background:C.white,outline:"none",...style}}>
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
    onClick={()=>alert("File upload will be available when connected to a backend storage service.")}>
    <div style={{fontSize:24,marginBottom:6}}>📎</div>
    <div style={{fontSize:13,color:C.textSub,fontWeight:600}}>Upload {label}</div>
    <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>Click to attach (placeholder — no storage yet)</div>
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

// ─── TAG MASTER DATA (source of truth for all dropdowns) ───────────────────
const INITIAL_TAGS = {
  "Work Country": ["India","China","USA","Canada","EU-UK","EU-Germany","EU-Poland","EU-Other","UAE","Japan","Korea","Other","Colombia","LatAm (Other)","Middle East","South Africa"],
  "Region": ["AMR","EUA","MoW"],
  "Division": ["MPR","MDV","CON","FDL","CFS","SLS"],
  "Department": ["MPR-Artwork","MPR-Consulting","MPR-Excellence Group","MPR-Labelling","MPR-Medical and Scientific Communication","MPR-Medical Writing","MPR-Pharmacovigilance","MPR-Publishing and Submission","MPR-Regulatory Affairs","MDV-Regulatory Affairs Delivery","MDV-Excellence Group","MDV-Leadership Group","CON-Business Operations","CON-Chemical Safety Regulatory Affairs","CON-Cosmetics","CON-Food and Dietary Supplements","CON-Excellence Group","CON-Leadership Group","CFS-Administration","CFS-Compliance and Validation","CFS-Finance","CFS-Freyr Academy","CFS-Human Resources","CFS-IT","CFS-Legal","CFS-Marketing","CFS-Regional Operations","CFS-FreyrX","CFS-Leadership Team","CFS-Transition Management","FF-GRI","FF-RIMS","FF-SUBMISSIONS"],
  "Service": ["MPR-Publishing","MPR-Submissions Planning","MPR-Label Change Management","MPR-Label Content Management Services","MPR-AW Change Management","MPR-Reg Affairs Strategy","MPR-Reg Affairs Submissions","MPR-Regulatory Strategy","MPR-Market Access","MPR-Local Reg Affairs","MDV-AW Change Management","MDV-Reg Affairs Submissions","MDV-Market Access","MDV-Local Reg Affairs","COS-Market Access","FDS-Market Access","COS-Reg Affairs","FDS-Reg Affairs","CSRA-Market Access","CSRA-Reg Affairs"],
  "Customer Type": ["Strategic Accounts","Focussed Accounts","SMB"],
  "Operations": ["Revenue","Cost"],
};

// ─── FREYR ENTITIES (initial) ──────────────────────────────────────────────
const INITIAL_ENTITIES = [
  {id:"ent-1",name:"Freyr US",prefix:"FRUS",currency:"USD",address:"123 Business Ave, New York, NY 10001, USA",bankName:"",accountName:"",accountNumber:"",swift:"",iban:"",active:true},
  {id:"ent-2",name:"Freyr India",prefix:"FRIN",currency:"INR",address:"456 Tech Park, Hyderabad, Telangana 500081, India",bankName:"",accountName:"",accountNumber:"",swift:"",iban:"",active:true},
  {id:"ent-3",name:"Freyr Germany",prefix:"FRDE",currency:"EUR",address:"789 Business Strasse, Frankfurt, 60311, Germany",bankName:"",accountName:"",accountNumber:"",swift:"",iban:"",active:true},
];

// ─── INITIAL USERS ─────────────────────────────────────────────────────────
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
const CUSTOMER_STATUSES = ["Active","Inactive"];
const EMP_STATUSES = ["Active","Inactive","Notice","Contractor"];
const PAYMENT_TERMS_OPTIONS = ["NET 30","NET 45","NET 60","NET 90","Custom"];

// ─── NAV ───────────────────────────────────────────────────────────────────
const NAV = [
  {key:"dashboard",label:"Dashboard",icon:"◼",group:"Overview"},
  {key:"customers",label:"Customers",icon:"🏢",group:"Delivery"},
  {key:"contracts",label:"Contracts",icon:"📋",group:"Delivery"},
  {key:"projects",label:"Projects",icon:"📁",group:"Delivery"},
  {key:"service-lines",label:"Service Lines",icon:"⚙",group:"Delivery"},
  {key:"rate-card",label:"Rate Card",icon:"💰",group:"Finance"},
  {key:"fx-rates",label:"FX Rates",icon:"💱",group:"Finance"},
  {key:"forecast",label:"Forecast",icon:"📊",group:"Finance"},
  {key:"invoices",label:"Invoices",icon:"🧾",group:"Finance"},
  {key:"exceptions",label:"Exceptions",icon:"⚠",group:"Reporting"},
  {key:"employees",label:"Employees",icon:"👥",group:"People"},
  {key:"tag-reviews",label:"Tag Reviews",icon:"🔁",group:"Admin"},
  {key:"users",label:"User Management",icon:"👤",group:"Admin"},
  {key:"tags",label:"Tag Master",icon:"🏷",group:"Admin"},
  {key:"settings",label:"Settings",icon:"⚙",group:"Admin"},
];

// ─── APP STATE (lifted to top level for cross-module access) ───────────────
// All state is managed in the App component and passed down as props.

// ═══════════════════════════════════════════════════════════════════════════
// TAG MASTER MODULE
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
    if((tags[activeCategory]||[]).includes(newTagVal.trim())){alert("Tag already exists in this category.");return;}
    setTags(p=>({...p,[activeCategory]:[...(p[activeCategory]||[]),newTagVal.trim()]}));
    setNewTagVal("");setShowNewTag(false);
  };

  const removeTag=(cat,tag)=>{
    if(!window.confirm(`Remove "${tag}" from ${cat}? This may affect existing records.`))return;
    setTags(p=>({...p,[cat]:p[cat].filter(t=>t!==tag)}));
  };

  const saveEdit=()=>{
    if(!editVal.trim())return;
    setTags(p=>({...p,[activeCategory]:p[activeCategory].map(t=>t===editingTag?editVal.trim():t)}));
    setEditingTag(null);setEditVal("");
  };

  return(
    <div>
      <SectionHeader title="Tag Master" sub="Single source of truth for all classification tags across the platform"
        action={<div style={{display:"flex",gap:8}}>
          <Btn variant="secondary" size="sm" onClick={()=>setShowNewCat(true)}>+ New Category</Btn>
          <Btn size="sm" onClick={()=>setShowNewTag(true)}>+ New Tag</Btn>
        </div>}/>

      <Alert type="info">All dropdowns across Customers, Contracts, Projects, Service Lines, and Employees pull live from these tags. Changes here reflect immediately everywhere.</Alert>

      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20}}>
        {/* Category list */}
        <Card style={{padding:0}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:12,color:C.textSub,textTransform:"uppercase",letterSpacing:0.5}}>
            Categories ({Object.keys(tags).length})
          </div>
          {Object.keys(tags).map(cat=>(
            <div key={cat} onClick={()=>{setActiveCategory(cat);setSearch("");}} style={{padding:"10px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",
              background:activeCategory===cat?C.primaryLight:"transparent",borderLeft:activeCategory===cat?`3px solid ${C.primary}`:"3px solid transparent",
              fontSize:13,fontWeight:activeCategory===cat?700:400,color:activeCategory===cat?C.primary:C.text}}>
              <span>{cat}</span>
              <span style={{background:C.bg,borderRadius:10,padding:"1px 8px",fontSize:11,color:C.textSub,fontWeight:600}}>{(tags[cat]||[]).length}</span>
            </div>
          ))}
        </Card>

        {/* Tag list */}
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:15}}>{activeCategory} <span style={{fontWeight:400,color:C.textMuted,fontSize:13}}>({filtered.length} tags)</span></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tags..." style={{border:`1.5px solid ${C.border}`,borderRadius:6,padding:"6px 10px",fontSize:12,outline:"none",width:200}}/>
          </div>

          {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.textMuted,fontSize:13}}>No tags found. Click "+ New Tag" to add one.</div>}

          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {filtered.map(tag=>(
              <div key={tag} style={{display:"flex",alignItems:"center",gap:0,background:C.primaryLight,borderRadius:20,overflow:"hidden",border:`1px solid ${C.primaryMid}`}}>
                {editingTag===tag?(
                  <>
                    <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus
                      style={{border:"none",background:"transparent",padding:"5px 10px",fontSize:12,fontWeight:600,color:C.primary,outline:"none",width:180}}
                      onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape"){setEditingTag(null);setEditVal("");}}}/>
                    <button onClick={saveEdit} style={{background:C.primary,border:"none",color:C.white,padding:"5px 8px",cursor:"pointer",fontSize:11}}>✓</button>
                    <button onClick={()=>{setEditingTag(null);setEditVal("");}} style={{background:"transparent",border:"none",color:C.textSub,padding:"5px 8px",cursor:"pointer",fontSize:11}}>✕</button>
                  </>
                ):(
                  <>
                    <span style={{padding:"5px 12px",fontSize:12,fontWeight:600,color:C.primary}}>{tag}</span>
                    <button onClick={()=>{setEditingTag(tag);setEditVal(tag);}} style={{background:"transparent",border:"none",cursor:"pointer",color:C.textSub,padding:"5px 4px",fontSize:11}} title="Edit">✏</button>
                    <button onClick={()=>removeTag(activeCategory,tag)} style={{background:"transparent",border:"none",cursor:"pointer",color:C.danger,padding:"5px 8px",fontSize:13}} title="Remove">×</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* New Category Modal */}
      <Modal open={showNewCat} onClose={()=>{setShowNewCat(false);setNewCatName("");}} title="New Tag Category" width={440}>
        <Alert type="warning">Adding a new category creates a new dropdown that can be used across the platform. Choose the name carefully.</Alert>
        <Input label="Category Name" required value={newCatName} onChange={setNewCatName} placeholder="e.g. Account Priority, Project Phase"/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>{setShowNewCat(false);setNewCatName("");}}>Cancel</Btn>
          <Btn onClick={addCategory} disabled={!newCatName.trim()}>Create Category</Btn>
        </div>
      </Modal>

      {/* New Tag Modal */}
      <Modal open={showNewTag} onClose={()=>{setShowNewTag(false);setNewTagVal("");}} title={`New Tag — ${activeCategory}`} width={440}>
        <Input label="Tag Value" required value={newTagVal} onChange={setNewTagVal} placeholder="e.g. MPR-New Department"
          hint={`Will be added to the "${activeCategory}" category`}/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <Btn variant="ghost" onClick={()=>{setShowNewTag(false);setNewTagVal("");}}>Cancel</Btn>
          <Btn onClick={addTag} disabled={!newTagVal.trim()}>Add Tag</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS MODULE
// ═══════════════════════════════════════════════════════════════════════════
function Settings({entities,setEntities,taxRates,setTaxRates}){
  const [tab,setTab]=useState("entities");
  const [showNewEntity,setShowNewEntity]=useState(false);
  const [showEditEntity,setShowEditEntity]=useState(false);
  const [showNewTax,setShowNewTax]=useState(false);
  const [selectedEntity,setSelectedEntity]=useState(null);
  const [entityForm,setEntityForm]=useState({name:"",prefix:"",currency:"USD",address:"",bankName:"",accountName:"",accountNumber:"",swift:"",iban:""});
  const [taxForm,setTaxForm]=useState({name:"",country:"",percentage:"",taxNumberLabel:"",active:true});
  const [entityErrors,setEntityErrors]=useState({});

  const validateEntity=()=>{
    const errs={};
    if(!entityForm.name.trim())errs.name="Entity name is required";
    if(!entityForm.prefix.trim())errs.prefix="Invoice prefix is required";
    if(entityForm.prefix.trim().length>6)errs.prefix="Prefix must be 6 characters or fewer";
    setEntityErrors(errs);
    return Object.keys(errs).length===0;
  };

  const saveEntity=()=>{
    if(!validateEntity())return;
    if(showEditEntity&&selectedEntity){
      setEntities(p=>p.map(e=>e.id===selectedEntity.id?{...e,...entityForm}:e));
    } else {
      setEntities(p=>[...p,{...entityForm,id:genId("ENT"),active:true,prefix:entityForm.prefix.toUpperCase()}]);
    }
    setShowNewEntity(false);setShowEditEntity(false);setSelectedEntity(null);
    setEntityForm({name:"",prefix:"",currency:"USD",address:"",bankName:"",accountName:"",accountNumber:"",swift:"",iban:""});
    setEntityErrors({});
  };

  const editEntity=(ent)=>{
    setSelectedEntity(ent);
    setEntityForm({name:ent.name,prefix:ent.prefix,currency:ent.currency,address:ent.address,bankName:ent.bankName,accountName:ent.accountName,accountNumber:ent.accountNumber,swift:ent.swift,iban:ent.iban});
    setShowEditEntity(true);
  };

  const saveTax=()=>{
    if(!taxForm.name||!taxForm.country||!taxForm.percentage)return;
    setTaxRates(p=>[...p,{...taxForm,id:genId("TAX"),percentage:parseFloat(taxForm.percentage)}]);
    setTaxForm({name:"",country:"",percentage:"",taxNumberLabel:"",active:true});
    setShowNewTax(false);
  };

  const EntityForm=()=>(
    <>
      <FormSection title="Entity Details">
        <FormRow>
          <Input label="Entity Name" required value={entityForm.name} onChange={v=>setEntityForm(p=>({...p,name:v}))} placeholder="e.g. Freyr Singapore" error={entityErrors.name}/>
          <Input label="Invoice Prefix" required value={entityForm.prefix} onChange={v=>setEntityForm(p=>({...p,prefix:v.toUpperCase()}))} placeholder="e.g. FRSG" error={entityErrors.prefix} hint="Used in invoice numbers e.g. FRSG2026-0001"/>
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
        <FormRow cols={1}>
          <Input label="IBAN (if applicable)" value={entityForm.iban} onChange={v=>setEntityForm(p=>({...p,iban:v}))} placeholder="e.g. DE89 3704 0044 0532 0130 00"/>
        </FormRow>
      </FormSection>
    </>
  );

  return(
    <div>
      <SectionHeader title="Settings" sub="Platform configuration — Freyr entities, tax rates, and system defaults"/>
      <Tabs tabs={[{key:"entities",label:"Freyr Entities"},{key:"tax",label:"Tax Master"},{key:"about",label:"System Info"}]} active={tab} onChange={setTab}/>

      {tab==="entities"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
            <Btn size="sm" onClick={()=>{setEntityForm({name:"",prefix:"",currency:"USD",address:"",bankName:"",accountName:"",accountNumber:"",swift:"",iban:""});setEntityErrors({});setShowNewEntity(true);}}>+ New Entity</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {entities.map(ent=>(
              <Card key={ent.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:16}}>{ent.name}</div>
                    <div style={{display:"flex",gap:8,marginTop:4}}>
                      <Badge color="blue">Prefix: {ent.prefix}</Badge>
                      <Badge color="gray">{ent.currency}</Badge>
                      {ent.active?<Badge color="green" dot>Active</Badge>:<Badge color="gray" dot>Inactive</Badge>}
                    </div>
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
                    {ent.bankName?(
                      <div style={{color:C.textSub,lineHeight:1.8}}>
                        <div><strong>Bank:</strong> {ent.bankName}</div>
                        <div><strong>Account:</strong> {ent.accountName} — {ent.accountNumber}</div>
                        {ent.swift&&<div><strong>SWIFT:</strong> {ent.swift}</div>}
                        {ent.iban&&<div><strong>IBAN:</strong> {ent.iban}</div>}
                      </div>
                    ):<span style={{color:C.textMuted,fontStyle:"italic",fontSize:12}}>Bank details not yet configured. Add them so they appear on invoice footers.</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab==="tax"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <Alert type="info">Tax rates defined here are available when creating invoices. Different countries can have different tax types and percentages.</Alert>
            <Btn size="sm" onClick={()=>setShowNewTax(true)} style={{flexShrink:0,marginLeft:12}}>+ New Tax Rate</Btn>
          </div>
          {taxRates.length===0&&(
            <Card>
              <div style={{textAlign:"center",padding:"40px 0",color:C.textMuted}}>
                <div style={{fontSize:32,marginBottom:8}}>🧾</div>
                <div style={{fontWeight:600,marginBottom:4}}>No tax rates configured</div>
                <div style={{fontSize:13}}>Add tax rates for the countries you invoice in. These will appear as options when creating invoices.</div>
              </div>
            </Card>
          )}
          {taxRates.length>0&&(
            <Table cols={[
              {key:"name",label:"Tax Name",render:r=><strong>{r.name}</strong>},
              {key:"country",label:"Country"},
              {key:"percentage",label:"Rate",right:true,render:r=><Badge color="blue">{r.percentage}%</Badge>},
              {key:"taxNumberLabel",label:"Tax Number Label",render:r=>r.taxNumberLabel||<span style={{color:C.textMuted}}>—</span>},
              {key:"active",label:"Status",render:r=><Badge color={r.active?"green":"gray"} dot>{r.active?"Active":"Inactive"}</Badge>},
              {key:"actions",label:"",render:r=>(
                <div style={{display:"flex",gap:6}}>
                  <Btn variant="ghost" size="sm" onClick={()=>setTaxRates(p=>p.map(t=>t.id===r.id?{...t,active:!t.active}:t))}>{r.active?"Deactivate":"Activate"}</Btn>
                  <Btn variant="ghost" size="sm" onClick={()=>setTaxRates(p=>p.filter(t=>t.id!==r.id))}>Remove</Btn>
                </div>
              )},
            ]} rows={taxRates}/>
          )}
        </div>
      )}

      {tab==="about"&&(
        <Card>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            {[["Platform","Freyr Pulse"],["Version","Session A"],["Deployment","Vercel (auto-deploy)"],["Repository","github.com/manojfreyr/freyr-pulse"],["Frontend","React (single file)"],["Backend","None — frontend prototype"],["Data Persistence","Session only (resets on refresh)"],["Reporting Currency","USD"],].map(([l,v])=>(
              <div key={l} style={{paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
                <div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",marginBottom:2}}>{l}</div>
                <div style={{fontSize:13,fontWeight:600,color:C.text}}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* New/Edit Entity Modal */}
      <Modal open={showNewEntity||showEditEntity} onClose={()=>{setShowNewEntity(false);setShowEditEntity(false);setSelectedEntity(null);setEntityErrors({});}} title={showEditEntity?`Edit — ${selectedEntity?.name}`:"New Freyr Entity"} width={680}>
        <EntityForm/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4}}>
          <Btn variant="ghost" onClick={()=>{setShowNewEntity(false);setShowEditEntity(false);setSelectedEntity(null);setEntityErrors({});}}>Cancel</Btn>
          <Btn onClick={saveEntity}>Save Entity</Btn>
        </div>
      </Modal>

      {/* New Tax Modal */}
      <Modal open={showNewTax} onClose={()=>{setShowNewTax(false);setTaxForm({name:"",country:"",percentage:"",taxNumberLabel:"",active:true});}} title="New Tax Rate" width={480}>
        <FormRow>
          <Input label="Tax Name" required value={taxForm.name} onChange={v=>setTaxForm(p=>({...p,name:v}))} placeholder="e.g. VAT, GST, Sales Tax"/>
          <Input label="Country" required value={taxForm.country} onChange={v=>setTaxForm(p=>({...p,country:v}))} placeholder="e.g. Germany"/>
        </FormRow>
        <FormRow>
          <Input label="Percentage (%)" required type="number" value={taxForm.percentage} onChange={v=>setTaxForm(p=>({...p,percentage:v}))} placeholder="e.g. 19"/>
          <Input label="Tax Number Label" value={taxForm.taxNumberLabel} onChange={v=>setTaxForm(p=>({...p,taxNumberLabel:v}))} placeholder="e.g. VAT Number, GST Number"/>
        </FormRow>
        {taxForm.percentage&&<Alert type="info">At {taxForm.percentage}%, an invoice of $10,000 would have {taxForm.name||"tax"} of ${((parseFloat(taxForm.percentage)||0)/100*10000).toFixed(2)}.</Alert>}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
          <Btn variant="ghost" onClick={()=>setShowNewTax(false)}>Cancel</Btn>
          <Btn onClick={saveTax} disabled={!taxForm.name||!taxForm.country||!taxForm.percentage}>Save Tax Rate</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMERS MODULE
// ═══════════════════════════════════════════════════════════════════════════
function Customers({tags,users,customers,setCustomers,contracts}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [filterType,setFilterType]=useState("All");
  const [form,setForm]=useState(blankCustomerForm());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");

  function blankCustomerForm(){
    return {name:"",addressLine1:"",addressLine2:"",city:"",state:"",zip:"",country:"",psaStart:"",psaEnd:"",customerType:"",accountOwner:"",status:"Active",notes:""};
  }

  const customerTypes=tags["Customer Type"]||[];
  const countries=tags["Work Country"]||[];
  const activeUsers=users.filter(u=>u.status==="Active");

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Customer name is required";
    else if(customers.some(c=>c.name.toLowerCase()===form.name.trim().toLowerCase()&&(!selected||c.id!==selected.id)))e.name="A customer with this name already exists";
    if(!form.addressLine1.trim())e.addressLine1="Address is required";
    if(!form.city.trim())e.city="City is required";
    if(!form.state.trim())e.state="State / Province is required";
    if(!form.zip.trim())e.zip="ZIP / Postal Code is required";
    if(!form.country)e.country="Country is required";
    if(!form.customerType)e.customerType="Customer type is required";
    if(!form.accountOwner)e.accountOwner="Account Owner is required";
    if(form.psaStart&&form.psaEnd&&form.psaStart>form.psaEnd)e.psaEnd="PSA End Date must be on or after Start Date";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const c={...form,id:genId("CUST"),createdAt:today(),name:form.name.trim()};
    setCustomers(p=>[...p,c]);
    setShowNew(false);setForm(blankCustomerForm());setErrors({});
  };

  const openDetail=(c)=>{setSelected(c);setDetailTab("overview");setView("detail");};

  const getCustomerContracts=(custId)=>contracts.filter(k=>k.customerId===custId);

  const psaWarning=(c)=>{
    if(!c.psaEnd)return null;
    const days=Math.ceil((new Date(c.psaEnd)-new Date())/(1000*60*60*24));
    if(days<0)return{type:"danger",msg:"PSA expired"};
    if(days<=30)return{type:"warning",msg:`PSA expires in ${days} days`};
    return null;
  };

  const filtered=customers.filter(c=>{
    const matchSearch=c.name.toLowerCase().includes(search.toLowerCase())||c.country?.toLowerCase().includes(search.toLowerCase());
    const matchStatus=filterStatus==="All"||c.status===filterStatus;
    const matchType=filterType==="All"||c.customerType===filterType;
    return matchSearch&&matchStatus&&matchType;
  });

  const F=({field,label,col=1,...rest})=>(
    <div style={{gridColumn:`span ${col}`}}>
      <Input label={label} value={form[field]} onChange={v=>setForm(p=>({...p,[field]:v}))} error={errors[field]} {...rest}/>
    </div>
  );

  return(
    <div>
      {view==="list"&&(
        <>
          <SectionHeader title="Customers" sub={`${customers.filter(c=>c.status==="Active").length} active customers`}
            action={<Btn size="sm" onClick={()=>{setForm(blankCustomerForm());setErrors({});setShowNew(true);}}>+ New Customer</Btn>}/>

          <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or country…"
              style={{flex:1,minWidth:200,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
            <Select value={filterStatus} onChange={setFilterStatus} options={["All","Active","Inactive"]} style={{width:130}}/>
            <Select value={filterType} onChange={setFilterType} placeholder="All Types" options={[{value:"All",label:"All Types"},...customerTypes.map(t=>({value:t,label:t}))]} style={{width:180}}/>
          </div>

          {customers.length===0&&(
            <Card>
              <div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}>
                <div style={{fontSize:40,marginBottom:12}}>🏢</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No customers yet</div>
                <div style={{fontSize:13,marginBottom:20}}>Add your first customer to get started. Contracts and projects flow from customers.</div>
                <Btn onClick={()=>{setForm(blankCustomerForm());setErrors({});setShowNew(true);}}>+ Add First Customer</Btn>
              </div>
            </Card>
          )}

          {customers.length>0&&(
            <Card style={{padding:0}}>
              <Table cols={[
                {key:"id",label:"Customer ID",render:r=><span style={{fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.id}</span>},
                {key:"name",label:"Customer",render:r=>{
                  const warn=psaWarning(r);
                  return<div>
                    <div style={{fontWeight:600}}>{r.name}</div>
                    <div style={{fontSize:11,color:C.textMuted}}>{r.customerType} · {r.country}</div>
                    {warn&&<Badge color={warn.type==="danger"?"red":"amber"}>{warn.msg}</Badge>}
                  </div>;
                }},
                {key:"accountOwner",label:"Account Owner"},
                {key:"contracts",label:"Contracts",right:true,render:r=><span style={{fontWeight:600}}>{getCustomerContracts(r.id).length}</span>},
                {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"gray"} dot>{r.status}</Badge>},
                {key:"createdAt",label:"Created"},
                {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>openDetail(r)}>View →</Btn>},
              ]} rows={filtered} emptyMsg="No customers match your search."/>
            </Card>
          )}
        </>
      )}

      {view==="detail"&&selected&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
            <div style={{flex:1}}>
              <h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.name}</h2>
              <div style={{fontSize:13,color:C.textSub}}>{selected.customerType} · {selected.country}</div>
            </div>
            <Badge color={selected.status==="Active"?"green":"gray"} dot>{selected.status}</Badge>
          </div>

          {psaWarning(selected)&&<Alert type={psaWarning(selected).type}>{psaWarning(selected).msg} — PSA End Date: {selected.psaEnd}</Alert>}

          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
            <div>
              <Tabs tabs={[{key:"overview",label:"Overview"},{key:"contracts",label:`Contracts (${getCustomerContracts(selected.id).length})`},{key:"documents",label:"Documents"}]} active={detailTab} onChange={setDetailTab}/>

              {detailTab==="overview"&&(
                <Card>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                    <div>
                      <FormSection title="Address">
                        <div style={{fontSize:13,color:C.text,lineHeight:2}}>
                          <div>{selected.addressLine1}</div>
                          {selected.addressLine2&&<div>{selected.addressLine2}</div>}
                          <div>{selected.city}{selected.state?`, ${selected.state}`:""} {selected.zip}</div>
                          <div>{selected.country}</div>
                        </div>
                      </FormSection>
                    </div>
                    <div>
                      <FormSection title="PSA Details">
                        {selected.psaStart||selected.psaEnd?(
                          <div style={{fontSize:13,lineHeight:2}}>
                            {selected.psaStart&&<div><strong>Start:</strong> {selected.psaStart}</div>}
                            {selected.psaEnd&&<div><strong>End:</strong> {selected.psaEnd}</div>}
                          </div>
                        ):<div style={{fontSize:13,color:C.textMuted,fontStyle:"italic"}}>No PSA dates recorded</div>}
                      </FormSection>
                    </div>
                  </div>
                  {selected.notes&&<div style={{marginTop:12,padding:12,background:C.bg,borderRadius:6,fontSize:13,color:C.textSub}}>{selected.notes}</div>}
                </Card>
              )}

              {detailTab==="contracts"&&(
                <Card style={{padding:0}}>
                  {getCustomerContracts(selected.id).length===0?(
                    <div style={{textAlign:"center",padding:"40px",color:C.textMuted}}>
                      <div style={{fontSize:13}}>No contracts linked to this customer yet.</div>
                    </div>
                  ):(
                    <Table cols={[
                      {key:"contractName",label:"Contract Name",render:r=><strong>{r.contractName}</strong>},
                      {key:"ref",label:"Reference"},
                      {key:"currency",label:"CCY"},
                      {key:"value",label:"Value",right:true,render:r=>r.value?`${r.currency} ${fmtN(r.value)}`:"—"},
                      {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="Closed"?"gray":r.status==="On Hold"?"amber":"red"} dot>{r.status}</Badge>},
                      {key:"endDate",label:"End Date"},
                    ]} rows={getCustomerContracts(selected.id)}/>
                  )}
                </Card>
              )}

              {detailTab==="documents"&&(
                <Card>
                  <UploadPlaceholder label="MSA / PSA Document"/>
                  <div style={{marginTop:12,fontSize:12,color:C.textMuted,textAlign:"center"}}>Document storage requires backend integration. This is a placeholder.</div>
                </Card>
              )}
            </div>

            {/* Side panel */}
            <Card>
              <div style={{fontWeight:700,marginBottom:16}}>Account Details</div>
              {[
                ["Customer ID",<span style={{fontFamily:"monospace",fontSize:11}}>{selected.id}</span>],
                ["Account Owner",selected.accountOwner],
                ["Customer Type",<Badge color="blue">{selected.customerType}</Badge>],
                ["Status",<Badge color={selected.status==="Active"?"green":"gray"} dot>{selected.status}</Badge>],
                ["Country",selected.country],
                ["Created",selected.createdAt],
                ["Contracts",getCustomerContracts(selected.id).length],
              ].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                  <span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});}} title="New Customer" width={720}>
        <FormSection title="Customer Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}>
              <Input label="Customer Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. Johnson & Johnson"/>
            </div>
            <Select label="Customer Type" required value={form.customerType} onChange={v=>setForm(p=>({...p,customerType:v}))} placeholder="Select type" options={customerTypes.map(t=>({value:t,label:t}))} error={errors.customerType}/>
            <Select label="Account Owner" required value={form.accountOwner} onChange={v=>setForm(p=>({...p,accountOwner:v}))} placeholder="Select user" options={activeUsers.map(u=>({value:u.name,label:`${u.name} (${u.role})`}))} error={errors.accountOwner}/>
            <Select label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={CUSTOMER_STATUSES.map(s=>({value:s,label:s}))}/>
          </div>
        </FormSection>

        <FormSection title="Billing Address">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}>
              <Input label="Address Line 1" required value={form.addressLine1} onChange={v=>setForm(p=>({...p,addressLine1:v}))} error={errors.addressLine1} placeholder="Street address"/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <Input label="Address Line 2" value={form.addressLine2} onChange={v=>setForm(p=>({...p,addressLine2:v}))} placeholder="Suite, floor, building (optional)"/>
            </div>
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
          <div style={{marginTop:12}}><UploadPlaceholder label="PSA / MSA Document"/></div>
        </FormSection>

        <FormSection title="Notes">
          <Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Any additional notes about this customer…"/>
        </FormSection>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn>
          <Btn onClick={save}>Save Customer</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTRACTS MODULE
// ═══════════════════════════════════════════════════════════════════════════
function Contracts({tags,customers,contracts,setContracts,entities}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blankContractForm());
  const [errors,setErrors]=useState({});
  const [detailTab,setDetailTab]=useState("overview");
  const [customPaymentTerm,setCustomPaymentTerm]=useState("");

  function blankContractForm(){
    return {contractName:"",customerId:"",customerName:"",ref:"",startDate:"",endDate:"",value:"",currency:"USD",paymentTerms:"NET 30",customPaymentTerms:"",freyrEntity:"",status:"Draft",tags:{},notes:""};
  }

  const activeCustomers=customers.filter(c=>c.status==="Active");
  const activeEntities=entities.filter(e=>e.active);
  const tagCategories=Object.keys(tags);

  const validate=()=>{
    const e={};
    if(!form.contractName.trim())e.contractName="Contract name is required";
    if(!form.customerId)e.customerId="Customer is required";
    if(!form.startDate)e.startDate="Start date is required";
    if(!form.endDate)e.endDate="End date is required";
    if(form.startDate&&form.endDate&&form.startDate>form.endDate)e.endDate="End date must be after start date";
    if(!form.currency)e.currency="Currency is required";
    if(!form.paymentTerms)e.paymentTerms="Payment terms are required";
    if(form.paymentTerms==="Custom"&&!form.customPaymentTerms.trim())e.customPaymentTerms="Please specify custom payment terms";
    if(!form.freyrEntity)e.freyrEntity="Freyr entity is required";
    if(!form.status)e.status="Status is required";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const effectivePT=form.paymentTerms==="Custom"?form.customPaymentTerms:form.paymentTerms;
    const c={...form,id:genId("CONT"),createdAt:today(),paymentTermsDisplay:effectivePT,value:form.value?parseFloat(form.value):null};
    setContracts(p=>[...p,c]);
    setShowNew(false);setForm(blankContractForm());setErrors({});
  };

  const openDetail=(c)=>{setSelected(c);setDetailTab("overview");setView("detail");};

  const expiryWarning=(c)=>{
    if(!c.endDate)return null;
    const days=Math.ceil((new Date(c.endDate)-new Date())/(1000*60*60*24));
    if(c.status==="Closed"||c.status==="Cancelled")return null;
    if(days<0)return{type:"danger",msg:`Expired ${Math.abs(days)} days ago`};
    if(days<=30)return{type:"warning",msg:`Expires in ${days} days`};
    if(days<=90)return{type:"info",msg:`Expires in ${days} days`};
    return null;
  };

  const filtered=contracts.filter(c=>{
    const matchSearch=c.contractName?.toLowerCase().includes(search.toLowerCase())||c.customerName?.toLowerCase().includes(search.toLowerCase())||c.ref?.toLowerCase().includes(search.toLowerCase());
    const matchStatus=filterStatus==="All"||c.status===filterStatus;
    return matchSearch&&matchStatus;
  });

  return(
    <div>
      {view==="list"&&(
        <>
          <SectionHeader title="Contracts" sub={`${contracts.filter(c=>c.status==="Active").length} active contracts`}
            action={<Btn size="sm" onClick={()=>{
              if(customers.length===0){alert("Please create a customer before adding a contract.");return;}
              setForm(blankContractForm());setErrors({});setShowNew(true);
            }}>+ New Contract</Btn>}/>

          <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, customer or reference…"
              style={{flex:1,minWidth:200,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
            <Select value={filterStatus} onChange={setFilterStatus} options={["All",...CONTRACT_STATUSES]} style={{width:150}}/>
          </div>

          {contracts.length===0&&(
            <Card>
              <div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}>
                <div style={{fontSize:40,marginBottom:12}}>📋</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No contracts yet</div>
                <div style={{fontSize:13,marginBottom:4}}>Contracts must be linked to an existing customer.</div>
                {customers.length===0&&<Alert type="warning">You need to create a customer first before adding contracts.</Alert>}
                {customers.length>0&&<Btn onClick={()=>{setForm(blankContractForm());setErrors({});setShowNew(true);}}>+ Add First Contract</Btn>}
              </div>
            </Card>
          )}

          {contracts.length>0&&(
            <Card style={{padding:0}}>
              <Table cols={[
                {key:"id",label:"Contract ID",render:r=><span style={{fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.id}</span>},
                {key:"contractName",label:"Contract",render:r=>(
                  <div>
                    <div style={{fontWeight:600}}>{r.contractName}</div>
                    <div style={{fontSize:11,color:C.textMuted}}>{r.customerName} {r.ref?`· ${r.ref}`:""}</div>
                    {expiryWarning(r)&&<Badge color={expiryWarning(r).type==="danger"?"red":expiryWarning(r).type==="warning"?"amber":"blue"}>{expiryWarning(r).msg}</Badge>}
                  </div>
                )},
                {key:"freyrEntity",label:"Freyr Entity"},
                {key:"currency",label:"CCY"},
                {key:"value",label:"Value",right:true,render:r=>r.value?`${r.currency} ${fmtN(r.value)}`:<span style={{color:C.textMuted}}>—</span>},
                {key:"paymentTermsDisplay",label:"Payment Terms"},
                {key:"endDate",label:"End Date",render:r=>{
                  const w=expiryWarning(r);
                  return<span style={{color:w?.type==="danger"?C.danger:w?.type==="warning"?C.warning:C.text}}>{r.endDate||"—"}</span>;
                }},
                {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="Draft"?"blue":r.status==="On Hold"?"amber":r.status==="Closed"?"gray":"red"} dot>{r.status}</Badge>},
                {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>openDetail(r)}>View →</Btn>},
              ]} rows={filtered} emptyMsg="No contracts match your search."/>
            </Card>
          )}
        </>
      )}

      {view==="detail"&&selected&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
            <div style={{flex:1}}>
              <h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.contractName}</h2>
              <div style={{fontSize:13,color:C.textSub}}>{selected.customerName} {selected.ref?`· Ref: ${selected.ref}`:""}</div>
            </div>
            <Badge color={selected.status==="Active"?"green":selected.status==="Draft"?"blue":selected.status==="On Hold"?"amber":"gray"} dot>{selected.status}</Badge>
          </div>

          {expiryWarning(selected)&&<Alert type={expiryWarning(selected).type}>{expiryWarning(selected).msg} — End Date: {selected.endDate}</Alert>}

          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
            <div>
              <Tabs tabs={[{key:"overview",label:"Overview"},{key:"tags",label:"Contract Tags"},{key:"documents",label:"Documents"}]} active={detailTab} onChange={setDetailTab}/>

              {detailTab==="overview"&&(
                <Card>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                    <FormSection title="Commercial Terms">
                      {[["Currency",selected.currency],["Payment Terms",selected.paymentTermsDisplay||selected.paymentTerms],["Contract Value",selected.value?`${selected.currency} ${fmtN(selected.value)}`:"Not specified"],["Freyr Entity",selected.freyrEntity],].map(([l,v])=>(
                        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                          <span style={{color:C.textSub}}>{l}</span><strong>{v}</strong>
                        </div>
                      ))}
                    </FormSection>
                    <FormSection title="Period">
                      {[["Start Date",selected.startDate],["End Date",selected.endDate],["Status",selected.status]].map(([l,v])=>(
                        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                          <span style={{color:C.textSub}}>{l}</span><strong>{v}</strong>
                        </div>
                      ))}
                    </FormSection>
                  </div>
                  {selected.notes&&<div style={{marginTop:12,padding:12,background:C.bg,borderRadius:6,fontSize:13,color:C.textSub}}>{selected.notes}</div>}
                </Card>
              )}

              {detailTab==="tags"&&(
                <Card>
                  {Object.keys(selected.tags||{}).length===0?(
                    <div style={{textAlign:"center",padding:"40px",color:C.textMuted,fontSize:13}}>No contract-level tags assigned.</div>
                  ):(
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {Object.entries(selected.tags||{}).map(([cat,vals])=>
                        (Array.isArray(vals)?vals:[vals]).map(v=>(
                          <div key={`${cat}-${v}`} style={{display:"flex",flexDirection:"column",gap:2}}>
                            <span style={{fontSize:10,color:C.textMuted,textTransform:"uppercase"}}>{cat}</span>
                            <Badge color="blue">{v}</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </Card>
              )}

              {detailTab==="documents"&&(
                <Card><UploadPlaceholder label="Contract Document"/></Card>
              )}
            </div>

            <Card>
              <div style={{fontWeight:700,marginBottom:16}}>Contract Summary</div>
              {[
                ["Contract ID",<span style={{fontFamily:"monospace",fontSize:11}}>{selected.id}</span>],
                ["Customer",selected.customerName],
                ["Freyr Entity",selected.freyrEntity],
                ["Currency",selected.currency],
                ["Value",selected.value?`${selected.currency} ${fmtN(selected.value)}`:"—"],
                ["Payment Terms",selected.paymentTermsDisplay||selected.paymentTerms],
                ["Created",selected.createdAt],
              ].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                  <span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600,textAlign:"right",maxWidth:160}}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* New Contract Modal */}
      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});}} title="New Contract" width={760}>
        <FormSection title="Contract Identity">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}>
              <Input label="Contract Name" required value={form.contractName} onChange={v=>setForm(p=>({...p,contractName:v}))} error={errors.contractName} placeholder="e.g. J&J Master Services Agreement 2026"/>
            </div>
            <Select label="Customer" required value={form.customerId} onChange={v=>{
              const c=customers.find(c=>c.id===v);
              setForm(p=>({...p,customerId:v,customerName:c?.name||""}));
            }} placeholder="Select customer" options={activeCustomers.map(c=>({value:c.id,label:c.name}))} error={errors.customerId}/>
            <Input label="Contract Reference / SOW Number" value={form.ref} onChange={v=>setForm(p=>({...p,ref:v}))} placeholder="e.g. MSA-JNJ-2026 (optional)"/>
          </div>
        </FormSection>

        <FormSection title="Commercial Terms">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Select label="Freyr Entity" required value={form.freyrEntity} onChange={v=>setForm(p=>({...p,freyrEntity:v}))} placeholder="Select entity" options={activeEntities.map(e=>({value:e.name,label:`${e.name} (${e.prefix})`}))} error={errors.freyrEntity}/>
            <Select label="Currency" required value={form.currency} onChange={v=>setForm(p=>({...p,currency:v}))} options={CURRENCIES.map(c=>({value:c,label:c}))} error={errors.currency}/>
            <Select label="Payment Terms" required value={form.paymentTerms} onChange={v=>setForm(p=>({...p,paymentTerms:v}))} options={PAYMENT_TERMS_OPTIONS.map(t=>({value:t,label:t}))} error={errors.paymentTerms}/>
            {form.paymentTerms==="Custom"&&<Input label="Custom Payment Terms" required value={form.customPaymentTerms} onChange={v=>setForm(p=>({...p,customPaymentTerms:v}))} placeholder="e.g. NET 75, 50% upfront" error={errors.customPaymentTerms}/>}
            <Input label="Contract Value (optional)" type="number" value={form.value} onChange={v=>setForm(p=>({...p,value:v}))} placeholder="Leave blank if not applicable" hint="Warning will show if invoice total exceeds this value"/>
            <Select label="Contract Status" required value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={CONTRACT_STATUSES.map(s=>({value:s,label:s}))}/>
          </div>
        </FormSection>

        <FormSection title="Contract Period">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Input label="Start Date" required type="date" value={form.startDate} onChange={v=>setForm(p=>({...p,startDate:v}))} error={errors.startDate}/>
            <Input label="End Date" required type="date" value={form.endDate} onChange={v=>setForm(p=>({...p,endDate:v}))} error={errors.endDate}/>
          </div>
        </FormSection>

        <FormSection title="Contract-level Tags (optional)">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {["Work Country","Region","Customer Type"].map(cat=>(
              tags[cat]&&<Select key={cat} label={cat} value={(form.tags||{})[cat]||""} onChange={v=>setForm(p=>({...p,tags:{...p.tags,[cat]:v}}))} placeholder={`Select ${cat}`} options={(tags[cat]||[]).map(t=>({value:t,label:t}))}/>
            ))}
          </div>
        </FormSection>

        <FormSection title="Notes">
          <Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="Any commercial notes, scope limitations, or special terms…"/>
        </FormSection>

        <FormSection title="Contract Document">
          <UploadPlaceholder label="Contract / SOW Document"/>
        </FormSection>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn>
          <Btn onClick={save}>Save Contract</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPLOYEES MODULE
// ═══════════════════════════════════════════════════════════════════════════
function Employees({tags,users,employees,setEmployees}){
  const [view,setView]=useState("list");
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [form,setForm]=useState(blankEmpForm());
  const [errors,setErrors]=useState({});

  function blankEmpForm(){
    return {name:"",email:"",status:"Active",baseCountry:"",baseDivision:"",baseDepartment:"",reportingManager:""};
  }

  const countries=tags["Work Country"]||[];
  const divisions=tags["Division"]||[];
  const departments=tags["Department"]||[];
  const activeUsers=users.filter(u=>u.status==="Active");

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Employee name is required";
    if(form.email&&!isValidEmail(form.email))e.email="Please enter a valid email address";
    if(!form.status)e.status="Employment status is required";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const save=()=>{
    if(!validate())return;
    const emp={...form,id:genId("EMP"),createdAt:today(),name:form.name.trim(),tagReviews:[]};
    setEmployees(p=>[...p,emp]);
    setShowNew(false);setForm(blankEmpForm());setErrors({});
  };

  const filtered=employees.filter(e=>{
    const matchSearch=e.name.toLowerCase().includes(search.toLowerCase())||e.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus=filterStatus==="All"||e.status===filterStatus;
    return matchSearch&&matchStatus;
  });

  const statusColor=s=>s==="Active"?"green":s==="Inactive"?"gray":s==="Notice"?"amber":"purple";

  return(
    <div>
      {view==="list"&&(
        <>
          <SectionHeader title="Employees" sub={`${employees.filter(e=>e.status==="Active").length} active employees`}
            action={<Btn size="sm" onClick={()=>{setForm(blankEmpForm());setErrors({});setShowNew(true);}}>+ New Employee</Btn>}/>

          <div style={{display:"flex",gap:12,marginBottom:16}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…"
              style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:6,padding:"7px 11px",fontSize:13,outline:"none"}}/>
            <Select value={filterStatus} onChange={setFilterStatus} options={["All",...EMP_STATUSES]} style={{width:150}}/>
          </div>

          {employees.length===0&&(
            <Card>
              <div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}>
                <div style={{fontSize:40,marginBottom:12}}>👥</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>No employees yet</div>
                <div style={{fontSize:13,marginBottom:20}}>Add employees to assign them to projects and manage tag reviews.</div>
                <Btn onClick={()=>{setForm(blankEmpForm());setErrors({});setShowNew(true);}}>+ Add First Employee</Btn>
              </div>
            </Card>
          )}

          {employees.length>0&&(
            <Card style={{padding:0}}>
              <Table cols={[
                {key:"id",label:"Employee ID",render:r=><span style={{fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.id}</span>},
                {key:"name",label:"Employee",render:r=>(
                  <div>
                    <div style={{fontWeight:600}}>{r.name}</div>
                    {r.email&&<div style={{fontSize:11,color:C.textMuted}}>{r.email}</div>}
                  </div>
                )},
                {key:"baseDivision",label:"Division",render:r=>r.baseDivision?<Badge color="blue">{r.baseDivision}</Badge>:<span style={{color:C.textMuted}}>—</span>},
                {key:"baseDepartment",label:"Department",render:r=>r.baseDepartment||<span style={{color:C.textMuted}}>—</span>},
                {key:"baseCountry",label:"Country",render:r=>r.baseCountry||<span style={{color:C.textMuted}}>—</span>},
                {key:"reportingManager",label:"Reporting Manager",render:r=>r.reportingManager||<span style={{color:C.textMuted}}>—</span>},
                {key:"status",label:"Status",render:r=><Badge color={statusColor(r.status)} dot>{r.status}</Badge>},
                {key:"actions",label:"",render:r=><Btn size="sm" variant="ghost" onClick={()=>{setSelected(r);setView("detail");}}>View →</Btn>},
              ]} rows={filtered} emptyMsg="No employees match your search."/>
            </Card>
          )}
        </>
      )}

      {view==="detail"&&selected&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <Btn variant="ghost" size="sm" onClick={()=>setView("list")}>← Back</Btn>
            <div style={{flex:1}}>
              <h2 style={{margin:0,fontSize:20,fontWeight:700}}>{selected.name}</h2>
              {selected.email&&<div style={{fontSize:13,color:C.textSub}}>{selected.email}</div>}
            </div>
            <Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
            <Card>
              <FormSection title="Employment Details">
                {[
                  ["Employee ID",<span style={{fontFamily:"monospace",fontSize:12}}>{selected.id}</span>],
                  ["Status",<Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>],
                  ["Reporting Manager",selected.reportingManager||"—"],
                  ["Base Country",selected.baseCountry||"—"],
                  ["Base Division",selected.baseDivision?<Badge color="blue">{selected.baseDivision}</Badge>:"—"],
                  ["Base Department",selected.baseDepartment||"—"],
                  ["Created",selected.createdAt],
                ].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                    <span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </FormSection>
            </Card>

            <Card>
              <div style={{fontWeight:700,marginBottom:12}}>Tag Review Status</div>
              <div style={{textAlign:"center",padding:"20px 0",color:C.textMuted,fontSize:13}}>
                <div style={{fontSize:24,marginBottom:8}}>🔁</div>
                <div>Monthly tag reviews managed in the Tag Reviews module.</div>
                <div style={{marginTop:8,fontSize:11}}>Reviewer: {selected.reportingManager||"No manager assigned"}</div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* New Employee Modal */}
      <Modal open={showNew} onClose={()=>{setShowNew(false);setErrors({});}} title="New Employee" width={640}>
        <FormSection title="Employee Details">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"span 2"}}>
              <Input label="Full Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} error={errors.name} placeholder="e.g. Alex Johnson"/>
            </div>
            <Input label="Email Address" type="email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} error={errors.email} placeholder="e.g. alex.johnson@freyr.com"/>
            <Select label="Employment Status" required value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={EMP_STATUSES.map(s=>({value:s,label:s}))} error={errors.status}/>
          </div>
        </FormSection>

        <FormSection title="Home Base (optional)">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Select label="Base Country" value={form.baseCountry} onChange={v=>setForm(p=>({...p,baseCountry:v}))} placeholder="Select country" options={countries.map(c=>({value:c,label:c}))}/>
            <Select label="Base Division" value={form.baseDivision} onChange={v=>setForm(p=>({...p,baseDivision:v}))} placeholder="Select division" options={divisions.map(d=>({value:d,label:d}))}/>
            <div style={{gridColumn:"span 2"}}>
              <Select label="Base Department" value={form.baseDepartment} onChange={v=>setForm(p=>({...p,baseDepartment:v}))} placeholder="Select department" options={departments.map(d=>({value:d,label:d}))}/>
            </div>
          </div>
        </FormSection>

        <FormSection title="Reporting">
          <Select label="Reporting Manager" value={form.reportingManager} onChange={v=>setForm(p=>({...p,reportingManager:v}))} placeholder="Select reporting manager (optional)"
            options={activeUsers.map(u=>({value:u.name,label:`${u.name} (${u.role})`}))}
            hint="The Reporting Manager will be assigned as reviewer for this employee's monthly tag reviews"/>
        </FormSection>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={()=>{setShowNew(false);setErrors({});}}>Cancel</Btn>
          <Btn onClick={save}>Save Employee</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD (overview — empty state aware)
// ═══════════════════════════════════════════════════════════════════════════
function Dashboard({customers,contracts,onNav}){
  const activeCustomers=customers.filter(c=>c.status==="Active").length;
  const activeContracts=contracts.filter(c=>c.status==="Active").length;
  const expiringContracts=contracts.filter(c=>{
    if(!c.endDate||c.status!=="Active")return false;
    const days=Math.ceil((new Date(c.endDate)-new Date())/(1000*60*60*24));
    return days>=0&&days<=30;
  }).length;

  const isEmpty=customers.length===0&&contracts.length===0;

  return(
    <div>
      <SectionHeader title="Platform Overview" sub="Freyr Pulse · Welcome"/>

      {isEmpty&&(
        <Card style={{marginBottom:20,background:"linear-gradient(135deg,#0C1F3D,#1a3a6b)",border:"none"}}>
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>🚀</div>
            <div style={{color:C.white,fontWeight:700,fontSize:20,marginBottom:8}}>Welcome to Freyr Pulse</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:14,marginBottom:24,maxWidth:500,margin:"0 auto 24px"}}>
              Get started by setting up your Tag Master, configuring Freyr entities in Settings, then adding your first customer.
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <Btn onClick={()=>onNav("tags")} style={{background:C.white,color:C.primary}}>1. Configure Tags</Btn>
              <Btn onClick={()=>onNav("settings")} style={{background:"rgba(255,255,255,0.15)",color:C.white,border:"1px solid rgba(255,255,255,0.3)"}}>2. Set Up Entities</Btn>
              <Btn onClick={()=>onNav("customers")} style={{background:"rgba(255,255,255,0.15)",color:C.white,border:"1px solid rgba(255,255,255,0.3)"}}>3. Add Customers</Btn>
            </div>
          </div>
        </Card>
      )}

      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <KpiCard label="Active Customers" value={activeCustomers} sub="Registered accounts" accent={C.primary} badge={activeCustomers===0?<Badge color="gray">None yet</Badge>:null}/>
        <KpiCard label="Active Contracts" value={activeContracts} sub="Across all customers" accent={C.success} badge={activeContracts===0?<Badge color="gray">None yet</Badge>:null}/>
        <KpiCard label="Expiring Soon" value={expiringContracts} sub="Within 30 days" accent={expiringContracts>0?C.warning:C.success} badge={expiringContracts>0?<Badge color="amber" dot>Action needed</Badge>:null}/>
        <KpiCard label="Total Contracts" value={contracts.length} sub="All statuses" accent={C.primary}/>
      </div>

      {expiringContracts>0&&(
        <Alert type="warning">{expiringContracts} contract{expiringContracts>1?"s":""} expiring within 30 days. <button onClick={()=>onNav("contracts")} style={{background:"none",border:"none",color:C.warning,cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>View contracts →</button></Alert>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Recent Customers</div>
          {customers.length===0?(
            <div style={{textAlign:"center",padding:"30px 0",color:C.textMuted,fontSize:13}}>
              No customers yet. <button onClick={()=>onNav("customers")} style={{background:"none",border:"none",color:C.primary,cursor:"pointer",fontWeight:600}}>Add first customer →</button>
            </div>
          ):(
            <Table cols={[
              {key:"name",label:"Customer",render:r=><strong>{r.name}</strong>},
              {key:"customerType",label:"Type",render:r=><Badge color="blue">{r.customerType}</Badge>},
              {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":"gray"} dot>{r.status}</Badge>},
            ]} rows={[...customers].reverse().slice(0,5)}/>
          )}
        </Card>

        <Card>
          <div style={{fontWeight:700,marginBottom:12}}>Recent Contracts</div>
          {contracts.length===0?(
            <div style={{textAlign:"center",padding:"30px 0",color:C.textMuted,fontSize:13}}>
              No contracts yet. <button onClick={()=>onNav("contracts")} style={{background:"none",border:"none",color:C.primary,cursor:"pointer",fontWeight:600}}>Add first contract →</button>
            </div>
          ):(
            <Table cols={[
              {key:"contractName",label:"Contract",render:r=><div><div style={{fontWeight:600,fontSize:12}}>{r.contractName}</div><div style={{fontSize:11,color:C.textMuted}}>{r.customerName}</div></div>},
              {key:"currency",label:"CCY"},
              {key:"status",label:"Status",render:r=><Badge color={r.status==="Active"?"green":r.status==="Draft"?"blue":"gray"} dot>{r.status}</Badge>},
            ]} rows={[...contracts].reverse().slice(0,5)}/>
          )}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PLACEHOLDER for Session B/C modules
// ═══════════════════════════════════════════════════════════════════════════
function Placeholder({name,icon="🔧",note}){
  return(
    <div>
      <SectionHeader title={name}/>
      <Card>
        <div style={{padding:"60px 40px",textAlign:"center",color:C.textMuted}}>
          <div style={{fontSize:48,marginBottom:16}}>{icon}</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.text}}>{name}</div>
          <div style={{fontSize:13,maxWidth:400,margin:"0 auto",lineHeight:1.6}}>
            {note||`This module will be fully rebuilt in the next session with complete spec compliance, proper validation, and live data integration.`}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP — root component with all shared state
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);

  // ── Shared state ──
  const [tags,setTags]=useState(INITIAL_TAGS);
  const [entities,setEntities]=useState(INITIAL_ENTITIES);
  const [taxRates,setTaxRates]=useState([]);
  const [users]=useState(INITIAL_USERS);
  const [customers,setCustomers]=useState([]);
  const [contracts,setContracts]=useState([]);
  const [employees,setEmployees]=useState([]);

  const groups=[...new Set(NAV.map(n=>n.group))];

  const renderPage=()=>{
    if(page==="dashboard")return<Dashboard customers={customers} contracts={contracts} onNav={setPage}/>;
    if(page==="tags")return<TagMaster tags={tags} setTags={setTags}/>;
    if(page==="settings")return<Settings entities={entities} setEntities={setEntities} taxRates={taxRates} setTaxRates={setTaxRates}/>;
    if(page==="customers")return<Customers tags={tags} users={users} customers={customers} setCustomers={setCustomers} contracts={contracts}/>;
    if(page==="contracts")return<Contracts tags={tags} customers={customers} contracts={contracts} setContracts={setContracts} entities={entities}/>;
    if(page==="employees")return<Employees tags={tags} users={users} employees={employees} setEmployees={setEmployees}/>;

    // Session B modules
    if(page==="projects")return<Placeholder name="Projects" icon="📁" note="Full spec rebuild coming in Session B — including project-level tags, scope notes, service line grid, and status workflow."/>;
    if(page==="service-lines")return<Placeholder name="Service Lines" icon="⚙" note="Full spec rebuild coming in Session B — including Billing Basis, milestone structure for Fixed Price, mandatory forecast gate, and tag ownership rules."/>;
    if(page==="forecast")return<Placeholder name="Forecast" icon="📊" note="Full spec rebuild coming in Session B — including forecast basis, versioning, planning vs actuals separation, and rollup reporting."/>;
    if(page==="invoices")return<Placeholder name="Invoices" icon="🧾" note="Full spec rebuild coming in Session B — including contract-driven service line selection, tax, NET terms, auto due date, Freyr entity, and bank details footer."/>;
    if(page==="rate-card")return<Placeholder name="Rate Card" icon="💰" note="Rate Card module carried over — will be integrated with Service Lines in Session B."/>;
    if(page==="fx-rates")return<Placeholder name="FX Rates" icon="💱" note="FX Rates module carried over — will be integrated with reporting in Session C."/>;

    // Session C modules
    if(page==="exceptions")return<Placeholder name="Exception Reports" icon="⚠" note="Exception reports will be rebuilt in Session C with live data from all modules."/>;
    if(page==="tag-reviews")return<Placeholder name="Tag Reviews" icon="🔁" note="Tag review workflow will be extended in Session C to cover both projects and employees, with reviewer = Reporting Manager for employees."/>;
    if(page==="users")return<Placeholder name="User Management" icon="👤" note="User management will be updated in Session C with proper role and scope enforcement."/>;

    return null;
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.bg,color:C.text}}>
      {/* Sidebar */}
      <div style={{width:collapsed?56:230,background:C.sidebar,display:"flex",flexDirection:"column",transition:"width 0.2s",flexShrink:0,overflowX:"hidden"}}>
        <div style={{padding:collapsed?"16px 12px":"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(c=>!c)}>
          <div style={{width:30,height:30,background:C.primary,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:C.white,fontWeight:900,fontSize:13}}>FP</span>
          </div>
          {!collapsed&&<span style={{color:C.white,fontWeight:700,fontSize:15,whiteSpace:"nowrap"}}>Freyr Pulse</span>}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {groups.map(group=>(
            <div key={group}>
              {!collapsed&&<div style={{padding:"10px 20px 3px",fontSize:10,fontWeight:700,color:"rgba(168,189,214,0.45)",textTransform:"uppercase",letterSpacing:1}}>{group}</div>}
              {NAV.filter(n=>n.group===group).map(n=>(
                <div key={n.key} onClick={()=>setPage(n.key)} title={collapsed?n.label:""}
                  style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"9px 13px":"8px 20px",cursor:"pointer",
                    borderLeft:page===n.key?`3px solid ${C.primary}`:"3px solid transparent",
                    background:page===n.key?"rgba(33,118,199,0.15)":"transparent",transition:"all 0.1s"}}>
                  <span style={{fontSize:14,flexShrink:0}}>{n.icon}</span>
                  {!collapsed&&<span style={{color:page===n.key?C.white:C.sidebarText,fontWeight:page===n.key?600:400,fontSize:13,whiteSpace:"nowrap"}}>{n.label}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{padding:collapsed?"12px":"12px 20px",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:C.primary,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:C.white,fontWeight:700,fontSize:12}}>SC</span>
          </div>
          {!collapsed&&<div><div style={{color:C.white,fontSize:12,fontWeight:600}}>Sarah Chen</div><div style={{color:C.sidebarText,fontSize:11}}>Admin</div></div>}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Top bar */}
        <div style={{height:52,background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 24px",gap:16,flexShrink:0}}>
          <div style={{flex:1,display:"flex",gap:6,fontSize:13,color:C.textMuted}}>
            <span>Freyr Pulse</span><span>/</span>
            <span style={{color:C.text,fontWeight:600}}>{NAV.find(n=>n.key===page)?.label||"Dashboard"}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:12,color:C.textMuted}}>{customers.length} customers · {contracts.length} contracts · {employees.length} employees</span>
            <div style={{width:1,height:20,background:C.border}}/>
            <span style={{fontSize:12,color:C.textSub,fontWeight:600}}>Session A</span>
          </div>
        </div>

        {/* Page content */}
        <div style={{flex:1,overflowY:"auto",padding:28}}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
