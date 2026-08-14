(()=>{
  const STORAGE_KEY='vfr_portfolio_analytics_v1';
  const ENDPOINT=window.PORTFOLIO_ANALYTICS_ENDPOINT||'';
  const generatedId=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const sessionId=sessionStorage.getItem('vfr_session_id')||generatedId;
  sessionStorage.setItem('vfr_session_id',sessionId);

  function readStore(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{"events":{},"last":[]}')}catch{return {events:{},last:[]}}
  }

  function persist(event,payload){
    const store=readStore();
    store.events[event]=(store.events[event]||0)+1;
    store.last=[{event,at:new Date().toISOString(),...payload},...(store.last||[])].slice(0,25);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(store))}catch{}
  }

  function referrerHost(){
    if(!document.referrer)return 'direct';
    try{return new URL(document.referrer,location.href).hostname||'direct'}catch{return 'unknown'}
  }

  function send(event,payload={}){
    const record={
      event,
      page:location.pathname||'/',
      referrer:referrerHost(),
      session_id:sessionId,
      ...payload,
    };
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push(record);
    window.dispatchEvent(new CustomEvent('portfolio:analytics',{detail:record}));
    persist(event,payload);
    if(ENDPOINT&&navigator.sendBeacon){
      try{navigator.sendBeacon(ENDPOINT,new Blob([JSON.stringify(record)],{type:'application/json'}))}catch{}
    }
  }

  window.portfolioAnalytics={track:send,snapshot:readStore};
  send('portfolio_view',{view:document.body.dataset.view||'recruiter'});

  document.addEventListener('click',event=>{
    const target=event.target.closest?.('[data-track]');
    if(!target)return;
    send(target.dataset.track,{
      label:target.dataset.trackLabel||target.textContent.trim().slice(0,80),
      project:target.dataset.project||undefined,
      destination:target.getAttribute('href')||undefined,
    });
  });

  const projectObserver='IntersectionObserver'in window?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      if(el.dataset.analyticsSeen)return;
      el.dataset.analyticsSeen='1';
      send('project_view',{project:el.dataset.projectName});
      projectObserver.unobserve(el);
    });
  },{threshold:.55}):null;
  document.querySelectorAll('[data-project-name]').forEach(el=>projectObserver?.observe(el));
})();
