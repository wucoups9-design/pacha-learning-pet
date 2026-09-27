(() => {
  const header=document.querySelector('.game-header');
  const toggle=document.createElement('button');toggle.className='scene-motion-toggle';toggle.textContent='暂停动画';toggle.setAttribute('aria-pressed','false');header.append(toggle);
  const sync=()=>{const paused=document.documentElement.classList.contains('motion-paused');toggle.textContent=paused?'继续动画':'暂停动画';toggle.setAttribute('aria-pressed',String(paused));};
  toggle.onclick=()=>document.getElementById('motionToggle').click();
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});sync();
  // Lessons are re-rendered between mini levels. Insert a living companion each time.
  function decorate(){document.querySelectorAll('.beginner-card h3').forEach(h=>{if(h.querySelector('.pacha-avatar'))return;const pet=document.createElement('span');pet.className='pacha-avatar';pet.setAttribute('aria-hidden','true');pet.style.cssText='width:74px;height:74px;display:inline-block;vertical-align:middle;margin-right:12px';h.prepend(pet);});}
  const lessons=document.getElementById('beginnerLessons');if(lessons)new MutationObserver(decorate).observe(lessons,{childList:true});decorate();
  const previews=[];
  document.querySelectorAll('.outing-note img,.destination img').forEach(img=>{
    const v=document.createElement('video');v.className='pet-preview';v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';v.poster=img.src;v.src='../assets/video/pacha-park-story-v2.mp4';v.setAttribute('aria-label',img.alt);v.setAttribute('tabindex','-1');img.replaceWith(v);previews.push(v);
  });
  const visible=new Set();
  function playback(){previews.forEach(v=>{if(visible.has(v)&&!document.hidden&&!document.documentElement.classList.contains('motion-paused'))v.play().catch(()=>{});else v.pause();});}
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));playback();});previews.forEach(v=>observer.observe(v));
  new MutationObserver(playback).observe(document.documentElement,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',playback);
})();
