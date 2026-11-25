export const roles = {
  Executive: ['overview','people','inbox','property','projects','dispatch','stock','intelligence','audit'],
  Administrator: ['overview','people','inbox','property','projects','dispatch','stock','intelligence','audit'],
  'HR / Payroll': ['people','audit'],
  'Sales agent': ['inbox','property'],
  'Dispatcher / Supervisor': ['projects','dispatch'],
  'Field crew': ['field'],
  'Customer approver': ['portal'],
  'Customer viewer': ['portal'],
  'Real estate buyer': ['buyer'],
  Distributor: ['distributor'],
};
export const phases = {
  pilot: {name:'Pilot', detail:'Customer visibility pilot', modules:['dispatch','field','portal','audit']},
  'phase/1': {name:'Phase 1', detail:'Foundation, HRIS & AI Sales', modules:['overview','people','inbox','audit']},
  'phase/2': {name:'Phase 2', detail:'Real Estate', modules:['overview','property','inbox','buyer','audit']},
  'phase/3': {name:'Phase 3', detail:'Landscaping & Maintenance', modules:['overview','projects','dispatch','field','portal','audit']},
  'phase/4': {name:'Phase 4', detail:'Andi Honey & Executive AI', modules:['overview','stock','intelligence','distributor','audit']},
  system: {name:'Full system', detail:'All business units', modules:['overview','people','inbox','property','projects','dispatch','field','portal','stock','intelligence','buyer','distributor','audit']},
};
export const labels = {overview:'Overview', people:'People & payroll', inbox:'Sales inbox', property:'Real estate', projects:'Projects & materials', dispatch:'Service dispatch', field:'My field work', portal:'Customer portal', stock:'Andi Honey', intelligence:'Executive intelligence', buyer:'Buyer portal', distributor:'Distributor portal', audit:'Activity log'};
export const sites = {
  coral:{name:'Coral Bay Resort', area:'East courtyard', service:'Courtyard garden maintenance', progress:72, visits:'3 of 4', next:'Weekly service · Monday', owner:'Coral Bay Facilities'},
  mangrove:{name:'Mangrove Court Villas', area:'North entrance', service:'Entrance planting care', progress:54, visits:'1 of 2', next:'Fortnightly service · Thursday', owner:'Mangrove Property Team'},
};
export const initial = {
  jobs:{coral:{status:'To schedule', day:'2026-12-07', notes:'Trim tropical borders, clear the stone walkway, and inspect irrigation.'},mangrove:{status:'Published',day:'2026-12-10',notes:'Inspect newly planted hedges and clear the entrance beds.'}},
  events:[], leave:false, overtime:false, payroll:false, attendance:false, lead:false, handoff:false, trip:false, reserve:false, buyerStep:0, commission:false, crossSell:false, requisition:false, milestone:false, batch:false, allocate:false, order:false
};
export const departments = ['All business units','Real Estate','Landscaping','Maintenance','Andi Honey'];
export const scopeRole = (role) => ['Customer approver','Customer viewer'].includes(role);
export function route() {
  const [phase, query=''] = location.hash.replace(/^#\/?/, '').split('?');
  const params = new URLSearchParams(query);
  const role = Object.hasOwn(roles, params.get('role')) ? params.get('role') : 'Executive';
  return {phase:Object.hasOwn(phases,phase)?phase:'pilot',role, module: params.get('view'), site: params.get('site')==='mangrove'?'mangrove':'coral'};
}
export function move(phase, role, view, site) {
  const query=new URLSearchParams({role});
  if(view) query.set('view',view);
  if(site==='mangrove') query.set('site',site);
  location.hash=`/${phase}?${query}`;
}
export function load() {
  try {const raw=localStorage.getItem('greenscape-demo-v1'); return raw?JSON.parse(raw):initial;}
  catch {return initial;}
}
