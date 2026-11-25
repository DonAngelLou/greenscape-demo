import React, {useState} from 'react';
import {
  Activity, ArrowRight, ArrowUpRight, Building2, CalendarDays, Check, ChevronRight,
  ClipboardCheck, FileText, Flower2, Globe2, Layers3, MapPin, Route, ShieldCheck,
  Sparkles, TrendingUp, Truck, Users,
} from 'lucide-react';
import {labels, sites} from './model';

const rolloutArt = new URL(import.meta.env.BASE_URL + 'evidence/operations.webp', document.baseURI).href;
const visitSteps = ['To schedule','Scheduled','Evidence queued','Evidence submitted','Published','Issue reported','Approved'];
const users = [
  {name:'Avery Santos',unit:'Maintenance',role:'Crew lead',shift:'07:00–16:00',site:'Coral Bay Resort'},
  {name:'Robin Luna',unit:'Landscaping',role:'Site supervisor',shift:'08:00–17:00',site:'Coral Bay Resort'},
  {name:'Kris Reyes',unit:'Andi Honey',role:'Production operator',shift:'06:00–15:00',site:'Palawan warehouse'},
];
const leads = [
  {id:'L-205',name:'Canopy Villas',channel:'Instagram',unit:'Landscaping',subject:'Landscape design request',message:'Can you prepare a planting concept for a new villa courtyard?',reply:'Our landscaping team can arrange a short design intake and request a site plan.',score:78},
  {id:'L-206',name:'Palm Grove Office',channel:'Email',unit:'Maintenance',subject:'Service report request',message:'We would like to see a sample report before deciding on the maintenance plan.',reply:'We can share an example of a released visit report and its supporting proof.',score:68},
  {id:'L-201',name:'Taylor P.',channel:'Web form',unit:'Real Estate',subject:'Cove Heights viewing',message:'Is there an available lot near the entrance? I can visit on Saturday.',reply:'Lot A-12 is listed for review. I can ask the property team to confirm a Saturday viewing.',score:92},
  {id:'L-202',name:'Harbor Facilities',channel:'Messenger',unit:'Maintenance',subject:'Recurring garden care',message:'We are looking for weekly maintenance and a service report after each visit.',reply:'Our maintenance team can arrange a site assessment and propose a visit schedule.',score:83},
  {id:'L-203',name:'Coastal Retail',channel:'WhatsApp',unit:'Andi Honey',subject:'Honey case pricing',message:'Could you send available pack sizes and distributor terms?',reply:'The distribution team can confirm current pack availability and account terms.',score:74},
  {id:'L-204',name:'Cove View',channel:'SMS',unit:'Real Estate',subject:'Dormant site inquiry',message:'Thanks, we were considering a viewing next month.',reply:'Would you like a new time for a property visit? We can help reschedule.',score:56},
];
const blocks = [
  ['A-11',142,'Available'],['A-12',168,'Available'],['A-13',185,'Sold'],['A-14',150,'Blocked'],
  ['A-15',148,'Available'],['A-16',170,'Reserved'],['A-17',144,'Available'],['A-18',155,'Available'],
];
const tabs = {
  dispatch:['Visit workflow','Calendar & routes','Contracts'],
  field:['Assignment','Site checklist','Sync activity'],
  portal:['Service overview','Documents & compliance','Issues & sign-offs'],
  people:['Employee register','Profiles & shifts','Time records','Payroll register'],
  inbox:['Inquiry queue','Conversations','Follow-up & knowledge'],
  property:['Sales workspace','Lot map','Commission ledger'],
  projects:['Projects overview','BOQ & requisition','Nursery & survival','Milestone approvals'],
  stock:['Batch register','Traceability & QC','Allocation & orders','Receivables'],
  intelligence:['Ask & explore','Business performance'],
  buyer:['Reservation overview','Buyer documents'],
  distributor:['My orders','Delivery & statements'],
  audit:['Activity log','Access matrix'],
};

function Action({children, onClick, disabled=false, secondary=false}) {
  return <button className={'button'+(secondary?' secondary':'')} disabled={disabled} onClick={onClick}>{children}</button>;
}

function Card({title, intro, children, className=''}) {
  return <section className={'studio-card '+className}>
    <header><h2>{title}</h2>{intro&&<p>{intro}</p>}</header>
    {children}
  </section>;
}

function Badge({children, tone='neutral'}) {
  return <span className={'studio-tag '+tone}>{children}</span>;
}

function Grid({columns, rows}) {
  return <div className="table-scroll"><table><thead><tr>{columns.map(column=><th key={column}>{column}</th>)}</tr></thead>
    <tbody>{rows.map((row,index)=><tr key={index}>{row.map((cell,position)=><td key={position}>{cell}</td>)}</tr>)}</tbody>
  </table></div>;
}

function Export({name, children, value}) {
  return <a className="button secondary" download={name} href={'data:text/plain;charset=utf-8,'+encodeURIComponent(value)}>
    <FileText size={16}/>{children}
  </a>;
}

export function Overview({data, phase, biz, allowed, icons, open, selectPhase, openRole}) {
  const pilot=phase==='pilot';
  const visit=data.jobs.coral;
  const signals=[
    ['Field visits',Object.entries(data.jobs).filter(([key,job])=>visitSteps.indexOf(job.status)>0&&(biz==='All business units'||biz==='Maintenance'||(biz==='Landscaping'&&key==='mangrove'))).length,CalendarDays,'Across sample sites'],
    ['Customer sign-offs',Object.values(data.jobs).filter(j=>j.status==='Approved').length,ClipboardCheck,'Published visit records'],
    ['Operational activity',data.events.length,Activity,'Actions in this demo'],
  ];
  const featured=allowed.filter(key=>key!=='overview'&&key!=='audit');
  return <>
    <div className="overview-feature">
      <section className="portfolio-hero" style={{backgroundImage:`linear-gradient(93deg,#102c23 0%,#102c23e0 27%,#102c2335 78%),url("${rolloutArt}")`}}>
        <div><span className="hero-signal"><span/>{pilot?'CUSTOMER VISIBILITY PILOT':'OPERATIONS OVERVIEW'}</span>
        <h2>{pilot?'See the work.\nFollow the service.':'Every business.\nOne operating view.'}</h2>
        <p>{pilot?'Follow one visit from crew scheduling to customer sign-off.':'Review workforce, sales, service delivery and inventory across Greenscape.'}</p>
        <Action onClick={()=>pilot?open('dispatch'):selectPhase('pilot')}>{pilot?'Start pilot walkthrough':'Open pilot walkthrough'} <ArrowRight size={17}/></Action></div>
        <span className="hero-credit"><MapPin size={13}/> Illustrative property</span>
      </section>
      <section className="pulse-card">
        <span className="section-kicker">SERVICE ACTIVITY</span>
        <h2>Coral Bay Resort</h2>
        <p>East courtyard maintenance</p>
        <Badge tone={visit.status==='Approved'?'green':'amber'}>{visit.status}</Badge>
        <div className="progress-track" aria-label={'Visit status '+visit.status}>
          {['Schedule','Capture','Publish','Sign-off'].map((step,i)=><span key={step} className={visitSteps.indexOf(visit.status)>=[1,3,4,6][i]?'done':''}><i/>{step}</span>)}
        </div>
        <div className="pulse-footer"><span>Customer portal</span><button onClick={()=>openRole('Customer approver','portal',pilot?'pilot':'phase/3')} aria-label="Preview customer portal"><ArrowUpRight size={17}/></button></div>
      </section>
    </div>
    <div className="signal-grid">{signals.map(([label,value,Icon,caption])=><div className="signal" key={label}><span className="signal-icon"><Icon size={18}/></span><div><span>{label}</span><strong>{value}</strong><small>{caption}</small></div></div>)}</div>
    <div className="overview-bottom">
      <Card title={pilot?'Explore the pilot':'Business workspaces'} intro={pilot?'Open a workspace and use the role selector to follow the handoffs.':'Open a workspace in the selected rollout.'}>
        <div className={"workspace-links"+(pilot?" pilot-links":"")}>{featured.map(key=>{const Icon=icons[key];return <button key={key} onClick={()=>open(key)}><Icon size={18}/><strong>{labels[key]}</strong><ChevronRight size={16}/></button>})}
          {pilot&&<><button onClick={()=>openRole('Field crew','field')}><Truck size={18}/><strong>Field assignment</strong><ChevronRight size={16}/></button>
          <button onClick={()=>openRole('Customer approver','portal')}><Globe2 size={18}/><strong>Customer portal</strong><ChevronRight size={16}/></button></>}
        </div>
        {pilot&&<button className="text-link" onClick={()=>selectPhase('system')}>Explore the full system <ArrowUpRight size={16}/></button>}
      </Card>
      <Card title="Recent activity" intro="Updates from this walkthrough">
        {data.events.length? <ul className="activity-list">{data.events.slice(0,4).map((event,index)=><li key={index}><span className="activity-point"/><div><strong>{event.message}</strong><small>{event.role} · {event.time}</small></div></li>)}</ul>:<div className="empty"><Activity size={21}/>Run a workflow to see its activity here.</div>}
      </Card>
    </div>
  </>;
}

export function FeatureWorkspace({view, data, role, site, biz, phase, set, updateJob, children}) {
  const [active,setActive]=useState(0);
  const available=tabs[view];
  if(!available) return children;
  return <>
    <nav className="feature-tabs" aria-label={labels[view]+' sections'}>
      {available.map((label,i)=><button key={label} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}>{label}</button>)}
    </nav>
    {active===0?children:<Detail key={active} view={view} index={active} data={data} role={role} site={site} biz={biz} phase={phase} set={set} updateJob={updateJob}/>}
  </>;
}

function Detail({view,index,data,role,site,biz,phase,set,updateJob}) {
  const [selected,select]=useState(0);
  const [filter,setFilter]=useState('All');
  const [quantity,setQuantity]=useState(6);
  const [name,setName]=useState('');
  const job=data.jobs[site];
  const current=sites[site];
  const published=['Published','Approved','Issue reported'].includes(job.status);
  const canApprove=role==='Customer approver';
  const annotations=data.details||{};
  const get=(key)=>annotations[key];
  const change=(key,value,message)=>set('details',message,{...annotations,[key]:value});
  const siteKey=(suffix)=>site+'-'+suffix;

  if(view==='dispatch'&&index===1) {
    const slots=['Mon 7','Tue 8','Wed 9','Thu 10','Fri 11'];
    const crew=get(siteKey('crew'))||'Crew Verde';
    return <div className="detail-split"><Card title="December route planner" intro="Choose a day to inspect the sample route.">
      <div className="calendar-grid">{slots.map((day,i)=><button key={day} aria-pressed={selected===i} onClick={()=>select(i)}><span>{day.split(' ')[0]}</span><strong>{day.split(' ')[1]}</strong><i className={[0,3].includes(i)?'has-visit':''}/></button>)}</div>
      <div className="route-list">
        <span><MapPin size={18}/></span><div><strong>{[0,3].includes(selected)?(selected===0?'Coral Bay Resort':'Mangrove Court Villas'):'Workshop & equipment check'}</strong><p>{[0,3].includes(selected)?'08:00 · Scheduled service route':'No customer stop assigned'}</p></div>
      </div>
      <div className="route-list"><span><Truck size={18}/></span><div><strong>{crew}</strong><p>Mobile field assignment</p></div></div>
    </Card><Card title="Crew assignment" intro="The selected site’s work order uses the assigned crew.">
      <label className="field-label">Assigned team<select value={crew} onChange={e=>change(siteKey('crew'),e.target.value,e.target.value+' assigned to '+current.name)}><option>Crew Verde</option><option>Crew Bay</option></select></label>
      <p className="inline-fact"><MapPin size={17}/>{current.name} · {current.area}</p>
      <p className="inline-fact"><CalendarDays size={17}/>{job.day} · {job.status}</p>
    </Card></div>;
  }
  if(view==='dispatch') return <Card title="Recurring service contracts" intro="Set a cadence and preview the recurring service order.">
    <Grid columns={['Site','Contract','Cadence','Target response']} rows={Object.entries(sites).map(([id,s])=>[s.name,s.service,get(id+'-frequency')||(id==='coral'?'Weekly':'Fortnightly'),'One business day'])}/>
    <label className="field-label">Cadence for {current.name}<select value={get(siteKey('frequency'))||(site==='coral'?'Weekly':'Fortnightly')} onChange={e=>change(siteKey('frequency'),e.target.value,'Maintenance cadence updated for '+current.name)}><option>Weekly</option><option>Fortnightly</option><option>Monthly</option></select></label>
    <div className="actions"><Action onClick={()=>{const day=new Date(job.day+'T12:00:00Z');day.setUTCDate(day.getUTCDate()+({Weekly:7,Fortnightly:14,Monthly:30}[get(siteKey('frequency'))||(site==='coral'?'Weekly':'Fortnightly')]));change(siteKey('next'),day.toISOString().slice(0,10),'Next recurring work order preview created')}}>Preview next work order</Action></div>
    {get(siteKey('next'))&&<p className="inline-fact"><CalendarDays size={17}/>Next recurring visit · {get(siteKey('next'))}</p>}
  </Card>;
  if(view==='field') {
    const checks=['Confirm geofence','Inspect irrigation','Record materials used','Complete service checklist'];
    const completed=get(siteKey('checklist'))||[];
    return index===1?<Card title="On-site checklist" intro={current.name+' · '+(get(siteKey('crew'))||'Crew Verde')}>
      <div className="checklist">{checks.map((check,i)=><label key={check}><input type="checkbox" checked={completed.includes(check)} onChange={e=>change(siteKey('checklist'),e.target.checked?[...completed,check]:completed.filter(item=>item!==check),check+(e.target.checked?' recorded':' cleared'))}/><div><strong>{check}</strong><p>{['Sample site location and timestamp','Valve pressure and timer verification','Filters, edging and nursery materials','Supervisor can review the recorded steps'][i]}</p></div></label>)}</div>
      <Badge tone={completed.length===checks.length?'green':'amber'}>{completed.length} of {checks.length} recorded</Badge>
    </Card>:<Card title="Field sync activity" intro={phase==='pilot'?'Pilot assignments use online submission.':'Offline evidence is held until the crew reconnects.'}>
      <Grid columns={['Item','Visit','State']} rows={[[ 'Before and after evidence',site==='coral'?'GS-104':'GS-209',job.status==='Evidence queued'?'Waiting for connection':visitSteps.indexOf(job.status)>2?'Synced':'Awaiting capture'],['Location and checklist',current.area,(get(siteKey('checklist'))||[]).length+' checks saved']]}/>
    </Card>;
  }
  if(view==='portal') return index===1?<div className="detail-split"><Card title="Published documents" intro={current.name+' · Customer-facing records'}>
    <Grid columns={['Document','Availability']} rows={[[ 'Service scope','Published'],['Latest visit summary',published?'Published':'Awaiting release'],['Site evidence',published?'Published':'Awaiting release']]}/>
    <div className="actions"><Export name="sample-service-scope.txt" value={[current.name,current.service,current.next].join('\n')}>Download service scope</Export>
    {published&&<Export name="sample-visit-report.txt" value={[current.name,job.day,job.status,job.notes].join('\n')}>Download visit report</Export>}</div>
  </Card><Card title="Service performance" intro="Illustrative contract targets and published progress">
    <div className="metric-display"><strong>{current.visits}</strong><span>Visits this reporting period</span></div><meter min="0" max="100" value={current.progress}>{current.progress}%</meter>
    <p className="inline-fact"><ShieldCheck size={17}/>Service target · one business day</p><p className="inline-fact"><CalendarDays size={17}/>{current.next}</p>
  </Card></div>:<Card title="Issue and approval record" intro={current.name+' · Published responses and service sign-off'}>
    <Grid columns={['Record','Status','Customer note']} rows={[[ 'Latest visit',published?job.status:'Awaiting release',job.issue||'No active issue'],['Signature',job.signature?'Recorded':'Pending',job.signature||'Approver can sign after release'],...(job.history||[]).map(record=>['Visit update',record.status,record.note])]}/>
    {published&&canApprove&&job.status==='Published'&&<><label className="field-label">Sign-off name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Type the sample approver name"/></label><div className="actions"><Action disabled={!name.trim()} onClick={()=>updateJob('Approved','Customer signature recorded',{signature:name.trim(),issue:''})}>Sign service report</Action></div></>}
    {published&&canApprove&&job.status==='Issue reported'&&<p className="inline-fact">Greenscape staff will review the issue and share an updated report.</p>}
  </Card>;
  if(view==='people'){
    const roster=users.filter(person=>biz==='All business units'||person.unit===biz);
    const person=roster[Math.min(selected,roster.length-1)];
    if(index===1) return <div className="detail-split"><Card title="Employee 201 profiles" intro="Browse staff records in the selected business unit."><div className="select-list">{roster.map((p,i)=><button key={p.name} aria-pressed={p===person} onClick={()=>select(i)}><Users size={17}/>{p.name}<small>{p.unit}</small></button>)}{!roster.length&&<p>No sample profiles in this business unit.</p>}</div></Card><Card title={person?.name||'No employee selected'} intro={person?.role}>
    {person&&<><Grid columns={['Assignment','Shift','Verification']} rows={[[person.site,person.shift,'Site geofence']]}/><label className="field-label">Shift template<select value={get(person.name+'-shift')||'Assigned shift'} onChange={e=>change(person.name+'-shift',e.target.value,'Shift template updated for '+person.name)}><option>Assigned shift</option><option>Early coverage</option><option>Weekend coverage</option></select></label></>}
    </Card></div>;
    if(index===2) return <Card title="Time records and approvals" intro="Review attendance, location validation, leave and overtime.">
      <Grid columns={['Employee','Attendance','Leave','Overtime']} rows={roster.map(p=>[p.name,data.attendance&&p.name==='Avery Santos'?'07:02 · Geofence verified':'Assigned shift',p.name==='Robin Luna'?(data.leave?'Approved':'Pending'):'—',p.name==='Kris Reyes'?(data.overtime?'Approved':'Pending'):'—'])}/>
      <div className="actions">
        {roster.some(p=>p.name==='Avery Santos')&&<Action onClick={()=>set('attendance','Sample DTR geofence and sync confirmed')}>Sync attendance</Action>}
        {roster.some(p=>p.name==='Robin Luna')&&<Action secondary onClick={()=>set('leave','Leave request approved')}>Approve leave request</Action>}
        {roster.some(p=>p.name==='Kris Reyes')&&<Action secondary onClick={()=>set('overtime','Overtime request approved')}>Approve overtime request</Action>}
      </div>
    </Card>;
    return <Card title="Payroll cycle ledger" intro="Illustrative deterministic totals for a 15-day pay period.">
      <Grid columns={['Scope','Gross','Deductions','Net','Release']} rows={biz==='All business units'||biz==='Maintenance'?[['Maintenance','₱38,500','₱2,400','₱36,100',data.payroll?'Reviewed':'Draft']]:[]}/>
      {(biz==='All business units'||biz==='Maintenance')&&<div className="actions"><Action onClick={()=>set('payroll','Illustrative payroll register reviewed')}>Review pay cycle</Action>{data.payroll&&<Export name="sample-payroll-export.csv" value={'Business,Gross,Deductions,Net\nMaintenance,38500,2400,36100'}>Export payroll ledger</Export>}</div>}
    </Card>;
  }
  if(view==='inbox') {
    const channels=['All','Web form','Messenger','WhatsApp','Instagram','Email','SMS'];
    const visible=leads.filter(lead=>filter==='All'||lead.channel===filter);
    const item=visible[Math.min(selected,visible.length-1)];
    if(index===1) return <div className="detail-split">
      <Card title="Sales conversations" intro="Select a channel and open an inquiry.">
       <label className="field-label">Channel<select value={filter} onChange={e=>{setFilter(e.target.value);select(0)}}>{channels.map(channel=><option key={channel}>{channel}</option>)}</select></label>
       <div className="select-list">{visible.map((lead,i)=><button key={lead.id} aria-pressed={lead===item} onClick={()=>select(i)}><Globe2 size={17}/>{lead.name}<small>{lead.channel}</small></button>)}</div>
      </Card><Card title={item.subject} intro={item.name+' · '+item.channel}>
       <div className="message-bubble">{item.message}</div>
       {get(item.id+'-draft')&&<div className="message-bubble draft"><strong>Sample AI draft</strong><p>{item.reply}</p></div>}
       <div className="actions"><Action onClick={()=>change(item.id+'-draft',true,'An AI reply draft was prepared for '+item.name)}><Sparkles size={16}/>Draft a response</Action><Action secondary onClick={()=>change(item.id+'-owner',item.unit,'Inquiry assigned to '+item.unit)}>Assign to {item.unit}</Action></div>
       {get(item.id+'-owner')&&<p className="inline-fact"><Users size={16}/>Assigned to {get(item.id+'-owner')}</p>}
      </Card></div>;
    return <div className="detail-split"><Card title="Lead prioritization" intro="Sample qualification, dormant leads and human handoff">
      <Grid columns={['Lead','Score','Next action']} rows={leads.map(lead=>[lead.name,lead.score,get(lead.id+'-follow')?'Follow-up queued':lead.score<60?'Dormant nurture':'Human review'])}/>
      <label className="field-label">Lead for follow-up<select value={selected} onChange={e=>select(Number(e.target.value))}>{leads.map((lead,i)=><option value={i} key={lead.id}>{lead.name}</option>)}</select></label>
      <div className="actions"><Action onClick={()=>change(leads[selected].id+'-follow',true,'Follow-up queued for '+leads[selected].name)}>Queue follow-up</Action></div>
    </Card><Card title="Sales knowledge base" intro="Sample approved answers and safe handoff rules">
      <details open><summary>Property viewings</summary><p>Offer a viewing window and route availability confirmation to the real estate team.</p></details>
      <details><summary>Maintenance proposals</summary><p>Ask for site size, service frequency and preferred inspection date.</p></details>
      <details><summary>Honey distribution</summary><p>Refer reseller terms and case availability to the distributor team.</p></details>
    </Card></div>;
  }
  if(view==='property'){
    if(index===1) {
      const [id,area,base]=blocks[selected];
      const selectedStatus=(lot,fallback)=>lot!=='A-12'?fallback:data.buyerStep===3?'Sold':data.buyerStep===2?'Reserved':data.reserve?'On hold':fallback;
      const state=selectedStatus(id,base);
      return <div className="detail-split map-layout"><Card title="Cove Heights lot map" intro="Subdivision · Phase A · Block 2">
        <div className="lot-plan"><div className="lot-grid">{blocks.map(([lot,size,defaultState],i)=>{const status=selectedStatus(lot,defaultState);return <button key={lot} data-state={status} aria-pressed={i===selected} onClick={()=>select(i)}><strong>{lot}</strong><span>{size} m²</span><small>{status}</small></button>})}</div><div className="lot-road">COVE HEIGHTS DRIVE</div></div>
      </Card><Card title={'Lot '+id} intro={area+' m² · Residential'}>
        <Badge tone={state==='Available'?'green':'amber'}>{state}</Badge>
        <p className="inline-fact"><MapPin size={17}/>Block 2 · Phase A</p>
        {id==='A-12'&&data.buyerStep<2&&<div className="actions">{data.reserve?<Action secondary onClick={()=>set('reserve','Lot A-12 reservation hold released',false)}>Release lot hold</Action>:<Action onClick={()=>set('reserve','Lot A-12 placed on hold for the sample buyer')}>Hold lot A-12</Action>}</div>}
        {state==='On hold'&&<p className="inline-fact">An active hold prevents another reservation.</p>}
      </Card></div>;
    }
    return <Card title="Commission and tranche ledger" intro="Sample rule-based split on ₱36,000 at confirmed buyer milestones.">
      <Grid columns={['Payee','Rule','Amount','Status']} rows={[[ 'Broker','50%','₱18,000',data.commission?'Posted':'Preview'],['Agent','One third','₱12,000',data.commission?'Posted':'Preview'],['Team','Balance','₱6,000',data.commission?'Posted':'Preview']]}/>
      <div className="actions"><Action onClick={()=>set('commission','Sample commission tranches posted at configured splits')}>Post sample tranches</Action></div>
    </Card>;
  }

  if(view==='projects'){
    if(index===1) return <Card title="Bill of quantities & material requisitions" intro="Coral Bay Resort · planned, requested and issued items">
      <Grid columns={['Material','Planned','Issued','Requisition']} rows={[[ 'Irrigation valves','24','12',data.requisition?'Submitted':'Draft'],['Stone edging','46 m','24 m','Scheduled'],['Tropical border plants','48','30',get('nurseryTransfer')?'Transferred':'Pending nursery issue']]}/>
      <div className="actions"><Action onClick={()=>set('requisition','Material requisition submitted for 24 irrigation valves')}>Submit valve requisition</Action></div>
    </Card>;
    if(index===2) return <Card title="Nursery transfers and plant survival" intro="Track stock, issued plants and survival checks by site.">
      <Grid columns={['Plant type','Available','Transferred','Survival']} rows={[[ 'Tropical border plants',38-(get('nurseryTransfer')||0),get('nurseryTransfer')||0,'95% sample survival'],['Native groundcover','60','18','100% sample survival'],['Ornamental palms','10','4','4 of 4 inspected']]}/>
      <label className="field-label">Transfer quantity<input type="number" min="1" max="38" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label>
      <div className="actions"><Action disabled={!Number.isInteger(Number(quantity))||Number(quantity)<1||Number(quantity)>38} onClick={()=>change('nurseryTransfer',Number(quantity),'Nursery transfer recorded for '+quantity+' plants')}>Record nursery transfer</Action></div>
    </Card>;
    return <Card title="Project milestones and approvals" intro="Coral Bay Resort · internal readiness and client publication">
      <Grid columns={['Milestone','Delivery','Customer visibility']} rows={[[ 'Site inspection','Completed','Published'],['Irrigation installation',data.milestone?'Completed':'In progress',get('milestonePublished')?'Published':'Supervisor review'],['Planting and handover','Upcoming','Pending']]}/>
      <div className="actions"><Action onClick={()=>set('milestone','Irrigation milestone marked complete')}>Complete irrigation milestone</Action><Action secondary disabled={!data.milestone} onClick={()=>change('milestonePublished',true,'Irrigation milestone published to the customer portal')}>Publish milestone</Action></div>
    </Card>;
  }
  if(view==='stock'){
    if(index===1) return <Card title="Batch traceability and quarantine" intro="Inspect raw material inputs, pack runs and quality release.">
      <Grid columns={['Production lot','Raw input','QC state','Best before']} rows={[[ 'AH-026','RH-09 · PK-18','Released','2027-01-18'],['AH-031','RH-11 · PK-19','Quarantined','2027-02-20'],['AH-047','RH-12 · PK-21',get('qcRelease')?'Released':data.batch?'Awaiting QC':'Planned','2027-04-30']]}/>
      <div className="actions"><Action disabled={!data.batch} onClick={()=>change('qcRelease',true,'Quality released batch AH-047')}>Release AH-047 from QC</Action></div>
    </Card>;
    if(index===2) return <Card title="FEFO allocation and distributor orders" intro="Release the oldest eligible lot for the order.">
      <Grid columns={['Lot','Eligibility','Reason']} rows={[[ 'AH-019','Excluded','Expired'],['AH-026','Eligible',data.allocate?'24 cases assigned to CR-112':'Earliest eligible expiry'],['AH-031','Excluded','Quarantined']]}/>
      <div className="actions"><Action onClick={()=>set('allocate','FEFO allocated eligible lot AH-026 and skipped quarantined inventory')}>Allocate eligible lot</Action><Action secondary disabled={!data.allocate} onClick={()=>set('order','Distributor order released for fulfilment')}>Release distributor order</Action></div>
    </Card>;
    return <Card title="Consignment and receivables" intro="Sample distributor ageing with expiry and reorder advisories">
      <Grid columns={['Account','Consignment','Balance','Age','Action']} rows={[[ 'Coastal Retail','24 cases','₱18,600','31–60 days',get('reorder')?'Review queued':'Review sell-through'],['Bay Pantry','12 cases','₱7,400','Current','Monitor stock']]}/>
      <div className="actions"><Action onClick={()=>change('reorder',true,'Reorder review added for Coastal Retail')}>Queue reorder review</Action></div>
    </Card>;
  }
  if(view==='intelligence') {
    const rows=[['Service visits',55],['Sales readiness',data.lead?76:47],['Project progress',data.milestone?86:72],['Inventory QC',get('qcRelease')?94:67]];
    const entries=filter==='All'?rows:rows.filter(([label])=>label===filter);
    return <Card title="Business performance" intro="Switch indicators to inspect the sample operating signals.">
      <label className="field-label">Indicator<select value={filter} onChange={e=>setFilter(e.target.value)}>{['All',...rows.map(([label])=>label)].map(label=><option key={label}>{label}</option>)}</select></label>
      <div className="metric-bars">{entries.map(([label,value])=><div key={label}><strong>{label}</strong><div><span style={{width:value+'%'}}/></div><span>{value}%</span></div>)}</div>
    </Card>;
  }
  if(view==='buyer') return <Card title="Published buyer documents" intro="Cove Heights · A-12">
    <Grid columns={['Document','Availability']} rows={[[ 'Site viewing guide',data.trip?'Published':'Pending appointment'],['Reservation summary',data.buyerStep>=2?'Published':'Pending reservation'],['Turnover checklist',data.buyerStep>=3?'Published':'Pending turnover']]}/>
    {data.buyerStep>=2&&<div className="actions"><Export name="sample-reservation-summary.txt" value="Cove Heights A-12 · Illustrative buyer reservation">Download reservation summary</Export></div>}
  </Card>;
  if(view==='distributor') return <Card title="Delivery and account statements" intro="Coastal Retail · Assigned account">
    <Grid columns={['Order','Fulfilment','Statement']} rows={[[ 'CR-112',data.order?'Released · batch AH-026':'Pending release','₱18,600 sample balance']]}/>
    {data.order&&<div className="actions"><Export name="sample-distributor-packing-list.txt" value="CR-112 · AH-026 · 24 cases · Coastal Retail">Download packing list</Export></div>}
  </Card>;
  if(view==='audit') return <Card title="Role access matrix" intro="Illustrative access by role. The preview picker switches between sample accounts.">
    <Grid columns={['Role','Scope','May do']} rows={role==='HR / Payroll'?[[ 'HR / Payroll','Assigned workforce entities','Process staff approvals and reviewed payroll']]:[[ 'Executive','Authorized business units','Review operations and use executive reporting'],['Supervisor','Assigned projects and contracts','Release evidence and service reports'],['Field crew','Assigned work orders','Capture site evidence and queue sync'],['Customer viewer','Own published project records','Read released reports'],['Customer approver','Own published project records','Approve service and raise issues'],['Buyer / Distributor','Assigned account','View released reservation or order records']]}/>
  </Card>;
  return null;
}
