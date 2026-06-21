const VERSION = "3.2.2-hotfix";
const LS_GARDEN = "kwenGardenV32_myCrops";
const LS_STAGES = "kwenGardenV32_stages";
const LS_HARVEST = "kwenGardenV32_harvestLog";
const LS_SUPPLY = "kwenGardenV32_supplyInventory";

let activeTab = "stat";
let selectedYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth();
let selectedCropId = null;
let calendarFilter = "all";
let addOpen = false;

function readJSON(key, fallback){
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch(e){ return fallback; }
}
function writeJSON(key, value){
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){}
}
function getMyGarden(){
  const saved = readJSON(LS_GARDEN, null);
  if(Array.isArray(saved) && saved.length) return saved.filter(id => getCrop(id));
  return DEFAULT_MY_GARDEN.filter(id => getCrop(id));
}
function setMyGarden(ids){ writeJSON(LS_GARDEN, ids.filter(id => getCrop(id))); }
function getStages(){ return readJSON(LS_STAGES, {}); }
function setStages(stages){ writeJSON(LS_STAGES, stages); }
function getCropStage(crop){
  const stages = getStages();
  return stages[crop.id]?.stage || crop.defaultStage || "growing";
}
function setCropStage(id, stage){
  const stages = getStages();
  stages[id] = { stage, changedAt: dateKey(new Date()) };
  setStages(stages);
}
function activeEvents(){
  return buildEventsForYear(selectedYear, getMyGarden(), getStages());
}
function escapeHTML(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function npkLabel(item){
  return item?.npk ? item.npk.join("-") : "—";
}
function productPills(keys){
  if(!keys || !keys.length) return '<span class="pill">No fertilizer</span>';
  return keys.map(k => {
    const item = SUPPLY_DATABASE[k];
    return `<span class="pill">✓ ${escapeHTML(item ? item.short : k)}</span>`;
  }).join(" ");
}
function allSupplyKeys(){ return Object.keys(SUPPLY_DATABASE || {}); }
function defaultOwnedSupply(){
  return allSupplyKeys().filter(k => SUPPLY_DATABASE[k]?.ownedDefault);
}
function getOwnedSupply(){
  const saved = readJSON(LS_SUPPLY, null);
  if(Array.isArray(saved)) return saved.filter(k => SUPPLY_DATABASE[k]);
  return defaultOwnedSupply();
}
function setOwnedSupply(keys){
  writeJSON(LS_SUPPLY, [...new Set(keys)].filter(k => SUPPLY_DATABASE[k]));
}
function tagScore(item, needs){
  if(!item || !needs) return -999;
  const tags = item.tags || [];
  const wanted = needs.preferredTags || [];
  const avoided = needs.avoidTags || [];
  let score = 0;
  wanted.forEach(t => { if(tags.includes(t)) score += 4; });
  avoided.forEach(t => { if(tags.includes(t)) score -= 8; });
  if(item.npk){
    const [n,p,k] = item.npk;
    if(needs.nitrogen === "low" && n <= 6) score += 3;
    if(needs.nitrogen === "low" && n >= 12) score -= 6;
    if(needs.nitrogen === "moderate" && n > 0 && n <= 12) score += 2;
    if(needs.nitrogen === "high" && n >= 5) score += 3;
    if(needs.fruiting && k >= n) score += 2;
    if(needs.root && p >= n) score += 2;
  }
  return score;
}
function fertilizerNeedsForCrop(c, stage){
  const type = String(c.type || "").toLowerCase();
  const id = String(c.id || "").toLowerCase();
  const category = String(c.category || "").toLowerCase();

  if(type.includes("root") || type.includes("tuber") || type.includes("bulb") || type.includes("allium")){
    return {
      title:"Root / bulb feeding",
      nitrogen:"low",
      root:true,
      preferredTags:["root","low-nitrogen","bloom","bulb","tuber","organic"],
      avoidTags:["high-nitrogen"],
      note:"Keep nitrogen lower once roots/bulbs are forming so you do not grow monster tops and sad little roots."
    };
  }
  if(type.includes("legume")){
    return {
      title:"Light legume feeding",
      nitrogen:"low",
      preferredTags:["soil","gentle","organic","legume","compost"],
      avoidTags:["high-nitrogen"],
      note:"Peas and beans usually need compost/soil support more than heavy fertilizer."
    };
  }
  if(type.includes("leafy") || type.includes("green") || type.includes("brassica") || type.includes("herb")){
    return {
      title:"Leafy growth feeding",
      nitrogen:"high",
      preferredTags:["leafy","nitrogen","general","balanced","quick-feed","organic"],
      avoidTags:[],
      note:"Leafy crops and herbs usually appreciate nitrogen, but use lighter doses in containers."
    };
  }
  if(type.includes("berry") || type.includes("fruit") || id.includes("blueberry") || category.includes("berries")){
    return {
      title:id.includes("blueberry") ? "Acid-loving berry feeding" : "Berry feeding",
      nitrogen:"moderate",
      preferredTags:id.includes("blueberry") ? ["acid-loving","berry","slow-release"] : ["berry","balanced","organic","slow-release"],
      avoidTags:["high-nitrogen"],
      note:"Berries prefer steady, moderate feeding rather than big nitrogen blasts."
    };
  }
  if(type.includes("fruiting") || type.includes("melon") || type.includes("large crop")){
    const early = stage === "seedling" || stage === "growing";
    return {
      title:early ? "Early fruiting-crop growth" : "Flowering / fruiting support",
      nitrogen:early ? "moderate" : "low",
      fruiting:true,
      preferredTags:early ? ["balanced","general","container","quick-feed"] : ["fruiting","tomato","bloom","low-nitrogen","container"],
      avoidTags:early ? [] : ["high-nitrogen"],
      note:early ? "Balanced feed is okay before flowering." : "Once flowers/fruit show, lower nitrogen and stronger bloom/potassium support is usually better."
    };
  }
  return {
    title:"General garden feeding",
    nitrogen:"moderate",
    preferredTags:["balanced","general","organic","gentle"],
    avoidTags:[],
    note:"Use a balanced general feed unless the plant shows a more specific need."
  };
}
function bestFertilizerMatch(c, keys, stage){
  const needs = fertilizerNeedsForCrop(c, stage);
  const ranked = keys
    .map(k => ({ key:k, item:SUPPLY_DATABASE[k], score:tagScore(SUPPLY_DATABASE[k], needs) }))
    .filter(x => x.item)
    .sort((a,b) => b.score - a.score);
  const best = ranked[0] || null;
  return { needs, best, ranked };
}
function fertilizerRecommendationHTML(c){
  const stage = getCropStage(c);
  const owned = getOwnedSupply();
  const ownedMatch = bestFertilizerMatch(c, owned, stage);
  const missingKeys = allSupplyKeys().filter(k => !owned.includes(k));
  const missingMatch = bestFertilizerMatch(c, missingKeys, stage);
  const ownedBest = ownedMatch.best;
  const missingBest = missingMatch.best;
  return `
    <div class="fert-rec">
      <b>${escapeHTML(ownedMatch.needs.title)}</b>
      <small>${escapeHTML(ownedMatch.needs.note)}</small>
      <div class="data-grid" style="margin-top:10px">
        <div class="data-card"><b>Best Owned Match</b><small>${ownedBest ? `✓ ${escapeHTML(ownedBest.item.short)} • NPK ${escapeHTML(npkLabel(ownedBest.item))}<br>${escapeHTML(ownedBest.item.role)}` : `No owned fertilizer found. Add one in DATA → Supply Inventory.`}</small></div>
        <div class="data-card"><b>Best Missing Match</b><small>${missingBest ? `${escapeHTML(missingBest.item.short)} • NPK ${escapeHTML(npkLabel(missingBest.item))}<br>${escapeHTML(missingBest.item.role)}` : `You already own the strongest database match for this crop.`}</small></div>
      </div>
    </div>
  `;
}

function setTab(tab){
  activeTab = tab;
  document.querySelectorAll(".pip-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
  addOpen = false;
  render();
}

function render(){
  const garden = getMyGarden();
  if(!selectedCropId || !garden.includes(selectedCropId)) selectedCropId = garden[0] || null;
  renderStatusStrip();
  if(activeTab === "stat") renderStat();
  if(activeTab === "cal") renderCalendarTab();
  if(activeTab === "crops") renderCropsTab();
  if(activeTab === "log") renderLogTab();
  if(activeTab === "data") renderDataTab();
}


function firstFrostDate(year){
  return new Date(year, 9, 1); // Oct 1 for Riverview / Moncton planning
}

function daysUntilFirstFrost(){
  const now = new Date();
  let frost = firstFrostDate(now.getFullYear());
  if(now > frost) frost = firstFrostDate(now.getFullYear() + 1);
  return Math.ceil((frost - now) / 86400000);
}

function getOverseerMessage(){
  const garden = getMyGarden().map(getCrop).filter(Boolean);
  const todays = buildEventsForYear(new Date().getFullYear(), getMyGarden(), getStages()).filter(e => e.date === dateKey(new Date()));
  const feeding = todays.filter(e => e.action === "💧").length;
  const frostDays = daysUntilFirstFrost();

  let headline = "War never changes.";
  let body = "Fertilizer schedules do.";

  if(feeding > 0){
    headline = "Supply cache inspection complete.";
    body = `${feeding} crop${feeding === 1 ? "" : "s"} require feeding today. Water first, fertilize second.`;
  } else if(frostDays <= 14){
    headline = "Frost protocol approaching.";
    body = `${frostDays} day${frostDays === 1 ? "" : "s"} until the planning frost date. Prepare covers and harvest tender crops.`;
  } else if(garden.some(c => getCropStage(c) === "fruiting")){
    headline = "Fruit production detected.";
    body = "Fruiting crops are active. Maintain consistent water and follow the stage-based feeding schedule.";
  }

  return { headline, body, frostDays };
}

function overseerHTML(){
  const msg = getOverseerMessage();
  return `
    <section class="panel overview-panel">
      <h2>Overview</h2>
      <div class="overseer-dynamic">
        <div class="overseer-art">
          <img src="images/vault-overseer.png" alt="Vault Overseer" onerror="this.style.display='none';this.parentElement.classList.add('missing');">
        </div>
        <div class="overseer-message">
          <b>${escapeHTML(msg.headline)}</b>
          <small>${escapeHTML(msg.body)}</small>
          <ul>
            <li>${msg.frostDays} day${msg.frostDays === 1 ? "" : "s"} until first frost planning date</li>
            <li>${getMyGarden().length} active crop${getMyGarden().length === 1 ? "" : "s"} in My Crops</li>
          </ul>
          <em>— Overseer of Vault 73</em>
        </div>
      </div>
    </section>
  `;
}

function riskGaugeHTML(){
  return `
    <div class="risk-meter-wrap">
      <div class="risk-meter-title"><span>Garden Threat Meter</span><span id="riskMeterLabel">STANDBY</span></div>
      <div class="risk-meter ideal" id="riskMeter">
        <div class="risk-arc"></div>
        <div class="risk-needle"></div>
        <div class="risk-center"></div>
      </div>
      <div class="risk-scale"><span>❄️ Frost</span><span>🧊 Cold</span><span>✅ Ideal</span><span>☀️ Hot</span><span>🔥 Danger</span></div>
    </div>
  `;
}

function setRiskGauge(riskClass, label){
  const meter = document.getElementById("riskMeter");
  const riskLabel = document.getElementById("riskMeterLabel");
  if(meter) meter.className = `risk-meter ${riskClass || "ideal"}`;
  if(riskLabel) riskLabel.textContent = label || "IDEAL";
}

function companionAIHTML(c){
  const gardenIds = getMyGarden().filter(id => id !== c.id);
  const good = (c.companionPlants || []).filter(id => gardenIds.includes(id)).map(getCrop).filter(Boolean);
  const bad = (c.avoidPlantingNear || []).filter(id => gardenIds.includes(id)).map(getCrop).filter(Boolean);
  const neutral = gardenIds
    .filter(id => !(c.companionPlants || []).includes(id) && !(c.avoidPlantingNear || []).includes(id))
    .map(getCrop).filter(Boolean)
    .slice(0, 6);

  return `
    <div class="companion-scan">
      <h3>Companion AI Scan</h3>
      <div class="companion-grid">
        <div class="companion-card good"><b>Good Present</b><small>${good.length ? good.map(x => `✅ ${x.icon} ${escapeHTML(x.name)}`).join("<br>") : "No known good companions currently in My Crops."}</small></div>
        <div class="companion-card warn"><b>Conflicts Detected</b><small>${bad.length ? bad.map(x => `❌ ${x.icon} ${escapeHTML(x.name)}`).join("<br>") : "No companion conflicts detected."}</small></div>
        <div class="companion-card neutral"><b>Neutral Nearby</b><small>${neutral.length ? neutral.map(x => `🟡 ${x.icon} ${escapeHTML(x.name)}`).join("<br>") : "No neutral crops to report."}</small></div>
      </div>
    </div>
  `;
}


function renderStatusStrip(){
  const strip = document.getElementById("statusStrip");
  if(!strip) return;
  if(activeTab !== "stat"){ strip.innerHTML = ""; return; }
  strip.innerHTML = `
    ${overseerHTML()}
    <section class="grid-wide">
      <div class="panel">
        <h2>Live Riverview Weather</h2>
        <div class="weather-main">
          <div class="weather-chip"><small>Now</small><b id="weatherNow">Loading…</b></div>
          <div class="weather-chip"><small>Tonight Low</small><b id="weatherLow">—</b></div>
          <div class="weather-chip"><small>Tomorrow High</small><b id="weatherHigh">—</b></div>
          <div class="weather-chip"><small>Threat Level</small><b id="weatherRisk">Checking…</b></div>
        </div>
        ${riskGaugeHTML()}
      </div>
      <div class="panel">
        <h2>Garden Alerts</h2>
        <div id="gardenAlerts" class="task-list">
          <div class="alert-card"><b>Checking Riverview forecast…</b><small>Cold, heat, watering, and shade alerts appear here.</small></div>
        </div>
      </div>
    </section>
  `;
  loadWeather();
}



async function loadWeather(){
  const nowEl = document.getElementById("weatherNow");
  if(!nowEl) return;
  try{
    const url = "https://api.open-meteo.com/v1/forecast?latitude=46.061&longitude=-64.805&current=temperature_2m,wind_speed_10m&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,wind_speed_10m_max&timezone=America%2FMoncton&forecast_days=3";
    const res = await fetch(url);
    const data = await res.json();

    const now = Math.round(data.current.temperature_2m);
    const low = Math.round(data.daily.temperature_2m_min[0]);
    const highTomorrow = Math.round(data.daily.temperature_2m_max[1]);
    const rain = Math.round(data.daily.precipitation_sum?.[1] || 0);
    const wind = Math.round(data.daily.wind_speed_10m_max?.[1] || data.current.wind_speed_10m || 0);

    document.getElementById("weatherNow").textContent = `${now}°C`;
    document.getElementById("weatherLow").textContent = `${low}°C`;
    document.getElementById("weatherHigh").textContent = `${highTomorrow}°C`;

    const alerts = [];
    let risk = "IDEAL";
    let riskClass = "ideal";

    if(low <= 2){
      risk = "FROST";
      riskClass = "danger";
      alerts.push(["danger","Frost risk","Cover tender crops and move pots if possible."]);
    } else if(low <= 7){
      risk = "COLD";
      riskClass = "cold";
      alerts.push(["warn","Cold night","Basil, peppers, tomatoes, and cucumbers may sulk. Avoid heavy watering late in the day."]);
    }

    if(highTomorrow >= 32){
      risk = "DANGER";
      riskClass = "danger";
      alerts.push(["danger","Danger heat","Grow bags can dry fast. Check containers twice and avoid fertilizing dry soil."]);
    } else if(highTomorrow >= 30){
      if(risk !== "DANGER"){ risk = "HEAT"; riskClass = "hot"; }
      alerts.push(["warn","Heat warning","Check grow bags daily. Water before fertilizer."]);
    }

    if(rain >= 15){
      if(risk === "IDEAL"){ risk = "RAIN"; riskClass = "warn"; }
      alerts.push(["warn","Heavy rain expected",`${rain} mm possible. Skip watering until soil is checked.`]);
    }

    if(wind >= 40){
      if(risk === "IDEAL"){ risk = "WIND"; riskClass = "warn"; }
      alerts.push(["warn","High wind",`${wind} km/h gusty conditions. Secure tomatoes, peas, and trellises.`]);
    }

    if(!alerts.length) alerts.push(["safe","No major weather threat","Normal watering checks are enough."]);

    document.getElementById("weatherRisk").textContent = risk;
    setRiskGauge(riskClass, risk);
    document.getElementById("gardenAlerts").innerHTML = alerts.map(a => `<div class="alert-card ${a[0]}"><b>${a[1]}</b><small>${a[2]}</small></div>`).join("");
  } catch(err){
    document.getElementById("weatherNow").textContent = "Offline";
    document.getElementById("weatherRisk").textContent = "Manual check";
    setRiskGauge("warn", "OFFLINE");
    const ga = document.getElementById("gardenAlerts");
    if(ga) ga.innerHTML = `<div class="alert-card warn"><b>Weather unavailable</b><small>Check Riverview forecast manually. The rest of the Pip-Boy still works.</small></div>`;
  }
}

function renderStat(){
  const app = document.getElementById("app");
  const todayKey = dateKey(new Date());
  const todays = buildEventsForYear(new Date().getFullYear(), getMyGarden(), getStages()).filter(e => e.date === todayKey);
  const garden = getMyGarden().map(getCrop).filter(Boolean);
  const counts = {};
  garden.forEach(c => {
    const s = getCropStage(c);
    counts[s] = (counts[s] || 0) + 1;
  });
  app.innerHTML = `
    <section class="grid">
      <div class="panel">
        <h2>Today's Tasks</h2>
        <div class="task-list">
          ${todays.length ? todays.map(taskHTML).join("") : `<div class="task"><div class="big">✅</div><div><b>No scheduled crop tasks today</b><small>Suspiciously peaceful. Enjoy it.</small></div></div>`}
        </div>
      </div>
      <div class="panel">
        <h2>Crop Status</h2>
        <div class="stat-grid">
          ${Object.keys(counts).length ? Object.entries(counts).map(([stage,count]) => `<div class="card"><b>${stageLabel(stage)}</b><small>${count} crop${count===1?"":"s"}</small></div>`).join("") : `<div class="card"><b>No crops loaded</b><small>Add crops from the CROPS screen.</small></div>`}
        </div>
      </div>
      <div class="panel">
        <h2>My Crops</h2>
        <div class="task-list">
          ${garden.map(c => `<div class="task"><div class="big">${c.icon}</div><div><b>${escapeHTML(c.name)}</b><small>${stageLabel(getCropStage(c))} • ${escapeHTML(c.harvestWindow)}</small></div></div>`).join("")}
        </div>
      </div>
      <div class="panel">
        <h2>Overseer Report</h2>
        <div class="card"><b>War never changes… but fertilizer schedules do.</b><small>Stage changes now update future calendar reminders automatically.</small></div>
      </div>
    </section>
  `;
}

function taskHTML(e){
  const crop = getCrop(e.plant);
  return `<div class="task"><div class="big">${e.action}</div><div><b>${crop ? crop.icon + " " + escapeHTML(crop.name) : "Garden Task"}</b><small>${escapeHTML(e.text)} • ${escapeHTML(e.date)}</small></div></div>`;
}

function renderCalendarTab(){
  const app = document.getElementById("app");
  const garden = getMyGarden().map(getCrop).filter(Boolean);
  const events = activeEvents().filter(e => calendarFilter === "all" || e.plant === calendarFilter);
  app.innerHTML = `
    <section class="panel">
      <h2>Calendar</h2>
      <div class="controls">
        <button class="month-btn" data-prev-month>◀</button>
        <div class="month-title">${MONTH_NAMES[selectedMonth]} ${selectedYear}</div>
        <button class="month-btn" data-next-month>▶</button>
        <select data-year-select>${[2026,2027,2028].map(y => `<option value="${y}" ${y===selectedYear?"selected":""}>${y}</option>`).join("")}</select>
        <select data-filter-select>
          <option value="all">All Crops</option>
          ${garden.map(c => `<option value="${c.id}" ${calendarFilter===c.id?"selected":""}>${c.icon} ${escapeHTML(c.name)}</option>`).join("")}
        </select>
      </div>
      <div class="cal">${calendarHTML(events)}</div>
      <div class="legend">${garden.map(c => `<span>${c.icon} ${escapeHTML(c.name)}</span>`).join("")}</div>
    </section>
    <section class="panel">
      <h2>This Month</h2>
      <div class="task-list">
        ${events.filter(e => parseKey(e.date).getMonth() === selectedMonth).length ? events.filter(e => parseKey(e.date).getMonth() === selectedMonth).map(taskHTML).join("") : `<div class="task"><div class="big">📡</div><div><b>No events this month</b><small>Try another month or crop filter.</small></div></div>`}
      </div>
    </section>
  `;
}

function calendarHTML(events){
  const first = new Date(selectedYear, selectedMonth, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
  const prevDays = new Date(selectedYear, selectedMonth, 0).getDate();
  const cells = [];
  DOW.forEach(d => cells.push(`<div class="dow">${d}</div>`));
  const total = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const todayK = dateKey(new Date());
  for(let i=0;i<total;i++){
    const dayNum = i - startDay + 1;
    let m = selectedMonth, y = selectedYear, d = dayNum, muted = false;
    if(dayNum < 1){ m = selectedMonth-1; if(m<0){m=11;y--;} d = prevDays + dayNum; muted = true; }
    if(dayNum > daysInMonth){ m = selectedMonth+1; if(m>11){m=0;y++;} d = dayNum - daysInMonth; muted = true; }
    const k = dateKeyFromParts(y,m,d);
    const dayEvents = events.filter(e => e.date === k);
    cells.push(`<div class="day ${muted?"muted":""} ${k===todayK?"today":""}">
      <div class="day-num">${d}</div>
      <div class="icons">${dayEvents.slice(0,6).map(e => `<span class="event-pill" title="${escapeHTML(e.text)}">${e.action}${getCrop(e.plant)?.icon || ""}</span>`).join("")}</div>
    </div>`);
  }
  return cells.join("");
}

function renderCropsTab(){
  const app = document.getElementById("app");
  const gardenIds = getMyGarden();
  const garden = gardenIds.map(getCrop).filter(Boolean);
  const selected = selectedCropId ? getCrop(selectedCropId) : garden[0];
  const available = GARDEN_DATABASE.filter(c => !gardenIds.includes(c.id));
  app.innerHTML = `
    <section class="panel">
      <h2>My Crops</h2>
      <div class="crop-layout">
        <div>
          <div class="crop-list">
            ${garden.map((c,i) => cropRowHTML(c,i,garden.length)).join("")}
          </div>
          <button class="add-btn" style="width:100%;margin-top:10px" data-toggle-add>➕ ADD CROP</button>
          <div class="add-browser ${addOpen ? "open" : ""}">
            <input data-add-search placeholder="Search crop database…">
            <div class="add-grid" id="addGrid">
              ${available.map(c => `<button class="btn add-item" data-add-crop="${c.id}">${c.icon} ${escapeHTML(c.name)} <small style="display:block;color:var(--dim)">${escapeHTML(c.category)} • ${escapeHTML(c.type)}</small></button>`).join("")}
            </div>
          </div>
        </div>
        <div>${selected ? cropDetailHTML(selected) : `<div class="card"><b>No crop selected</b><small>Add a crop to begin.</small></div>`}</div>
      </div>
    </section>
  `;
}

function cropRowHTML(c,i,len){
  return `<div class="crop-row ${selectedCropId===c.id?"active":""}">
    <button class="crop-row-title" data-select-crop="${c.id}">
      ${c.icon} ${escapeHTML(c.name)}
      <small style="display:block;color:var(--dim)">${stageLabel(getCropStage(c))}</small>
    </button>
  </div>`;
}

function cropDetailHTML(c){
  const stage = getCropStage(c);
  const track = getStageTrack(c);
  const days = fertilizerDaysForStage(c, stage);
  const gardenIds = getMyGarden();
  const cropIndex = gardenIds.indexOf(c.id);
  return `
    <div class="crop-detail-hero">
      <div class="crop-icon-big">${c.icon}</div>
      <div><h2 class="crop-title">${escapeHTML(c.name)}</h2><div class="crop-sub">${escapeHTML(c.category)} • ${escapeHTML(c.type)} • Zone ${escapeHTML(c.zone)}</div></div>
    </div>

    <div class="selected-actions">
      <button class="mini-btn" data-move-crop="${c.id}" data-dir="-1" ${cropIndex<=0?"disabled":""}>▲ Move Up</button>
      <button class="mini-btn" data-move-crop="${c.id}" data-dir="1" ${cropIndex<0 || cropIndex>=gardenIds.length-1?"disabled":""}>▼ Move Down</button>
      <button class="remove-garden-btn" data-remove-crop="${c.id}">Remove From My Garden</button>
    </div>

    <h3>Growth Stage</h3>
    <div class="stage-row">
      ${track.map(s => `<button class="stage-btn ${stage===s?"active":""}" data-stage="${s}" data-stage-crop="${c.id}">${stage===s?"●":"○"} ${stageLabel(s)}</button>`).join("")}
    </div>

    <div class="card" style="margin-bottom:12px"><b>Active Fertilizer Rate</b><small>${days ? `Every ${days} days while ${stageLabel(stage).toLowerCase()}. Future calendar reminders update from today's stage change date.` : `No scheduled fertilizer for ${stageLabel(stage).toLowerCase()} stage.`}</small></div>

    ${companionAIHTML(c)}

    <div class="info-grid">
      ${info("Sow", c.sowWindow)}
      ${info("Direct Sow", c.directSow)}
      ${info("Move Out", c.transplantWindow)}
      ${info("Harvest", c.harvestWindow)}
      ${info("Container", c.containerSize)}
      ${info("Spacing", c.spacing)}
      ${info("Sun", c.sun)}
      ${info("Water", c.water)}
      ${info("Safe Temp", c.safeTemp)}
      ${info("Heat Care", c.heatCare)}
      ${info("Fertilizer", fertilizerRecommendationHTML(c), true)}
      ${info("Companions", c.companionPlants?.length ? c.companionPlants.map(id => getCrop(id)?.name || id).join(", ") : "—")}
      ${info("Notes", c.notes, true)}
    </div>
  `;
}
function info(label,value,full=false){
  return `<div class="info ${full?"full":""}"><small>${escapeHTML(label)}</small><b>${value || "—"}</b></div>`;
}

function renderLogTab(){
  const app = document.getElementById("app");
  const logs = readJSON(LS_HARVEST, []);
  const garden = getMyGarden().map(getCrop).filter(Boolean);
  app.innerHTML = `
    <section class="panel">
      <h2>Harvest Log</h2>
      <div class="log-form">
        <select data-log-crop>${garden.map(c => `<option value="${c.id}">${c.icon} ${escapeHTML(c.name)}</option>`).join("")}</select>
        <input data-log-note placeholder="Example: 5 tomatoes / handful basil">
        <button class="btn" data-add-log>ADD</button>
      </div>
      <div class="history">
        ${logs.length ? logs.map((l,idx) => {
          const c = getCrop(l.crop);
          return `<div class="task"><div class="big">${c?.icon || "🧺"}</div><div><b>${escapeHTML(c?.name || l.crop)}</b><small>${escapeHTML(l.date)} • ${escapeHTML(l.note)}</small></div><button class="mini-btn danger-btn" data-delete-log="${idx}">✖</button></div>`;
        }).join("") : `<div class="card"><b>No harvest logged yet</b><small>The tomatoes are plotting quietly.</small></div>`}
      </div>
    </section>
  `;
}

function renderDataTab(){
  const app = document.getElementById("app");
  const garden = getMyGarden().map(getCrop).filter(Boolean);
  const owned = getOwnedSupply();
  const availableToAdd = allSupplyKeys().filter(k => !owned.includes(k));
  app.innerHTML = `
    <section class="grid">
      <div class="panel">
        <h2>Supply Inventory</h2>
        <div class="controls">
          <select data-supply-select>
            ${availableToAdd.length ? availableToAdd.map(k => `<option value="${k}">${escapeHTML(SUPPLY_DATABASE[k].short)} • ${escapeHTML(npkLabel(SUPPLY_DATABASE[k]))}</option>`).join("") : `<option value="">All fertilizers already in inventory</option>`}
          </select>
          <button class="btn" data-add-supply ${availableToAdd.length ? "" : "disabled"}>ADD SUPPLY</button>
          <button class="mini-btn" data-reset-supply>RESET DEFAULTS</button>
        </div>
        <div class="supply-grid">
          ${owned.map(k => {
            const s = SUPPLY_DATABASE[k];
            return `<div class="data-card"><b>✓ ${escapeHTML(s.name)}</b><small>NPK ${escapeHTML(npkLabel(s))} • ${escapeHTML(s.form || "")}.<br>${escapeHTML(s.role)}</small><button class="mini-btn danger-btn" data-remove-supply="${k}">Remove</button></div>`;
          }).join("") || `<div class="data-card"><b>No owned fertilizer selected</b><small>Add what you own from the dropdown above.</small></div>`}
        </div>
      </div>
      <div class="panel">
        <h2>Fertilizer Guide</h2>
        <div class="task-list">
          ${garden.map(c => {
            const stage = getCropStage(c);
            const ownedMatch = bestFertilizerMatch(c, owned, stage).best;
            const missingMatch = bestFertilizerMatch(c, allSupplyKeys().filter(k => !owned.includes(k)), stage).best;
            return `<div class="task"><div class="big">${c.icon}</div><div><b>${escapeHTML(c.name)}</b><small>Owned: ${ownedMatch ? escapeHTML(ownedMatch.item.short) : "None"}<br>Missing ideal: ${missingMatch ? escapeHTML(missingMatch.item.short) : "Already covered"}</small></div></div>`;
          }).join("")}
        </div>
      </div>
      <div class="panel">
        <h2>Fertilizer Database</h2>
        <div class="supply-grid">
          ${allSupplyKeys().map(k => {
            const s = SUPPLY_DATABASE[k];
            return `<div class="data-card"><b>${owned.includes(k) ? "✓ " : ""}${escapeHTML(s.short)}</b><small>${escapeHTML(s.name)}<br>NPK ${escapeHTML(npkLabel(s))} • ${escapeHTML(s.form || "")}.<br>${escapeHTML(s.role)}</small></div>`;
          }).join("")}
        </div>
      </div>
      <div class="panel">
        <h2>Garden Rules</h2>
        <div class="data-grid">
          <div class="data-card"><b>Grow Bags</b><small>They dry faster than beds, especially July/August. Water before fertilizing.</small></div>
          <div class="data-card"><b>Stage Changes</b><small>Changing a crop stage updates future fertilizer reminders. Past dates are left alone.</small></div>
          <div class="data-card"><b>Spinach</b><small>4 inch x 10 inch planters are good for baby spinach. Give afternoon shade during heat.</small></div>
          <div class="data-card"><b>Root Crops</b><small>Use lower nitrogen. Thin seedlings early or the roots stay tiny and sad.</small></div>
        </div>
      </div>
    </section>
  `;
}

document.addEventListener("click", e => {
  const tab = e.target.closest("[data-tab]");
  if(tab){ setTab(tab.dataset.tab); return; }

  if(e.target.closest("[data-prev-month]")){ selectedMonth--; if(selectedMonth<0){selectedMonth=11;selectedYear--;} render(); return; }
  if(e.target.closest("[data-next-month]")){ selectedMonth++; if(selectedMonth>11){selectedMonth=0;selectedYear++;} render(); return; }

  const sel = e.target.closest("[data-select-crop]");
  if(sel){ selectedCropId = sel.dataset.selectCrop; addOpen = false; render(); return; }

  const mv = e.target.closest("[data-move-crop]");
  if(mv){
    const ids = getMyGarden();
    const idx = ids.indexOf(mv.dataset.moveCrop);
    const dir = Number(mv.dataset.dir);
    const next = idx + dir;
    if(idx >= 0 && next >= 0 && next < ids.length){
      [ids[idx],ids[next]] = [ids[next],ids[idx]];
      setMyGarden(ids);
      render();
    }
    return;
  }

  const rm = e.target.closest("[data-remove-crop]");
  if(rm){
    const ids = getMyGarden().filter(id => id !== rm.dataset.removeCrop);
    setMyGarden(ids);
    if(selectedCropId === rm.dataset.removeCrop) selectedCropId = ids[0] || null;
    render();
    return;
  }

  const addToggle = e.target.closest("[data-toggle-add]");
  if(addToggle){ addOpen = !addOpen; render(); return; }

  const add = e.target.closest("[data-add-crop]");
  if(add){
    const ids = getMyGarden();
    if(!ids.includes(add.dataset.addCrop)) ids.push(add.dataset.addCrop);
    setMyGarden(ids);
    selectedCropId = add.dataset.addCrop;
    addOpen = false;
    render();
    return;
  }

  const st = e.target.closest("[data-stage]");
  if(st){
    setCropStage(st.dataset.stageCrop, st.dataset.stage);
    render();
    return;
  }

  const addSupply = e.target.closest("[data-add-supply]");
  if(addSupply){
    const key = document.querySelector("[data-supply-select]")?.value;
    if(key && SUPPLY_DATABASE[key]){
      const owned = getOwnedSupply();
      if(!owned.includes(key)) owned.push(key);
      setOwnedSupply(owned);
      render();
    }
    return;
  }

  const rmSupply = e.target.closest("[data-remove-supply]");
  if(rmSupply){
    setOwnedSupply(getOwnedSupply().filter(k => k !== rmSupply.dataset.removeSupply));
    render();
    return;
  }

  const resetSupply = e.target.closest("[data-reset-supply]");
  if(resetSupply){
    setOwnedSupply(defaultOwnedSupply());
    render();
    return;
  }

  const logAdd = e.target.closest("[data-add-log]");
  if(logAdd){
    const crop = document.querySelector("[data-log-crop]")?.value;
    const note = document.querySelector("[data-log-note]")?.value?.trim();
    if(crop && note){
      const logs = readJSON(LS_HARVEST, []);
      logs.unshift({ crop, note, date: dateKey(new Date()) });
      writeJSON(LS_HARVEST, logs);
      render();
    }
    return;
  }

  const logDel = e.target.closest("[data-delete-log]");
  if(logDel){
    const logs = readJSON(LS_HARVEST, []);
    logs.splice(Number(logDel.dataset.deleteLog),1);
    writeJSON(LS_HARVEST, logs);
    render();
    return;
  }
});

document.addEventListener("change", e => {
  if(e.target.matches("[data-year-select]")){ selectedYear = Number(e.target.value); render(); }
  if(e.target.matches("[data-filter-select]")){ calendarFilter = e.target.value; render(); }
});

document.addEventListener("input", e => {
  if(e.target.matches("[data-add-search]")){
    const q = e.target.value.toLowerCase();
    document.querySelectorAll("[data-add-crop]").forEach(btn => {
      btn.style.display = btn.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", render);
