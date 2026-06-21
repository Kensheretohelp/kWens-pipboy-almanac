/* kWen's Pip-Boy Almanac — Fertilizer Database
   Keep fertilizer products and matching logic out of index.html, just like crop data.
*/
(function(){
  'use strict';

  window.FERTILIZER_DB = {
    schultz_10_15_10: {
      name: 'Schultz Liquid Plant Food 10-15-10',
      short: 'Schultz 10-15-10',
      npk: [10,15,10],
      type: 'liquid',
      ownedDefault: true,
      roles: ['balanced', 'fruiting', 'flowering'],
      bestFor: ['tomatoes','cherrytomatoes','peppers','cucumbers','basil','thaibasil','chives','savory','mint'],
      avoid: ['peas','thyme'],
      note: 'Main quick-feed option. Use half strength for herbs.'
    },
    miracle_gro_24_8_16: {
      name: 'Miracle-Gro Water Soluble All Purpose Plant Food 24-8-16',
      short: 'Miracle-Gro 24-8-16',
      npk: [24,8,16],
      type: 'water-soluble',
      ownedDefault: true,
      roles: ['high_nitrogen','balanced','leafy_growth'],
      bestFor: ['tomatoes','cherrytomatoes','peppers','cucumbers','basil','thaibasil','chives','mint','savory','spinach','garlic'],
      avoid: ['beets','peas','waxbeans','thyme'],
      note: 'Good general growth feed, but high nitrogen. Go light on fruiting crops and avoid as the main beet/root-crop feed.'
    },
    shakefeed_ultra_bloom_10_18_9: {
      name: "Miracle-Gro Shake 'n Feed Ultra Bloom 10-18-9",
      short: 'Shake n Feed Ultra Bloom',
      npk: [10,18,9],
      type: 'slow-release',
      ownedDefault: true,
      roles: ['bloom','slow_release','fruiting'],
      bestFor: ['tomatoes','cherrytomatoes','peppers','cucumbers'],
      avoid: ['peas','thyme'],
      note: 'Optional slow-release bloom support at planting.'
    },
    gaia_power_bloom_2_8_4: {
      name: 'Gaia Green Power Bloom 2-8-4',
      short: 'Gaia Green 2-8-4',
      npk: [2,8,4],
      type: 'organic granular',
      ownedDefault: true,
      roles: ['low_nitrogen','bloom','root_support'],
      bestFor: ['beets','tomatoes','cherrytomatoes','peppers'],
      avoid: [],
      note: 'Best owned match for golden beets/root support.'
    },
    houseplant_0_0_2: {
      name: 'On My Garden Organic Houseplant Food 0-0-2',
      short: 'Houseplant 0-0-2',
      npk: [0,0,2],
      type: 'liquid',
      ownedDefault: true,
      roles: ['potassium','houseplant'],
      bestFor: [],
      avoid: ['tomatoes','cherrytomatoes','peppers','cucumbers','beets','peas','waxbeans'],
      note: 'Keep this as an indoor/houseplant product, not a main veggie-garden feed.'
    },
    vegetable_5_10_10: {
      name: 'Vegetable / Root Crop Fertilizer 5-10-10',
      short: 'Veg 5-10-10',
      npk: [5,10,10],
      type: 'granular',
      ownedDefault: false,
      roles: ['low_nitrogen','root_support','fruiting'],
      bestFor: ['beets','tomatoes','cherrytomatoes','peppers','cucumbers'],
      avoid: ['peas','thyme'],
      note: 'Best missing match for beets and a strong general vegetable-garden option.'
    },
    tomato_vegetable_18_18_21: {
      name: 'Tomato / Vegetable Water Soluble Plant Food 18-18-21',
      short: 'Tomato 18-18-21',
      npk: [18,18,21],
      type: 'water-soluble',
      ownedDefault: false,
      roles: ['fruiting','balanced','high_potassium'],
      bestFor: ['tomatoes','cherrytomatoes','peppers','cucumbers'],
      avoid: ['beets','peas','waxbeans','thyme'],
      note: 'Best missing match for heavy fruiting tomatoes/peppers if you want a dedicated fruiting feed.'
    },
    compost: {
      name: 'Compost / Worm Castings',
      short: 'Compost',
      npk: null,
      type: 'soil amendment',
      ownedDefault: false,
      roles: ['soil_health','gentle'],
      bestFor: ['peas','waxbeans','garlic','thyme','spinach','beets'],
      avoid: [],
      note: 'Gentle soil support. Often better than forcing fertilizer on legumes and herbs.'
    }
  };

  window.PLANT_FERTILIZER_NEEDS = {
    tomatoes: { roles:['fruiting','balanced','bloom'], avoid:['high_nitrogen'], schedule:'Every 2 weeks; weekly when fruiting mode is ON.', note:'Use a fruiting/bloom-leaning feed once fruit appears.' },
    cherrytomatoes: { roles:['fruiting','balanced','bloom'], avoid:['high_nitrogen'], schedule:'Every 2 weeks; weekly when fruiting mode is ON.', note:'Same plan as San Marzano.' },
    peppers: { roles:['fruiting','balanced','bloom'], avoid:['high_nitrogen'], schedule:'Every 2 weeks; weekly when fruiting mode is ON.', note:'Avoid pushing leafy growth too hard once flowering starts.' },
    cucumbers: { roles:['fruiting','balanced'], avoid:[], schedule:'Every 2 weeks while actively growing/producing.', note:'Water consistency matters as much as fertilizer.' },
    beets: { roles:['low_nitrogen','root_support'], avoid:['high_nitrogen'], schedule:'Once after thinning.', note:'Root crop mode: low nitrogen, no leafy chaos.' },
    peas: { roles:['soil_health','gentle'], avoid:['high_nitrogen','balanced'], schedule:'No fertilizer needed.', note:'Compost is plenty; peas fix nitrogen.' },
    waxbeans: { roles:['gentle','soil_health'], avoid:['high_nitrogen'], schedule:'Skip unless growth is poor.', note:'Too much nitrogen means leaves instead of beans.' },
    spinach: { roles:['balanced','leafy_growth'], avoid:[], schedule:'Usually skip; half strength only if growth slows.', note:'Moisture and shade beat fertilizer in summer.' },
    basil: { roles:['balanced','leafy_growth'], avoid:[], schedule:'Half strength every 3–4 weeks.', note:'Light feeding keeps flavour better.' },
    thaibasil: { roles:['balanced','leafy_growth'], avoid:[], schedule:'Half strength every 3–4 weeks.', note:'Keep it warm and keep pinching.' },
    chives: { roles:['balanced','leafy_growth'], avoid:[], schedule:'Half strength monthly.', note:'Easy herb. Do not overthink it.' },
    mint: { roles:['balanced','leafy_growth'], avoid:[], schedule:'Only if growth slows.', note:'Containment is more important than feeding.' },
    savory: { roles:['balanced'], avoid:['high_nitrogen'], schedule:'Very light feed every 4–6 weeks.', note:'Too much weakens flavour.' },
    thyme: { roles:['soil_health'], avoid:['high_nitrogen','balanced'], schedule:'No fertilizer.', note:'Lean, well-drained soil. Neglect is the feature.' },
    garlic: { roles:['high_nitrogen','soil_health'], avoid:[], schedule:'Spring only; stop feeding by early summer.', note:'Compost or nitrogen early, then hands off.' }
  };

  const ownedKey = 'kwenGardenOwnedFertilizersV1';
  const db = window.FERTILIZER_DB;
  const needs = window.PLANT_FERTILIZER_NEEDS;

  function defaultOwned(){
    return Object.fromEntries(Object.entries(db).map(([key,item]) => [key, !!item.ownedDefault]));
  }

  function getOwned(){
    try{
      const saved = JSON.parse(localStorage.getItem(ownedKey) || 'null');
      return Object.assign(defaultOwned(), saved || {});
    } catch(err){
      return defaultOwned();
    }
  }

  function setOwned(key, value){
    const owned = getOwned();
    owned[key] = !!value;
    try{ localStorage.setItem(ownedKey, JSON.stringify(owned)); } catch(err){}
  }

  function scoreProduct(item, need, plantKey){
    let score = 0;
    if(item.bestFor && item.bestFor.includes(plantKey)) score += 8;
    (need.roles || []).forEach(role => { if(item.roles && item.roles.includes(role)) score += 5; });
    (need.avoid || []).forEach(role => { if(item.roles && item.roles.includes(role)) score -= 8; });
    if(item.avoid && item.avoid.includes(plantKey)) score -= 10;
    if(plantKey === 'beets' && item.npk && item.npk[0] > 8) score -= 10;
    if(['peas','waxbeans','thyme'].includes(plantKey) && item.roles && item.roles.includes('high_nitrogen')) score -= 12;
    return score;
  }

  function bestForPlant(plantKey, ownedOnly){
    const need = needs[plantKey] || {roles:['balanced'], avoid:[]};
    const owned = getOwned();
    return Object.entries(db)
      .filter(([key]) => !ownedOnly || owned[key])
      .map(([key,item]) => ({ key, item, score: scoreProduct(item, need, plantKey) }))
      .filter(row => row.score > 0)
      .sort((a,b) => b.score - a.score)[0] || null;
  }

  function pill(key, muted){
    const item = db[key];
    if(!item) return '<span class="supply-pill">No fertilizer</span>';
    return '<span class="supply-pill'+(muted?' muted':'')+'">'+(muted?'◇ ':'✓ ')+item.short+'</span>';
  }

  function recommendationHtml(plantKey){
    const need = needs[plantKey] || { schedule:'See plant notes.', note:'See plant notes.' };
    const ownedBest = bestForPlant(plantKey, true);
    const idealBest = bestForPlant(plantKey, false);
    const ownedText = ownedBest ? pill(ownedBest.key) : '<span class="supply-pill">No fertilizer / compost only</span>';
    const missingText = idealBest && (!ownedBest || idealBest.key !== ownedBest.key) ? '<br><strong>Best missing match:</strong> '+pill(idealBest.key, true) : '';
    return '<strong>Best owned match:</strong> '+ownedText+missingText+'<br><strong>Schedule:</strong> '+need.schedule+'<br>'+need.note;
  }

  function injectStyles(){
    if(document.getElementById('fertilizer-db-styles')) return;
    const style = document.createElement('style');
    style.id = 'fertilizer-db-styles';
    style.textContent = '.fertilizer-inventory-panel{display:grid;gap:10px;margin:10px 0 14px}.fertilizer-picker{display:grid;grid-template-columns:1fr auto;gap:8px}.fertilizer-picker select{background:rgba(8,24,15,.95);color:var(--green);border:1px solid rgba(140,255,180,.35);border-radius:10px;padding:10px;font-family:inherit}.supply-pill.muted{opacity:.72;border-style:dashed}.inventory-row{display:flex;justify-content:space-between;gap:10px;align-items:center}.inventory-row button{border:1px solid rgba(140,255,180,.35);background:rgba(15,40,24,.9);color:var(--green);border-radius:999px;padding:6px 10px;font-family:inherit}';
    document.head.appendChild(style);
  }

  function renderInventoryControls(){
    injectStyles();
    const cache = document.getElementById('supplyCache');
    if(!cache || document.getElementById('fertilizerInventoryControls')) return;
    const wrap = document.createElement('div');
    wrap.id = 'fertilizerInventoryControls';
    wrap.className = 'fertilizer-inventory-panel vault-callout';
    wrap.innerHTML = '<b>Fertilizer Inventory Database</b><small>Add products you own. Plant pages will use your inventory first, then show the best missing match.</small><div class="fertilizer-picker"><select id="fertilizerPicker"></select><button type="button" id="addFertilizerBtn">Add</button></div>';
    cache.parentNode.insertBefore(wrap, cache);
    document.getElementById('addFertilizerBtn').addEventListener('click', function(){
      const sel = document.getElementById('fertilizerPicker');
      if(sel && sel.value){ setOwned(sel.value, true); rerender(); }
    });
  }

  function renderPicker(){
    const sel = document.getElementById('fertilizerPicker');
    if(!sel) return;
    const owned = getOwned();
    sel.innerHTML = Object.entries(db).filter(([key]) => !owned[key]).map(([key,item]) => '<option value="'+key+'">'+item.short+' — '+item.name+'</option>').join('') || '<option value="">All listed fertilizers are in inventory</option>';
  }

  window.renderSupplyCache = function(){
    renderInventoryControls();
    renderPicker();
    const box = document.getElementById('supplyCache');
    if(!box) return;
    const owned = getOwned();
    box.innerHTML = Object.entries(db).filter(([key]) => owned[key]).map(([key,item]) => '<div class="supply-card"><div class="inventory-row"><b>✓ '+item.name+'</b><button type="button" data-remove-fertilizer="'+key+'">Remove</button></div><small>'+item.note+'</small></div>').join('') || '<div class="vault-empty">No fertilizers in inventory yet.</div>';
    box.querySelectorAll('[data-remove-fertilizer]').forEach(btn => btn.addEventListener('click', function(){ setOwned(btn.dataset.removeFertilizer, false); rerender(); }));
  };

  window.renderFertilizerGuide = function(){
    const guide = document.getElementById('fertilizerGuide');
    if(!guide || !window.plants) return;
    const keys = ['tomatoes','cherrytomatoes','peppers','cucumbers','beets','waxbeans','peas','spinach','thaibasil','basil','chives','mint','savory','garlic','thyme'];
    guide.innerHTML = keys.map(key => {
      const p = window.plants[key];
      if(!p) return '';
      return '<div class="fertilizer-row"><b>'+plantIcon(key,p.name)+' '+p.name+'</b><small>'+recommendationHtml(key)+'</small></div>';
    }).join('');
  };

  window.renderQuickGrab = function(){
    const box = document.getElementById('quickGrab');
    if(!box || !window.plants) return;
    const groups = {};
    Object.keys(needs).forEach(key => {
      const p = window.plants[key];
      if(!p) return;
      const best = bestForPlant(key, true);
      const label = best ? best.item.short : 'No fertilizer / compost only';
      (groups[label] || (groups[label] = [])).push(key);
    });
    box.innerHTML = Object.entries(groups).map(([label, keys]) => '<div class="quick-grab-card"><b>'+label+'</b><small>'+keys.map(k => plantIcon(k,window.plants[k].name)+' '+window.plants[k].name).join('<br>')+'</small></div>').join('');
  };

  window.renderPlantDetail = function(){
    const p = window.plants && window.plants[window.selectedPlant];
    if(!p) return;
    const fruiting = window.getFruitingState ? !!getFruitingState()[window.selectedPlant] : false;
    const rec = recommendationHtml(window.selectedPlant).replace('Every 2 weeks; weekly when fruiting mode is ON.', fruiting && ['tomatoes','cherrytomatoes','peppers'].includes(window.selectedPlant) ? 'FRUITING MODE: weekly.' : 'Every 2 weeks; weekly when fruiting mode is ON.');
    document.getElementById('plantDetail').innerHTML = `<div class="task"><div class="big">${plantIcon(window.selectedPlant,p.name)}</div><div><b>${p.name}</b><small>${p.notes}</small><div class="plant-recommendation"><b>Inventory-Based Fertilizer Match</b><small>${rec}</small></div></div></div><div class="stage-row"><div class="stage-chip"><small>Stage Track</small><b>${p.stage||'Seed → Established → Harvest'}</b></div><div class="stage-chip"><small>Safe Night Temp</small><b>${p.safeTemp||'See notes'}</b></div><div class="stage-chip"><small>Heat Care</small><b>${p.heatCare||'Water as needed'}</b></div></div><div class="stats"><div class="stat"><small>Best Spot</small><b>${p.best}</b></div><div class="stat"><small>Water</small><b>${p.water}</b></div><div class="stat"><small>Fertilizer Schedule</small><b>${p.feed}</b></div><div class="stat"><small>Best Fertilizer</small><b>${bestForPlant(window.selectedPlant,true)?.item.short || 'No fertilizer / compost only'}</b></div><div class="stat"><small>Harvest</small><b>${p.harvest}</b></div></div><div class="timeline"><div class="tblock"><small>🌱 Sow</small>${p.sow}</div><div class="tblock"><small>🪴 Move Out</small>${p.move}</div><div class="tblock"><small>💧 Feed</small>${p.feed}</div><div class="tblock"><small>🧺 Harvest</small>${p.harvest}</div></div>`;
  };

  function rerender(){
    renderPicker();
    window.renderSupplyCache && window.renderSupplyCache();
    window.renderQuickGrab && window.renderQuickGrab();
    window.renderFertilizerGuide && window.renderFertilizerGuide();
    window.renderPlantDetail && window.renderPlantDetail();
  }

  function start(){ rerender(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
