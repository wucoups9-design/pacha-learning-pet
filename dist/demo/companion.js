/* Pacha: illustrated expressions and an eight-frame trot, driven by one clock. */
(() => {
  const zone = document.querySelector('.pet-zone');
  zone.innerHTML = `
    <div class="room-heading"><span>PACHA · 一起长大的朋友</span><button id="motionToggle" aria-pressed="false">暂停动作</button></div>
    <div class="bubble" id="mood" aria-live="polite">嗨！摸摸我的头，或者带我玩一会儿吧。</div>
    <div class="pet-room" id="petRoom">
      <div class="room-window"><span>☁</span></div><div class="room-plant">🌱</div>
      <div class="room-rug"></div><div class="pet-bed">帕恰的小窝</div>
      <div class="pet-shadow" id="petShadow"></div>
      <button class="puppet" id="puppet" aria-label="摸摸帕恰，点击或按回车" title="摸摸我的头">
        <span class="pacha-sprite" id="pachaSprite" aria-hidden="true"></span>
      </button>
      <div id="toyBall" class="toy-ball" hidden></div><div id="petEffect" class="pet-effect" aria-hidden="true"></div>
      <span class="floor-hint">点地板，帕恰会走过去 · 点帕恰，摸摸头</span>
    </div>
    <div class="companion-status"><b>帕恰 <span id="petActivity">在陪你</span></b><span id="bondText">今天还没一起玩</span></div>
    <div class="companion-actions"><button data-companion="call">🐾 过来呀</button><button data-companion="cuddle">♡ 摸摸头</button><button data-companion="ball">◉ 丢小球</button><button data-companion="rest">☾ 睡一会</button></div>
    <small class="care-note">随时都能陪帕恰玩，慢慢学也没关系。</small>`;

  const q = id => document.getElementById(id);
  const room = q('petRoom'), puppet = q('puppet');
  const sprite = q('pachaSprite');
  let runPhase=0, facing=1, lastSprite='', stageAt=0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduce.matches, state = 'idle', x = .5, target = .5, velocity = 0, until = 0, nextIdle = 0;
  let nextBlink = 2, blinkUntil = 0, last = 0, elapsed = 0, look = 0, contact = 0, ballX = .72, throwAt = 0;
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const names = {idle:'在陪你',walk:'散步中',fetch:'追小球',return:'把球叼回来',cuddle:'被摸得好舒服',sleep:'睡得香香的',happy:'好开心',thinking:'歪头想一想',listening:'认真听你说',sniff:'闻闻新发现',stretch:'伸个懒腰',worried:'再试试就好'};
  function say(text) { q('mood').textContent = text; }
  function enter(next, seconds = 3) {
    state = next; stageAt=elapsed; until = elapsed + seconds; nextIdle = until + 5 + Math.random()*5;
    q('petActivity').textContent = ({pickup:'低头捡小球',turn:'转身找你',drop:'轻轻放下小球'})[next] || names[next] || names.idle;
    room.dataset.state = next;
  }
  function affection() { contact++; q('bondText').textContent = `一起互动了 ${contact} 次 ♡`; }
  function action(kind) {
    q('toyBall').hidden = true; target=x; velocity=0; q('petEffect').textContent='';
    if (kind === 'ball') {
      ballX = x > .5 ? .2 : .8; facing=ballX>x?1:-1;
      target=clamp(ballX-facing*puppet.offsetWidth*.35/room.clientWidth,.16,.84); throwAt=elapsed; q('toyBall').hidden=false;
      enter('fetch',12); say('你丢，我来捡！等我把小球带回来～');
    } else if (kind === 'call') { target=x>.5?.24:.76; enter('walk',8); say('听到你叫我啦，哒哒哒！'); }
    else if (kind === 'rest') { enter('sleep',3600); say('我先眯一会儿。想我了就摸摸我的头。'); }
    else { enter('cuddle',3.4); affection(); say(['喜欢你摸我的头，嘿嘿～','再蹭一下你的手，好舒服呀。','有你陪我，今天真开心！'][contact%3]); }
    if(paused){
      if(kind==='ball'){q('toyBall').hidden=true;affection();enter('happy');say('小球带回来啦！');}
      else if(kind==='call'){x=target;enter('idle');}
      render(0);
    }
  }
  document.querySelectorAll('[data-companion]').forEach(button => button.addEventListener('click',()=>action(button.dataset.companion)));
  puppet.addEventListener('click',event=>{event.stopPropagation();action('cuddle');});
  room.addEventListener('click',event=>{
    const rect=room.getBoundingClientRect(); if(event.clientY-rect.top<rect.height*.48)return;
    q('toyBall').hidden=true; q('petEffect').textContent=''; target=clamp((event.clientX-rect.left)/rect.width,.2,.8);
    enter('walk',8);say('那里有什么？我去看看。');
    if(paused){x=target;enter('idle');render(0);}
  });
  room.addEventListener('pointermove',event=>{const r=puppet.getBoundingClientRect();look=clamp((event.clientX-r.left-r.width/2)/100,-1,1);});
  room.addEventListener('pointerleave',()=>{look=0;});
  function pauseUI(){q('motionToggle').textContent=paused?'继续动作':'暂停动作';q('motionToggle').setAttribute('aria-pressed',String(paused));document.documentElement.classList.toggle('motion-paused',paused);}
  q('motionToggle').addEventListener('click',()=>{paused=!paused;pauseUI();});
  reduce.addEventListener('change',event=>{paused=event.matches;pauseUI();});pauseUI();
  window.doudouCompanion = {react(next,duration){
    if(next==='running')return action('call');if(next==='playing')return action('ball');if(next==='cuddly')return action('cuddle');
    if(['idle','sleep','sniff','stretch','thinking','listening'].includes(state)) enter(next,(duration||3000)/1000);
  }};
  function pose(sheet, index, flip=1) {
    const key=sheet+index+flip;
    if(key===lastSprite)return;
    sprite.dataset.sheet=sheet; sprite.dataset.frame=String(index);
    sprite.style.backgroundPosition=`${index%4*100/3}% ${Math.floor(index/4)*100}%`;
    sprite.style.transform=`scaleX(${flip})`;lastSprite=key;
  }
  function render(dt) {
    const travelling=['walk','fetch','return'].includes(state);
    if(travelling){
      const delta=target-x; const desired=clamp(delta*4,-.32,.32);
      velocity+=(desired-velocity)*Math.min(1,dt*9); x=clamp(x+velocity*dt,.16,.84);
      if(Math.abs(velocity)>.015)facing=velocity>0?1:-1;
      runPhase+=dt*Math.max(4,Math.abs(velocity)*40);
      if(Math.abs(delta)<.009){
        if(state==='fetch'){velocity=0;enter('pickup',.65);say('找到啦，轻轻叼起来……');}
        else if(state==='return'){velocity=0;enter('drop',.7);say('给你，轻轻放在这里。');}
        else {q('toyBall').hidden=true;enter('sniff',2.2);velocity=0;}
      }
    }
    if(elapsed>until && state!=='idle' && state!=='sleep'){
      if(state==='pickup'){enter('turn',.35);facing=x>.5?-1:1;}
      else if(state==='turn'){target=.5;enter('return',10);say('叼稳啦，这就带给你！');}
      else if(state==='drop'){affection();ballX=x+facing*puppet.offsetWidth*.35/room.clientWidth;throwAt=elapsed-2;enter('happy',2);say('给你！还要再玩一轮吗？');}
      else {q('toyBall').hidden=true;enter('idle',5);}
    }
    if(state==='idle' && elapsed>nextIdle){const pick=Math.random();if(pick<.4){target=.22+Math.random()*.56;enter('walk',8);}else enter('sniff',2.8);}
    if(elapsed>nextBlink){blinkUntil=elapsed+.16;nextBlink=elapsed+2.4+Math.random()*3.5;}
    const sleepy=state==='sleep', cuddly=state==='cuddle', walking=['walk','fetch','return'].includes(state);
    if(walking)pose('run',Math.floor(runPhase)%8,facing);
    else if(['pickup','turn','drop'].includes(state))pose('run',0,facing);
    else if(sleepy)pose('mood',6);
    else if(cuddly)pose('mood',Math.floor(elapsed*1.8)%2?3:2);
    else if(state==='sniff')pose('mood',5,facing);
    else if(state==='happy')pose('mood',7);
    else pose('mood',elapsed<blinkUntil?1:0);
    const breath=paused?0:Math.sin(elapsed*(sleepy?1.8:2.4))*.004;
    const tilt=cuddly&&!paused?Math.sin(elapsed*3.6)*1.5:state==='pickup'?Math.sin(clamp((elapsed-stageAt)/.65,0,1)*Math.PI)*facing*9:0;
    puppet.style.left=`${x*100}%`; q('petShadow').style.left=`${x*100}%`;
    puppet.style.transform=`translateX(-50%) rotate(${tilt}deg) scaleY(${1+breath})`;
    q('petEffect').textContent=cuddly?'♡':sleepy?'z Z':state==='happy'?'♥':'';
    q('petEffect').style.left=`${x*100}%`;q('petEffect').style.transform=`translateY(${Math.sin(elapsed*3)*5}px)`;
    if(!q('toyBall').hidden){
      const size=puppet.offsetWidth, base=parseFloat(getComputedStyle(puppet).bottom)||38;
      const f=walking?Math.floor(runPhase)%8:0;
      const mouthX=[.85,.88,.86,.87,.88,.87,.86,.88][f],mouthY=[.44,.46,.44,.43,.43,.43,.46,.43][f];
      const held=['return','turn','pickup','drop'].includes(state);
      const lift=state==='pickup'?clamp((elapsed-stageAt)/.65,0,1):state==='drop'?1-clamp((elapsed-stageAt)/.7,0,1):1;
      const ground=base+size*.07, mouth=base+size*(1-mouthY);
      q('toyBall').style.left=held?`${x*room.clientWidth+facing*(mouthX-.5)*size}px`:`${ballX*100}%`;
      q('toyBall').style.bottom=`${held?ground+(mouth-ground)*lift:ground+Math.abs(Math.sin((elapsed-throwAt)*6))*Math.max(0,1-(elapsed-throwAt)/1.4)*70}px`;
      q('toyBall').style.transform='translate(-50%,50%)';
    }
  }
  function frame(now){const dt=Math.min((now-last)/1000,.04);last=now;if(!document.hidden&&!paused&&room.getClientRects().length){elapsed+=dt;render(dt);}requestAnimationFrame(frame);}
  enter('idle',5);render(0);requestAnimationFrame(frame);
})();
