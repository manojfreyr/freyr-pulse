import { useState } from "react";

const C = {
  b600:"#2176C7",b700:"#1A62A8",b50:"#EEF5FD",b100:"#C8E0F8",
  g50:"#F8FAFB",g100:"#F1F4F8",g200:"#E2E8F0",g300:"#CBD5E1",
  g400:"#94A3B8",g500:"#64748B",g600:"#475569",g700:"#334155",
  g800:"#1E293B",g900:"#0F172A",
  red:"#E24B4A",redBg:"#FCEBEB",redTxt:"#A32D2D",
  grn:"#639922",grnBg:"#EAF3DE",grnTxt:"#3B6D11",
  amb:"#BA7517",ambBg:"#FAEEDA",ambTxt:"#854F0B",
};

const s = {
  app:{display:"flex",flexDirection:"column",height:"100vh",background:C.g50,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"},
  nav:{background:C.b600,display:"flex",alignItems:"center",padding:"0 20px",height:52,flexShrink:0,gap:8,overflowX:"auto"},
  logoName:{fontSize:15,fontWeight:700,color:"#fff",letterSpacing:-0.3,whiteSpace:"nowrap"},
  logoTag:{fontSize:9,color:C.b100,letterSpacing:0.5,textTransform:"uppercase"},
  navLink:(a)=>({padding:"5px 11px",fontSize:13,color:a?"#fff":"rgba(255,255,255,0.7)",borderRadius:6,cursor:"pointer",background:a?"rgba(255,255,255,0.18)":"transparent",fontWeight:a?500:400,border:"none",whiteSpace:"nowrap"}),
  body:{display:"flex",flex:1,overflow:"hidden"},
  sidebar:{width:200,background:"#fff",borderRight:"1px solid "+C.g200,display:"flex",flexDirection:"column",overflow:"auto",flexShrink:0},
  sideSection:{padding:"14px 10px 6px"},
  sideLabel:{fontSize:10,fontWeight:600,color:C.g400,letterSpacing:0.8,textTransform:"uppercase",padding:"0 8px",marginBottom:4},
  sideItem:(a)=>({display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,cursor:"pointer",color:a?C.b700:C.g600,fontSize:13,background:a?C.b50:"transparent",fontWeight:a?600:400,border:"none",width:"100%",textAlign:"left"}),
  sideDivider:{height:1,background:C.g200,margin:"6px 10px"},
  main:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
  pageHeader:{background:"#fff",borderBottom:"1px solid "+C.g200,padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52,flexShrink:0},
  pageTitle:{fontSize:17,fontWeight:600,color:C.g900},
  content:{flex:1,overflow:"auto",padding:20},
  btn:(v)=>{
    const b={display:"inline-flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:7,fontSize:13,fontWeight:500,cursor:"pointer",border:"1px solid transparent",whiteSpace:"nowrap"};
    if(v==="primary")return{...b,background:C.b600,color:"#fff",borderColor:C.b600};
    if(v==="danger")return{...b,background:"#fff",color:C.redTxt,borderColor:C.red};
    return{...b,background:"#fff",color:C.g700,borderColor:C.g300};
  },
  btnSm:{padding:"4px 10px",fontSize:12},
  badge:(col)=>{
    const m={green:{background:C.grnBg,color:C.grnTxt},amber:{background:C.ambBg,color:C.ambTxt},red:{background:C.redBg,color:C.redTxt},blue:{background:C.b50,color:C.b700},gray:{background:C.g100,color:C.g600},purple:{background:"#F3F0FF",color:"#5B21B6"}};
    return{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:500,...(m[col]||m.gray)};
  },
  tw:{background:"#fff",border:"1px solid "+C.g200,borderRadius:10,overflow:"hidden"},
  th:{background:C.g50,padding:"8px 13px",textAlign:"left",fontSize:11,fontWeight:600,color:C.g500,letterSpacing:0.4,textTransform:"uppercase",borderBottom:"1px solid "+C.g200,whiteSpace:"nowrap"},
  td:{padding:"10px 13px",borderBottom:"1px solid "+C.g100,color:C.g700,fontSize:13,verticalAlign:"middle"},
  input:{width:"100%",padding:"7px 10px",border:"1px solid "+C.g300,borderRadius:7,fontSize:13,color:C.g800,background:"#fff",outline:"none",boxSizing:"border-box"},
  select:{width:"100%",padding:"7px 10px",border:"1px solid "+C.g300,borderRadius:7,fontSize:13,color:C.g800,background:"#fff",outline:"none",appearance:"none",boxSizing:"border-box"},
  label:{display:"block",fontSize:12,fontWeight:500,color:C.g700,marginBottom:4},
  fg:{marginBottom:13},
  card:{background:"#fff",border:"1px solid "+C.g200,borderRadius:10,padding:"16px 18px",marginBottom:14},
  kpi:(a)=>({background:"#fff",border:"1px solid "+C.g200,borderRadius:10,padding:"13px 16px",borderTop:"3px solid "+a}),
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000},
  modalBox:{background:"#fff",borderRadius:12,border:"1px solid "+C.g200,width:560,maxWidth:"95vw",maxHeight:"90vh",overflow:"auto"},
  mh:{padding:"15px 18px",borderBottom:"1px solid "+C.g200,display:"flex",alignItems:"center",justifyContent:"space-between"},
  mb:{padding:18},
  mf:{padding:"13px 18px",borderTop:"1px solid "+C.g200,display:"flex",justifyContent:"flex-end",gap:8},
  tag:{display:"inline-flex",alignItems:"center",background:C.b50,color:C.b700,border:"1px solid "+C.b100,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:500},
  empty:{textAlign:"center",padding:"48px 20px",color:C.g400},
  toolbar:{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"},
  sb:{display:"flex",alignItems:"center",gap:7,background:"#fff",border:"1px solid "+C.g300,borderRadius:7,padding:"6px 10px",minWidth:200},
  si:{border:"none",outline:"none",fontSize:13,color:C.g800,background:"transparent",width:"100%"},
  alert:(t)=>{const m={amber:{background:C.ambBg,color:C.ambTxt,border:"1px solid #F6D860"},red:{background:C.redBg,color:C.redTxt,border:"1px solid #F5A7A7"},blue:{background:C.b50,color:C.b700,border:"1px solid "+C.b100}};return{padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:12,...(m[t]||m.blue)}},
};

// ── helpers ──────────────────────────────────────────────────────────────────
function genId(p){return p+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase();}
function statusColor(s){return{active:"green",paid:"green",completed:"green",inactive:"gray",cancelled:"gray",void:"gray",draft:"blue",submitted:"blue",on_hold:"amber",overdue:"red",partially_paid:"amber"}[s]||"gray";}
function commLabel(t){return{fixed_price:"Fixed price",tm_managed:"T&M managed",tm_staffing:"T&M staffing",unit_based:"Unit-based",recurring:"Recurring"}[t]||t;}

// ── seed data ─────────────────────────────────────────────────────────────────
const INIT_TAGS = {
  categories:[
    {id:"TC001",name:"Division",code:"DIV",mandatory:true,levels:["service_line"],status:"active",description:"Internal delivery division"},
    {id:"TC002",name:"Department",code:"DEPT",mandatory:true,levels:["service_line"],status:"active",description:"Department within division"},
    {id:"TC003",name:"Region",code:"RGN",mandatory:true,levels:["project"],status:"active",description:"Geographic region"},
    {id:"TC004",name:"Country",code:"CTY",mandatory:true,levels:["service_line","project"],status:"active",description:"Country of delivery"},
    {id:"TC005",name:"Customer Type",code:"CTYPE",mandatory:true,levels:["customer"],status:"active",description:"Type of customer"},
    {id:"TC006",name:"Service",code:"SVC",mandatory:true,levels:["service_line"],status:"active",description:"Service category"},
  ],
  tags:[
    {id:"T001",categoryId:"TC001",name:"Regulatory Division",code:"REG",status:"active"},
    {id:"T002",categoryId:"TC001",name:"Clinical Division",code:"CLI",status:"active"},
    {id:"T003",categoryId:"TC001",name:"Pharmacovigilance",code:"PV",status:"active"},
    {id:"T004",categoryId:"TC001",name:"Medical Affairs",code:"MA",status:"active"},
    {id:"T005",categoryId:"TC002",name:"Regulatory Affairs",code:"RA",status:"active"},
    {id:"T006",categoryId:"TC002",name:"Clinical Operations",code:"CO",status:"active"},
    {id:"T007",categoryId:"TC002",name:"Drug Safety",code:"DS",status:"active"},
    {id:"T008",categoryId:"TC002",name:"Medical Writing",code:"MW",status:"active"},
    {id:"T009",categoryId:"TC002",name:"Publishing",code:"PUB",status:"active"},
    {id:"T010",categoryId:"TC003",name:"North America",code:"NA",status:"active"},
    {id:"T011",categoryId:"TC003",name:"Europe",code:"EU",status:"active"},
    {id:"T012",categoryId:"TC003",name:"Asia Pacific",code:"APAC",status:"active"},
    {id:"T013",categoryId:"TC003",name:"LATAM",code:"LAT",status:"active"},
    {id:"T014",categoryId:"TC003",name:"Middle East",code:"ME",status:"active"},
    {id:"T015",categoryId:"TC004",name:"United States",code:"US",status:"active"},
    {id:"T016",categoryId:"TC004",name:"United Kingdom",code:"GB",status:"active"},
    {id:"T017",categoryId:"TC004",name:"Switzerland",code:"CH",status:"active"},
    {id:"T018",categoryId:"TC004",name:"Germany",code:"DE",status:"active"},
    {id:"T019",categoryId:"TC004",name:"France",code:"FR",status:"active"},
    {id:"T020",categoryId:"TC004",name:"Japan",code:"JP",status:"active"},
    {id:"T021",categoryId:"TC004",name:"India",code:"IN",status:"active"},
    {id:"T022",categoryId:"TC005",name:"Pharma",code:"PH",status:"active"},
    {id:"T023",categoryId:"TC005",name:"Biotech",code:"BT",status:"active"},
    {id:"T024",categoryId:"TC005",name:"MedTech",code:"MT",status:"active"},
    {id:"T025",categoryId:"TC005",name:"CRO",code:"CRO",status:"active"},
    {id:"T026",categoryId:"TC006",name:"Regulatory Affairs",code:"RA",status:"active"},
    {id:"T027",categoryId:"TC006",name:"Clinical Writing",code:"CW",status:"active"},
    {id:"T028",categoryId:"TC006",name:"Publishing",code:"PUB",status:"active"},
    {id:"T029",categoryId:"TC006",name:"HA Query Support",code:"HAQ",status:"active"},
    {id:"T030",categoryId:"TC006",name:"Pharmacovigilance",code:"PV",status:"active"},
    {id:"T031",categoryId:"TC006",name:"Drug Safety",code:"DS",status:"active"},
    {id:"T032",categoryId:"TC006",name:"Medical Writing",code:"MW",status:"active"},
  ]
};

const CURRENCIES=["USD","GBP","EUR","CHF","JPY","INR","AUD"];
const COMM_TYPES=[["fixed_price","Fixed price"],["tm_managed","T&M managed"],["tm_staffing","T&M staffing"],["unit_based","Unit-based"],["recurring","Recurring"]];
const BILLING_BASIS=["milestone","monthly","quarterly","hourly","daily","per_unit","per_slab","upfront","annual","ad_hoc"];
const PAYMENT_TERMS=["Net 30","Net 45","Net 60","Upfront"];
const CUSTOMER_TYPES=["Pharma","Biotech","MedTech","CRO","Generic"];

const INIT={
  tags: INIT_TAGS,
  customers:[
    {id:"C001",name:"Johnson & Johnson",legalName:"Johnson & Johnson Inc.",accountCode:"JNJ-001",country:"United States",countryTag:"T015",region:"North America",regionTag:"T010",customerType:"Pharma",customerTypeTag:"T022",status:"active",psaStart:"2022-01-01",psaEnd:"2026-12-31"},
    {id:"C002",name:"Pfizer",legalName:"Pfizer Inc.",accountCode:"PFZ-002",country:"United States",countryTag:"T015",region:"North America",regionTag:"T010",customerType:"Pharma",customerTypeTag:"T022",status:"active",psaStart:"2023-01-01",psaEnd:"2027-06-30"},
    {id:"C003",name:"Novartis",legalName:"Novartis AG",accountCode:"NVT-003",country:"Switzerland",countryTag:"T017",region:"Europe",regionTag:"T011",customerType:"Pharma",customerTypeTag:"T022",status:"active",psaStart:"2022-06-01",psaEnd:"2027-02-28"},
  ],
  contracts:[
    {id:"CT001",name:"Regulatory Submission Support",customerId:"C001",currency:"USD",value:1800000,status:"active",startDate:"2022-01-01",endDate:"2026-12-31",paymentTerms:"Net 30"},
    {id:"CT002",name:"Clinical Writing Services",customerId:"C001",currency:"USD",value:900000,status:"active",startDate:"2023-03-01",endDate:"2026-06-30",paymentTerms:"Net 45"},
    {id:"CT003",name:"Pharmacovigilance Support",customerId:"C002",currency:"USD",value:2100000,status:"active",startDate:"2024-06-01",endDate:"2027-05-31",paymentTerms:"Net 30"},
  ],
  projects:[
    {id:"P001",name:"Dossier Prep & Submission",contractId:"CT001",divisionTag:"T001",division:"Regulatory Division",departmentTag:"T005",department:"Regulatory Affairs",regionTag:"T010",region:"North America",countryTag:"T015",country:"United States",status:"active",startDate:"2024-02-01",endDate:"2026-12-31"},
    {id:"P002",name:"HA Query Support 2026",contractId:"CT001",divisionTag:"T001",division:"Regulatory Division",departmentTag:"T005",department:"Regulatory Affairs",regionTag:"T010",region:"North America",countryTag:"T015",country:"United States",status:"active",startDate:"2026-01-01",endDate:"2026-12-31"},
    {id:"P003",name:"Clinical Trial Submission",contractId:"CT003",divisionTag:"T002",division:"Clinical Division",departmentTag:"T006",department:"Clinical Operations",regionTag:"T010",region:"North America",countryTag:"T015",country:"United States",status:"active",startDate:"2025-01-01",endDate:"2026-06-30"},
  ],
  serviceLines:[
    {id:"SL001",name:"Regulatory Affairs",projectId:"P001",serviceTag:"T026",service:"Regulatory Affairs",commercialType:"fixed_price",billingBasis:"milestone",currency:"USD",divisionTag:"T001",division:"Regulatory Division",departmentTag:"T005",department:"Regulatory Affairs",countryTag:"T015",country:"United States",status:"active"},
    {id:"SL002",name:"HA Query Support",projectId:"P002",serviceTag:"T029",service:"HA Query Support",commercialType:"tm_managed",billingBasis:"hourly",currency:"USD",divisionTag:"T001",division:"Regulatory Division",departmentTag:"T005",department:"Regulatory Affairs",countryTag:"T015",country:"United States",status:"active"},
    {id:"SL003",name:"Clinical Writing",projectId:"P003",serviceTag:"T027",service:"Clinical Writing",commercialType:"fixed_price",billingBasis:"milestone",currency:"USD",divisionTag:"T002",division:"Clinical Division",departmentTag:"T006",department:"Clinical Operations",countryTag:"T015",country:"United States",status:"active"},
  ],
  invoices:[
    {id:"INV001",number:"FRUS20261831",customerId:"C001",contractId:"CT001",invoiceDate:"2026-04-06",billingPeriodStart:"2026-04-01",billingPeriodEnd:"2026-04-30",currency:"USD",status:"paid",totalAmount:59360,notes:"April 2026 billing",
     lines:[
       {id:"IL001",description:"Protocol Submission Milestone",serviceLineId:"SL001",qty:"",rate:"",amount:50000},
       {id:"IL002",description:"HA Query Support Apr 2026",serviceLineId:"SL002",qty:48,rate:195,amount:9360},
     ]},
  ],
};

// ── shared UI ────────────────────────────────────────────────────────────────
function Modal({title,onClose,onSave,saveLabel,children,wide}){
  return(
    <div style={s.modal} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{...s.modalBox,width:wide?720:560}}>
        <div style={s.mh}><span style={{fontSize:15,fontWeight:600,color:C.g900}}>{title}</span><button onClick={onClose} style={{border:"none",background:"none",fontSize:20,cursor:"pointer",color:C.g400}}>×</button></div>
        <div style={s.mb}>{children}</div>
        {onSave&&<div style={s.mf}><button style={s.btn()} onClick={onClose}>Cancel</button><button style={s.btn("primary")} onClick={onSave}>{saveLabel||"Save"}</button></div>}
      </div>
    </div>
  );
}
function F({label,req,children,hint}){
  return <div style={s.fg}><label style={s.label}>{label}{req&&<span style={{color:C.red}}> *</span>}</label>{children}{hint&&<div style={{fontSize:11,color:C.g400,marginTop:3}}>{hint}</div>}</div>;
}
function Grid2({children}){return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>;}
function Grid3({children}){return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>{children}</div>;}

// ── Tag selector helpers ─────────────────────────────────────────────────────
function useTagsForCategory(tags, categoryId){
  return tags.tags.filter(t=>t.categoryId===categoryId&&t.status==="active");
}
function TagSelect({tags, categoryId, value, onChange, placeholder}){
  const opts = useTagsForCategory(tags, categoryId);
  return(
    <select style={s.select} value={value||""} onChange={e=>onChange(e.target.value)}>
      <option value="">{placeholder||"Select..."}</option>
      {opts.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
  );
}

// ── TAG MASTER ───────────────────────────────────────────────────────────────
function TagMaster({data,setData}){
  const [activeTab,setActiveTab]=useState("categories");
  const [selectedCat,setSelectedCat]=useState(null);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [eid,setEid]=useState(null);
  const [q,setQ]=useState("");

  const cats=data.tags.categories;
  const allTags=data.tags.tags;
  const catTags=selectedCat?allTags.filter(t=>t.categoryId===selectedCat):[];
  const filteredTags=allTags.filter(t=>t.name.toLowerCase().includes(q.toLowerCase())||t.code.toLowerCase().includes(q.toLowerCase()));

  function openNewCat(){setForm({status:"active",mandatory:false});setEid(null);setModal("cat");}
  function openEditCat(c){setForm({...c});setEid(c.id);setModal("cat");}
  function saveCat(){
    if(!form.name||!form.code)return alert("Name and code are required");
    if(eid){setData(d=>({...d,tags:{...d.tags,categories:d.tags.categories.map(c=>c.id===eid?{...form,id:eid}:c)}}))}
    else{setData(d=>({...d,tags:{...d.tags,categories:[...d.tags.categories,{...form,id:genId("TC")}]}}))}
    setModal(null);
  }
  function openNewTag(){setForm({status:"active",categoryId:selectedCat||""});setEid(null);setModal("tag");}
  function openEditTag(t){setForm({...t});setEid(t.id);setModal("tag");}
  function saveTag(){
    if(!form.name||!form.code||!form.categoryId)return alert("Name, code and category are required");
    if(eid){setData(d=>({...d,tags:{...d.tags,tags:d.tags.tags.map(t=>t.id===eid?{...form,id:eid}:t)}}))}
    else{setData(d=>({...d,tags:{...d.tags,tags:[...d.tags.tags,{...form,id:genId("T")}]}}))}
    setModal(null);
  }
  function delTag(id){if(window.confirm("Delete this tag?"))setData(d=>({...d,tags:{...d.tags,tags:d.tags.tags.filter(t=>t.id!==id)}}))}
  function delCat(id){if(window.confirm("Delete this category and all its tags?"))setData(d=>({...d,tags:{...d.tags,categories:d.tags.categories.filter(c=>c.id!==id),tags:d.tags.tags.filter(t=>t.categoryId!==id)}}))}
  const f=(k,v)=>setForm(x=>({...x,[k]:v}));

  return(
    <div style={s.content}>
      <div style={{display:"flex",gap:8,marginBottom:16,borderBottom:"1px solid "+C.g200,paddingBottom:0}}>
        {["categories","all_tags"].map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{padding:"8px 16px",background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:activeTab===tab?600:400,color:activeTab===tab?C.b600:C.g500,borderBottom:activeTab===tab?"2px solid "+C.b600:"2px solid transparent"}}>
            {tab==="categories"?"Tag Categories":"All Tags"}
          </button>
        ))}
      </div>

      {activeTab==="categories"&&(
        <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontWeight:600,fontSize:13,color:C.g800}}>Categories</span>
              <button style={{...s.btn("primary"),...s.btnSm}} onClick={openNewCat}>+ New</button>
            </div>
            <div style={s.tw}>
              {cats.map(c=>(
                <div key={c.id} onClick={()=>setSelectedCat(c.id)} style={{padding:"10px 13px",cursor:"pointer",background:selectedCat===c.id?C.b50:"#fff",borderBottom:"1px solid "+C.g100,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:500,fontSize:13,color:selectedCat===c.id?C.b700:C.g800}}>{c.name}</div>
                    <div style={{fontSize:11,color:C.g400}}>{c.code} · {allTags.filter(t=>t.categoryId===c.id).length} tags</div>
                  </div>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    {c.mandatory&&<span style={s.badge("blue")}>Mandatory</span>}
                    <span style={s.badge(statusColor(c.status))}>{c.status}</span>
                  </div>
                </div>
              ))}
              {cats.length===0&&<div style={{...s.empty,padding:"24px"}}>No categories yet</div>}
            </div>
          </div>
          <div>
            {selectedCat?(()=>{
              const cat=cats.find(c=>c.id===selectedCat);
              return(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div>
                      <span style={{fontWeight:600,fontSize:13,color:C.g800}}>{cat?.name} Tags</span>
                      {cat?.description&&<div style={{fontSize:11,color:C.g400,marginTop:2}}>{cat.description}</div>}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={{...s.btn(),...s.btnSm}} onClick={()=>openEditCat(cat)}>Edit category</button>
                      <button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>delCat(selectedCat)}>Delete</button>
                      <button style={{...s.btn("primary"),...s.btnSm}} onClick={openNewTag}>+ New tag</button>
                    </div>
                  </div>
                  <div style={s.tw}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr><th style={s.th}>Tag name</th><th style={s.th}>Code</th><th style={s.th}>Status</th><th style={s.th}></th></tr></thead>
                      <tbody>
                        {catTags.length===0&&<tr><td colSpan={4} style={{...s.td,...s.empty}}>No tags in this category yet.</td></tr>}
                        {catTags.map(t=>(
                          <tr key={t.id}>
                            <td style={s.td}><span style={{fontWeight:500,color:C.g900}}>{t.name}</span></td>
                            <td style={{...s.td,fontFamily:"monospace",fontSize:12,color:C.g500}}>{t.code}</td>
                            <td style={s.td}><span style={s.badge(statusColor(t.status))}>{t.status}</span></td>
                            <td style={s.td}>
                              <div style={{display:"flex",gap:6}}>
                                <button style={{...s.btn(),...s.btnSm}} onClick={()=>openEditTag(t)}>Edit</button>
                                <button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>delTag(t.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })():(
              <div style={{...s.card,...s.empty}}>Select a category on the left to view and manage its tags</div>
            )}
          </div>
        </div>
      )}

      {activeTab==="all_tags"&&(
        <>
          <div style={s.toolbar}>
            <div style={s.sb}><input style={s.si} placeholder="Search all tags..." value={q} onChange={e=>setQ(e.target.value)}/></div>
            <button style={s.btn("primary")} onClick={()=>{setForm({status:"active",categoryId:""});setEid(null);setModal("tag");}}>+ New tag</button>
          </div>
          <div style={s.tw}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr><th style={s.th}>Tag name</th><th style={s.th}>Category</th><th style={s.th}>Code</th><th style={s.th}>Status</th><th style={s.th}></th></tr></thead>
              <tbody>
                {filteredTags.length===0&&<tr><td colSpan={5} style={{...s.td,...s.empty}}>No tags found.</td></tr>}
                {filteredTags.map(t=>{
                  const cat=cats.find(c=>c.id===t.categoryId);
                  return(
                    <tr key={t.id}>
                      <td style={s.td}><span style={{fontWeight:500,color:C.g900}}>{t.name}</span></td>
                      <td style={s.td}><span style={s.tag}>{cat?.name||"—"}</span></td>
                      <td style={{...s.td,fontFamily:"monospace",fontSize:12,color:C.g500}}>{t.code}</td>
                      <td style={s.td}><span style={s.badge(statusColor(t.status))}>{t.status}</span></td>
                      <td style={s.td}>
                        <div style={{display:"flex",gap:6}}>
                          <button style={{...s.btn(),...s.btnSm}} onClick={()=>openEditTag(t)}>Edit</button>
                          <button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>delTag(t.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal==="cat"&&(
        <Modal title={eid?"Edit category":"New tag category"} onClose={()=>setModal(null)} onSave={saveCat} saveLabel={eid?"Save changes":"Create category"}>
          <Grid2>
            <F label="Category name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. Division"/></F>
            <F label="Code" req><input style={s.input} value={form.code||""} onChange={e=>f("code",e.target.value.toUpperCase())} placeholder="e.g. DIV"/></F>
            <F label="Status"><select style={s.select} value={form.status||"active"} onChange={e=>f("status",e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></F>
            <F label="Mandatory"><select style={s.select} value={form.mandatory?"yes":"no"} onChange={e=>f("mandatory",e.target.value==="yes")}><option value="yes">Yes — required on all records</option><option value="no">No — optional</option></select></F>
          </Grid2>
          <F label="Description"><input style={s.input} value={form.description||""} onChange={e=>f("description",e.target.value)} placeholder="Brief description of this tag category"/></F>
        </Modal>
      )}
      {modal==="tag"&&(
        <Modal title={eid?"Edit tag":"New tag"} onClose={()=>setModal(null)} onSave={saveTag} saveLabel={eid?"Save changes":"Create tag"}>
          <Grid2>
            <F label="Tag name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. Regulatory Division"/></F>
            <F label="Code" req><input style={s.input} value={form.code||""} onChange={e=>f("code",e.target.value.toUpperCase())} placeholder="e.g. REG"/></F>
            <F label="Category" req>
              <select style={s.select} value={form.categoryId||""} onChange={e=>f("categoryId",e.target.value)}>
                <option value="">Select category...</option>
                {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </F>
            <F label="Status"><select style={s.select} value={form.status||"active"} onChange={e=>f("status",e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></F>
          </Grid2>
        </Modal>
      )}
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({data}){
  const totalBilled=data.invoices.reduce((a,i)=>a+i.totalAmount,0);
  const paid=data.invoices.filter(i=>i.status==="paid").reduce((a,i)=>a+i.totalAmount,0);
  const outstanding=totalBilled-paid;
  const activeProjects=data.projects.filter(p=>p.status==="active").length;
  return(
    <div style={s.content}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <div style={s.kpi(C.b600)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Customers</div><div style={{fontSize:22,fontWeight:700,color:C.g900}}>{data.customers.length}</div></div>
        <div style={s.kpi(C.grn)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Active Projects</div><div style={{fontSize:22,fontWeight:700,color:C.g900}}>{activeProjects}</div></div>
        <div style={s.kpi(C.amb)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Total Invoiced</div><div style={{fontSize:22,fontWeight:700,color:C.g900}}>${totalBilled.toLocaleString()}</div></div>
        <div style={s.kpi(C.red)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Outstanding</div><div style={{fontSize:22,fontWeight:700,color:outstanding>0?C.ambTxt:C.grnTxt}}>${outstanding.toLocaleString()}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={s.card}>
          <div style={{fontWeight:600,color:C.g800,marginBottom:12,fontSize:14}}>Customers</div>
          {data.customers.map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+C.g100}}>
              <div><div style={{fontWeight:500,color:C.g800,fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:C.g400}}>{c.country} · {c.customerType}</div></div>
              <span style={s.badge(statusColor(c.status))}>{c.status}</span>
            </div>
          ))}
          {data.customers.length===0&&<div style={{color:C.g400,fontSize:13}}>No customers yet</div>}
        </div>
        <div style={s.card}>
          <div style={{fontWeight:600,color:C.g800,marginBottom:12,fontSize:14}}>Recent Invoices</div>
          {data.invoices.map(inv=>(
            <div key={inv.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+C.g100}}>
              <div><div style={{fontWeight:600,color:C.g900,fontSize:13,fontFamily:"monospace"}}>{inv.number}</div><div style={{fontSize:11,color:C.g400}}>{inv.currency} {inv.totalAmount.toLocaleString()}</div></div>
              <span style={s.badge(statusColor(inv.status))}>{inv.status}</span>
            </div>
          ))}
          {data.invoices.length===0&&<div style={{color:C.g400,fontSize:13}}>No invoices yet</div>}
        </div>
        <div style={s.card}>
          <div style={{fontWeight:600,color:C.g800,marginBottom:12,fontSize:14}}>Projects</div>
          {data.projects.map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+C.g100}}>
              <div><div style={{fontWeight:500,color:C.g800,fontSize:13}}>{p.name}</div><div style={{fontSize:11,color:C.g400}}>{p.division}</div></div>
              <span style={s.badge(statusColor(p.status))}>{p.status}</span>
            </div>
          ))}
        </div>
        <div style={s.card}>
          <div style={{fontWeight:600,color:C.g800,marginBottom:12,fontSize:14}}>Tag Summary</div>
          {data.tags.categories.map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid "+C.g100}}>
              <div style={{fontSize:13,color:C.g700}}>{c.name}</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:12,color:C.g500}}>{data.tags.tags.filter(t=>t.categoryId===c.id).length} tags</span>
                {c.mandatory&&<span style={s.badge("blue")}>Mandatory</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CUSTOMERS ────────────────────────────────────────────────────────────────
function Customers({data,setData}){
  const [q,setQ]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [eid,setEid]=useState(null);

  const countryTags=data.tags.tags.filter(t=>t.categoryId==="TC004"&&t.status==="active");
  const regionTags=data.tags.tags.filter(t=>t.categoryId==="TC003"&&t.status==="active");
  const typeTags=data.tags.tags.filter(t=>t.categoryId==="TC005"&&t.status==="active");

  const list=data.customers.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||(c.accountCode||"").toLowerCase().includes(q.toLowerCase()));

  function openCreate(){setForm({status:"active"});setEid(null);setModal("form");}
  function openEdit(c){setForm({...c});setEid(c.id);setModal("form");}
  function save(){
    if(!form.name)return alert("Customer name is required");
    if(!form.regionTag)return alert("Region is required");
    if(!form.customerTypeTag)return alert("Customer type is required");
    if(!form.countryTag)return alert("Country is required");
    const regionName=regionTags.find(t=>t.id===form.regionTag)?.name||"";
    const countryName=countryTags.find(t=>t.id===form.countryTag)?.name||"";
    const typeName=typeTags.find(t=>t.id===form.customerTypeTag)?.name||"";
    const record={...form,region:regionName,country:countryName,customerType:typeName};
    if(eid){setData(d=>({...d,customers:d.customers.map(c=>c.id===eid?{...record,id:eid}:c)}))}
    else{setData(d=>({...d,customers:[...d.customers,{...record,id:genId("C")}]}))}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this customer?"))setData(d=>({...d,customers:d.customers.filter(c=>c.id!==id)}))}
  const f=(k,v)=>setForm(x=>({...x,[k]:v}));

  return(
    <div style={s.content}>
      <div style={s.toolbar}>
        <div style={s.sb}><input style={s.si} placeholder="Search customers..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <button style={s.btn("primary")} onClick={openCreate}>+ New customer</button>
      </div>
      <div style={s.tw}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={s.th}>Name</th><th style={s.th}>Code</th><th style={s.th}>Type</th><th style={s.th}>Country</th><th style={s.th}>Region</th><th style={s.th}>Status</th><th style={s.th}>PSA End</th><th style={s.th}></th></tr></thead>
          <tbody>
            {list.length===0&&<tr><td colSpan={8} style={{...s.td,...s.empty}}>No customers yet.</td></tr>}
            {list.map(c=>(
              <tr key={c.id} style={{cursor:"pointer"}} onClick={()=>openEdit(c)}>
                <td style={s.td}><div style={{fontWeight:500,color:C.g900}}>{c.name}</div><div style={{fontSize:11,color:C.g400}}>{c.legalName}</div></td>
                <td style={{...s.td,fontFamily:"monospace",fontSize:12,color:C.g500}}>{c.accountCode||"—"}</td>
                <td style={s.td}><span style={s.badge("blue")}>{c.customerType}</span></td>
                <td style={s.td}><span style={s.tag}>{c.country}</span></td>
                <td style={{...s.td,fontSize:12,color:C.g500}}>{c.region}</td>
                <td style={s.td}><span style={s.badge(statusColor(c.status))}>{c.status}</span></td>
                <td style={{...s.td,fontSize:12,color:C.g500}}>{c.psaEnd||"—"}</td>
                <td style={s.td} onClick={e=>e.stopPropagation()}><button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>del(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal==="form"&&(
        <Modal title={eid?"Edit customer":"New customer"} onClose={()=>setModal(null)} onSave={save} saveLabel={eid?"Save changes":"Create customer"}>
          <div style={{...s.alert("blue"),marginBottom:14}}>Tags are governed by the Tag Master. Add new options there if needed.</div>
          <Grid2>
            <F label="Customer name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. Johnson & Johnson"/></F>
            <F label="Legal name"><input style={s.input} value={form.legalName||""} onChange={e=>f("legalName",e.target.value)} placeholder="Full legal entity name"/></F>
            <F label="Account code"><input style={s.input} value={form.accountCode||""} onChange={e=>f("accountCode",e.target.value)} placeholder="e.g. JNJ-001"/></F>
            <F label="Status" req><select style={s.select} value={form.status||"active"} onChange={e=>f("status",e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></F>
            <F label="Customer type" req>
              <select style={s.select} value={form.customerTypeTag||""} onChange={e=>f("customerTypeTag",e.target.value)}>
                <option value="">Select...</option>
                {typeTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </F>
            <F label="Region" req>
              <select style={s.select} value={form.regionTag||""} onChange={e=>f("regionTag",e.target.value)}>
                <option value="">Select...</option>
                {regionTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </F>
            <F label="Country" req>
              <select style={s.select} value={form.countryTag||""} onChange={e=>f("countryTag",e.target.value)}>
                <option value="">Select...</option>
                {countryTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </F>
            <F label="PSA start date"><input type="date" style={s.input} value={form.psaStart||""} onChange={e=>f("psaStart",e.target.value)}/></F>
            <F label="PSA end date"><input type="date" style={s.input} value={form.psaEnd||""} onChange={e=>f("psaEnd",e.target.value)}/></F>
            <F label="City"><input style={s.input} value={form.city||""} onChange={e=>f("city",e.target.value)} placeholder="City"/></F>
          </Grid2>
          <F label="Address"><input style={s.input} value={form.address||""} onChange={e=>f("address",e.target.value)} placeholder="Street address"/></F>
        </Modal>
      )}
    </div>
  );
}

// ── CONTRACTS ────────────────────────────────────────────────────────────────
function Contracts({data,setData}){
  const [q,setQ]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [eid,setEid]=useState(null);
  const gc=id=>data.customers.find(c=>c.id===id)||{};
  const list=data.contracts.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||gc(c.customerId).name?.toLowerCase().includes(q.toLowerCase()));
  function openCreate(){setForm({status:"draft",currency:"USD",paymentTerms:"Net 30"});setEid(null);setModal("form");}
  function openEdit(c){setForm({...c});setEid(c.id);setModal("form");}
  function save(){
    if(!form.name||!form.customerId)return alert("Name and customer are required");
    if(!form.startDate||!form.endDate)return alert("Start and end dates are required");
    if(eid){setData(d=>({...d,contracts:d.contracts.map(c=>c.id===eid?{...form,id:eid}:c)}))}
    else{setData(d=>({...d,contracts:[...d.contracts,{...form,id:genId("CT")}]}))}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this contract?"))setData(d=>({...d,contracts:d.contracts.filter(c=>c.id!==id)}))}
  const f=(k,v)=>setForm(x=>({...x,[k]:v}));
  return(
    <div style={s.content}>
      <div style={s.toolbar}>
        <div style={s.sb}><input style={s.si} placeholder="Search contracts..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <button style={s.btn("primary")} onClick={openCreate}>+ New contract</button>
      </div>
      <div style={s.tw}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={s.th}>Contract name</th><th style={s.th}>Customer</th><th style={s.th}>Currency</th><th style={s.th}>Value</th><th style={s.th}>Status</th><th style={s.th}>End date</th><th style={s.th}></th></tr></thead>
          <tbody>
            {list.length===0&&<tr><td colSpan={7} style={{...s.td,...s.empty}}>No contracts yet.</td></tr>}
            {list.map(c=>(
              <tr key={c.id} onClick={()=>openEdit(c)} style={{cursor:"pointer"}}>
                <td style={s.td}><div style={{fontWeight:500,color:C.g900}}>{c.name}</div></td>
                <td style={{...s.td,color:C.b600,fontWeight:500}}>{gc(c.customerId).name||"—"}</td>
                <td style={s.td}><span style={s.tag}>{c.currency}</span></td>
                <td style={{...s.td,fontWeight:500}}>{c.value?"$"+Number(c.value).toLocaleString():"—"}</td>
                <td style={s.td}><span style={s.badge(statusColor(c.status))}>{c.status}</span></td>
                <td style={{...s.td,fontSize:12,color:C.g500}}>{c.endDate||"—"}</td>
                <td style={s.td} onClick={e=>e.stopPropagation()}><button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>del(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal==="form"&&(
        <Modal title={eid?"Edit contract":"New contract"} onClose={()=>setModal(null)} onSave={save} saveLabel={eid?"Save changes":"Create contract"}>
          <Grid2>
            <F label="Contract name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. Regulatory Submission Support"/></F>
            <F label="Customer" req><select style={s.select} value={form.customerId||""} onChange={e=>f("customerId",e.target.value)}><option value="">Select customer...</option>{data.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></F>
            <F label="Status" req><select style={s.select} value={form.status||"draft"} onChange={e=>f("status",e.target.value)}>{["draft","active","on_hold","expired","terminated"].map(st=><option key={st} value={st}>{st}</option>)}</select></F>
            <F label="Currency" req><select style={s.select} value={form.currency||"USD"} onChange={e=>f("currency",e.target.value)}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></F>
            <F label="Contract value"><input type="number" style={s.input} value={form.value||""} onChange={e=>f("value",e.target.value)} placeholder="0.00"/></F>
            <F label="Payment terms"><select style={s.select} value={form.paymentTerms||"Net 30"} onChange={e=>f("paymentTerms",e.target.value)}>{PAYMENT_TERMS.map(p=><option key={p}>{p}</option>)}</select></F>
            <F label="Start date" req><input type="date" style={s.input} value={form.startDate||""} onChange={e=>f("startDate",e.target.value)}/></F>
            <F label="End date" req><input type="date" style={s.input} value={form.endDate||""} onChange={e=>f("endDate",e.target.value)}/></F>
          </Grid2>
          <F label="Notes"><textarea style={{...s.input,resize:"none"}} rows={2} value={form.notes||""} onChange={e=>f("notes",e.target.value)} placeholder="Optional notes..."/></F>
        </Modal>
      )}
    </div>
  );
}

// ── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({data,setData}){
  const [q,setQ]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [eid,setEid]=useState(null);
  const gct=id=>data.contracts.find(c=>c.id===id)||{};
  const gcu=cid=>{const ct=gct(cid);return data.customers.find(c=>c.id===ct.customerId)||{};};

  const divTags=data.tags.tags.filter(t=>t.categoryId==="TC001"&&t.status==="active");
  const deptTags=data.tags.tags.filter(t=>t.categoryId==="TC002"&&t.status==="active");
  const regionTags=data.tags.tags.filter(t=>t.categoryId==="TC003"&&t.status==="active");
  const countryTags=data.tags.tags.filter(t=>t.categoryId==="TC004"&&t.status==="active");

  const list=data.projects.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
  function openCreate(){setForm({status:"draft"});setEid(null);setModal("form");}
  function openEdit(p){setForm({...p});setEid(p.id);setModal("form");}
  function save(){
    if(!form.name||!form.contractId)return alert("Name and contract are required");
    if(!form.divisionTag||!form.departmentTag||!form.regionTag||!form.countryTag)return alert("All four tags (Division, Department, Region, Country) are mandatory");
    const divName=divTags.find(t=>t.id===form.divisionTag)?.name||"";
    const deptName=deptTags.find(t=>t.id===form.departmentTag)?.name||"";
    const regionName=regionTags.find(t=>t.id===form.regionTag)?.name||"";
    const countryName=countryTags.find(t=>t.id===form.countryTag)?.name||"";
    const record={...form,division:divName,department:deptName,region:regionName,country:countryName};
    if(eid){setData(d=>({...d,projects:d.projects.map(p=>p.id===eid?{...record,id:eid}:p)}))}
    else{setData(d=>({...d,projects:[...d.projects,{...record,id:genId("P")}]}))}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this project?"))setData(d=>({...d,projects:d.projects.filter(p=>p.id!==id)}))}
  const f=(k,v)=>setForm(x=>({...x,[k]:v}));
  return(
    <div style={s.content}>
      <div style={s.toolbar}>
        <div style={s.sb}><input style={s.si} placeholder="Search projects..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <button style={s.btn("primary")} onClick={openCreate}>+ New project</button>
      </div>
      <div style={s.tw}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={s.th}>Project</th><th style={s.th}>Customer</th><th style={s.th}>Division</th><th style={s.th}>Status</th><th style={s.th}>Start</th><th style={s.th}>End</th><th style={s.th}></th></tr></thead>
          <tbody>
            {list.length===0&&<tr><td colSpan={7} style={{...s.td,...s.empty}}>No projects yet.</td></tr>}
            {list.map(p=>(
              <tr key={p.id} onClick={()=>openEdit(p)} style={{cursor:"pointer"}}>
                <td style={s.td}><div style={{fontWeight:500,color:C.g900}}>{p.name}</div><div style={{fontSize:11,color:C.g400}}>{gct(p.contractId).name||"—"}</div></td>
                <td style={{...s.td,color:C.b600,fontWeight:500}}>{gcu(p.contractId).name||"—"}</td>
                <td style={s.td}><span style={s.tag}>{p.division}</span></td>
                <td style={s.td}><span style={s.badge(statusColor(p.status))}>{p.status}</span></td>
                <td style={{...s.td,fontSize:12,color:C.g500}}>{p.startDate||"—"}</td>
                <td style={{...s.td,fontSize:12,color:C.g500}}>{p.endDate||"—"}</td>
                <td style={s.td} onClick={e=>e.stopPropagation()}><button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>del(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal==="form"&&(
        <Modal title={eid?"Edit project":"New project"} onClose={()=>setModal(null)} onSave={save} saveLabel={eid?"Save changes":"Create project"} wide>
          <div style={{...s.alert("blue"),marginBottom:14}}>Division, Department, Region and Country are mandatory tags governed by Tag Master.</div>
          <Grid2>
            <F label="Project name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. Dossier Prep & Submission"/></F>
            <F label="Contract" req><select style={s.select} value={form.contractId||""} onChange={e=>f("contractId",e.target.value)}><option value="">Select contract...</option>{data.contracts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></F>
            <F label="Status" req><select style={s.select} value={form.status||"draft"} onChange={e=>f("status",e.target.value)}>{["draft","active","on_hold","completed","cancelled"].map(st=><option key={st} value={st}>{st}</option>)}</select></F>
            <F label="Division" req><select style={s.select} value={form.divisionTag||""} onChange={e=>f("divisionTag",e.target.value)}><option value="">Select...</option>{divTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></F>
            <F label="Department" req><select style={s.select} value={form.departmentTag||""} onChange={e=>f("departmentTag",e.target.value)}><option value="">Select...</option>{deptTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></F>
            <F label="Region" req><select style={s.select} value={form.regionTag||""} onChange={e=>f("regionTag",e.target.value)}><option value="">Select...</option>{regionTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></F>
            <F label="Country" req><select style={s.select} value={form.countryTag||""} onChange={e=>f("countryTag",e.target.value)}><option value="">Select...</option>{countryTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></F>
            <F label="Start date"><input type="date" style={s.input} value={form.startDate||""} onChange={e=>f("startDate",e.target.value)}/></F>
            <F label="End date"><input type="date" style={s.input} value={form.endDate||""} onChange={e=>f("endDate",e.target.value)}/></F>
          </Grid2>
          <F label="Scope summary"><textarea style={{...s.input,resize:"none"}} rows={2} value={form.scopeSummary||""} onChange={e=>f("scopeSummary",e.target.value)} placeholder="Brief description of project scope..."/></F>
        </Modal>
      )}
    </div>
  );
}

// ── SERVICE LINES ─────────────────────────────────────────────────────────────
function ServiceLines({data,setData}){
  const [q,setQ]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [eid,setEid]=useState(null);
  const gp=id=>data.projects.find(p=>p.id===id)||{};

  const divTags=data.tags.tags.filter(t=>t.categoryId==="TC001"&&t.status==="active");
  const deptTags=data.tags.tags.filter(t=>t.categoryId==="TC002"&&t.status==="active");
  const countryTags=data.tags.tags.filter(t=>t.categoryId==="TC004"&&t.status==="active");
  const serviceTags=data.tags.tags.filter(t=>t.categoryId==="TC006"&&t.status==="active");

  const list=data.serviceLines.filter(sl=>sl.name.toLowerCase().includes(q.toLowerCase()));
  function openCreate(){setForm({status:"draft",commercialType:"fixed_price",billingBasis:"milestone",currency:"USD"});setEid(null);setModal("form");}
  function openEdit(sl){setForm({...sl});setEid(sl.id);setModal("form");}
  function save(){
    if(!form.name||!form.projectId||!form.serviceTag)return alert("Name, project and service are required");
    if(!form.divisionTag||!form.departmentTag||!form.countryTag)return alert("Division, Department and Country are mandatory tags");
    const divName=divTags.find(t=>t.id===form.divisionTag)?.name||"";
    const deptName=deptTags.find(t=>t.id===form.departmentTag)?.name||"";
    const countryName=countryTags.find(t=>t.id===form.countryTag)?.name||"";
    const serviceName=serviceTags.find(t=>t.id===form.serviceTag)?.name||"";
    const record={...form,division:divName,department:deptName,country:countryName,service:serviceName};
    if(eid){setData(d=>({...d,serviceLines:d.serviceLines.map(sl=>sl.id===eid?{...record,id:eid}:sl)}))}
    else{setData(d=>({...d,serviceLines:[...d.serviceLines,{...record,id:genId("SL")}]}))}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this service line?"))setData(d=>({...d,serviceLines:d.serviceLines.filter(sl=>sl.id!==id)}))}
  const f=(k,v)=>setForm(x=>({...x,[k]:v}));
  return(
    <div style={s.content}>
      <div style={s.toolbar}>
        <div style={s.sb}><input style={s.si} placeholder="Search service lines..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <button style={s.btn("primary")} onClick={openCreate}>+ New service line</button>
      </div>
      <div style={s.tw}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={s.th}>Service line</th><th style={s.th}>Project</th><th style={s.th}>Service</th><th style={s.th}>Commercial type</th><th style={s.th}>Billing basis</th><th style={s.th}>Status</th><th style={s.th}></th></tr></thead>
          <tbody>
            {list.length===0&&<tr><td colSpan={7} style={{...s.td,...s.empty}}>No service lines yet.</td></tr>}
            {list.map(sl=>(
              <tr key={sl.id} onClick={()=>openEdit(sl)} style={{cursor:"pointer"}}>
                <td style={s.td}><div style={{fontWeight:500,color:C.g900}}>{sl.name}</div><div style={{fontSize:11,color:C.g400}}>{sl.division} · {sl.department}</div></td>
                <td style={{...s.td,color:C.b600,fontWeight:500,fontSize:12}}>{gp(sl.projectId).name||"—"}</td>
                <td style={s.td}><span style={s.tag}>{sl.service}</span></td>
                <td style={s.td}><span style={s.badge("blue")}>{commLabel(sl.commercialType)}</span></td>
                <td style={{...s.td,fontSize:12,color:C.g500}}>{sl.billingBasis}</td>
                <td style={s.td}><span style={s.badge(statusColor(sl.status))}>{sl.status}</span></td>
                <td style={s.td} onClick={e=>e.stopPropagation()}><button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>del(sl.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal==="form"&&(
        <Modal title={eid?"Edit service line":"New service line"} onClose={()=>setModal(null)} onSave={save} saveLabel={eid?"Save changes":"Create service line"} wide>
          <div style={{...s.alert("blue"),marginBottom:14}}>Division, Department and Country are mandatory tags governed by Tag Master.</div>
          <Grid2>
            <F label="Service line name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. HA Query Support"/></F>
            <F label="Project" req><select style={s.select} value={form.projectId||""} onChange={e=>f("projectId",e.target.value)}><option value="">Select project...</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></F>
            <F label="Service" req><select style={s.select} value={form.serviceTag||""} onChange={e=>f("serviceTag",e.target.value)}><option value="">Select service...</option>{serviceTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></F>
            <F label="Commercial type" req><select style={s.select} value={form.commercialType||""} onChange={e=>f("commercialType",e.target.value)}>{COMM_TYPES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></F>
            <F label="Billing basis" req><select style={s.select} value={form.billingBasis||""} onChange={e=>f("billingBasis",e.target.value)}>{BILLING_BASIS.map(b=><option key={b}>{b}</option>)}</select></F>
            <F label="Currency" req><select style={s.select} value={form.currency||"USD"} onChange={e=>f("currency",e.target.value)}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></F>
            <F label="Division" req><select style={s.select} value={form.divisionTag||""} onChange={e=>f("divisionTag",e.target.value)}><option value="">Select...</option>{divTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></F>
            <F label="Department" req><select style={s.select} value={form.departmentTag||""} onChange={e=>f("departmentTag",e.target.value)}><option value="">Select...</option>{deptTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></F>
            <F label="Country" req><select style={s.select} value={form.countryTag||""} onChange={e=>f("countryTag",e.target.value)}><option value="">Select...</option>{countryTags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></F>
            <F label="Status"><select style={s.select} value={form.status||"draft"} onChange={e=>f("status",e.target.value)}>{["draft","active","on_hold","completed","cancelled"].map(st=><option key={st} value={st}>{st}</option>)}</select></F>
            <F label="Forecast start month"><input type="month" style={s.input} value={form.forecastStart||""} onChange={e=>f("forecastStart",e.target.value)}/></F>
            <F label="Forecast end month"><input type="month" style={s.input} value={form.forecastEnd||""} onChange={e=>f("forecastEnd",e.target.value)}/></F>
          </Grid2>
          <F label="Notes"><textarea style={{...s.input,resize:"none"}} rows={2} value={form.notes||""} onChange={e=>f("notes",e.target.value)} placeholder="Optional notes..."/></F>
        </Modal>
      )}
    </div>
  );
}

// ── INVOICES ─────────────────────────────────────────────────────────────────
function Invoices({data,setData}){
  const [q,setQ]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [lines,setLines]=useState([]);
  const [eid,setEid]=useState(null);
  const gc=id=>data.customers.find(c=>c.id===id)||{};
  const gct=id=>data.contracts.find(c=>c.id===id)||{};
  const gsl=id=>data.serviceLines.find(sl=>sl.id===id)||{};
  const total=ls=>ls.reduce((a,l)=>a+Number(l.amount||0),0);
  const list=data.invoices.filter(i=>i.number.toLowerCase().includes(q.toLowerCase())||gc(i.customerId).name?.toLowerCase().includes(q.toLowerCase()));
  function openCreate(){
    const yr=new Date().getFullYear();
    const seq=String(data.invoices.length+1832).padStart(4,"0");
    setForm({status:"draft",currency:"USD",invoiceDate:new Date().toISOString().slice(0,10),number:`FRUS${yr}${seq}`});
    setLines([{id:genId("IL"),description:"",serviceLineId:"",qty:"",rate:"",amount:""}]);
    setEid(null);setModal("form");
  }
  function openView(inv){setForm({...inv});setLines(inv.lines||[]);setEid(inv.id);setModal("view");}
  function addLine(){setLines(ls=>[...ls,{id:genId("IL"),description:"",serviceLineId:"",qty:"",rate:"",amount:""}]);}
  function ul(id,k,v){
    setLines(ls=>ls.map(l=>{
      if(l.id!==id)return l;
      const u={...l,[k]:v};
      if((k==="qty"||k==="rate")&&u.qty&&u.rate)u.amount=(Number(u.qty)*Number(u.rate)).toFixed(2);
      return u;
    }));
  }
  function removeLine(id){setLines(ls=>ls.filter(l=>l.id!==id));}
  function save(){
    if(!form.customerId||!form.contractId)return alert("Customer and contract are required");
    const inv={...form,totalAmount:total(lines),lines};
    if(eid){setData(d=>({...d,invoices:d.invoices.map(i=>i.id===eid?{...inv,id:eid}:i)}))}
    else{setData(d=>({...d,invoices:[...d.invoices,{...inv,id:genId("INV")}]}))}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this invoice?"))setData(d=>({...d,invoices:d.invoices.filter(i=>i.id!==id)}))}
  const f=(k,v)=>setForm(x=>({...x,[k]:v}));
  const totalInv=data.invoices.reduce((a,i)=>a+i.totalAmount,0);
  const totalPaid=data.invoices.filter(i=>i.status==="paid").reduce((a,i)=>a+i.totalAmount,0);
  return(
    <div style={s.content}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
        <div style={s.kpi(C.b600)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Total invoiced</div><div style={{fontSize:20,fontWeight:700,color:C.g900}}>${totalInv.toLocaleString()}</div></div>
        <div style={s.kpi(C.grn)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Total paid</div><div style={{fontSize:20,fontWeight:700,color:C.grnTxt}}>${totalPaid.toLocaleString()}</div></div>
        <div style={s.kpi(C.amb)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Outstanding</div><div style={{fontSize:20,fontWeight:700,color:(totalInv-totalPaid)>0?C.ambTxt:C.grnTxt}}>${(totalInv-totalPaid).toLocaleString()}</div></div>
      </div>
      <div style={s.toolbar}>
        <div style={s.sb}><input style={s.si} placeholder="Search invoices..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <button style={s.btn("primary")} onClick={openCreate}>+ New invoice</button>
      </div>
      <div style={s.tw}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={s.th}>Invoice no.</th><th style={s.th}>Customer</th><th style={s.th}>Currency</th><th style={s.th}>Amount</th><th style={s.th}>Status</th><th style={s.th}>Date</th><th style={s.th}></th></tr></thead>
          <tbody>
            {list.length===0&&<tr><td colSpan={7} style={{...s.td,...s.empty}}>No invoices yet.</td></tr>}
            {list.map(inv=>(
              <tr key={inv.id} onClick={()=>openView(inv)} style={{cursor:"pointer"}}>
                <td style={{...s.td,fontFamily:"monospace",fontWeight:600,color:C.g900}}>{inv.number}</td>
                <td style={{...s.td,color:C.b600,fontWeight:500}}>{gc(inv.customerId).name||"—"}</td>
                <td style={s.td}><span style={s.tag}>{inv.currency}</span></td>
                <td style={{...s.td,fontWeight:500}}>${Number(inv.totalAmount||0).toLocaleString()}</td>
                <td style={s.td}><span style={s.badge(statusColor(inv.status))}>{inv.status}</span></td>
                <td style={{...s.td,fontSize:12,color:C.g500}}>{inv.invoiceDate||"—"}</td>
                <td style={s.td} onClick={e=>e.stopPropagation()}><button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>del(inv.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal==="form"&&(
        <Modal title="New invoice" onClose={()=>setModal(null)} onSave={save} saveLabel="Create invoice" wide>
          <Grid2>
            <F label="Invoice number"><input style={{...s.input,background:C.g50,color:C.g500}} value={form.number||""} readOnly/></F>
            <F label="Status"><select style={s.select} value={form.status||"draft"} onChange={e=>f("status",e.target.value)}>{["draft","submitted","paid","partially_paid","overdue","void"].map(st=><option key={st} value={st}>{st}</option>)}</select></F>
            <F label="Customer" req><select style={s.select} value={form.customerId||""} onChange={e=>f("customerId",e.target.value)}><option value="">Select customer...</option>{data.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></F>
            <F label="Contract" req><select style={s.select} value={form.contractId||""} onChange={e=>f("contractId",e.target.value)}><option value="">Select contract...</option>{data.contracts.filter(c=>!form.customerId||c.customerId===form.customerId).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></F>
            <F label="Invoice date"><input type="date" style={s.input} value={form.invoiceDate||""} onChange={e=>f("invoiceDate",e.target.value)}/></F>
            <F label="Currency"><select style={s.select} value={form.currency||"USD"} onChange={e=>f("currency",e.target.value)}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></F>
            <F label="Billing period from"><input type="date" style={s.input} value={form.billingPeriodStart||""} onChange={e=>f("billingPeriodStart",e.target.value)}/></F>
            <F label="Billing period to"><input type="date" style={s.input} value={form.billingPeriodEnd||""} onChange={e=>f("billingPeriodEnd",e.target.value)}/></F>
          </Grid2>
          <div style={{fontWeight:600,color:C.g800,fontSize:13,marginBottom:8}}>Invoice lines</div>
          <div style={{border:"1px solid "+C.g200,borderRadius:8,overflow:"hidden",marginBottom:10}}>
            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr 1fr 1fr 1fr 32px",background:C.g50,borderBottom:"1px solid "+C.g200}}>
              {["Description","Service line","Qty","Rate","Amount",""].map((h,i)=><div key={i} style={{padding:"6px 10px",fontSize:11,fontWeight:600,color:C.g500,textTransform:"uppercase"}}>{h}</div>)}
            </div>
            {lines.map(l=>(
              <div key={l.id} style={{display:"grid",gridTemplateColumns:"3fr 2fr 1fr 1fr 1fr 32px",borderBottom:"1px solid "+C.g100}}>
                <div style={{padding:6}}><input style={{...s.input,border:"none",background:"transparent"}} value={l.description} onChange={e=>ul(l.id,"description",e.target.value)} placeholder="Description..."/></div>
                <div style={{padding:6}}><select style={{...s.select,border:"none",background:"transparent",fontSize:12}} value={l.serviceLineId} onChange={e=>ul(l.id,"serviceLineId",e.target.value)}><option value="">Select SL...</option>{data.serviceLines.map(sl=><option key={sl.id} value={sl.id}>{sl.name}</option>)}</select></div>
                <div style={{padding:6}}><input style={{...s.input,border:"none",background:"transparent",textAlign:"right"}} type="number" value={l.qty} onChange={e=>ul(l.id,"qty",e.target.value)} placeholder="—"/></div>
                <div style={{padding:6}}><input style={{...s.input,border:"none",background:"transparent",textAlign:"right"}} type="number" value={l.rate} onChange={e=>ul(l.id,"rate",e.target.value)} placeholder="—"/></div>
                <div style={{padding:6}}><input style={{...s.input,border:"none",background:"transparent",textAlign:"right",fontWeight:500}} type="number" value={l.amount} onChange={e=>ul(l.id,"amount",e.target.value)} placeholder="0.00"/></div>
                <div style={{padding:6,display:"flex",alignItems:"center",justifyContent:"center"}}><button onClick={()=>removeLine(l.id)} style={{border:"none",background:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button></div>
              </div>
            ))}
            <div style={{padding:"8px 10px",background:C.g50,cursor:"pointer",color:C.b600,fontSize:12,fontWeight:500}} onClick={addLine}>+ Add line</div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12,marginBottom:12}}>
            <span style={{fontSize:13,color:C.g500}}>Total:</span>
            <span style={{fontSize:18,fontWeight:700,color:C.g900}}>{form.currency||"USD"} {total(lines).toLocaleString()}</span>
          </div>
          <F label="Notes"><textarea style={{...s.input,resize:"none"}} rows={2} value={form.notes||""} onChange={e=>f("notes",e.target.value)} placeholder="Optional billing notes..."/></F>
        </Modal>
      )}
      {modal==="view"&&(
        <Modal title={form.number} onClose={()=>setModal(null)} wide>
          <Grid2>
            <div><div style={{fontSize:11,color:C.g400,marginBottom:2}}>CUSTOMER</div><div style={{fontWeight:500,color:C.b600}}>{gc(form.customerId).name}</div></div>
            <div><div style={{fontSize:11,color:C.g400,marginBottom:2}}>CONTRACT</div><div style={{fontWeight:500}}>{gct(form.contractId).name}</div></div>
            <div><div style={{fontSize:11,color:C.g400,marginBottom:2}}>STATUS</div><span style={s.badge(statusColor(form.status))}>{form.status}</span></div>
            <div><div style={{fontSize:11,color:C.g400,marginBottom:2}}>DATE</div><div style={{fontWeight:500}}>{form.invoiceDate}</div></div>
            <div><div style={{fontSize:11,color:C.g400,marginBottom:2}}>PERIOD</div><div style={{fontSize:12,color:C.g500}}>{form.billingPeriodStart} → {form.billingPeriodEnd}</div></div>
            <div><div style={{fontSize:11,color:C.g400,marginBottom:2}}>CURRENCY</div><span style={s.tag}>{form.currency}</span></div>
          </Grid2>
          <div style={{height:12}}/>
          <div style={{border:"1px solid "+C.g200,borderRadius:8,overflow:"hidden",marginBottom:12}}>
            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr 1fr 1fr 1fr",background:C.g50,borderBottom:"1px solid "+C.g200}}>
              {["Description","Service line","Qty","Rate","Amount"].map((h,i)=><div key={i} style={{padding:"7px 10px",fontSize:11,fontWeight:600,color:C.g500,textTransform:"uppercase"}}>{h}</div>)}
            </div>
            {(form.lines||[]).map(l=>(
              <div key={l.id} style={{display:"grid",gridTemplateColumns:"3fr 2fr 1fr 1fr 1fr",borderBottom:"1px solid "+C.g100}}>
                <div style={{padding:"9px 10px",fontWeight:500,color:C.g800,fontSize:13}}>{l.description}</div>
                <div style={{padding:"9px 10px",fontSize:12,color:C.b600}}>{gsl(l.serviceLineId).name||"—"}</div>
                <div style={{padding:"9px 10px",fontSize:12,color:C.g500,textAlign:"right"}}>{l.qty||"—"}</div>
                <div style={{padding:"9px 10px",fontSize:12,color:C.g500,textAlign:"right"}}>{l.rate?"$"+l.rate:"—"}</div>
                <div style={{padding:"9px 10px",fontWeight:600,color:C.g900,textAlign:"right"}}>${Number(l.amount||0).toLocaleString()}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",gap:12,padding:"10px 14px",background:C.g50,borderTop:"2px solid "+C.g200}}>
              <span style={{fontSize:13,color:C.g500}}>Total:</span>
              <span style={{fontSize:16,fontWeight:700,color:C.g900}}>{form.currency} {Number(form.totalAmount||0).toLocaleString()}</span>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <button style={{...s.btn("danger"),...s.btnSm}} onClick={()=>{del(form.id);setModal(null);}}>Delete invoice</button>
            <button style={s.btn()} onClick={()=>setModal(null)}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── NAV TABS ──────────────────────────────────────────────────────────────────
const TABS=[
  {id:"dashboard",label:"Dashboard"},
  {id:"tagmaster",label:"Tag Master"},
  {id:"customers",label:"Customers"},
  {id:"contracts",label:"Contracts"},
  {id:"projects",label:"Projects"},
  {id:"serviceLines",label:"Service Lines"},
  {id:"invoices",label:"Invoices"},
];

export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [data,setData]=useState(INIT);
  const title=TABS.find(t=>t.id===tab)?.label||"";
  return(
    <div style={s.app}>
      <div style={s.nav}>
        <div style={{width:28,height:28,background:"rgba(255,255,255,0.2)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="2" y="2" width="5" height="5" rx="1" fill="white" opacity="0.9"/><rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6"/><rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6"/><rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.3"/></svg>
        </div>
        <div style={{marginLeft:6,marginRight:12,flexShrink:0}}><div style={s.logoName}>Freyr Pulse</div><div style={s.logoTag}>Enterprise</div></div>
        <div style={{width:1,height:24,background:"rgba(255,255,255,0.2)",marginRight:4,flexShrink:0}}/>
        {TABS.map(t=><button key={t.id} style={s.navLink(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        <div style={{marginLeft:"auto",width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"#fff",flexShrink:0}}>SA</div>
      </div>
      <div style={s.body}>
        <div style={s.sidebar}>
          <div style={s.sideSection}>
            <div style={s.sideLabel}>Modules</div>
            {TABS.map(t=><button key={t.id} style={s.sideItem(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>)}
          </div>
          <div style={s.sideDivider}/>
          <div style={s.sideSection}>
            <div style={s.sideLabel}>Summary</div>
            <div style={{padding:"5px 8px",fontSize:12,color:C.g500}}>{data.customers.length} customers</div>
            <div style={{padding:"5px 8px",fontSize:12,color:C.g500}}>{data.contracts.length} contracts</div>
            <div style={{padding:"5px 8px",fontSize:12,color:C.g500}}>{data.projects.length} projects</div>
            <div style={{padding:"5px 8px",fontSize:12,color:C.g500}}>{data.serviceLines.length} service lines</div>
            <div style={{padding:"5px 8px",fontSize:12,color:C.g500}}>{data.invoices.length} invoices</div>
            <div style={{padding:"5px 8px",fontSize:12,color:C.g500}}>{data.tags.tags.length} tags</div>
          </div>
        </div>
        <div style={s.main}>
          <div style={s.pageHeader}><div style={s.pageTitle}>{title}</div><div style={{fontSize:12,color:C.g400}}>Freyr Pulse · Admin</div></div>
          {tab==="dashboard"&&<Dashboard data={data}/>}
          {tab==="tagmaster"&&<TagMaster data={data} setData={setData}/>}
          {tab==="customers"&&<Customers data={data} setData={setData}/>}
          {tab==="contracts"&&<Contracts data={data} setData={setData}/>}
          {tab==="projects"&&<Projects data={data} setData={setData}/>}
          {tab==="serviceLines"&&<ServiceLines data={data} setData={setData}/>}
          {tab==="invoices"&&<Invoices data={data} setData={setData}/>}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback } from "react";

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  primary: "#2176C7",
  primaryDark: "#1a5fa0",
  primaryLight: "#E6F1FB",
  primaryMid: "#cde3f7",
  white: "#ffffff",
  bg: "#f4f7fb",
  sidebar: "#0C1F3D",
  sidebarText: "#a8bdd6",
  sidebarActive: "#2176C7",
  border: "#dde4ed",
  text: "#1a2535",
  textSub: "#5a6a7e",
  textMuted: "#8fa0b4",
  success: "#16a34a",
  successBg: "#dcfce7",
  warning: "#d97706",
  warningBg: "#fef3c7",
  danger: "#dc2626",
  dangerBg: "#fee2e2",
  info: "#0369a1",
  infoBg: "#e0f2fe",
  purple: "#7c3aed",
  purpleBg: "#ede9fe",
};

// ─── Utility helpers ──────────────────────────────────────────────────────────
const s = (obj) => ({ ...obj }); // passthrough for IDE hints
const fmt = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
const fmtN = (n) => new Intl.NumberFormat("en-US").format(n);
const pct = (n) => `${n.toFixed(1)}%`;

// ─── Shared primitives ────────────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style }) => {
  const base = {
    border: "none", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, transition: "all 0.15s", opacity: disabled ? 0.5 : 1,
    padding: size === "sm" ? "5px 12px" : size === "lg" ? "10px 22px" : "7px 16px",
    fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
  };
  const variants = {
    primary: { background: C.primary, color: C.white },
    secondary: { background: C.white, color: C.primary, border: `1.5px solid ${C.primary}` },
    ghost: { background: "transparent", color: C.textSub },
    danger: { background: C.danger, color: C.white },
    success: { background: C.success, color: C.white },
    warning: { background: C.warning, color: C.white },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = "blue", dot }) => {
  const colors = {
    blue: { bg: C.primaryLight, text: C.primary },
    green: { bg: C.successBg, text: C.success },
    amber: { bg: C.warningBg, text: C.warning },
    red: { bg: C.dangerBg, text: C.danger },
    purple: { bg: C.purpleBg, text: C.purple },
    gray: { bg: "#f1f5f9", text: C.textSub },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.text }} />}
      {children}
    </span>
  );
};

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, ...style, cursor: onClick ? "pointer" : undefined }}>
    {children}
  </div>
);

const KpiCard = ({ label, value, sub, accent = C.primary, badge }) => (
  <Card style={{ borderTop: `3px solid ${accent}`, flex: 1, minWidth: 150 }}>
    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "6px 0 4px" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: C.textSub }}>{sub}</div>}
    {badge && <div style={{ marginTop: 6 }}>{badge}</div>}
  </Card>
);

const Input = ({ label, value, onChange, type = "text", placeholder, required, readOnly, style, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textSub }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
    <input
      type={type} value={value} onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder} readOnly={readOnly}
      style={{ border: `1.5px solid ${C.border}`, borderRadius: 6, padding: "7px 11px", fontSize: 13, color: C.text, background: readOnly ? C.bg : C.white, outline: "none", ...style }}
    />
    {hint && <div style={{ fontSize: 11, color: C.textMuted }}>{hint}</div>}
  </div>
);

const Select = ({ label, value, onChange, options, required, style, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textSub }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
    <select value={value} onChange={e => onChange?.(e.target.value)}
      style={{ border: `1.5px solid ${C.border}`, borderRadius: 6, padding: "7px 11px", fontSize: 13, color: value ? C.text : C.textMuted, background: C.white, outline: "none", ...style }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

const Modal = ({ open, onClose, title, children, width = 640 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.white, borderRadius: 12, width: "100%", maxWidth: width, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.textMuted }}>×</button>
        </div>
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

const Table = ({ cols, rows, onRow }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>{cols.map(c => <th key={c.key} style={{ padding: "9px 14px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: c.right ? "right" : "left", fontWeight: 600, color: C.textSub, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" }}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} onClick={() => onRow?.(r)} style={{ borderBottom: `1px solid ${C.border}`, cursor: onRow ? "pointer" : undefined, transition: "background 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.primaryLight}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {cols.map(c => <td key={c.key} style={{ padding: "10px 14px", color: C.text, textAlign: c.right ? "right" : "left" }}>{c.render ? c.render(r) : r[c.key]}</td>)}
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={cols.length} style={{ padding: "32px 14px", textAlign: "center", color: C.textMuted }}>No records found</td></tr>}
      </tbody>
    </table>
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 2, borderBottom: `1.5px solid ${C.border}`, marginBottom: 20 }}>
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        padding: "9px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: active === t.key ? 700 : 500,
        color: active === t.key ? C.primary : C.textSub, borderBottom: active === t.key ? `2.5px solid ${C.primary}` : "2.5px solid transparent", marginBottom: -1.5, transition: "all 0.15s"
      }}>{t.label}{t.count !== undefined && <span style={{ marginLeft: 6, background: active === t.key ? C.primary : C.border, color: active === t.key ? C.white : C.textSub, borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{t.count}</span>}</button>
    ))}
  </div>
);

const SectionHeader = ({ title, sub, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>{title}</h2>
      {sub && <p style={{ margin: "4px 0 0", color: C.textSub, fontSize: 13 }}>{sub}</p>}
    </div>
    {action}
  </div>
);

const Alert = ({ type = "info", children }) => {
  const t = { info: { bg: C.infoBg, text: C.info, icon: "ℹ" }, warning: { bg: C.warningBg, text: C.warning, icon: "⚠" }, danger: { bg: C.dangerBg, text: C.danger, icon: "✕" }, success: { bg: C.successBg, text: C.success, icon: "✓" } };
  const cfg = t[type];
  return <div style={{ background: cfg.bg, color: cfg.text, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 500, display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16 }}><span>{cfg.icon}</span><div>{children}</div></div>;
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const CURRENCIES = ["USD", "GBP", "EUR", "CHF", "JPY", "CAD", "AUD", "INR", "SGD", "AED"];
const ROLES = ["Senior Regulatory Affairs Specialist", "Regulatory Affairs Specialist", "Clinical Writer", "Senior Clinical Writer", "Publishing Specialist", "Project Manager", "Principal Consultant", "Associate Consultant"];
const GRADES = ["Associate", "Specialist", "Senior Specialist", "Principal", "Director", "Senior Director"];
const LOCATIONS = ["US", "UK", "EU", "India", "Singapore", "UAE"];
const DIVISIONS = ["Regulatory Affairs", "Clinical Writing", "Publishing", "PV & Safety"];
const DEPARTMENTS = ["Global RA", "CMC", "Labelling", "Clinical Operations", "Medical Writing", "PV Operations"];
const CUSTOMERS_LIST = ["Johnson & Johnson", "AstraZeneca", "GSK", "Pfizer", "Novartis", "Roche", "Merck", "Sanofi", "Bayer", "Abbott"];
const PROJECTS_LIST = [
  { id: "p1", name: "J&J RA Global Support", customer: "Johnson & Johnson", contract: "MSA-JNJ-2024" },
  { id: "p2", name: "AZ Clinical Writing", customer: "AstraZeneca", contract: "MSA-AZ-2024" },
  { id: "p3", name: "GSK Publishing Suite", customer: "GSK", contract: "MSA-GSK-2023" },
  { id: "p4", name: "Pfizer Labelling Hub", customer: "Pfizer", contract: "SOW-PFZ-2025" },
  { id: "p5", name: "Novartis PV Support", customer: "Novartis", contract: "MSA-NOV-2024" },
];
const SERVICE_LINES_LIST = [
  { id: "sl1", name: "HA Query Support", projectId: "p1", project: "J&J RA Global Support", customer: "Johnson & Johnson", commercialType: "T&M Managed", division: "Regulatory Affairs", dept: "Global RA", currency: "USD" },
  { id: "sl2", name: "Regulatory Affairs Fixed", projectId: "p1", project: "J&J RA Global Support", customer: "Johnson & Johnson", commercialType: "Fixed Price", division: "Regulatory Affairs", dept: "CMC", currency: "USD" },
  { id: "sl3", name: "Clinical Writing Support", projectId: "p2", project: "AZ Clinical Writing", customer: "AstraZeneca", commercialType: "T&M Staffing", division: "Clinical Writing", dept: "Medical Writing", currency: "GBP" },
  { id: "sl4", name: "Publishing Unit Work", projectId: "p3", project: "GSK Publishing Suite", customer: "GSK", commercialType: "Unit-Based", division: "Publishing", dept: "Labelling", currency: "GBP" },
  { id: "sl5", name: "PV Safety Review", projectId: "p5", project: "Novartis PV Support", customer: "Novartis", commercialType: "Recurring", division: "PV & Safety", dept: "PV Operations", currency: "EUR" },
];
const COMMERCIAL_TYPES = ["Fixed Price", "T&M Staffing", "T&M Managed", "Unit-Based", "Recurring"];
const MONTHS_2026 = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"];
const CUR_MONTH_IDX = 3; // Apr 2026

// ─── Initial Rate Card data ───────────────────────────────────────────────────
const initRates = [
  { id: "r1", role: "Senior Regulatory Affairs Specialist", grade: "Senior Specialist", location: "US", currency: "USD", unit: "Hour", rate: 185, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r2", role: "Regulatory Affairs Specialist", grade: "Specialist", location: "UK", currency: "GBP", unit: "Hour", rate: 120, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r3", role: "Clinical Writer", grade: "Specialist", location: "US", currency: "USD", unit: "Hour", rate: 145, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r4", role: "Senior Clinical Writer", grade: "Senior Specialist", location: "UK", currency: "GBP", unit: "Hour", rate: 155, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r5", role: "Publishing Specialist", grade: "Specialist", location: "India", currency: "USD", unit: "Page", rate: 45, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r6", role: "Project Manager", grade: "Principal", location: "US", currency: "USD", unit: "Hour", rate: 210, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r7", role: "Principal Consultant", grade: "Director", location: "EU", currency: "EUR", unit: "Day", rate: 1800, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r8", role: "Associate Consultant", grade: "Associate", location: "India", currency: "USD", unit: "Hour", rate: 55, effectiveFrom: "2025-01-01", effectiveTo: "2025-12-31", status: "Retired" },
];

const initOverrides = [
  { id: "o1", serviceLine: "HA Query Support", project: "J&J RA Global Support", customer: "Johnson & Johnson", role: "Senior Regulatory Affairs Specialist", stdRate: 185, overrideRate: 195, currency: "USD", unit: "Hour", deviation: 5.4, reason: "Strategic account premium", effectiveFrom: "2026-01-01" },
  { id: "o2", serviceLine: "Clinical Writing Support", project: "AZ Clinical Writing", customer: "AstraZeneca", role: "Senior Clinical Writer", stdRate: 155, overrideRate: 130, currency: "GBP", unit: "Hour", deviation: -16.1, reason: "Volume discount — 2000+ hrs/yr commitment", effectiveFrom: "2026-01-01" },
  { id: "o3", serviceLine: "PV Safety Review", project: "Novartis PV Support", customer: "Novartis", role: "Principal Consultant", stdRate: 1800, overrideRate: 1950, currency: "EUR", unit: "Day", deviation: 8.3, reason: "Specialist premium — rare expertise", effectiveFrom: "2026-03-01" },
];

const initAlerts = [
  { id: "a1", serviceLine: "HA Query Support", project: "J&J RA Global Support", deliveryOwner: "Jane Smith", role: "Senior Regulatory Affairs Specialist", oldRate: 175, newRate: 185, currency: "USD", effectiveDate: "2026-01-01", status: "Pending", daysOverdue: 94 },
  { id: "a2", serviceLine: "Clinical Writing Support", project: "AZ Clinical Writing", deliveryOwner: "Mike Kumar", role: "Senior Clinical Writer", oldRate: 145, newRate: 155, currency: "GBP", effectiveDate: "2026-01-01", status: "Acknowledged", daysOverdue: 0 },
  { id: "a3", serviceLine: "PV Safety Review", project: "Novartis PV Support", deliveryOwner: "Sara Lee", role: "Principal Consultant", oldRate: 1700, newRate: 1800, currency: "EUR", effectiveDate: "2026-01-01", status: "Pending", daysOverdue: 94 },
  { id: "a4", serviceLine: "Regulatory Affairs Fixed", project: "J&J RA Global Support", deliveryOwner: "Jane Smith", role: "Project Manager", oldRate: 195, newRate: 210, currency: "USD", effectiveDate: "2026-01-01", status: "Pending", daysOverdue: 94 },
];

// ─── FX seed data ─────────────────────────────────────────────────────────────
const FX_PAIRS = ["GBP/USD", "EUR/USD", "CHF/USD", "JPY/USD", "CAD/USD", "AUD/USD", "INR/USD", "SGD/USD", "AED/USD"];
const initFxRates = [
  // GBP
  { id: "fx1", pair: "GBP/USD", from: "GBP", to: "USD", month: "Jan 2026", rate: 1.2720, enteredBy: "Admin", enteredAt: "2026-02-05" },
  { id: "fx2", pair: "GBP/USD", from: "GBP", to: "USD", month: "Feb 2026", rate: 1.2680, enteredBy: "Admin", enteredAt: "2026-03-04" },
  { id: "fx3", pair: "GBP/USD", from: "GBP", to: "USD", month: "Mar 2026", rate: 1.2750, enteredBy: "Admin", enteredAt: "2026-04-03" },
  // EUR
  { id: "fx4", pair: "EUR/USD", from: "EUR", to: "USD", month: "Jan 2026", rate: 1.0840, enteredBy: "Admin", enteredAt: "2026-02-05" },
  { id: "fx5", pair: "EUR/USD", from: "EUR", to: "USD", month: "Feb 2026", rate: 1.0790, enteredBy: "Admin", enteredAt: "2026-03-04" },
  { id: "fx6", pair: "EUR/USD", from: "EUR", to: "USD", month: "Mar 2026", rate: 1.0820, enteredBy: "Admin", enteredAt: "2026-04-03" },
];

// ─── Forecast seed data ───────────────────────────────────────────────────────
const buildForecastEntries = (slId, commercialType) => {
  const entries = {};
  MONTHS_2026.forEach((m, i) => {
    const isPast = i < CUR_MONTH_IDX;
    let qty = null, rate = null, amount = 0, actual = null, note = "";
    if (commercialType === "T&M Managed" || commercialType === "T&M Staffing") {
      qty = 80 + Math.round(Math.random() * 40);
      rate = 185;
      amount = qty * rate;
      actual = isPast ? amount * (0.85 + Math.random() * 0.25) : null;
    } else if (commercialType === "Fixed Price") {
      amount = [45000, 0, 60000, 0, 45000, 0, 60000, 0, 45000, 0, 60000, 30000][i] || 0;
      actual = isPast && amount > 0 ? amount * (0.9 + Math.random() * 0.15) : null;
    } else if (commercialType === "Unit-Based") {
      qty = 200 + Math.round(Math.random() * 100);
      rate = 45;
      amount = qty * rate;
      actual = isPast ? amount * (0.88 + Math.random() * 0.2) : null;
    } else {
      amount = 25000;
      actual = isPast ? 25000 : null;
    }
    entries[m] = { qty, rate, amount: Math.round(amount), actual: actual ? Math.round(actual) : null, note, locked: isPast };
  });
  return entries;
};

const initForecastVersions = {
  sl1: [
    { id: "v1", name: "Baseline", type: "Baseline", createdBy: "Jane Smith", createdAt: "2026-01-10", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v2", name: "Q2 Revision", type: "Working", createdBy: "Jane Smith", createdAt: "2026-04-01", reason: "Scope increase — HA queries volume up 20%", locked: false, isWorking: true },
  ],
  sl2: [
    { id: "v3", name: "Baseline", type: "Baseline", createdBy: "Jane Smith", createdAt: "2026-01-10", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v4", name: "Q1 Revision", type: "Working", createdBy: "Jane Smith", createdAt: "2026-02-15", reason: "Milestone replan post kickoff", locked: false, isWorking: true },
  ],
  sl3: [
    { id: "v5", name: "Baseline", type: "Baseline", createdBy: "Mike Kumar", createdAt: "2026-01-12", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v6", name: "Q2 Revision", type: "Working", createdBy: "Mike Kumar", createdAt: "2026-04-02", reason: "Resource mix change", locked: false, isWorking: true },
  ],
  sl4: [
    { id: "v7", name: "Baseline", type: "Baseline", createdBy: "Sara Lee", createdAt: "2026-01-15", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v8", name: "Q2 Revision", type: "Working", createdBy: "Sara Lee", createdAt: "2026-04-03", reason: "Page volume revised upward", locked: false, isWorking: true },
  ],
  sl5: [
    { id: "v9", name: "Baseline", type: "Baseline", createdBy: "Sara Lee", createdAt: "2026-01-20", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v10", name: "Q2 Revision", type: "Working", createdBy: "Sara Lee", createdAt: "2026-04-05", reason: "Extended contract period", locked: false, isWorking: true },
  ],
};

const initForecastEntries = {
  sl1: { v1: buildForecastEntries("sl1", "T&M Managed"), v2: buildForecastEntries("sl1", "T&M Managed") },
  sl2: { v3: buildForecastEntries("sl2", "Fixed Price"), v4: buildForecastEntries("sl2", "Fixed Price") },
  sl3: { v5: buildForecastEntries("sl3", "T&M Staffing"), v6: buildForecastEntries("sl3", "T&M Staffing") },
  sl4: { v7: buildForecastEntries("sl4", "Unit-Based"), v8: buildForecastEntries("sl4", "Unit-Based") },
  sl5: { v9: buildForecastEntries("sl5", "Recurring"), v10: buildForecastEntries("sl5", "Recurring") },
};

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "⬛", group: "Overview" },
  { key: "customers", label: "Customers", icon: "🏢", group: "Delivery" },
  { key: "contracts", label: "Contracts", icon: "📋", group: "Delivery" },
  { key: "projects", label: "Projects", icon: "📁", group: "Delivery" },
  { key: "service-lines", label: "Service Lines", icon: "⚙", group: "Delivery" },
  { key: "rate-card", label: "Rate Card", icon: "💰", group: "Finance" },
  { key: "fx-rates", label: "FX Rates", icon: "💱", group: "Finance" },
  { key: "forecast", label: "Forecast", icon: "📊", group: "Finance" },
  { key: "invoices", label: "Invoices", icon: "🧾", group: "Finance" },
  { key: "tags", label: "Tag Master", icon: "🏷", group: "Admin" },
];

// ─── RATE CARD MODULE ─────────────────────────────────────────────────────────
function RateCard() {
  const [tab, setTab] = useState("standard");
  const [rates, setRates] = useState(initRates);
  const [overrides, setOverrides] = useState(initOverrides);
  const [alerts, setAlerts] = useState(initAlerts);
  const [showAddRate, setShowAddRate] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRate, setHistoryRate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Active");
  const [form, setForm] = useState({ role: "", grade: "", location: "", currency: "USD", unit: "Hour", rate: "", effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" });

  const activeRates = rates.filter(r => filterStatus === "All" ? true : r.status === filterStatus);

  const deviationColor = (d) => {
    const abs = Math.abs(d);
    if (abs > 15) return C.danger;
    if (abs > 5) return C.warning;
    return C.textSub;
  };
  const deviationBadge = (d) => {
    const abs = Math.abs(d);
    if (abs > 15) return "red";
    if (abs > 5) return "amber";
    return "gray";
  };

  const handleAddRate = () => {
    if (!form.role || !form.grade || !form.location || !form.rate) return;
    setRates(prev => [...prev, { ...form, id: "r" + Date.now(), rate: parseFloat(form.rate) }]);
    setShowAddRate(false);
    setForm({ role: "", grade: "", location: "", currency: "USD", unit: "Hour", rate: "", effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" });
  };

  const pendingAlerts = alerts.filter(a => a.status === "Pending").length;

  return (
    <div>
      <SectionHeader
        title="Rate Card Master"
        sub="Standard rates, project overrides, and rate update alerts"
        action={<div style={{ display: "flex", gap: 8 }}><Btn variant="secondary" size="sm" onClick={() => setShowHistory(true)}>📜 Rate History</Btn><Btn size="sm" onClick={() => setShowAddRate(true)}>+ New Rate</Btn></div>}
      />

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <KpiCard label="Active Standard Rates" value={rates.filter(r => r.status === "Active").length} sub="Across all roles & locations" accent={C.primary} />
        <KpiCard label="Project Overrides" value={overrides.length} sub="Negotiated deviations" accent={C.warning} />
        <KpiCard label="Pending Rate Alerts" value={pendingAlerts} sub="Awaiting DO acknowledgement" accent={C.danger} badge={pendingAlerts > 0 ? <Badge color="red" dot>Action needed</Badge> : null} />
        <KpiCard label="Rate Revisions (2026)" value={4} sub="Last revision: Jan 2026" accent={C.success} />
      </div>

      <Tabs
        tabs={[
          { key: "standard", label: "Standard Rates" },
          { key: "overrides", label: "Project Overrides" },
          { key: "alerts", label: "Rate Alerts", count: pendingAlerts },
        ]}
        active={tab} onChange={setTab}
      />

      {tab === "standard" && (
        <Card>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <Select value={filterStatus} onChange={setFilterStatus} options={["Active", "Retired", "All"]} style={{ width: 140 }} />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: C.textMuted }}>{activeRates.length} rates shown</span>
          </div>
          <Table
            cols={[
              { key: "role", label: "Role" },
              { key: "grade", label: "Grade" },
              { key: "location", label: "Location" },
              { key: "currency", label: "Currency" },
              { key: "unit", label: "Unit" },
              { key: "rate", label: "Rate", right: true, render: r => <strong>{fmt(r.rate, r.currency).replace(/[A-Z]{3}\s?/, `${r.currency} `)}</strong> },
              { key: "effectiveFrom", label: "Effective From" },
              { key: "effectiveTo", label: "Effective To", render: r => r.effectiveTo || <span style={{ color: C.textMuted }}>Open</span> },
              { key: "status", label: "Status", render: r => <Badge color={r.status === "Active" ? "green" : "gray"}>{r.status}</Badge> },
              { key: "actions", label: "", render: r => (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="ghost" size="sm">Edit</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => { setHistoryRate(r); setShowHistory(true); }}>History</Btn>
                </div>
              )},
            ]}
            rows={activeRates}
          />
        </Card>
      )}

      {tab === "overrides" && (
        <Card>
          {overrides.length > 0 && <Alert type="info">Project overrides represent negotiated deviations from the standard rate card. Deviations &gt;15% are flagged for review.</Alert>}
          <Table
            cols={[
              { key: "serviceLine", label: "Service Line" },
              { key: "customer", label: "Customer" },
              { key: "role", label: "Role" },
              { key: "stdRate", label: "Std Rate", right: true, render: r => <span style={{ color: C.textMuted }}>{r.currency} {fmtN(r.stdRate)}/{r.unit}</span> },
              { key: "overrideRate", label: "Override Rate", right: true, render: r => <strong>{r.currency} {fmtN(r.overrideRate)}/{r.unit}</strong> },
              { key: "deviation", label: "Deviation", right: true, render: r => <Badge color={deviationBadge(r.deviation)}>{r.deviation > 0 ? "+" : ""}{r.deviation.toFixed(1)}%</Badge> },
              { key: "reason", label: "Reason", render: r => <span style={{ color: C.textSub, fontSize: 12 }}>{r.reason}</span> },
              { key: "effectiveFrom", label: "From" },
            ]}
            rows={overrides}
          />
        </Card>
      )}

      {tab === "alerts" && (
        <Card>
          <Alert type="warning">
            {pendingAlerts} service lines have not yet been reviewed after the January 2026 rate revision. Delivery Owners must review and apply or defer the new rate.
          </Alert>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Btn variant="secondary" size="sm">Send All Reminders</Btn>
          </div>
          <Table
            cols={[
              { key: "serviceLine", label: "Service Line" },
              { key: "deliveryOwner", label: "Delivery Owner" },
              { key: "role", label: "Role" },
              { key: "oldRate", label: "Previous Rate", right: true, render: r => <span style={{ color: C.textMuted }}>{r.currency} {fmtN(r.oldRate)}/hr</span> },
              { key: "newRate", label: "New Rate", right: true, render: r => <strong style={{ color: C.primary }}>{r.currency} {fmtN(r.newRate)}/hr</strong> },
              { key: "effectiveDate", label: "Effective" },
              { key: "status", label: "Status", render: r => <Badge color={r.status === "Acknowledged" ? "green" : "red"} dot>{r.status}</Badge> },
              { key: "actions", label: "", render: r => r.status === "Pending" ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm" onClick={() => setAlerts(prev => prev.map(a => a.id === r.id ? { ...a, status: "Acknowledged" } : a))}>Apply Rate</Btn>
                  <Btn variant="ghost" size="sm">Nudge</Btn>
                </div>
              ) : <span style={{ fontSize: 12, color: C.success }}>✓ Done</span> },
            ]}
            rows={alerts}
          />
        </Card>
      )}

      {/* Add Rate Modal */}
      <Modal open={showAddRate} onClose={() => setShowAddRate(false)} title="Add Standard Rate">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Select label="Role" required value={form.role} onChange={v => setForm(p => ({ ...p, role: v }))} options={ROLES.map(r => ({ value: r, label: r }))} placeholder="Select role" />
          <Select label="Grade" required value={form.grade} onChange={v => setForm(p => ({ ...p, grade: v }))} options={GRADES.map(g => ({ value: g, label: g }))} placeholder="Select grade" />
          <Select label="Location" required value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} options={LOCATIONS.map(l => ({ value: l, label: l }))} placeholder="Select location" />
          <Select label="Currency" required value={form.currency} onChange={v => setForm(p => ({ ...p, currency: v }))} options={CURRENCIES.map(c => ({ value: c, label: c }))} />
          <Select label="Billing Unit" required value={form.unit} onChange={v => setForm(p => ({ ...p, unit: v }))} options={["Hour", "Day", "Page", "Word", "Module", "Unit"].map(u => ({ value: u, label: u }))} />
          <Input label="Rate" required type="number" value={form.rate} onChange={v => setForm(p => ({ ...p, rate: v }))} placeholder="e.g. 185"
            hint={form.rate ? `Preview: ${form.currency} ${fmtN(parseFloat(form.rate) || 0)} / ${form.unit}` : ""} />
          <Input label="Effective From" required type="date" value={form.effectiveFrom} onChange={v => setForm(p => ({ ...p, effectiveFrom: v }))} />
          <Input label="Effective To (optional)" type="date" value={form.effectiveTo} onChange={v => setForm(p => ({ ...p, effectiveTo: v }))} />
        </div>
        {form.rate && form.role && (
          <div style={{ marginTop: 16, background: C.primaryLight, borderRadius: 8, padding: 14, fontSize: 13 }}>
            <strong>Rate preview:</strong> {form.role} · {form.grade} · {form.location} → <strong>{form.currency} {fmtN(parseFloat(form.rate) || 0)} / {form.unit}</strong> from {form.effectiveFrom || "—"}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setShowAddRate(false)}>Cancel</Btn>
          <Btn onClick={handleAddRate}>Save Rate</Btn>
        </div>
      </Modal>

      {/* History Modal */}
      <Modal open={showHistory} onClose={() => { setShowHistory(false); setHistoryRate(null); }} title={historyRate ? `Rate History — ${historyRate.role}` : "Rate Change Audit Log"} width={720}>
        <Alert type="info">Rate history is immutable. Records cannot be edited or deleted to ensure reporting integrity.</Alert>
        <Table
          cols={[
            { key: "role", label: "Role/Grade/Location", render: () => historyRate ? `${historyRate.role} · ${historyRate.grade} · ${historyRate.location}` : "Various" },
            { key: "event", label: "Event", render: (_, i) => i === 0 ? "Rate Updated" : "Rate Created" },
            { key: "old", label: "Previous", render: (r, i) => i === 0 ? `${r.currency ?? "USD"} ${fmtN(historyRate ? historyRate.rate * 0.943 : 175)}` : "—" },
            { key: "new", label: "New Rate", render: r => <strong>{r.currency ?? "USD"} {fmtN(historyRate ? historyRate.rate : 185)}</strong> },
            { key: "by", label: "Changed By", render: () => "Admin" },
            { key: "at", label: "Date", render: (_, i) => i === 0 ? "2026-01-02" : "2025-01-05" },
          ]}
          rows={historyRate ? [historyRate, historyRate] : rates.slice(0, 3)}
        />
      </Modal>
    </div>
  );
}

// ─── FX RATES MODULE ──────────────────────────────────────────────────────────
function FxRates() {
  const [tab, setTab] = useState("current");
  const [fxRates, setFxRates] = useState(initFxRates);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ pair: "GBP/USD", from: "GBP", to: "USD", month: "Apr 2026", rate: "" });

  const currentMonth = "Apr 2026";
  const activePairs = FX_PAIRS;

  const getRateForMonth = (pair, month) => fxRates.find(r => r.pair === pair && r.month === month);
  const isMissing = (pair, month) => !getRateForMonth(pair, month);
  const missingCurrent = activePairs.filter(p => isMissing(p, currentMonth));

  const handleAddRates = () => {
    if (!addForm.rate) return;
    const existing = fxRates.find(r => r.pair === addForm.pair && r.month === addForm.month);
    if (existing) {
      setFxRates(prev => prev.map(r => r.pair === addForm.pair && r.month === addForm.month ? { ...r, rate: parseFloat(addForm.rate), enteredAt: "2026-04-09" } : r));
    } else {
      setFxRates(prev => [...prev, { id: "fx" + Date.now(), ...addForm, rate: parseFloat(addForm.rate), enteredBy: "Admin", enteredAt: "2026-04-09" }]);
    }
    setShowAdd(false);
  };

  const pastMonths = MONTHS_2026.slice(0, CUR_MONTH_IDX);

  return (
    <div>
      <SectionHeader
        title="FX Rate Master"
        sub="Monthly average exchange rates for USD reporting conversion"
        action={<Btn size="sm" onClick={() => setShowAdd(true)}>+ Add Rates</Btn>}
      />

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <KpiCard label="Active Currency Pairs" value={activePairs.length} sub="Tracked for conversion" accent={C.primary} />
        <KpiCard label="Missing (Apr 2026)" value={missingCurrent.length} sub="Rates not yet entered" accent={missingCurrent.length > 0 ? C.danger : C.success}
          badge={missingCurrent.length > 0 ? <Badge color="red" dot>Action required</Badge> : <Badge color="green" dot>All current</Badge>} />
        <KpiCard label="Reporting Currency" value="USD" sub="All reports converted to USD" accent={C.success} />
        <KpiCard label="Last Updated" value="Apr 3" sub="Mar 2026 rates locked" accent={C.primary} />
      </div>

      {missingCurrent.length > 0 && (
        <Alert type="warning">
          <strong>Missing rates for {currentMonth}:</strong> {missingCurrent.join(", ")}. Reports for this month will use the previous month's rates until these are entered. <button style={{ background: "none", border: "none", color: C.warning, cursor: "pointer", fontWeight: 700, textDecoration: "underline" }} onClick={() => setShowAdd(true)}>Enter now →</button>
        </Alert>
      )}

      <Tabs tabs={[{ key: "current", label: `${currentMonth} Rates` }, { key: "grid", label: "Rate Grid (2026)" }, { key: "history", label: "Audit History" }]} active={tab} onChange={setTab} />

      {tab === "current" && (
        <Card>
          <Table
            cols={[
              { key: "pair", label: "Currency Pair", render: r => <strong>{r.pair}</strong> },
              { key: "from", label: "From" },
              { key: "to", label: "To" },
              { key: "rate", label: `Rate (${currentMonth})`, right: true, render: r => {
                const entry = getRateForMonth(r, currentMonth);
                return entry ? (
                  <span>1 {r.replace("/USD", "")} = <strong>{entry.rate.toFixed(4)} USD</strong></span>
                ) : <Badge color="red" dot>Missing</Badge>;
              }},
              { key: "status", label: "Status", render: r => {
                const entry = getRateForMonth(r, currentMonth);
                return entry ? <Badge color="green">Entered</Badge> : <Badge color="red">Missing</Badge>;
              }},
              { key: "enteredBy", label: "Entered By", render: r => {
                const entry = getRateForMonth(r, currentMonth);
                return entry ? `${entry.enteredBy} on ${entry.enteredAt}` : "—";
              }},
              { key: "actions", label: "", render: r => {
                const entry = getRateForMonth(r, currentMonth);
                return (
                  <Btn size="sm" variant={entry ? "ghost" : "primary"} onClick={() => { setAddForm({ pair: r, from: r.replace("/USD", ""), to: "USD", month: currentMonth, rate: entry?.rate ?? "" }); setShowAdd(true); }}>
                    {entry ? "Edit" : "Enter Rate"}
                  </Btn>
                );
              }},
            ]}
            rows={activePairs}
          />
        </Card>
      )}

      {tab === "grid" && (
        <Card style={{ padding: 0 }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px 14px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "left", fontWeight: 700, position: "sticky", left: 0, zIndex: 1 }}>Pair</th>
                  {MONTHS_2026.map((m, i) => (
                    <th key={m} style={{ padding: "10px 10px", background: i === CUR_MONTH_IDX ? C.primaryLight : C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", fontWeight: 600, color: i === CUR_MONTH_IDX ? C.primary : C.textSub, whiteSpace: "nowrap" }}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activePairs.map((pair, pi) => (
                  <tr key={pair} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px 14px", fontWeight: 700, background: C.white, position: "sticky", left: 0 }}>{pair}</td>
                    {MONTHS_2026.map((m, i) => {
                      const entry = getRateForMonth(pair, m);
                      const isPast = i < CUR_MONTH_IDX;
                      const isCurrent = i === CUR_MONTH_IDX;
                      const isFuture = i > CUR_MONTH_IDX;
                      return (
                        <td key={m} style={{ padding: "8px 10px", textAlign: "right", background: isCurrent ? C.primaryLight : "transparent" }}>
                          {isPast && !entry && <span style={{ color: C.danger, fontSize: 11 }}>✕ Missing</span>}
                          {entry && <span style={{ color: isPast ? C.textSub : C.text }}>{entry.rate.toFixed(4)}</span>}
                          {isFuture && !entry && (
                            <input type="number" step="0.0001" placeholder="—"
                              style={{ width: 70, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 4px", fontSize: 11, textAlign: "right" }} />
                          )}
                          {isCurrent && !entry && (
                            <button onClick={() => { setAddForm({ pair, from: pair.replace("/USD", ""), to: "USD", month: m, rate: "" }); setShowAdd(true); }}
                              style={{ background: C.primary, color: C.white, border: "none", borderRadius: 4, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>Enter</button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "history" && (
        <Card>
          <Alert type="info">FX rate history is permanently locked once the month ends. Past rates cannot be modified to ensure historical report consistency.</Alert>
          <Table
            cols={[
              { key: "pair", label: "Currency Pair", render: r => <strong>{r.pair}</strong> },
              { key: "month", label: "Month" },
              { key: "rate", label: "Rate", right: true, render: r => <strong>{r.rate.toFixed(4)}</strong> },
              { key: "formula", label: "Conversion", render: r => <span style={{ color: C.textSub }}>1 {r.from} = {r.rate.toFixed(4)} {r.to}</span> },
              { key: "enteredBy", label: "Entered By" },
              { key: "enteredAt", label: "Date" },
              { key: "locked", label: "Status", render: () => <Badge color="gray">Locked</Badge> },
            ]}
            rows={fxRates.sort((a, b) => b.enteredAt.localeCompare(a.enteredAt))}
          />
        </Card>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Enter FX Rate" width={520}>
        <Alert type="info">Monthly average rates are locked permanently once the month ends. Ensure accuracy before saving.</Alert>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Select label="Currency Pair" required value={addForm.pair} onChange={v => setAddForm(p => ({ ...p, pair: v, from: v.replace("/USD", "") }))}
            options={activePairs.map(p => ({ value: p, label: p }))} />
          <Select label="Month" required value={addForm.month} onChange={v => setAddForm(p => ({ ...p, month: v }))} options={MONTHS_2026.map(m => ({ value: m, label: m }))} />
          <div style={{ gridColumn: "1/-1" }}>
            <Input label={`Exchange Rate (1 ${addForm.from} → USD)`} required type="number" step="0.0001" value={addForm.rate} onChange={v => setAddForm(p => ({ ...p, rate: v }))} placeholder="e.g. 1.2680" />
            {addForm.rate && <div style={{ marginTop: 8, padding: "10px 12px", background: C.primaryLight, borderRadius: 6, fontSize: 13 }}>
              Preview: 1 {addForm.from} = <strong>{parseFloat(addForm.rate).toFixed(4)} USD</strong> &nbsp;|&nbsp; 100 {addForm.from} = <strong>{(parseFloat(addForm.rate) * 100).toFixed(2)} USD</strong>
            </div>}
          </div>
        </div>
        <div style={{ marginTop: 8, padding: "10px 12px", background: "#fff8e1", borderRadius: 6, fontSize: 12, color: C.warning }}>
          ⚠ Once {addForm.month} has passed, this rate will be permanently locked and cannot be changed.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
          <Btn onClick={handleAddRates}>Save Rate</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── FORECAST MODULE ──────────────────────────────────────────────────────────
function Forecast() {
  const [selectedSl, setSelectedSl] = useState(SERVICE_LINES_LIST[0]);
  const [versions, setVersions] = useState(initForecastVersions);
  const [entries, setEntries] = useState(initForecastEntries);
  const [activeVersionId, setActiveVersionId] = useState("v2");
  const [showVersionMgr, setShowVersionMgr] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showNewVersion, setShowNewVersion] = useState(false);
  const [compareVers, setCompareVers] = useState({ a: "v1", b: "v2" });
  const [showActuals, setShowActuals] = useState(true);
  const [newVerForm, setNewVerForm] = useState({ name: "", type: "Working", reason: "", copyFrom: "" });

  const slVersions = versions[selectedSl.id] || [];
  const workingVersion = slVersions.find(v => v.isWorking) || slVersions[slVersions.length - 1];
  const activeVersion = slVersions.find(v => v.id === activeVersionId) || workingVersion;
  const slEntries = entries[selectedSl.id] || {};
  const activeEntries = slEntries[activeVersionId] || {};

  const totalForecast = Object.values(activeEntries).reduce((s, e) => s + (e.amount || 0), 0);
  const totalActual = Object.values(activeEntries).reduce((s, e) => s + (e.actual || 0), 0);
  const variance = totalActual - totalForecast;
  const realization = totalForecast > 0 ? (totalActual / totalForecast) * 100 : 0;

  const isT_M = ["T&M Managed", "T&M Staffing"].includes(selectedSl.commercialType);
  const isUnit = selectedSl.commercialType === "Unit-Based";
  const isFixed = selectedSl.commercialType === "Fixed Price";
  const isRecurring = selectedSl.commercialType === "Recurring";

  const handleEntryChange = (month, field, val) => {
    setEntries(prev => {
      const slE = { ...(prev[selectedSl.id] || {}) };
      const verE = { ...(slE[activeVersionId] || {}) };
      const cell = { ...(verE[month] || {}) };
      cell[field] = parseFloat(val) || 0;
      if ((isT_M || isUnit) && field !== "amount") {
        cell.amount = Math.round((cell.qty || 0) * (cell.rate || 0));
      }
      verE[month] = cell;
      slE[activeVersionId] = verE;
      return { ...prev, [selectedSl.id]: slE };
    });
  };

  const handleCreateVersion = () => {
    if (!newVerForm.name) return;
    const newId = "v" + Date.now();
    const copyEntries = newVerForm.copyFrom ? slEntries[newVerForm.copyFrom] : {};
    setVersions(prev => ({
      ...prev,
      [selectedSl.id]: [
        ...((prev[selectedSl.id] || []).map(v => ({ ...v, isWorking: false }))),
        { id: newId, name: newVerForm.name, type: newVerForm.type, reason: newVerForm.reason, createdBy: "Jane Smith", createdAt: "2026-04-09", locked: false, isWorking: true },
      ]
    }));
    setEntries(prev => ({
      ...prev,
      [selectedSl.id]: { ...(prev[selectedSl.id] || {}), [newId]: JSON.parse(JSON.stringify(copyEntries)) }
    }));
    setActiveVersionId(newId);
    setShowNewVersion(false);
    setNewVerForm({ name: "", type: "Working", reason: "", copyFrom: "" });
  };

  const monthColColor = (i) => {
    if (i < CUR_MONTH_IDX) return "#f8fafc";
    if (i === CUR_MONTH_IDX) return "#edf4fd";
    return C.white;
  };

  const versionColor = (type) => {
    if (type === "Baseline") return C.text;
    if (type === "Working") return C.primary;
    if (type === "Locked") return C.purple;
    return C.textSub;
  };
  const versionBadge = (type) => {
    if (type === "Baseline") return "gray";
    if (type === "Working") return "blue";
    if (type === "Locked") return "purple";
    return "gray";
  };

  return (
    <div>
      <SectionHeader
        title="Forecast Entry"
        sub="Monthly revenue forecast by service line with version management"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm" onClick={() => setShowCompare(true)}>⇄ Compare Versions</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setShowVersionMgr(true)}>📋 Manage Versions</Btn>
            <Btn size="sm" onClick={() => setShowNewVersion(true)}>+ New Version</Btn>
          </div>
        }
      />

      {/* Service Line Selector */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Select label="Service Line" value={selectedSl.id} onChange={v => {
            const sl = SERVICE_LINES_LIST.find(s => s.id === v);
            setSelectedSl(sl);
            const vers = versions[sl.id] || [];
            const wv = vers.find(v2 => v2.isWorking) || vers[vers.length - 1];
            if (wv) setActiveVersionId(wv.id);
          }} options={SERVICE_LINES_LIST.map(s => ({ value: s.id, label: `${s.name} — ${s.customer}` }))} style={{ minWidth: 320 }} />
          <div style={{ display: "flex", gap: 6 }}>
            {slVersions.map(v => (
              <button key={v.id} onClick={() => setActiveVersionId(v.id)} style={{
                padding: "6px 14px", borderRadius: 20, border: `2px solid ${activeVersionId === v.id ? versionColor(v.type) : C.border}`,
                background: activeVersionId === v.id ? versionColor(v.type) : C.white, color: activeVersionId === v.id ? C.white : C.textSub,
                fontWeight: 600, fontSize: 12, cursor: "pointer",
              }}>{v.name} {v.locked ? "🔒" : ""}</button>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.textSub, marginLeft: "auto" }}>
            <input type="checkbox" checked={showActuals} onChange={e => setShowActuals(e.target.checked)} />
            Show actuals
          </label>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, color: C.textSub }}>Commercial type: <Badge color="blue">{selectedSl.commercialType}</Badge></div>
          <div style={{ fontSize: 12, color: C.textSub }}>Division: <strong>{selectedSl.division}</strong></div>
          <div style={{ fontSize: 12, color: C.textSub }}>Currency: <strong>{selectedSl.currency}</strong></div>
          <div style={{ fontSize: 12, color: C.textSub }}>Customer: <strong>{selectedSl.customer}</strong></div>
          {activeVersion && <div style={{ fontSize: 12, color: C.textSub }}>Version: <Badge color={versionBadge(activeVersion.type)}>{activeVersion.name}</Badge> {activeVersion.locked && "🔒"}</div>}
        </div>
      </Card>

      {/* KPI Strip */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <KpiCard label="Total Forecast (2026)" value={fmt(totalForecast, selectedSl.currency)} sub={selectedSl.currency !== "USD" ? "Native currency" : ""} accent={C.primary} />
        <KpiCard label="Actuals YTD" value={fmt(totalActual, selectedSl.currency)} sub={`${CUR_MONTH_IDX} months billed`} accent={C.success} />
        <KpiCard label="YTD Variance" value={fmt(Math.abs(variance), selectedSl.currency)} sub={variance >= 0 ? "Ahead of forecast" : "Behind forecast"}
          accent={variance >= 0 ? C.success : C.danger} badge={<Badge color={variance >= 0 ? "green" : "red"} dot>{variance >= 0 ? "+" : "-"}{fmt(Math.abs(variance), selectedSl.currency)}</Badge>} />
        <KpiCard label="Realization" value={pct(realization)} sub="Actuals / Forecast" accent={realization >= 95 ? C.success : realization >= 80 ? C.warning : C.danger}
          badge={<Badge color={realization >= 95 ? "green" : realization >= 80 ? "amber" : "red"} dot>{realization >= 95 ? "On track" : realization >= 80 ? "Watch" : "At risk"}</Badge>} />
      </div>

      {activeVersion?.locked && <Alert type="info">This version is locked and read-only. Switch to the working version to make changes.</Alert>}

      {/* Forecast Grid */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: "14px 16px", display: "flex", gap: 10, alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Monthly Forecast Grid</span>
          <div style={{ flex: 1 }} />
          {!activeVersion?.locked && (
            <>
              <Btn variant="ghost" size="sm">Fill Down</Btn>
              <Btn variant="ghost" size="sm">Repeat Flat</Btn>
            </>
          )}
          <Btn variant="secondary" size="sm">Export CSV</Btn>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "left", fontWeight: 700, minWidth: 100, position: "sticky", left: 0 }}>Month</th>
                {isT_M && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 80 }}>Hours</th>}
                {isUnit && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 80 }}>Units</th>}
                {(isT_M || isUnit) && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 90 }}>Rate</th>}
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 110 }}>Forecast ({selectedSl.currency})</th>
                {showActuals && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 110 }}>Actual ({selectedSl.currency})</th>}
                {showActuals && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 90 }}>Variance</th>}
                {showActuals && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 70 }}>Real. %</th>}
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "left", minWidth: 140 }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS_2026.map((month, i) => {
                const e = activeEntries[month] || { qty: 0, rate: 0, amount: 0, actual: null, note: "" };
                const isPast = i < CUR_MONTH_IDX;
                const isCurrent = i === CUR_MONTH_IDX;
                const locked = e.locked || activeVersion?.locked;
                const var_ = e.actual != null ? e.actual - e.amount : null;
                const real = e.amount > 0 && e.actual != null ? (e.actual / e.amount) * 100 : null;
                const realColor = real == null ? C.textMuted : real >= 95 ? C.success : real >= 80 ? C.warning : C.danger;

                return (
                  <tr key={month} style={{ borderBottom: `1px solid ${C.border}`, background: monthColColor(i) }}>
                    <td style={{ padding: "7px 12px", fontWeight: isCurrent ? 700 : 500, color: isCurrent ? C.primary : C.text, position: "sticky", left: 0, background: monthColColor(i) }}>
                      {month} {isCurrent && <span style={{ fontSize: 10, background: C.primary, color: C.white, borderRadius: 4, padding: "1px 5px", marginLeft: 4 }}>NOW</span>}
                      {isPast && <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>🔒</span>}
                    </td>
                    {isT_M && (
                      <td style={{ padding: "4px 6px", textAlign: "right" }}>
                        {locked ? <span style={{ color: C.textSub }}>{fmtN(e.qty || 0)}</span> : (
                          <input type="number" value={e.qty || ""} onChange={ev => handleEntryChange(month, "qty", ev.target.value)}
                            style={{ width: 70, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", textAlign: "right", fontSize: 12 }} />
                        )}
                      </td>
                    )}
                    {isUnit && (
                      <td style={{ padding: "4px 6px", textAlign: "right" }}>
                        {locked ? <span style={{ color: C.textSub }}>{fmtN(e.qty || 0)}</span> : (
                          <input type="number" value={e.qty || ""} onChange={ev => handleEntryChange(month, "qty", ev.target.value)}
                            style={{ width: 70, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", textAlign: "right", fontSize: 12 }} />
                        )}
                      </td>
                    )}
                    {(isT_M || isUnit) && (
                      <td style={{ padding: "4px 6px", textAlign: "right" }}>
                        {locked ? <span style={{ color: C.textSub }}>{fmtN(e.rate || 0)}</span> : (
                          <input type="number" value={e.rate || ""} onChange={ev => handleEntryChange(month, "rate", ev.target.value)}
                            style={{ width: 76, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", textAlign: "right", fontSize: 12 }} />
                        )}
                      </td>
                    )}
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>
                      {locked || (isT_M || isUnit) ? (
                        <strong style={{ color: (isT_M || isUnit) ? C.primary : C.text }}>
                          {e.amount ? fmtN(e.amount) : <span style={{ color: C.textMuted }}>—</span>}
                          {(isT_M || isUnit) && e.qty && e.rate && <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>auto</span>}
                        </strong>
                      ) : (
                        <input type="number" value={e.amount || ""} onChange={ev => handleEntryChange(month, "amount", ev.target.value)}
                          style={{ width: 100, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", textAlign: "right", fontSize: 12 }} />
                      )}
                    </td>
                    {showActuals && (
                      <td style={{ padding: "7px 12px", textAlign: "right", color: e.actual != null ? C.text : C.textMuted }}>
                        {e.actual != null ? fmtN(Math.round(e.actual)) : "—"}
                      </td>
                    )}
                    {showActuals && (
                      <td style={{ padding: "7px 12px", textAlign: "right" }}>
                        {var_ != null ? <span style={{ color: var_ >= 0 ? C.success : C.danger, fontWeight: 600 }}>{var_ >= 0 ? "+" : ""}{fmtN(Math.round(var_))}</span> : "—"}
                      </td>
                    )}
                    {showActuals && (
                      <td style={{ padding: "7px 12px", textAlign: "right" }}>
                        {real != null ? <span style={{ color: realColor, fontWeight: 600 }}>{pct(real)}</span> : "—"}
                      </td>
                    )}
                    <td style={{ padding: "4px 6px" }}>
                      {locked ? <span style={{ color: C.textMuted, fontSize: 11 }}>{e.note || ""}</span> : (
                        <input value={e.note || ""} onChange={ev => handleEntryChange(month, "note", ev.target.value)} placeholder="Optional note"
                          style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", fontSize: 11 }} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: C.primaryLight, fontWeight: 700 }}>
                <td style={{ padding: "9px 12px", color: C.primary, position: "sticky", left: 0, background: C.primaryLight }}>TOTAL</td>
                {isT_M && <td style={{ padding: "9px 12px", textAlign: "right" }}>{fmtN(Object.values(activeEntries).reduce((s, e) => s + (e.qty || 0), 0))}</td>}
                {isUnit && <td style={{ padding: "9px 12px", textAlign: "right" }}>{fmtN(Object.values(activeEntries).reduce((s, e) => s + (e.qty || 0), 0))}</td>}
                {(isT_M || isUnit) && <td />}
                <td style={{ padding: "9px 12px", textAlign: "right", color: C.primary }}>{fmtN(totalForecast)}</td>
                {showActuals && <td style={{ padding: "9px 12px", textAlign: "right" }}>{fmtN(Math.round(totalActual))}</td>}
                {showActuals && <td style={{ padding: "9px 12px", textAlign: "right", color: variance >= 0 ? C.success : C.danger }}>{variance >= 0 ? "+" : ""}{fmtN(Math.round(variance))}</td>}
                {showActuals && <td style={{ padding: "9px 12px", textAlign: "right", color: realization >= 95 ? C.success : realization >= 80 ? C.warning : C.danger }}>{pct(realization)}</td>}
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Version Manager Modal */}
      <Modal open={showVersionMgr} onClose={() => setShowVersionMgr(false)} title={`Forecast Versions — ${selectedSl.name}`} width={760}>
        <Table
          cols={[
            { key: "name", label: "Version", render: r => <span style={{ fontWeight: 700, color: versionColor(r.type) }}>{r.name} {r.isWorking && <Badge color="blue">Working</Badge>} {r.locked && "🔒"}</span> },
            { key: "type", label: "Type", render: r => <Badge color={versionBadge(r.type)}>{r.type}</Badge> },
            { key: "createdBy", label: "Created By" },
            { key: "createdAt", label: "Created" },
            { key: "reason", label: "Reason", render: r => <span style={{ fontSize: 12, color: C.textSub }}>{r.reason}</span> },
            { key: "total", label: "Total", right: true, render: r => {
              const e = slEntries[r.id] || {};
              const t = Object.values(e).reduce((s, e2) => s + (e2.amount || 0), 0);
              return <strong>{fmtN(t)}</strong>;
            }},
            { key: "actions", label: "", render: r => (
              <div style={{ display: "flex", gap: 4 }}>
                <Btn size="sm" variant="ghost" onClick={() => { setActiveVersionId(r.id); setShowVersionMgr(false); }}>View</Btn>
                {!r.locked && !r.isWorking && <Btn size="sm" variant="warning">Lock</Btn>}
              </div>
            )},
          ]}
          rows={slVersions}
        />
      </Modal>

      {/* Compare Modal */}
      <Modal open={showCompare} onClose={() => setShowCompare(false)} title="Compare Forecast Versions" width={900}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-end" }}>
          <Select label="Version A" value={compareVers.a} onChange={v => setCompareVers(p => ({ ...p, a: v }))} options={slVersions.map(v => ({ value: v.id, label: v.name }))} style={{ width: 200 }} />
          <Select label="Version B" value={compareVers.b} onChange={v => setCompareVers(p => ({ ...p, b: v }))} options={slVersions.map(v => ({ value: v.id, label: v.name }))} style={{ width: 200 }} />
          <div style={{ flex: 1 }} />
          <Badge color="blue">{slVersions.find(v => v.id === compareVers.a)?.name}</Badge>
          <span style={{ color: C.textMuted }}>vs</span>
          <Badge color="purple">{slVersions.find(v => v.id === compareVers.b)?.name}</Badge>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "left" }}>Month</th>
                <th style={{ padding: "8px 12px", background: "#e8f0fa", borderBottom: `1.5px solid ${C.border}`, textAlign: "right" }}>{slVersions.find(v => v.id === compareVers.a)?.name}</th>
                <th style={{ padding: "8px 12px", background: "#ede9fe", borderBottom: `1.5px solid ${C.border}`, textAlign: "right" }}>{slVersions.find(v => v.id === compareVers.b)?.name}</th>
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right" }}>Actuals</th>
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right" }}>A vs B Δ</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS_2026.map((m, i) => {
                const eA = (slEntries[compareVers.a] || {})[m] || {};
                const eB = (slEntries[compareVers.b] || {})[m] || {};
                const diff = (eB.amount || 0) - (eA.amount || 0);
                return (
                  <tr key={m} style={{ borderBottom: `1px solid ${C.border}`, background: i === CUR_MONTH_IDX ? C.primaryLight : "transparent" }}>
                    <td style={{ padding: "7px 12px", fontWeight: i === CUR_MONTH_IDX ? 700 : 400 }}>{m}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", background: "#f0f4fc" }}>{fmtN(eA.amount || 0)}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", background: "#f5f3ff" }}>{fmtN(eB.amount || 0)}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", color: C.textSub }}>{eA.actual != null ? fmtN(Math.round(eA.actual)) : "—"}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", color: diff > 0 ? C.success : diff < 0 ? C.danger : C.textMuted, fontWeight: 600 }}>
                      {diff !== 0 ? `${diff > 0 ? "+" : ""}${fmtN(diff)}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: C.primaryLight, fontWeight: 700 }}>
                <td style={{ padding: "9px 12px" }}>TOTAL</td>
                <td style={{ padding: "9px 12px", textAlign: "right", background: "#e8f0fa" }}>{fmtN(Object.values(slEntries[compareVers.a] || {}).reduce((s, e) => s + (e.amount || 0), 0))}</td>
                <td style={{ padding: "9px 12px", textAlign: "right", background: "#ede9fe" }}>{fmtN(Object.values(slEntries[compareVers.b] || {}).reduce((s, e) => s + (e.amount || 0), 0))}</td>
                <td style={{ padding: "9px 12px", textAlign: "right" }}>{fmtN(Math.round(Object.values(slEntries[compareVers.a] || {}).reduce((s, e) => s + (e.actual || 0), 0)))}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal>

      {/* New Version Modal */}
      <Modal open={showNewVersion} onClose={() => setShowNewVersion(false)} title="Create New Forecast Version" width={520}>
        <Alert type="info">New versions copy entries from an existing version as a starting point. The baseline version is always immutable.</Alert>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Version Name" required value={newVerForm.name} onChange={v => setNewVerForm(p => ({ ...p, name: v }))} placeholder="e.g. Q3 Revision, Post scope change" />
          <Select label="Version Type" required value={newVerForm.type} onChange={v => setNewVerForm(p => ({ ...p, type: v }))} options={["Working", "Locked"].map(t => ({ value: t, label: t }))} />
          <Input label="Reason for revision" value={newVerForm.reason} onChange={v => setNewVerForm(p => ({ ...p, reason: v }))} placeholder="Briefly describe why this version is being created" />
          <Select label="Copy entries from" value={newVerForm.copyFrom} onChange={v => setNewVerForm(p => ({ ...p, copyFrom: v }))} placeholder="Start blank" options={slVersions.map(v => ({ value: v.id, label: v.name }))} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setShowNewVersion(false)}>Cancel</Btn>
          <Btn onClick={handleCreateVersion} disabled={!newVerForm.name}>Create Version</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── PLACEHOLDER for existing modules ────────────────────────────────────────
const Placeholder = ({ name }) => (
  <div>
    <SectionHeader title={name} sub={`${name} module — carried over from Round 1`} />
    <Card>
      <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔧</div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{name} module</div>
        <div style={{ fontSize: 13 }}>This module was built in Round 1 and is active in your deployed app. Switch to your Vercel deployment to access the full module.</div>
      </div>
    </Card>
  </div>
);

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("rate-card");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const groups = [...new Set(NAV.map(n => n.group))];

  const renderPage = () => {
    if (page === "rate-card") return <RateCard />;
    if (page === "fx-rates") return <FxRates />;
    if (page === "forecast") return <Forecast />;
    return <Placeholder name={NAV.find(n => n.key === page)?.label || page} />;
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg, color: C.text }}>
      {/* Sidebar */}
      <div style={{ width: sidebarCollapsed ? 56 : 220, background: C.sidebar, display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0, overflowX: "hidden" }}>
        <div style={{ padding: sidebarCollapsed ? "18px 12px" : "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSidebarCollapsed(c => !c)}>
          <div style={{ width: 28, height: 28, background: C.primary, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: C.white, fontWeight: 900, fontSize: 13 }}>FP</span>
          </div>
          {!sidebarCollapsed && <span style={{ color: C.white, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>Freyr Pulse</span>}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
          {groups.map(group => (
            <div key={group}>
              {!sidebarCollapsed && <div style={{ padding: "10px 20px 4px", fontSize: 10, fontWeight: 700, color: "rgba(168,189,214,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>{group}</div>}
              {NAV.filter(n => n.group === group).map(n => (
                <div key={n.key} onClick={() => setPage(n.key)} title={sidebarCollapsed ? n.label : ""}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: sidebarCollapsed ? "9px 14px" : "9px 20px", cursor: "pointer", borderLeft: page === n.key ? `3px solid ${C.primary}` : "3px solid transparent", background: page === n.key ? "rgba(33,118,199,0.15)" : "transparent", transition: "all 0.1s" }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
                  {!sidebarCollapsed && <span style={{ color: page === n.key ? C.white : C.sidebarText, fontWeight: page === n.key ? 600 : 400, fontSize: 13, whiteSpace: "nowrap" }}>{n.label}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: sidebarCollapsed ? "14px 12px" : "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: C.primary, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: C.white, fontWeight: 700, fontSize: 12 }}>JS</span>
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>Jane Smith</div>
              <div style={{ color: C.sidebarText, fontSize: 11 }}>Delivery Owner</div>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ height: 54, background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", gap: 6, fontSize: 13, color: C.textMuted }}>
            <span>Freyr Pulse</span><span>/</span><span style={{ color: C.text, fontWeight: 600 }}>{NAV.find(n => n.key === page)?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge color="blue">April 2026</Badge>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={{ position: "absolute", top: -4, right: -4, background: C.danger, color: C.white, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>4</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
