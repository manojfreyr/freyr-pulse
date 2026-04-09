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
