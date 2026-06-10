const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function pad2(n){ return String(n).padStart(2,"0"); }
function dateKeyFromParts(y,m,d){ return `${y}-${pad2(m+1)}-${pad2(d)}`; }
function dateKey(date){ return dateKeyFromParts(date.getFullYear(), date.getMonth(), date.getDate()); }
function parseKey(key){ const [y,m,d] = key.split("-").map(Number); return new Date(y,m-1,d); }
function addDays(date, days){ const d = new Date(date); d.setDate(d.getDate()+days); return d; }

function getCrop(id){ return GARDEN_DATABASE.find(c => c.id === id); }

function stageLabel(stage){
  const labels = {
    seedling:"Seedling", growing:"Growing", flowering:"Flowering", fruiting:"Fruiting",
    harvesting:"Harvesting", root:"Root Development", harvestReady:"Harvest Ready",
    heading:"Heading"
  };
  return labels[stage] || stage;
}

function getStageTrack(crop){
  const tracks = {
    fruiting:["seedling","growing","flowering","fruiting"],
    herb:["seedling","growing","harvesting"],
    root:["seedling","root","harvestReady"],
    leafy:["seedling","growing","harvesting"],
    legume:["seedling","growing","flowering","harvesting"],
    brassica:["seedling","growing","heading","harvestReady"],
    flower:["seedling","growing","flowering"],
    perennial:["seedling","growing","harvesting"],
    tree:["seedling","growing","harvesting"]
  };
  return tracks[crop.stageTrack] || ["seedling","growing","harvesting"];
}

function fertilizerDaysForStage(crop, stage){
  const f = crop.fertilizer || {};
  if(stage === "seedling") return f.seedlingDays || 0;
  if(stage === "flowering") return f.floweringDays || f.growingDays || 0;
  if(stage === "fruiting") return f.fruitingDays || f.floweringDays || f.growingDays || 0;
  if(stage === "harvesting") return f.harvestingDays || f.growingDays || 0;
  if(stage === "root") return f.rootDays || f.growingDays || 0;
  if(stage === "heading") return f.headingDays || f.growingDays || 0;
  if(stage === "harvestReady") return f.harvestReadyDays || 0;
  return f.growingDays || 0;
}

function monthRangeFromText(text){
  const t = (text || "").toLowerCase();
  const months = [
    ["jan",0],["feb",1],["march",2],["mar",2],["april",3],["apr",3],["may",4],["june",5],["jun",5],
    ["july",6],["jul",6],["august",7],["aug",7],["sept",8],["sep",8],["oct",9],["nov",10],["dec",11]
  ];
  const found = [];
  months.forEach(([name,idx]) => { if(t.includes(name) && !found.includes(idx)) found.push(idx); });
  found.sort((a,b)=>a-b);
  if(!found.length) return [];
  const min = found[0], max = found[found.length-1];
  const expanded = [];
  for(let m=min;m<=max;m++) expanded.push(m);
  return expanded;
}

function defaultStartForCrop(crop, year){
  const months = monthRangeFromText(crop.transplantWindow).concat(monthRangeFromText(crop.directSow));
  const unique = [...new Set(months)].sort((a,b)=>a-b);
  const m = unique.length ? unique[0] : 5;
  return new Date(year, m, 1);
}

function defaultEndForCrop(crop, year){
  const months = monthRangeFromText(crop.harvestWindow);
  const m = months.length ? months[months.length-1] : 8;
  return new Date(year, m, new Date(year, m+1, 0).getDate());
}

function addWindowEvents(events, year, crop, field, action, label){
  const months = monthRangeFromText(crop[field]);
  months.forEach((m, idx) => {
    const day = idx === 0 ? 1 : 15;
    events.push({
      date: dateKeyFromParts(year,m,Math.min(day,new Date(year,m+1,0).getDate())),
      action, plant: crop.id,
      text: `${crop.name}: ${label} — ${crop[field]}`
    });
  });
}

function addFertilizerEvents(events, year, crop, stageInfo){
  const defaultStage = crop.defaultStage || "growing";
  const currentStage = stageInfo?.stage || defaultStage;
  const changedAt = stageInfo?.changedAt ? parseKey(stageInfo.changedAt) : null;
  const start = defaultStartForCrop(crop, year);
  const end = defaultEndForCrop(crop, year);
  const Jan1 = new Date(year,0,1), Dec31 = new Date(year,11,31);
  if(end < Jan1 || start > Dec31) return;

  const addSeries = (from, to, days, stageName) => {
    if(!days || days <= 0) return;
    let d = new Date(from);
    if(d < start) d = new Date(start);
    while(d <= to && d <= end){
      if(d.getFullYear() === year){
        events.push({
          date: dateKey(d),
          action:"💧",
          plant: crop.id,
          text:`${crop.name}: fertilize (${stageLabel(stageName)} stage, every ${days} days)`
        });
      }
      d = addDays(d, days);
    }
  };

  if(changedAt && changedAt.getFullYear() === year && changedAt > start && changedAt <= end){
    const beforeEnd = addDays(changedAt, -1);
    addSeries(start, beforeEnd, fertilizerDaysForStage(crop, defaultStage), defaultStage);
    addSeries(changedAt, end, fertilizerDaysForStage(crop, currentStage), currentStage);
  } else {
    const activeStage = changedAt && changedAt <= start ? currentStage : defaultStage;
    addSeries(start, end, fertilizerDaysForStage(crop, activeStage), activeStage);
  }
}

function buildEventsForYear(year, gardenIds, stageStore){
  const events = [];
  gardenIds.map(getCrop).filter(Boolean).forEach(crop => {
    addWindowEvents(events, year, crop, "sowWindow", "🌱", "sow/start");
    addWindowEvents(events, year, crop, "transplantWindow", "🪴", "move/transplant");
    addWindowEvents(events, year, crop, "harvestWindow", "🧺", "harvest window");
    addFertilizerEvents(events, year, crop, stageStore[crop.id]);
  });

  const seen = new Set();
  return events
    .filter(e => {
      const k = `${e.date}|${e.action}|${e.plant}|${e.text}`;
      if(seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a,b)=>a.date.localeCompare(b.date) || a.plant.localeCompare(b.plant));
}
