
const years = [2026, 2027];
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const visibleMonths = [2,3,4,5,6,7,8,9,10];
const today = new Date();
let selectedYear = today.getFullYear() < 2026 ? 2026 : today.getFullYear();
if(!years.includes(selectedYear)) selectedYear = 2026;
let selectedMonth = visibleMonths.includes(today.getMonth()) ? today.getMonth() : 5;
let selectedPlant = "tomatoes";
let calendarFilter = "all";
let selectedCategory = "all";
let plantSearch = "";

const byId = Object.fromEntries(GARDEN_DATABASE.map(c => [c.id, c]));
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
const dateKey = (y,m,d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const escapeHtml = s => String(s ?? "").replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function getMyGarden(){
  try{ const saved = JSON.parse(localStorage.getItem("kwenMyGarden") || "null"); if(Array.isArray(saved)) return saved.filter(id => byId[id]); }catch(e){}
  return MY_GARDEN_DEFAULT.filter(id => byId[id]);
}
function setMyGarden(ids){ localStorage.setItem("kwenMyGarden", JSON.stringify([...new Set(ids)].filter(id => byId[id]))); }
function isInMyGarden(id){ return getMyGarden().includes(id); }
function addPlant(id){ const ids=getMyGarden(); if(!ids.includes(id)) ids.push(id); setMyGarden(ids); selectedPlant=id; calendarFilter=id; renderAll(); }
function removePlant(id){ const ids=getMyGarden().filter(x=>x!==id); setMyGarden(ids); if(selectedPlant===id) selectedPlant=ids[0]||GARDEN_DATABASE[0].id; if(calendarFilter===id) calendarFilter="all"; renderAll(); }

function getFruitingState(){ try{return JSON.parse(localStorage.getItem("kwenGardenFruitingState")||"{}")}catch(e){return {}} }
function setFruitingState(id,val){ const s=getFruitingState(); s[id]=!!val; localStorage.setItem("kwenGardenFruitingState",JSON.stringify(s)); }
function getHarvestState(){ try{return JSON.parse(localStorage.getItem("kwenHarvestLog")||"{}")}catch(e){return {}} }
function setHarvestDone(id,val){ const s=getHarvestState(); s[id]=!!val; localStorage.setItem("kwenHarvestLog",JSON.stringify(s)); }
function getOrderState(){ try{return JSON.parse(localStorage.getItem("kwenOrderLog")||"{}")}catch(e){return {}} }
function setOrderDone(id,val){ const s=getOrderState(); s[id]=!!val; localStorage.setItem("kwenOrderLog",JSON.stringify(s)); }

function monthFromText(txt){
  const t=String(txt||"").toLowerCase();
  const map={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
  const found=[]; Object.keys(map).forEach(k=>{ if(t.includes(k)) found.push(map[k]); });
  return found;
}
function expandWindowMonths(label, fallback=[]){
  const found=monthFromText(label); if(found.length) {
    const min=Math.min(...found), max=Math.max(...found); const arr=[]; for(let m=min;m<=max;m++) arr.push(m); return arr;
  }
  return fallback;
}
function eventDayForMonth(type, month){
  if(type==='sow') return month===3?15:8;
  if(type==='move') return month===4?28:5;
  if(type==='feed') return 16;
  if(type==='harvest') return 20;
  return 10;
}
function buildEventsForYear(year){
  const ids=getMyGarden(); const events=[]; const fruit=getFruitingState();
  ids.forEach(id=>{
    const p=byId[id]; if(!p) return;
    const add=(type,action,label,months)=>months.forEach(m=>{ if(m>=0&&m<12) events.push({date:dateKey(year,m,eventDayForMonth(type,m)),action,plant:id,text:`${p.name}: ${label}`}) });
    add('sow','🌱',p.directSowWindow && p.directSowWindow !== 'Not recommended' ? p.directSowWindow : p.sowWindow, expandWindowMonths((p.directSowWindow && p.directSowWindow !== 'Not recommended') ? p.directSowWindow : p.sowWindow, [3,4]));
    if(p.transplantWindow && !/direct sow preferred|no transplanting|not needed/i.test(p.transplantWindow)) add('move','🪴',p.transplantWindow, expandWindowMonths(p.transplantWindow,[4,5]));
    add('harvest','🧺',p.harvestWindow, expandWindowMonths(p.harvestWindow,[6,7,8]));
    const feedMonths = /none|skip|no fertilizer/i.test(p.fertilizerSchedule) ? [] : expandWindowMonths(p.harvestWindow,[5,6,7,8]);
    feedMonths.forEach(m=>{
      const days = fruit[id] && p.supportsFruitingMode ? [7,14,21,28] : [14,28];
      days.forEach(d=>events.push({date:dateKey(year,m,d),action:'💧',plant:id,text:`${p.name}: ${fruit[id]&&p.supportsFruitingMode?'Fruiting mode feed':p.fertilizerSchedule}`}));
    });
  });
  return events.sort((a,b)=>a.date.localeCompare(b.date));
}
function eventsForSelected(){ return buildEventsForYear(selectedYear).filter(e => calendarFilter==='all' || e.plant===calendarFilter); }

function plantLabel(id){ const p=byId[id]; return p ? `${p.icon} ${p.name}` : id; }
function renderControls(){
  qs('#yearRow').innerHTML = years.map(y=>`<button class="year-btn ${y===selectedYear?'active':''}" data-year="${y}">${y}</button>`).join('');
  qs('#monthRow').innerHTML = visibleMonths.map(m=>`<button class="year-btn ${m===selectedMonth?'active':''}" data-month="${m}">${monthNames[m].slice(0,3)}</button>`).join('');
  const ids=getMyGarden();
  qs('#plantFilter').innerHTML = `<option value="all">📡 All Garden Events</option>` + ids.map(id=>`<option value="${id}" ${calendarFilter===id?'selected':''}>${plantLabel(id)}</option>`).join('');
  const cats=[...new Set(GARDEN_DATABASE.map(p=>p.category))].sort();
  qs('#categoryFilter').innerHTML = `<option value="all">All categories</option>` + cats.map(c=>`<option value="${escapeHtml(c)}" ${selectedCategory===c?'selected':''}>${escapeHtml(c)}</option>`).join('');
}
function renderCalendar(){
  qs('#monthTitle').textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
  const cal=qs('#calendar'); const events=eventsForSelected(); const byDate={}; events.forEach(e=>(byDate[e.date] ||= []).push(e));
  const first=new Date(selectedYear,selectedMonth,1); const start=new Date(first); start.setDate(1-first.getDay());
  let html=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="dow">${d}</div>`).join('');
  for(let i=0;i<42;i++){
    const d=new Date(start); d.setDate(start.getDate()+i); const key=dateKey(d.getFullYear(),d.getMonth(),d.getDate()); const dayEvents=byDate[key]||[];
    const cls=[d.getMonth()!==selectedMonth?'muted':'', key===dateKey(today.getFullYear(),today.getMonth(),today.getDate())?'today':''].join(' ');
    html += `<div class="day ${cls}"><div class="day-num">${d.getDate()}</div><div class="icons">${dayEvents.slice(0,4).map(e=>`<span class="event-pill" title="${escapeHtml(e.text)}">${e.action}${byId[e.plant]?.icon||''}</span>`).join('')}</div></div>`;
  }
  cal.innerHTML=html;
  qs('#calendarLegend').innerHTML = getMyGarden().map(id=>`<span>${plantLabel(id)}</span>`).join('');
}
function taskCard(e, done=false){ const id=encodeURIComponent(`${e.date}|${e.plant}|${e.text}`); return `<div class="task"><div class="big">${e.action}</div><div><b>${escapeHtml(e.text)}</b><small>${e.date} • ${plantLabel(e.plant)}</small><button class="mini-btn ${done?'done':''}" data-order-id="${id}">${done?'DONE':'MARK DONE'}</button></div></div>`; }
function renderTasks(){
  const monthPrefix=`${selectedYear}-${String(selectedMonth+1).padStart(2,'0')}`; const events=eventsForSelected().filter(e=>e.date.startsWith(monthPrefix));
  qs('#monthTasks').innerHTML = events.length ? events.map(e=>taskCard(e,getOrderState()[`${e.date}|${e.plant}|${e.text}`])).join('') : '<div class="alert-card safe"><b>No scheduled tasks</b><small>Nothing queued for this month/filter.</small></div>';
}
function renderTodaysOrders(){
  const key=dateKey(today.getFullYear(),today.getMonth(),today.getDate()); let events=buildEventsForYear(today.getFullYear()).filter(e=>e.date===key);
  if(!events.length) events=buildEventsForYear(selectedYear).filter(e=>e.date>=key).slice(0,5);
  qs('#todaysOrders').innerHTML = events.length ? events.map(e=>taskCard(e,getOrderState()[`${e.date}|${e.plant}|${e.text}`])).join('') : '<div class="alert-card safe"><b>No active garden orders</b><small>Vault-Tec says you may drink coffee and admire dirt.</small></div>';
}
function renderAlerts(){
  const ids=getMyGarden(); const fruit=getFruitingState(); const cards=[];
  const fruiting=ids.filter(id=>byId[id]?.supportsFruitingMode && fruit[id]);
  if(fruiting.length) cards.push(`<div class="alert-card warn"><b>Fruiting mode active</b><small>${fruiting.map(plantLabel).join(', ')} now generate weekly fertilizer reminders.</small></div>`);
  if(selectedMonth>=6 && selectedMonth<=7) cards.push(`<div class="alert-card heat"><b>Heat watch</b><small>Grow bags dry faster in July/August. Check moisture before fertilizing.</small></div>`);
  cards.push(`<div class="alert-card safe"><b>${ids.length} plants in My Garden</b><small>Calendar, crop page, fertilizer guide, and logs are all reading from the same database items.</small></div>`);
  qs('#gardenAlerts').innerHTML=cards.join('');
}
function cropLine(label,value,full=false){return `<div class="crop-info-card ${full?'full':''}"><small>${escapeHtml(label)}</small><b>${escapeHtml(value||'—')}</b></div>`}
function filteredCrops(){ const q=plantSearch.toLowerCase().trim(); return GARDEN_DATABASE.filter(p => (selectedCategory==='all'||p.category===selectedCategory) && (!q || [p.name,p.category,p.type,p.notes].join(' ').toLowerCase().includes(q))); }
function renderCropDatabase(){
  if(!byId[selectedPlant]) selectedPlant=getMyGarden()[0]||GARDEN_DATABASE[0].id; const list=qs('#cropDbList'); const detail=qs('#cropDbDetail'); const mine=getMyGarden();
  list.innerHTML = filteredCrops().map(p=>`<button type="button" class="crop-db-item ${p.id===selectedPlant?'active':''}" data-crop-db="${p.id}"><span class="crop-db-icon">${p.icon}</span><span>${escapeHtml(p.name)}</span>${mine.includes(p.id)?'<span class="badge">MINE</span>':''}</button>`).join('') || '<div class="alert-card"><b>No crops found</b><small>Try a different search.</small></div>';
  const p=byId[selectedPlant]; if(!p) return; const inGarden=mine.includes(p.id); const fruit=getFruitingState()[p.id];
  const supplyNames=(p.supplies||[]).map(id=>SUPPLY_DATABASE[id]?.short||id).join(', ') || 'None / compost';
  detail.innerHTML = `<div class="crop-detail-hero"><div class="crop-detail-big-icon">${p.icon}</div><div><h4 class="crop-detail-title">${escapeHtml(p.name)}</h4><div class="crop-detail-sub">${escapeHtml(p.category)} • ${escapeHtml(p.type)} • ${escapeHtml(p.zone)}</div><div class="mini-row"><button class="mini-btn ${inGarden?'done':''}" data-toggle-plant="${p.id}">${inGarden?'REMOVE FROM MY GARDEN':'ADD TO MY GARDEN'}</button>${p.supportsFruitingMode && inGarden ? `<button class="mini-btn ${fruit?'done':''}" data-fruiting="${p.id}">${fruit?'FRUITING ON':'FRUITING OFF'}</button>`:''}</div></div></div><div class="crop-info-grid">${cropLine('Stage',p.stage)}${cropLine('Difficulty',p.difficulty)}${cropLine('Safe temp',p.safeTemp)}${cropLine('Heat care',p.heatCare)}${cropLine('Sow',p.sowWindow)}${cropLine('Direct sow',p.directSowWindow)}${cropLine('Move out',p.transplantWindow)}${cropLine('Harvest',p.harvestWindow)}${cropLine('Days',p.daysToHarvest)}${cropLine('Spacing',p.spacing)}${cropLine('Container',p.containerSize)}${cropLine('Sun',p.sun)}${cropLine('Water',p.water)}${cropLine('Fertilizer',p.fertilizerSchedule)}${cropLine('Supplies',supplyNames)}${cropLine('Notes',p.notes,true)}</div>`;
}
function renderFertilizerGuide(){
  const ids=getMyGarden(); qs('#fertilizerGuide').innerHTML = ids.map(id=>{const p=byId[id]; const supplies=(p.supplies||[]).map(s=>`<span class="supply-pill">${SUPPLY_DATABASE[s]?.short||s}</span>`).join('') || '<span class="supply-pill">No fertilizer</span>'; return `<div class="fertilizer-row"><b>${p.icon} ${p.name}</b><small>${escapeHtml(p.fertilizerSchedule)}</small>${supplies}</div>`}).join('');
}
function renderSupplyCache(){ qs('#supplyCache').innerHTML = Object.values(SUPPLY_DATABASE).map(s=>`<div class="supply-card"><b>${escapeHtml(s.name)}</b><small>${escapeHtml(s.role)}</small></div>`).join(''); }
function renderGardenRules(){ qs('#gardenRules').innerHTML = [
 ['One database rule','Add or edit a crop once and every tab uses that same object.'],
 ['My Garden rule','Calendar and sidebar replacement only show crops saved in My Garden.'],
 ['Fruiting rule','Only crops with supportsFruitingMode:true can create weekly fruiting feed tasks.'],
 ['Container rule','Grow bags dry faster than raised beds; water first, fertilize second.']
].map(r=>`<div class="data-card"><b>${r[0]}</b><small>${r[1]}</small></div>`).join(''); }
function renderFieldNotes(){ qs('#fieldNotes').innerHTML = `<p><strong>Grow bags:</strong> they dry faster than beds, especially during heat. Check daily in July/August and water before fertilizing if soil is dry.</p><p><strong>Fruit set:</strong> this means the flower has dropped and a tiny tomato/pepper/cucumber/etc. is visibly forming. Crops with fruiting mode enabled generate weekly feeding reminders.</p><p><strong>Spinach rule:</strong> your 4 inch x 10 inch planters are good for baby spinach. Sow April-June and again mid-August-September.</p>`; }
function renderHarvestLog(){
  const state=getHarvestState(); const harvestEvents=buildEventsForYear(selectedYear).filter(e=>e.action==='🧺' && (calendarFilter==='all'||e.plant===calendarFilter));
  qs('#harvestLog').innerHTML = harvestEvents.length ? harvestEvents.map(e=>{const id=`${e.date}|${e.plant}|harvest`; const done=!!state[id]; return `<div class="harvest-row"><div><b>${e.action} ${escapeHtml(e.text)}</b><small>${e.date}</small></div><button class="mini-btn ${done?'done':''}" data-harvest-id="${encodeURIComponent(id)}">${done?'LOGGED':'LOG'}</button></div>`}).join('') : '<div class="alert-card"><b>No harvest windows</b><small>Add plants to My Garden to generate harvest logs.</small></div>';
}
function renderWeatherFallback(){ qs('#weatherNow').textContent='—'; qs('#weatherLow').textContent='—'; qs('#weatherHigh').textContent='—'; qs('#weatherRisk').textContent='Forecast unavailable'; qs('#riskMeterLabel').textContent='STANDBY'; qs('#forecastList').innerHTML='<div class="forecast-day"><span>Weather fetch failed</span><span>Use local forecast</span></div>'; }
async function loadWeather(){
  try{ const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=46.06&longitude=-64.81&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FMoncton&forecast_days=3'); const data=await r.json(); const now=data.current?.temperature_2m; const lows=data.daily?.temperature_2m_min||[]; const highs=data.daily?.temperature_2m_max||[]; qs('#weatherNow').textContent = now!=null ? `${Math.round(now)}°C` : '—'; qs('#weatherLow').textContent = lows[0]!=null ? `${Math.round(lows[0])}°C` : '—'; qs('#weatherHigh').textContent = highs[1]!=null ? `${Math.round(highs[1])}°C` : '—'; const low=Math.min(...lows.filter(x=>x!=null)); const high=Math.max(...highs.filter(x=>x!=null)); let risk='ideal', label='IDEAL'; if(low<=0){risk='freeze';label='FROST'} else if(low<8){risk='cold';label='COLD'} else if(high>=32){risk='danger';label='DANGER'} else if(high>=28){risk='hot';label='HOT'} qs('#weatherRisk').textContent=label; qs('#riskMeterLabel').textContent=label; qs('#riskMeter').className=`risk-meter ${risk}`; qs('#forecastList').innerHTML=(data.daily?.time||[]).map((d,i)=>`<div class="forecast-day"><span>${d}</span><span>${Math.round(lows[i])}°C / ${Math.round(highs[i])}°C</span></div>`).join(''); }catch(e){renderWeatherFallback()}
}
function renderAll(){ renderControls(); renderCalendar(); renderTasks(); renderTodaysOrders(); renderAlerts(); renderCropDatabase(); renderFertilizerGuide(); renderSupplyCache(); renderGardenRules(); renderFieldNotes(); renderHarvestLog(); }

document.addEventListener('click', e=>{
  const tab=e.target.closest('[data-tab-btn]'); if(tab){ qs('.pip-content').dataset.activeTab=tab.dataset.tabBtn; qsa('.pip-tab').forEach(b=>b.classList.toggle('active',b===tab)); return; }
  const y=e.target.closest('[data-year]'); if(y){ selectedYear=Number(y.dataset.year); renderAll(); return; }
  const m=e.target.closest('[data-month]'); if(m){ selectedMonth=Number(m.dataset.month); renderAll(); return; }
  const prev=e.target.closest('#prevMonth'); if(prev){ const idx=visibleMonths.indexOf(selectedMonth); selectedMonth=visibleMonths[(idx-1+visibleMonths.length)%visibleMonths.length]; renderAll(); return; }
  const next=e.target.closest('#nextMonth'); if(next){ const idx=visibleMonths.indexOf(selectedMonth); selectedMonth=visibleMonths[(idx+1)%visibleMonths.length]; renderAll(); return; }
  const crop=e.target.closest('[data-crop-db]'); if(crop){ selectedPlant=crop.dataset.cropDb; renderCropDatabase(); return; }
  const toggle=e.target.closest('[data-toggle-plant]'); if(toggle){ isInMyGarden(toggle.dataset.togglePlant) ? removePlant(toggle.dataset.togglePlant) : addPlant(toggle.dataset.togglePlant); return; }
  const fruit=e.target.closest('[data-fruiting]'); if(fruit){ setFruitingState(fruit.dataset.fruiting,!getFruitingState()[fruit.dataset.fruiting]); renderAll(); return; }
  const harvest=e.target.closest('[data-harvest-id]'); if(harvest){ const id=decodeURIComponent(harvest.dataset.harvestId); setHarvestDone(id,!getHarvestState()[id]); renderHarvestLog(); return; }
  const order=e.target.closest('[data-order-id]'); if(order){ const id=decodeURIComponent(order.dataset.orderId); setOrderDone(id,!getOrderState()[id]); renderAll(); return; }
  if(e.target.closest('#resetGardenBtn')){ localStorage.removeItem('kwenMyGarden'); localStorage.removeItem('kwenGardenFruitingState'); calendarFilter='all'; selectedPlant='tomatoes'; renderAll(); return; }
});
document.addEventListener('input', e=>{ if(e.target.id==='plantSearch'){ plantSearch=e.target.value; renderCropDatabase(); }});
document.addEventListener('change', e=>{ if(e.target.id==='plantFilter'){ calendarFilter=e.target.value; renderAll(); } if(e.target.id==='categoryFilter'){ selectedCategory=e.target.value; renderCropDatabase(); }});
document.addEventListener('DOMContentLoaded', ()=>{ renderAll(); loadWeather(); });
