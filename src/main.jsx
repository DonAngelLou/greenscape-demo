import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Activity,ArrowUpRight,BriefcaseBusiness,Building2,CalendarDays,Camera,Check,ChevronDown,ClipboardList,Clock3,CloudOff,Flower2,GalleryHorizontal,Globe2,Home,Inbox,Layers3,Leaf,MapPin,Package,RefreshCw,Route,ShieldCheck,Sparkles,Truck,Users,Wifi} from 'lucide-react';
import {roles,phases,labels,sites,initial,departments,scopeRole,route,move,load} from './model';
import {FeatureWorkspace,Overview} from './studio';
import './styles.css';

const icons={overview:Home,people:Users,inbox:Inbox,property:Building2,projects:Flower2,dispatch:Route,field:Truck,portal:Globe2,stock:Package,intelligence:Sparkles,buyer:Home,distributor:Package,audit:Activity};
const stepNames=['To schedule','Scheduled','Evidence queued','Evidence submitted','Published','Approved'];
const assets=import.meta.env.BASE_URL+'evidence/';

const intro={
  overview:['Platform overview','Review work and performance across the business.'],
  dispatch:['Service dispatch','Schedule visits, review evidence, and publish work for customers.'],
  portal:['My service dashboard','Track work, review service evidence and follow up on issues.'],
  field:['My field work','Record work at your assigned site and sync evidence for review.'],
  people:['People & payroll','Review attendance, approvals and payroll across authorized business units.'],
  inbox:['Sales inbox','Qualify new inquiries and route them to the right team.'],
  property:['Real estate workspace','Manage lot inventory, buyer visits, reservations and commissions.'],
  projects:['Projects & materials','Track milestones, quantities, plants and material requests.'],
  stock:['Andi Honey operations','Manage batches, quality, inventory and distributor fulfilment.'],
  intelligence:['Executive intelligence','Review operating indicators and ask questions about authorized records.'],
  buyer:['My property journey','Follow the published milestones for your reservation and turnover.'],
  distributor:['My distributor orders','Review your fulfilment, assigned stock and delivery records.'],
  audit:['Activity log','Review the recorded actions from this demo session.']
};

function Tag({children,tone=''}) {return <span className={'tag '+tone}>{children}</span>}
function Panel({title,caption,children,action}) {return <section className="panel"><header className="panel-head"><div><h2>{title}</h2>{caption&&<p>{caption}</p>}</div>{action}</header>{children}</section>}
function Stat({icon:Icon,label,value,detail}) {return <article className="stat"><div className="stat-label"><span className="icon-tile"><Icon size={17}/></span>{label}</div><strong>{value}</strong><small>{detail}</small></article>}
function Table({head,rows}) {return <div className="table-scroll"><table><thead><tr>{head.map(cell=><th key={cell}>{cell}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
function Btn({children,onClick,secondary=false,disabled=false}) {return <button className={secondary?'button secondary':'button'} onClick={onClick} disabled={disabled}>{children}</button>}
function Photos(){return <div className="photos">{['before','after'].map(side=><figure key={side}><img src={assets+side+'.webp'} alt={side==='before'?'Garden border and pathway before maintenance':'Garden border and pathway after maintenance'}/><figcaption>{side==='before'?'Before service':'After service'}</figcaption></figure>)}</div>}
function App(){
  const [url,setUrl]=useState(route),[data,setData]=useState(load),[biz,setBiz]=useState(departments[0]),[notice,setNotice]=useState(''),[visitDate,setVisitDate]=useState(''),[comment,setComment]=useState(''),[prompt,setPrompt]=useState(''),[answer,setAnswer]=useState('');
  useEffect(()=>{const change=()=>{setUrl(route());setNotice('');setComment('');setVisitDate('')};window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change)},[]);
  useEffect(()=>{try{localStorage.setItem('greenscape-demo-v1',JSON.stringify(data))}catch{}},[data]);
  const {phase,role,site}=url, phaseInfo=phases[phase], allowed=phaseInfo.modules.filter(x=>roles[role].includes(x));
  const view=allowed.includes(url.module)?url.module:allowed[0];
  const scoped=scopeRole(role), current=sites[site], job=data.jobs[site];
  const published=['Published','Approved','Issue reported'].includes(job.status);
  const event=(message)=>({message,role,site,time:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})});
  const set=(key,message,value=true)=>{setData(old=>({...old,[key]:value,events:[event(message),...old.events]}));setNotice(message)};
  const jobChange=(status,message,additional={})=>{
  setData(old=>{
    const eventHistory = ['Issue reported','Approved'].includes(status)||(status==='Published'&&old.jobs[site].status==='Issue reported');
    const history = eventHistory
      ? [...(old.jobs[site].history||[]), {status, note:additional.issue||additional.signature||message}]
      : old.jobs[site].history;
    return {...old,jobs:{...old.jobs,[site]:{...old.jobs[site],status,...additional,history}},events:[event(message),...old.events]};
  });
  setNotice(message);
};
  const changeRole=(r,target)=>move(phase,r,target,site);
  const dateLabel=new Date(job.day+'T12:00').toLocaleDateString('en-PH',{weekday:'short',month:'short',day:'numeric'});
  const tableStatus=(value,yes,no)=><Tag tone={value?'good':'muted'}>{value?yes:no}</Tag>;
  const isCoral=site==='coral';
  const serviceProgress=isCoral&&data.details?.milestonePublished?86:current.progress;

  function serviceView(){
    const portal=view==='portal',crew=view==='field';
    const showEvidence=portal?published:!['To schedule','Scheduled'].includes(job.status);
    const steps=[['Scheduled','Visit on the calendar'],['Evidence submitted','Crew records proof'],['Published','Supervisor release'],['Approved','Customer sign-off']];
    const progress=job.status==='Issue reported'?4:stepNames.indexOf(job.status);
    return <>
      <section className="site-banner"><div className="site-copy"><span className="site-overline"><MapPin size={14}/> {current.area}</span><h2>{current.name}</h2><p>{current.service}</p><div className="site-tags"><Tag>{isCoral?'Maintenance contract':'Planting care contract'}</Tag><Tag>{portal?current.owner:'Visit '+(isCoral?'GS-104':'GS-209')}</Tag></div></div><div className="site-image" style={{"--banner-photo": "url(" + new URL(assets + "after.webp", document.baseURI).href + ")"}} role="img" aria-label="Illustrative tropical courtyard after maintenance"/></section>
      <div className="stats three">
        <Stat icon={CalendarDays} label="Service date" value={dateLabel} detail={current.next}/>
        <Stat icon={ClipboardList} label="Visit status" value={portal&&!published?'Awaiting update':job.status} detail={portal?'Published customer view':'Illustrative work order'}/>
        <Stat icon={ShieldCheck} label={portal?'Service progress':'Contract visits'} value={portal?`${serviceProgress}%`:current.visits} detail={portal?'Across published milestones':'Current reporting period'}/>
      </div>
      <div className="cols">
        <Panel title={portal?'Visit activity':crew?'Assignment details':'Visit workflow'} caption={portal?'Updates shared by Greenscape':'Courtyard maintenance workflow'} action={<Tag tone={published?'good':'muted'}>{portal&&!published?'Awaiting update':job.status}</Tag>}>
          <ol className="timeline">{steps.map(([label,desc],i)=><li key={label} className={(progress >= [1,3,4,5][i]&&(!portal||published))?'done':''}><span>{(progress >= [1,3,4,5][i]&&(!portal||published))?<Check size={15}/>:i+1}</span><div><strong>{label}</strong><small>{desc}</small></div></li>)}</ol>
          {(!portal||published)&&<div className="note"><p>{job.notes}</p>{!portal&&data.details?.[site+'-crew']&&<p>Assigned to {data.details[site+'-crew']}.</p>}</div>}
          {job.issue&&published&&<div className="note issue"><strong>Issue reported</strong><p>{job.issue}</p></div>}
        </Panel>
        <Panel title={portal?'Service evidence':crew?'Capture proof':'Evidence review'} caption={portal?'Photos and sign-off for this visit':'Before-and-after documentation'}>
          {showEvidence&&(isCoral?<Photos/>:<div className="note">North entrance evidence reviewed by the assigned supervisor. The service summary is available below.</div>)}
          {!showEvidence&&<div className="empty"><Camera size={25}/><strong>{portal?'Awaiting the published report':'Ready for site evidence'}</strong><span>{portal?'Released photos and reports will appear here.':'Images and notes appear after the crew records the visit.'}</span></div>}
          {view==='dispatch'&&<>
            {job.status==='To schedule'&&<div className="actions"><label>Visit date<input type="date" value={visitDate||job.day} onChange={e=>setVisitDate(e.target.value)}/></label><Btn onClick={()=>jobChange('Scheduled','Visit scheduled for the field crew',{day:visitDate||job.day})}>Schedule visit</Btn></div>}
            {job.status==='Scheduled'&&<div className="actions"><Btn onClick={()=>changeRole('Field crew','field')}>Open field assignment</Btn></div>}
            {job.status==='Evidence queued'&&<div className="note">Evidence is waiting for the field crew to reconnect.</div>}
            {job.status==='Evidence submitted'&&<div className="actions"><Btn onClick={()=>jobChange('Published','Service report published to the customer portal')}>Publish service report</Btn></div>}
            {job.status==='Published'&&<div className="actions"><Btn onClick={()=>changeRole('Customer approver','portal')}>Open customer review</Btn></div>}
            {job.status==='Issue reported'&&<div className="actions"><Btn onClick={()=>jobChange('Published','Issue reviewed and updated report published',{issue:''})}>Resolve and republish</Btn></div>}
          </>}
          {crew&&job.status==='Scheduled'&&<div className="actions"><Btn onClick={()=>jobChange('Evidence submitted','Crew submitted two photos and a site note')}>Submit sample proof</Btn>{phase!=='pilot'&&<Btn secondary onClick={()=>jobChange('Evidence queued','Proof saved in the simulated offline queue')}><CloudOff size={16}/>Save offline</Btn>}</div>}
          {crew&&job.status==='Evidence queued'&&<div className="actions"><Btn onClick={()=>jobChange('Evidence submitted','Offline evidence synced for supervisor review')}><Wifi size={16}/>Reconnect and sync</Btn></div>}
          {crew&&job.status==='Evidence submitted'&&<div className="actions"><Btn onClick={()=>changeRole('Dispatcher / Supervisor','dispatch')}>Open supervisor review</Btn></div>}
          {portal&&job.status==='Published'&&role==='Customer approver'&&<div className="review"><label>Issue details<input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Describe what needs attention"/></label><div className="actions"><Btn onClick={()=>jobChange('Approved','Customer approved the service report',{issue:''})}><Check size={16}/>Approve service</Btn><Btn secondary disabled={!comment.trim()} onClick={()=>jobChange('Issue reported','Customer submitted an issue for review',{issue:comment.trim()})}>Report issue</Btn></div></div>}
          {portal&&published&&<div className="note"><strong>Published service summary</strong><p>Garden borders and path serviced. Before-and-after photos recorded. {job.status==='Approved'?(job.signature?'Signed by '+job.signature+'.':'Customer sign-off recorded.'):'Status is visible in the visit timeline.'}</p></div>}
        </Panel>
      </div>
      {portal&&<Panel title="Projects & service history" caption="Published updates for your assigned site">
        <div className="client-summary"><div><strong>{isCoral?'Courtyard irrigation':'North entrance planting'}</strong><p>{isCoral?'Irrigation and tropical border care':'Hedge establishment and pathway upkeep'}</p></div><Tag tone="good">{serviceProgress}% published</Tag></div>
        <Table head={['Milestone or visit','Status','Customer record']} rows={[
          [isCoral?'Initial site inspection':'Entrance inspection','Completed','Checklist accepted'],
          [isCoral?(data.details?.milestonePublished?'Irrigation installation':'Irrigation preparation'):'Planting bed preparation','Published','Milestone update'],
          [job.day,published?job.status:'Scheduled',published?'Service report and evidence':'Next scheduled visit'],
        ]}/>
        {published&&<div className="actions"><a className="button secondary" download={(isCoral?'GS-104':'GS-209')+'-service-summary.txt'} href={'data:text/plain;charset=utf-8,'+encodeURIComponent([current.name,current.service,job.day,job.status,job.notes,'Illustrative Greenscape service report'].join(String.fromCharCode(10)))}>Download service summary</a></div>}
      </Panel>}
    </>
  }
  function moduleView(){
    if(['dispatch','field','portal'].includes(view))return serviceView();
    if(view==='people')return <><div className="stats three"><Stat icon={Users} label="Profiles" value="3" detail="Illustrative employee register"/><Stat icon={Clock3} label="Attendance" value={data.attendance?'Synced':'Ready'} detail="Geofence and offline sample"/><Stat icon={ClipboardList} label="Payroll run" value={data.payroll?'Reviewed':'Draft'} detail="Illustrative figures in PHP"/></div><Panel title="Employee register" caption={'201 profiles, daily time records and approvals · '+biz}><Table head={['Employee','Unit','Attendance','Workflow']} rows={[[<strong>Avery Santos</strong>,'Maintenance',tableStatus(data.attendance,'Geofence verified','Awaiting check-in'),'Day shift'],[<strong>Robin Luna</strong>,'Landscaping','On site',tableStatus(data.leave,'Leave approved','Leave requested')],[<strong>Kris Reyes</strong>,'Andi Honey','Clocked out',tableStatus(data.overtime,'Overtime approved','Overtime requested')]].filter(row=>biz===departments[0]||row[1]===biz)}/><div className="actions"><Btn onClick={()=>set('attendance','Sample geofenced attendance recorded and synced')}>Simulate DTR sync</Btn><Btn secondary onClick={()=>set('leave','Leave request approved')}>Approve leave</Btn><Btn secondary onClick={()=>set('overtime','Overtime request approved')}>Approve overtime</Btn><Btn secondary onClick={()=>set('payroll','Illustrative payroll register reviewed')}>Review payroll run</Btn></div>{data.payroll&&<Table head={['Period','Gross pay','Sample deductions','Sample net','Status']} rows={[[ '15-day demo period','₱38,500','₱2,400','₱36,100','Reviewed · sample bank export ledger']]} />}</Panel></>;
    if(view==='inbox')return <><Panel title="Omnichannel inquiries" caption="Sample queue · web, Messenger, WhatsApp and SMS"><Table head={['Contact','Channel','Need','Status']} rows={[[<strong>Taylor P.</strong>,'Web form','Book a property visit',tableStatus(data.lead,'Qualified · priority','New')],['Harbor Facilities','Messenger','Recurring garden care',data.handoff?'Assigned to maintenance':'Awaiting response'],['Coastal Retail','WhatsApp','Honey case pricing','New'],['Cove View','SMS','Follow-up for site inspection',data.trip?'Visit follow-up ready':'Dormant']]}/><div className="actions"><Btn onClick={()=>set('lead','Sample AI qualified the property inquiry and drafted an FAQ reply')}>Qualify sample lead</Btn><Btn secondary onClick={()=>set('handoff','Inquiry handed off to the maintenance team')}>Hand off inquiry</Btn></div>{data.lead&&<div className="note"><strong>Drafted reply</strong><p>A site visit is available by appointment. Would you prefer a weekday or Saturday? The real estate team can confirm the timeslot.</p></div>}</Panel></>;
    if(view==='property')return <><div className="stats three"><Stat icon={Home} label="Subdivision" value="Cove Heights" detail="Phase A · Block 2"/><Stat icon={MapPin} label="Site visit" value={data.trip?'Booked':'Open'} detail="Sample buyer follow-up"/><Stat icon={ShieldCheck} label="Lot A-12" value={data.reserve?'On hold':'Available'} detail={data.reserve?'Reserved for Taylor P.':'Ready for reservation'}/></div><Panel title="Lot inventory and buyer pipeline" caption="Cove Heights · Phase A · Block 2"><Table head={['Lot','Status','Buyer step','Agent note']} rows={[[<strong>A-12</strong>,tableStatus(data.reserve,'Hold active','Available'),['Inquiry','Site visit booked','Reservation','Turnover'][data.buyerStep],data.commission?'Commission split posted':'Assigned to Avery'],['A-13',<Tag tone="good">Sold</Tag>,'Turnover','Closed'],['A-14',<Tag>Blocked</Tag>,'—','Utilities review']]}/><div className="actions"><Btn disabled={data.reserve} onClick={()=>set('reserve','Lot A-12 placed on hold for the sample buyer')}>Hold lot A-12</Btn><Btn secondary disabled={data.trip} onClick={()=>{set('trip','Site visit booked and sample GPS check-in logged');setData(old=>({...old,buyerStep:Math.max(1,old.buyerStep)}));}}>Book site visit</Btn><Btn secondary disabled={data.buyerStep===3||!data.reserve||!data.trip} onClick={()=>{set('buyerStep',data.buyerStep===2?'Turnover published to the buyer portal':'Buyer reservation published',data.buyerStep+1);}}>Advance buyer stage</Btn><Btn secondary onClick={()=>set('commission','Sample commission tranches posted at configured splits')}>Calculate commission</Btn><Btn secondary disabled={data.buyerStep<3||data.crossSell} onClick={()=>set('crossSell','Turnover created a landscaping referral for staff review')}>Create landscaping referral</Btn></div>{data.commission&&<div className="note">Sample commission ₱36,000 · Broker ₱18,000 · Agent ₱12,000 · Team ₱6,000.</div>}</Panel></>;
    if(view==='buyer')return <Panel title="Cove Heights · A-12" caption="Taylor P. · Your published property milestones"><Table head={['Milestone','Status']} rows={['Inquiry','Site visit','Reservation','Turnover'].map((x,i)=>[x,tableStatus(data.buyerStep>=i,'Published','Upcoming')])}/></Panel>;
    if(view==='projects')return <><div className="stats three"><Stat icon={Flower2} label="Site progress" value={data.milestone?'86%':'72%'} detail="Coral Bay Resort"/><Stat icon={Package} label="Nursery stock" value="48 plants" detail="38 ready for transfer"/><Stat icon={Inbox} label="Cross-sell referrals" value={data.crossSell?'1 ready':'0'} detail="From real estate turnover"/></div><Panel title="Coral Bay landscaping" caption="Materials, plantation and milestones"><Table head={['Scope item','Quantity','Status','Next step']} rows={[[<strong>Irrigation valve</strong>,'24 units',tableStatus(data.requisition,'Requested','Planned'),'Material requisition'],['Tropical border planting','48 plants','95% sample survival','Record nursery transfer'],['Courtyard irrigation','Milestone 03',tableStatus(data.milestone,'Completed','In progress'),'Publish progress at next review']]}/><div className="actions"><Btn onClick={()=>set('requisition','Material requisition submitted for 24 irrigation valves')}>Request materials</Btn><Btn secondary onClick={()=>set('milestone','Irrigation milestone marked complete')}>Complete milestone</Btn></div>{data.crossSell&&<div className="note">New Cove Heights referral · Draft garden care package ready for supervisor review.</div>}</Panel></>;
    if(view==='stock')return <><div className="stats three"><Stat icon={Package} label="Raw & packaging stock" value="420 kg" detail="Raw honey · 2,400 sachets available"/><Stat icon={CalendarDays} label="Expiry advisory" value="1 lot" detail="Review near-expiry stock"/><Stat icon={Truck} label="Distributor order" value={data.order?'Released':'Pending'} detail="Coastal Retail · 24 cases"/></div><Panel title="Batch and distribution register" caption="Production, quality checks, allocation and consignment"><Table head={['Batch','Use-by','QC status','Inventory']} rows={[[<strong>AH-026</strong>,'2027-01-18',<Tag tone="good">Released</Tag>,data.allocate?'24 cases allocated':'48 eligible cases'],['AH-031','2027-02-20',<Tag>Quarantined</Tag>,'20 held cases'],[data.batch?'AH-047 · new batch':'Raw input stock',data.batch?'2027-04-30':'—',data.batch?'Awaiting QC':'Approved','Production input']]}/><div className="actions"><Btn onClick={()=>set('batch','Sample production batch AH-047 created')}>Create sample batch</Btn><Btn secondary onClick={()=>set('allocate','FEFO allocated eligible lot AH-026 and skipped quarantined inventory')}>Run FEFO allocation</Btn><Btn secondary disabled={!data.allocate} onClick={()=>set('order','Distributor order released for fulfilment')}>Release order</Btn></div><div className="note">Coastal Retail · Consignment 24 cases · Sample receivable ₱18,600 · 31–60 days.</div></Panel></>;
    if(view==='distributor')return <Panel title="Coastal Retail orders" caption="Your order and fulfilment records"><Table head={['Order','Quantity','Status','Batch']} rows={[[<strong>CR-112</strong>,'24 cases',tableStatus(data.order,'Released','Pending'),data.order?'AH-026':'Pending fulfilment']]}/></Panel>;
    if(view==='intelligence')return <><div className="stats three"><Stat icon={Route} label="Service operations" value={data.jobs.coral.status} detail="Source · Coral Bay GS-104"/><Stat icon={Package} label="Inventory advisory" value="1 near-expiry lot" detail="Source · AH-026"/><Stat icon={Inbox} label="Cross-sell pipeline" value={data.crossSell?'1 referral':'0 referrals'} detail="Source · Real Estate A-12"/></div><Panel title="Ask about operations" caption="Sample assistant answers from the records in this demo"><div className="review"><label>Question<input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="What is the latest service or inventory status?"/></label><div className="actions"><Btn disabled={!prompt.trim()} onClick={()=>setAnswer(/lot|honey|expir|stock|inventor/i.test(prompt)?'Batch AH-026 expires on 18 January 2027. Source: Andi Honey batch register.':/service|visit|maintenance|project|coral/i.test(prompt)?`Coral Bay service visit GS-104 is ${data.jobs.coral.status.toLowerCase()}. Source: Service dispatch.`:'Sample answers cover the Coral Bay service visit and Andi Honey expiry records.')}>Ask about records</Btn><Btn secondary onClick={()=>{setPrompt('Which honey lot expires next?');setAnswer('Batch AH-026 expires on 18 January 2027. Source: Andi Honey batch register.')}}>Try a sample question</Btn></div></div>{answer&&<div className="note"><Sparkles size={17}/><p>{answer}</p></div>}</Panel></>;
    if(view==='audit')return <Panel title="Demo audit trail" caption="Actions recorded during this browser session"><Table head={['Time','Role','Activity']} rows={data.events.filter(x=>role!=='HR / Payroll'||x.role==='HR / Payroll').map(x=>[x.time,x.role,x.message])}/>{!data.events.length&&<div className="empty"><Activity size={22}/>Try a workflow action to populate this log.</div>}</Panel>;
    return <div className="panel empty"><ShieldCheck size={28}/><strong>This role has no workspace in {phaseInfo.name}.</strong><span>Choose another role or phase to explore the preview.</span></div>;
  }
  const [title,sub]=intro[view]||['Workspace access','Review this phase with a different sample role.'];
  const open=(target)=>move(phase,role,target,site);
  const openRole=(targetRole,target,targetPhase=phase)=>move(targetPhase,targetRole,target,site);
  const selectPhase=(target)=>{
    const sameRole=phases[target].modules.some(module=>roles[role].includes(module));
    openRole(sameRole?role:'Executive',null,target);
  };
  const activeIcon=icons[view]||ShieldCheck;
  const ActiveIcon=activeIcon;

  return <div className="app">
    <aside className="sidebar">
      <a className="brand" href="#/pilot" aria-label="Greenscape pilot">
        <span className="brand-mark"><Leaf size={22}/></span>
        <span><strong>greenscape<span>.</span></strong><small>OPERATIONS STUDIO</small></span>
      </a>
      {!!allowed.length&&<>
        <div className="side-label workspace-label">WORKSPACES</div>
        <nav aria-label="Workspace views">
          {allowed.map(key=>{const Icon=icons[key];return <button key={key} aria-current={key===view?'page':undefined} className={'nav module '+(key===view?'active':'')} onClick={()=>open(key)}><Icon size={18}/><span>{labels[key]}</span></button>})}
        </nav>
      </>}
      <div className="side-foot"><span className="dot"/> Demo workspace<small>Prepared by Inyovision Palawan</small></div>
    </aside>
    <main>
      <header className="topbar">
        <div className="crumb"><ActiveIcon size={16}/><strong>{view?labels[view]:'Permissions'}</strong></div>
        <div className="toolbar">
          <label className="toolbar-select"><Layers3 size={16}/><span>Rollout</span><select aria-label="Rollout" value={phase} onChange={e=>selectPhase(e.target.value)}>
            {Object.keys(phases).map(key=><option value={key} key={key}>{({pilot:'Customer pilot','phase/1':'Phase 1 · HRIS','phase/2':'Phase 2 · Realty','phase/3':'Phase 3 · Field','phase/4':'Phase 4 · Honey',system:'Full system'})[key]}</option>)}
          </select><ChevronDown size={14}/></label>
          <label className="toolbar-select role-picker"><ShieldCheck size={16}/><span>Preview as</span><select aria-label="Preview as" value={role} onChange={e=>changeRole(e.target.value,view)}>{Object.keys(roles).map(r=><option key={r}>{r}</option>)}</select><ChevronDown size={14}/></label>
          <button className="reset" onClick={()=>{setData(initial);setNotice('Demo reset');setAnswer('');setPrompt('');move('pilot','Executive','overview','coral')}} aria-label="Reset demo" title="Reset demo"><RefreshCw size={16}/><span>Reset</span></button>
        </div>
      </header>
      <div className={'content content-'+view}>
        <header className="page-head">
          <div><span className="eyebrow">{phaseInfo.detail}</span><h1>{title}</h1><p>{sub}</p></div>
          <div className="controls">
            {['dispatch','field','portal'].includes(view)&&<label><Building2 size={16}/>{scoped?'Sample account':'Sample site'}<select aria-label="Sample site or account" value={site} onChange={e=>move(phase,role,view,e.target.value)}>{Object.entries(sites).map(([key,value])=><option value={key} key={key}>{value.name}</option>)}</select><ChevronDown size={14}/></label>}
            {!scoped&&['overview','people'].includes(view)&&<label><Building2 size={16}/>Business unit<select aria-label="Business unit" value={biz} onChange={e=>setBiz(e.target.value)}>{departments.map(d=><option key={d}>{d}</option>)}</select><ChevronDown size={14}/></label>}
            <Tag tone="muted">Illustrative data</Tag>
          </div>
        </header>
        {notice&&<div className="toast" role="status"><Check size={17}/>{notice}</div>}
        {view==='overview'
          ?<Overview data={data} phase={phase} biz={biz} allowed={allowed} icons={icons} open={open} selectPhase={selectPhase} openRole={openRole}/>
          :<FeatureWorkspace key={[view,phase,role,site].join('/')} view={view} phase={phase} role={role} site={site} biz={biz} data={data} set={set} updateJob={jobChange}>{moduleView()}</FeatureWorkspace>
        }
      </div>
    </main>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
