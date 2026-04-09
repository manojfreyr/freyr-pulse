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
  nav:{background:C.b600,display:"flex",alignItems:"center",padding:"0 20px",height:52,flexShrink:0,gap:8},
  logoName:{fontSize:15,fontWeight:700,color:"#fff",letterSpacing:-0.3},
  logoTag:{fontSize:9,color:C.b100,letterSpacing:0.5,textTransform:"uppercase"},
  navLink:(a)=>({padding:"5px 11px",fontSize:13,color:a?"#fff":"rgba(255,255,255,0.7)",borderRadius:6,cursor:"pointer",background:a?"rgba(255,255,255,0.18)":"transparent",fontWeight:a?500:400,border:"none"}),
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
    const m={green:{background:C.grnBg,color:C.grnTxt},amber:{background:C.ambBg,color:C.ambTxt},red:{background:C.redBg,color:C.redTxt},blue:{background:C.b50,color:C.b700},gray:{background:C.g100,color:C.g600}};
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
  modalBox:{background:"#fff",borderRadius:12,border:"1px solid "+C.g200,width:500,maxWidth:"95vw",maxHeight:"90vh",overflow:"auto"},
  mh:{padding:"15px 18px",borderBottom:"1px solid "+C.g200,display:"flex",alignItems:"center",justifyContent:"space-between"},
  mb:{padding:18},
  mf:{padding:"13px 18px",borderTop:"1px solid "+C.g200,display:"flex",justifyContent:"flex-end",gap:8},
  tag:{display:"inline-flex",alignItems:"center",background:C.b50,color:C.b700,border:"1px solid "+C.b100,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:500},
  empty:{textAlign:"center",padding:"48px 20px",color:C.g400},
  toolbar:{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"},
  sb:{display:"flex",alignItems:"center",gap:7,background:"#fff",border:"1px solid "+C.g300,borderRadius:7,padding:"6px 10px",minWidth:220},
  si:{border:"none",outline:"none",fontSize:13,color:C.g800,background:"transparent",width:"100%"},
};

const COUNTRIES=["United States","United Kingdom","Switzerland","Germany","France","Japan","India","Australia","Canada","Singapore"];
const REGIONS=["North America","Europe","Asia Pacific","LATAM","Middle East"];
const DIVISIONS=["Regulatory Division","Clinical Division","Pharmacovigilance","Medical Affairs"];
const DEPARTMENTS=["Regulatory Affairs","Clinical Operations","Drug Safety","Medical Writing","Publishing"];
const SERVICES=["Regulatory Affairs","Clinical Writing","Publishing","HA Query Support","Pharmacovigilance","Drug Safety","Medical Writing"];
const CURRENCIES=["USD","GBP","EUR","CHF","JPY","INR","AUD"];
const COMM_TYPES=[["fixed_price","Fixed price"],["tm_managed","T&M managed"],["tm_staffing","T&M staffing"],["unit_based","Unit-based"],["recurring","Recurring"]];
const BILLING_BASIS=["milestone","monthly","quarterly","hourly","daily","per_unit","per_slab","upfront","annual","ad_hoc"];

function genId(p){return p+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase();}
function statusColor(s){return{active:"green",paid:"green",completed:"green",inactive:"gray",cancelled:"gray",void:"gray",draft:"blue",submitted:"blue",on_hold:"amber",overdue:"red",partially_paid:"amber"}[s]||"gray";}
function commLabel(t){return(COMM_TYPES.find(x=>x[0]===t)||[t,t])[1];}

const INIT={
  customers:[
    {id:"C001",name:"Johnson & Johnson",legalName:"Johnson & Johnson Inc.",accountCode:"JNJ-001",country:"United States",region:"North America",customerType:"Pharma",status:"active",psaStart:"2022-01-01",psaEnd:"2026-12-31"},
    {id:"C002",name:"Pfizer",legalName:"Pfizer Inc.",accountCode:"PFZ-002",country:"United States",region:"North America",customerType:"Pharma",status:"active",psaStart:"2023-01-01",psaEnd:"2027-06-30"},
    {id:"C003",name:"Novartis",legalName:"Novartis AG",accountCode:"NVT-003",country:"Switzerland",region:"Europe",customerType:"Pharma",status:"active",psaStart:"2022-06-01",psaEnd:"2027-02-28"},
  ],
  contracts:[
    {id:"CT001",name:"Regulatory Submission Support",customerId:"C001",currency:"USD",value:1800000,status:"active",startDate:"2022-01-01",endDate:"2026-12-31",paymentTerms:"Net 30"},
    {id:"CT002",name:"Clinical Writing Services",customerId:"C001",currency:"USD",value:900000,status:"active",startDate:"2023-03-01",endDate:"2026-06-30",paymentTerms:"Net 45"},
    {id:"CT003",name:"Pharmacovigilance Support",customerId:"C002",currency:"USD",value:2100000,status:"active",startDate:"2024-06-01",endDate:"2027-05-31",paymentTerms:"Net 30"},
  ],
  projects:[
    {id:"P001",name:"Dossier Prep & Submission",contractId:"CT001",division:"Regulatory Division",department:"Regulatory Affairs",region:"North America",country:"United States",status:"active",startDate:"2024-02-01",endDate:"2026-12-31"},
    {id:"P002",name:"HA Query Support 2026",contractId:"CT001",division:"Regulatory Division",department:"Regulatory Affairs",region:"North America",country:"United States",status:"active",startDate:"2026-01-01",endDate:"2026-12-31"},
    {id:"P003",name:"Clinical Trial Submission",contractId:"CT003",division:"Clinical Division",department:"Clinical Operations",region:"North America",country:"United States",status:"active",startDate:"2025-01-01",endDate:"2026-06-30"},
  ],
  serviceLines:[
    {id:"SL001",name:"Regulatory Affairs",projectId:"P001",service:"Regulatory Affairs",commercialType:"fixed_price",billingBasis:"milestone",currency:"USD",division:"Regulatory Division",department:"Regulatory Affairs",country:"United States",status:"active"},
    {id:"SL002",name:"HA Query Support",projectId:"P002",service:"HA Query Support",commercialType:"tm_managed",billingBasis:"hourly",currency:"USD",division:"Regulatory Division",department:"Regulatory Affairs",country:"United States",status:"active"},
    {id:"SL003",name:"Clinical Writing",projectId:"P003",service:"Clinical Writing",commercialType:"fixed_price",billingBasis:"milestone",currency:"USD",division:"Clinical Division",department:"Clinical Operations",country:"United States",status:"active"},
  ],
  invoices:[
    {id:"INV001",number:"FRUS20261831",customerId:"C001",contractId:"CT001",invoiceDate:"2026-04-06",billingPeriodStart:"2026-04-01",billingPeriodEnd:"2026-04-30",currency:"USD",status:"paid",totalAmount:59360,notes:"April 2026 billing",
     lines:[
       {id:"IL001",description:"Protocol Submission Milestone",serviceLineId:"SL001",commercialType:"fixed_price",qty:"",rate:"",amount:50000},
       {id:"IL002",description:"HA Query Support Apr 2026",serviceLineId:"SL002",commercialType:"tm_managed",qty:48,rate:195,amount:9360},
     ]},
  ],
};

function Modal({title,onClose,onSave,saveLabel,children}){
  return(
    <div style={s.modal} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={s.modalBox}>
        <div style={s.mh}><span style={{fontSize:15,fontWeight:600,color:C.g900}}>{title}</span><button onClick={onClose} style={{border:"none",background:"none",fontSize:20,cursor:"pointer",color:C.g400}}>×</button></div>
        <div style={s.mb}>{children}</div>
        {onSave&&<div style={s.mf}><button style={s.btn()} onClick={onClose}>Cancel</button><button style={s.btn("primary")} onClick={onSave}>{saveLabel||"Save"}</button></div>}
      </div>
    </div>
  );
}

function F({label,req,children}){
  return <div style={s.fg}><label style={s.label}>{label}{req&&<span style={{color:C.red}}> *</span>}</label>{children}</div>;
}

function Grid2({children}){return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>;}

function Dashboard({data}){
  const totalBilled=data.invoices.reduce((a,i)=>a+i.totalAmount,0);
  const paid=data.invoices.filter(i=>i.status==="paid").reduce((a,i)=>a+i.totalAmount,0);
  const outstanding=totalBilled-paid;
  return(
    <div style={s.content}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <div style={s.kpi(C.b600)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Customers</div><div style={{fontSize:22,fontWeight:700,color:C.g900}}>{data.customers.length}</div></div>
        <div style={s.kpi(C.grn)}><div style={{fontSize:11,color:C.g400,textTransform:"uppercase",letterSpacing:0.3,marginBottom:5}}>Active Projects</div><div style={{fontSize:22,fontWeight:700,color:C.g900}}>{data.projects.filter(p=>p.status==="active").length}</div></div>
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
          {data.projects.length===0&&<div style={{color:C.g400,fontSize:13}}>No projects yet</div>}
        </div>
        <div style={s.card}>
          <div style={{fontWeight:600,color:C.g800,marginBottom:12,fontSize:14}}>Service Lines</div>
          {data.serviceLines.map(sl=>(
            <div key={sl.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+C.g100}}>
              <div><div style={{fontWeight:500,color:C.g800,fontSize:13}}>{sl.name}</div><div style={{fontSize:11,color:C.g400}}>{commLabel(sl.commercialType)}</div></div>
              <span style={s.badge(statusColor(sl.status))}>{sl.status}</span>
            </div>
          ))}
          {data.serviceLines.length===0&&<div style={{color:C.g400,fontSize:13}}>No service lines yet</div>}
        </div>
      </div>
    </div>
  );
}

function Customers({data,setData}){
  const [q,setQ]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [eid,setEid]=useState(null);
  const list=data.customers.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||(c.accountCode||"").toLowerCase().includes(q.toLowerCase()));
  function openCreate(){setForm({status:"active",customerType:"Pharma",region:"North America",country:"United States"});setEid(null);setModal("form");}
  function openEdit(c){setForm({...c});setEid(c.id);setModal("form");}
  function save(){
    if(!form.name)return alert("Customer name is required");
    if(!form.region)return alert("Region is required");
    if(!form.customerType)return alert("Customer type is required");
    if(!form.country)return alert("Country is required");
    if(eid){setData(d=>({...d,customers:d.customers.map(c=>c.id===eid?{...form,id:eid}:c)}));}
    else{setData(d=>({...d,customers:[...d.customers,{...form,id:genId("C")}]}));}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this customer?"))setData(d=>({...d,customers:d.customers.filter(c=>c.id!==id)}));}
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
            {list.length===0&&<tr><td colSpan={8} style={{...s.td,...s.empty}}>No customers yet. Click + New customer to add one.</td></tr>}
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
          <Grid2>
            <F label="Customer name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. Johnson & Johnson"/></F>
            <F label="Legal name"><input style={s.input} value={form.legalName||""} onChange={e=>f("legalName",e.target.value)} placeholder="Full legal entity name"/></F>
            <F label="Account code"><input style={s.input} value={form.accountCode||""} onChange={e=>f("accountCode",e.target.value)} placeholder="e.g. JNJ-001"/></F>
            <F label="Status" req><select style={s.select} value={form.status||"active"} onChange={e=>f("status",e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></F>
            <F label="Customer type" req><select style={s.select} value={form.customerType||""} onChange={e=>f("customerType",e.target.value)}><option value="">Select...</option>{["Pharma","Biotech","MedTech","CRO","Generic"].map(t=><option key={t}>{t}</option>)}</select></F>
            <F label="Region" req><select style={s.select} value={form.region||""} onChange={e=>f("region",e.target.value)}><option value="">Select...</option>{REGIONS.map(r=><option key={r}>{r}</option>)}</select></F>
            <F label="Country" req><select style={s.select} value={form.country||""} onChange={e=>f("country",e.target.value)}><option value="">Select...</option>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></F>
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
    if(eid){setData(d=>({...d,contracts:d.contracts.map(c=>c.id===eid?{...form,id:eid}:c)}));}
    else{setData(d=>({...d,contracts:[...d.contracts,{...form,id:genId("CT")}]}));}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this contract?"))setData(d=>({...d,contracts:d.contracts.filter(c=>c.id!==id)}));}
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
            <F label="Payment terms"><select style={s.select} value={form.paymentTerms||"Net 30"} onChange={e=>f("paymentTerms",e.target.value)}>{["Net 30","Net 45","Net 60","Upfront"].map(p=><option key={p}>{p}</option>)}</select></F>
            <F label="Start date" req><input type="date" style={s.input} value={form.startDate||""} onChange={e=>f("startDate",e.target.value)}/></F>
            <F label="End date" req><input type="date" style={s.input} value={form.endDate||""} onChange={e=>f("endDate",e.target.value)}/></F>
          </Grid2>
          <F label="Notes"><textarea style={{...s.input,resize:"none"}} rows={2} value={form.notes||""} onChange={e=>f("notes",e.target.value)} placeholder="Optional notes..."/></F>
        </Modal>
      )}
    </div>
  );
}

function Projects({data,setData}){
  const [q,setQ]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [eid,setEid]=useState(null);
  const gct=id=>data.contracts.find(c=>c.id===id)||{};
  const gcu=cid=>{const ct=gct(cid);return data.customers.find(c=>c.id===ct.customerId)||{};};
  const list=data.projects.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
  function openCreate(){setForm({status:"draft",division:"Regulatory Division",department:"Regulatory Affairs",region:"North America",country:"United States"});setEid(null);setModal("form");}
  function openEdit(p){setForm({...p});setEid(p.id);setModal("form");}
  function save(){
    if(!form.name||!form.contractId)return alert("Name and contract are required");
    if(!form.division||!form.department||!form.region||!form.country)return alert("All four tags (Division, Department, Region, Country) are mandatory");
    if(eid){setData(d=>({...d,projects:d.projects.map(p=>p.id===eid?{...form,id:eid}:p)}));}
    else{setData(d=>({...d,projects:[...d.projects,{...form,id:genId("P")}]}));}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this project?"))setData(d=>({...d,projects:d.projects.filter(p=>p.id!==id)}));}
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
        <Modal title={eid?"Edit project":"New project"} onClose={()=>setModal(null)} onSave={save} saveLabel={eid?"Save changes":"Create project"}>
          <Grid2>
            <F label="Project name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. Dossier Prep & Submission"/></F>
            <F label="Contract" req><select style={s.select} value={form.contractId||""} onChange={e=>f("contractId",e.target.value)}><option value="">Select contract...</option>{data.contracts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></F>
            <F label="Status" req><select style={s.select} value={form.status||"draft"} onChange={e=>f("status",e.target.value)}>{["draft","active","on_hold","completed","cancelled"].map(st=><option key={st} value={st}>{st}</option>)}</select></F>
            <F label="Division" req><select style={s.select} value={form.division||""} onChange={e=>f("division",e.target.value)}><option value="">Select...</option>{DIVISIONS.map(d=><option key={d}>{d}</option>)}</select></F>
            <F label="Department" req><select style={s.select} value={form.department||""} onChange={e=>f("department",e.target.value)}><option value="">Select...</option>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></F>
            <F label="Region" req><select style={s.select} value={form.region||""} onChange={e=>f("region",e.target.value)}><option value="">Select...</option>{REGIONS.map(r=><option key={r}>{r}</option>)}</select></F>
            <F label="Country" req><select style={s.select} value={form.country||""} onChange={e=>f("country",e.target.value)}><option value="">Select...</option>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></F>
            <F label="Start date"><input type="date" style={s.input} value={form.startDate||""} onChange={e=>f("startDate",e.target.value)}/></F>
            <F label="End date"><input type="date" style={s.input} value={form.endDate||""} onChange={e=>f("endDate",e.target.value)}/></F>
          </Grid2>
          <F label="Scope summary"><textarea style={{...s.input,resize:"none"}} rows={2} value={form.scopeSummary||""} onChange={e=>f("scopeSummary",e.target.value)} placeholder="Brief description of project scope..."/></F>
        </Modal>
      )}
    </div>
  );
}

function ServiceLines({data,setData}){
  const [q,setQ]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [eid,setEid]=useState(null);
  const gp=id=>data.projects.find(p=>p.id===id)||{};
  const list=data.serviceLines.filter(sl=>sl.name.toLowerCase().includes(q.toLowerCase()));
  function openCreate(){setForm({status:"draft",commercialType:"fixed_price",billingBasis:"milestone",currency:"USD",division:"Regulatory Division",department:"Regulatory Affairs",country:"United States"});setEid(null);setModal("form");}
  function openEdit(sl){setForm({...sl});setEid(sl.id);setModal("form");}
  function save(){
    if(!form.name||!form.projectId||!form.service)return alert("Name, project and service are required");
    if(!form.division||!form.department||!form.country)return alert("Division, Department and Country are mandatory tags");
    if(eid){setData(d=>({...d,serviceLines:d.serviceLines.map(sl=>sl.id===eid?{...form,id:eid}:sl)}));}
    else{setData(d=>({...d,serviceLines:[...d.serviceLines,{...form,id:genId("SL")}]}));}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this service line?"))setData(d=>({...d,serviceLines:d.serviceLines.filter(sl=>sl.id!==id)}));}
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
                <td style={s.td}><div style={{fontWeight:500,color:C.g900}}>{sl.name}</div></td>
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
        <Modal title={eid?"Edit service line":"New service line"} onClose={()=>setModal(null)} onSave={save} saveLabel={eid?"Save changes":"Create service line"}>
          <Grid2>
            <F label="Service line name" req><input style={s.input} value={form.name||""} onChange={e=>f("name",e.target.value)} placeholder="e.g. HA Query Support"/></F>
            <F label="Project" req><select style={s.select} value={form.projectId||""} onChange={e=>f("projectId",e.target.value)}><option value="">Select project...</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></F>
            <F label="Service" req><select style={s.select} value={form.service||""} onChange={e=>f("service",e.target.value)}><option value="">Select service...</option>{SERVICES.map(sv=><option key={sv}>{sv}</option>)}</select></F>
            <F label="Commercial type" req><select style={s.select} value={form.commercialType||""} onChange={e=>f("commercialType",e.target.value)}>{COMM_TYPES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></F>
            <F label="Billing basis" req><select style={s.select} value={form.billingBasis||""} onChange={e=>f("billingBasis",e.target.value)}>{BILLING_BASIS.map(b=><option key={b}>{b}</option>)}</select></F>
            <F label="Currency" req><select style={s.select} value={form.currency||"USD"} onChange={e=>f("currency",e.target.value)}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></F>
            <F label="Division" req><select style={s.select} value={form.division||""} onChange={e=>f("division",e.target.value)}><option value="">Select...</option>{DIVISIONS.map(d=><option key={d}>{d}</option>)}</select></F>
            <F label="Department" req><select style={s.select} value={form.department||""} onChange={e=>f("department",e.target.value)}><option value="">Select...</option>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></F>
            <F label="Country" req><select style={s.select} value={form.country||""} onChange={e=>f("country",e.target.value)}><option value="">Select...</option>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></F>
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
    if(eid){setData(d=>({...d,invoices:d.invoices.map(i=>i.id===eid?{...inv,id:eid}:i)}));}
    else{setData(d=>({...d,invoices:[...d.invoices,{...inv,id:genId("INV")}]}));}
    setModal(null);
  }
  function del(id){if(window.confirm("Delete this invoice?"))setData(d=>({...d,invoices:d.invoices.filter(i=>i.id!==id)}));}
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
        <Modal title="New invoice" onClose={()=>setModal(null)} onSave={save} saveLabel="Create invoice">
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
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12}}>
            <span style={{fontSize:13,color:C.g500}}>Total:</span>
            <span style={{fontSize:18,fontWeight:700,color:C.g900}}>{form.currency||"USD"} {total(lines).toLocaleString()}</span>
          </div>
          <F label="Notes"><textarea style={{...s.input,resize:"none"}} rows={2} value={form.notes||""} onChange={e=>f("notes",e.target.value)} placeholder="Optional billing notes..."/></F>
        </Modal>
      )}
      {modal==="view"&&(
        <Modal title={form.number} onClose={()=>setModal(null)}>
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

const TABS=[{id:"dashboard",label:"Dashboard"},{id:"customers",label:"Customers"},{id:"contracts",label:"Contracts"},{id:"projects",label:"Projects"},{id:"serviceLines",label:"Service Lines"},{id:"invoices",label:"Invoices"}];

export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [data,setData]=useState(INIT);
  const title=TABS.find(t=>t.id===tab)?.label||"";
  return(
    <div style={s.app}>
      <div style={s.nav}>
        <div style={{width:28,height:28,background:"rgba(255,255,255,0.2)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="2" y="2" width="5" height="5" rx="1" fill="white" opacity="0.9"/><rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6"/><rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6"/><rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.3"/></svg>
        </div>
        <div style={{marginLeft:6}}><div style={s.logoName}>Freyr Pulse</div><div style={s.logoTag}>Enterprise</div></div>
        <div style={{width:1,height:24,background:"rgba(255,255,255,0.2)",margin:"0 12px"}}/>
        {TABS.map(t=><button key={t.id} style={s.navLink(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        <div style={{marginLeft:"auto",width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"#fff"}}>SA</div>
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
          </div>
        </div>
        <div style={s.main}>
          <div style={s.pageHeader}><div style={s.pageTitle}>{title}</div><div style={{fontSize:12,color:C.g400}}>Freyr Pulse · Admin</div></div>
          {tab==="dashboard"&&<Dashboard data={data}/>}
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
