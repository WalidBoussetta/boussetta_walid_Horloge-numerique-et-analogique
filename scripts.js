    // fi souret maa saret erreur lel intl 
    const timeZones = [
      'UTC','Europe/Paris','Europe/London','America/New_York','America/Los_Angeles','Asia/Tokyo','Asia/Dubai','Australia/Sydney','Africa/Tunis'
    ];

    const tzSelect = document.getElementById('tzSelect');
    const addTzBtn = document.getElementById('addTz');
    const clocksContainer = document.getElementById('clocks');
    const showAnalog = document.getElementById('showAnalog');
    const showDigital = document.getElementById('showDigital');
    const accentPicker = document.getElementById('accentPicker');
    const hourFormat = document.getElementById('hourFormat');
    const localNow = document.getElementById('localNow');

    
    //take the api from the intl susing the function populate timezones
    function populateTZs(){
      let zones = [];
      // objet global intl (nrml ykun dima mawjoud fel nav moderne)
      if (Intl && typeof Intl.supportedValuesOf === 'function'){
        try{ zones = Intl.supportedValuesOf('timeZone'); } //api
        catch(e){ zones = timeZones; }  // fallback if they throw an error
      } else {
        zones = timeZones;
      }

      //on vide le contenu precedent du selecteur
      tzSelect.innerHTML='';
      zones.forEach(z=>{
        const opt = document.createElement('option'); opt.value = z; opt.textContent = z; tzSelect.appendChild(opt);
      });
    }
    populateTZs(); 

    //---------------------------------------------------------------------------------

    // Utility: get time parts for a timezone using Intl.formatToParts
    function getTimePartsForZone(zone, now=new Date()){
      // Use hour12=false to get 24-hour numeric parts
      const fmt = new Intl.DateTimeFormat('en-GB',{timeZone: zone, hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
      const parts = fmt.formatToParts(now); //formatToParts traja3lna tableau mta3 objets
      const map = {};
      parts.forEach(p=>{ if (p.type !== 'literal') map[p.type] = p.value; });
      // map = {hour:'14', minute:'05', second:'09'}
      return {
        hour: parseInt(map.hour,10), //convertir string to int
        minute: parseInt(map.minute,10), //10 mean base decimal
        second: parseInt(map.second,10)
      };
    }


    //---------------------------------------------------------------------------------

    // Create a clock card for a timezone
    function createClockCard(zone){
      const card = document.createElement('section'); card.className='clock-card';
      const title = document.createElement('div'); title.className='tz-name'; title.textContent = zone;
      const meta = document.createElement('div'); meta.className='meta'; meta.textContent = zone.replace('_',' ');

      // contenu horloge
      const clockWrap = document.createElement('div'); clockWrap.style.display='flex'; clockWrap.style.flexDirection='column'; clockWrap.style.alignItems='center';
      
      
      // analog clock
      const analog = document.createElement('div'); analog.className='clock'; analog.setAttribute('data-zone',zone);
      //le cadron avec les ticks
      const face = document.createElement('div'); face.className='face';

      // bch n3ml des traits autour du cadron de l'horloge
      // les grand ticks toute les (5 minutes) w les petits ticks pour les minutes
      // cardron avec 60 ticks
      for (let i=0;i<60;i++){
        const t = document.createElement('div'); t.className='tick';
        if (i%5 !== 0) t.setAttribute('data-small','1');
        t.style.transform = `translateX(-50%) rotate(${i*6}deg)`;
        face.appendChild(t);
      }

      // hands
      const hour = document.createElement('div'); hour.className='hand hour'; hour.innerHTML='<div class="bar" style="width:6px;height:100%;background:linear-gradient(#fff,#fff);transform:translateX(-50%)"></div>';
      const minute = document.createElement('div'); minute.className='hand minute'; minute.innerHTML='<div class="bar" style="width:4px;height:100%;background:linear-gradient(#fff,#ddd);transform:translateX(-50%)"></div>';
      const second = document.createElement('div'); second.className='hand second'; second.innerHTML='<div class="bar" style="width:2px;height:100%;transform:translateX(-50%)"></div><div class="cap"></div>';
      // aiguille de secondes a un petit cap au centre


      analog.appendChild(face);
      analog.appendChild(hour); analog.appendChild(minute); analog.appendChild(second);

      const digital = document.createElement('div'); digital.className='digital'; digital.textContent='--:--:--';

      const actions = document.createElement('div'); actions.style.display='flex'; actions.style.gap='8px'; actions.style.marginTop='6px';
      // supprimer bouton
      const remove = document.createElement('button'); remove.className='btn'; remove.textContent='Supprimer'; remove.onclick = ()=>{ card.remove(); }
      actions.appendChild(remove);

      clockWrap.appendChild(analog); if (showDigital.checked) clockWrap.appendChild(digital);

      card.appendChild(title); card.appendChild(meta); card.appendChild(clockWrap); card.appendChild(actions);

      // stockage des rederences aux éléments pour mise à jour
      const clockObj = {zone, card, analog, hourEl:hour, minuteEl:minute, secondEl:second, digitalEl:digital, wrap:clockWrap};

      // set initial visibility
      analog.style.display = showAnalog.checked ? 'grid' : 'none';
      digital.style.display = showDigital.checked ? 'block' : 'none';

      // ajout au DOM
      clocksContainer.appendChild(card);
      return clockObj;
    }

    //---------------------------------------------------------------------------------

    
    // Maintain list of clocks
    const clocks = []; //bch nst3mlha f update

    function addZone(zone){
      try{
        // Validate by creating a formatter
        new Intl.DateTimeFormat('en-US',{timeZone:zone});
      }catch(e){ return; }
      
      const already = clocks.find(c=>c.zone===zone); if (already) { alert('Fuseau déjà présent'); return; }
      const c = createClockCard(zone); clocks.push(c);
      updateOnceForClock(c);
    }

    // update function: updates DOM for each clock pour un instant précis
    function updateOnceForClock(c, now=new Date()){
      const parts = getTimePartsForZone(c.zone, now);
      const hr = parts.hour % 12; //parts objet {hour,minute,second}
      const min = parts.minute;
      const sec = parts.second;

      // degrees
      const secDeg = sec * 6; // 360/60
      const minDeg = (min + sec/60) * 6;
      const hrDeg = (hr + min/60 + sec/3600) * 30; // 360/12
      
      if (secDeg === 0){
        // avoid transition jump when second hand resets
        c.secondEl.style.transition = 'none';
        requestAnimationFrame(()=>{ c.secondEl.style.transition = 'transform 0s linear'; });
      }

      c.hourEl.style.transform = `translate(-50%, -100%) rotate(${hrDeg}deg)`;
      c.minuteEl.style.transform = `translate(-50%, -100%) rotate(${minDeg}deg)`;
      c.secondEl.style.transform = `translate(-50%, -100%) rotate(${secDeg}deg)`;

      // digital
      const hourDisplay = (hourFormat.value === '12') ? ((parts.hour%12)||12) : parts.hour;
      const hh = String(hourDisplay).padStart(2,'0');  //ajouter 0 si chiffre <10 (ex: 9 -> 09)
      const mm = String(min).padStart(2,'0'); //2 hiya el length eli n7eb 3liha el string
      const ss = String(sec).padStart(2,'0');
      c.digitalEl.textContent = `${hh}:${mm}:${ss}`;
    }


    // Update all ( we'll update at 200ms for fluid second-hand ) 
    function tick(){
      const now = new Date(); //pour avoir une synchronisation entre les horloges
      // Update local display
      localNow.textContent = now.toLocaleTimeString();

      clocks.forEach(c=> updateOnceForClock(c, now));
    }
    //---------------------------------------------------------------------------------

    // Event listeners
    addTzBtn.addEventListener('click', ()=>{
      const val = tzSelect.value.trim(); if (!val) return; // trim to escape spaces
      addZone(val);
    });

    showAnalog.addEventListener('change', ()=>{
      clocks.forEach(c=> c.analog.style.display = showAnalog.checked ? 'grid' : 'none');
    });

    showDigital.addEventListener('change', ()=>{
      clocks.forEach(c=> c.digitalEl.style.display = showDigital.checked ? 'block' : 'none');
    });

    // Accent color change
    accentPicker.addEventListener('input', (e)=>{
      document.documentElement.style.setProperty('--accent', e.target.value);
    });

    hourFormat.addEventListener('change', ()=>{ tick(); });

    //---------------------------------------------------------------------------------

    // add a default local clock 
    addZone('local');
    (function addDefaults(){
      const localCard = createClockCard('local');
      clocks.push(localCard);
      updateOnceForClockLocal(localCard);

      ['Europe/Paris','America/New_York','Asia/Tokyo'].forEach(z=>{ addZone(z); });
    })();

    // Special update for local
    function getTimePartsLocal(now=new Date()){
      return {hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds()};
    }
    //fonction bch traja3l el wa9t local

    
    // update function for local clock
    function updateOnceForClockLocal(c, now=new Date()){
      const parts = getTimePartsLocal(now);
      const hr = parts.hour % 12;
      const min = parts.minute;
      const sec = parts.second;
      const secDeg = sec * 6;
      const minDeg = (min + sec/60) * 6;
      const hrDeg = (hr + min/60 + sec/3600) * 30;

        if (secDeg === 0){
            c.secondEl.style.transition = 'none';
            requestAnimationFrame(()=>{ c.secondEl.style.transition = 'transform 0s linear'; });
        }
      c.hourEl.style.transform = `translate(-50%, -100%) rotate(${hrDeg}deg)`;
      c.minuteEl.style.transform = `translate(-50%, -100%) rotate(${minDeg}deg)`;
      c.secondEl.style.transform = `translate(-50%, -100%) rotate(${secDeg}deg)`;
      const hourDisplay = (hourFormat.value === '12') ? ((parts.hour%12)||12) : parts.hour;
      const hh = String(hourDisplay).padStart(2,'0');
      const mm = String(min).padStart(2,'0');
      const ss = String(sec).padStart(2,'0');
      c.digitalEl.textContent = `${hh}:${mm}:${ss}`;
    }

    // Replace generic update for 'local' zone
    function tickWrap(){
      const now = new Date(); localNow.textContent = now.toLocaleTimeString();
      clocks.forEach(c=>{
        if (c.zone === 'local') updateOnceForClockLocal(c, now);
        else updateOnceForClock(c, now);
      });
    }

    // Start ticking: update frequently for smooth second hand
    setInterval(tickWrap, 200);

    // Small accessibility: pressing enter in select triggers add
    tzSelect.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') addTzBtn.click(); });

    // responsive: adjust --size based on computed card width
    function adjustSize(){
      const cw = Math.min(260, Math.max(140, Math.floor(window.innerWidth/6)));
      document.documentElement.style.setProperty('--size', cw + 'px');
    }
    window.addEventListener('resize', adjustSize); adjustSize();


    const nightBtn = document.getElementById("nightModeBtn");
    let nightMode = true;

    function updateNightMode() {
    if (nightMode) {
        document.body.classList.remove("light-mode");
        nightBtn.textContent = "🌙";
    } else {
        document.body.classList.add("light-mode");
        nightBtn.textContent = "☀️";
        
    }
    }

    nightBtn.addEventListener("click", () => {
    nightMode = !nightMode;
    updateNightMode();
    });

    // Initialize
    updateNightMode();
