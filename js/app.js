(()=>{
  const body=document.body;
  const buttons=document.querySelectorAll('.view-btn');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  buttons.forEach(button=>button.addEventListener('click',()=>{
    body.dataset.view=button.dataset.view;
    buttons.forEach(candidate=>{
      const active=candidate===button;
      candidate.classList.toggle('is-active',active);
      candidate.setAttribute('aria-pressed',String(active));
    });
  }));

  document.querySelectorAll('.whatsapp-link').forEach(link=>{
    link.href=['https://','wa.me/','5511993408348'].join('');
    link.target='_blank';
    link.rel='noreferrer';
  });

  document.querySelectorAll('.architecture').forEach(group=>{
    const detail=group.parentElement?.querySelector('.architecture-detail');
    const nodes=[...group.querySelectorAll('[data-arch]')];
    nodes.forEach(node=>node.addEventListener('click',()=>{
      nodes.forEach(candidate=>{
        const active=candidate===node;
        candidate.classList.toggle('is-active',active);
        candidate.setAttribute('aria-pressed',String(active));
      });
      if(detail)detail.textContent=node.dataset.detail||'';
      window.portfolioAnalytics?.track?.('architecture_node',{node:node.textContent.trim(),project:'AWS Data Lakehouse'});
    }));
  });

  const reveals=[...document.querySelectorAll('.reveal')];
  reveals.forEach(element=>element.dataset.delay&&(element.style.transitionDelay=`${element.dataset.delay}ms`));
  if(reduced||!('IntersectionObserver'in window)){
    reveals.forEach(element=>element.classList.add('is-visible'));
  }else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }),{threshold:.1});
    reveals.forEach(element=>observer.observe(element));
  }

  const counters=[...document.querySelectorAll('.counter')];
  const done=element=>element.textContent=`${element.dataset.prefix||''}${element.dataset.target||0}${element.dataset.suffix||''}`;
  if(reduced){
    counters.forEach(done);
  }else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const element=entry.target;
      const target=+element.dataset.target;
      const start=performance.now();
      function frame(now){
        const progress=Math.min((now-start)/1000,1);
        const value=Math.round(target*(1-Math.pow(1-progress,3)));
        element.textContent=`${element.dataset.prefix||''}${value}${element.dataset.suffix||''}`;
        if(progress<1)requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      observer.unobserve(element);
    }),{threshold:.6});
    counters.forEach(element=>observer.observe(element));
  }

  const year=document.getElementById('year');
  if(year)year.textContent=new Date().getFullYear();
})();
