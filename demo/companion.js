/* A small articulated SVG puppet: joints are animated independently of travel. */
(() => {
  const zone = document.querySelector('.pet-zone');
  zone.innerHTML = `
    <div class="room-heading"><span>DOUDOU · 一起长大的朋友</span><button id="motionToggle" aria-pressed="false">暂停动作</button></div>
    <div class="bubble" id="mood" aria-live="polite">嗨！摸摸我的头，或者带我玩一会儿吧。</div>
    <div class="pet-room" id="petRoom">
      <div class="room-window"><span>☁</span></div><div class="room-plant">🌱</div>
      <div class="room-rug"></div><div class="pet-bed">豆豆的小窝</div>
      <div class="pet-shadow" id="petShadow"></div>
      <button class="puppet" id="puppet" aria-label="摸摸豆豆，点击或按回车" title="摸摸我的头">
        <svg viewBox="0 0 240 250" aria-hidden="true">
          <defs><linearGradient id="fur" x2="0.7" y2="1"><stop stop-color="#ffd99b"/><stop offset="1" stop-color="#eeb16f"/></linearGradient><linearGradient id="earFur" x2="0.7" y2="1"><stop stop-color="#dda365"/><stop offset="1" stop-color="#b97743"/></linearGradient></defs>
          <g id="rigRoot" stroke="#bc804a" stroke-width="2" stroke-linejoin="round">
            <g id="tail"><path d="M77 177 Q17 166 29 119 Q32 106 43 111 Q57 117 46 135 Q42 151 82 148" fill="url(#fur)"/><path d="M29 123 Q29 105 43 111 Q57 117 46 135" fill="#fff3d9" stroke="none"/></g>
            <g id="backLeft"><path d="M88 179 Q67 184 69 218 Q56 232 82 234 Q96 235 98 221 L109 184" fill="#e6ad70"/></g>
            <g id="backRight"><path d="M153 178 L155 220 Q145 234 169 234 Q183 234 179 221 L179 178" fill="#e6ad70"/></g>
            <g id="torso"><ellipse cx="127" cy="176" rx="56" ry="44" fill="url(#fur)"/><ellipse cx="140" cy="182" rx="34" ry="32" fill="#fff1d8" stroke="none"/></g>
            <g id="frontLeft"><path d="M107 175 Q96 190 103 219 Q89 231 110 237 Q131 242 133 225 L132 178" fill="#fff0d6"/></g>
            <g id="frontRight"><path d="M151 174 L151 219 Q139 232 160 237 Q183 238 181 224 L179 170" fill="#fff0d6"/></g>
            <path d="M87 144 Q129 163 174 142 L167 183 L119 168 Z" fill="#4cadd9" stroke="#3589b1"/><path d="M148 158 l4 8 9 1 -6 6 1 9 -8 -4 -8 4 2 -9 -7 -6 9 -1 Z" fill="#ffda64" stroke="#e7b74e"/>
            <g id="head">
              <g id="earLeft"><path d="M80 57 Q36 55 33 109 Q33 155 57 156 Q85 147 89 91" fill="url(#earFur)"/></g>
              <g id="earRight"><path d="M167 54 Q210 56 219 102 Q230 150 202 152 Q176 143 163 86" fill="url(#earFur)"/></g>
              <path d="M66 91 Q60 47 99 37 Q96 22 118 30 Q132 15 144 34 Q184 38 186 87 L184 121 Q172 155 126 155 Q80 153 67 123 Z" fill="url(#fur)"/>
              <path d="M115 34 Q134 58 128 85 Q146 101 144 126 L107 129 Q101 103 113 81 Q123 58 107 38" fill="#fff5e2" stroke="none"/>
              <g id="eyeWhites"><ellipse cx="97" cy="94" rx="18" ry="22" fill="#fffdf4"/><ellipse cx="157" cy="91" rx="18" ry="22" fill="#fffdf4"/></g>
              <g id="eyes"><g id="pupils" fill="#412c24" stroke="none"><ellipse cx="100" cy="97" rx="12" ry="16"/><ellipse cx="154" cy="94" rx="12" ry="16"/><circle cx="96" cy="91" r="5" fill="white"/><circle cx="150" cy="88" r="5" fill="white"/></g></g>
              <g id="closedEyes" fill="none" stroke="#674129" stroke-width="4" stroke-linecap="round" opacity="0"><path d="M84 98 Q96 86 109 98 M144 95 Q155 83 169 95"/></g>
              <ellipse cx="111" cy="126" rx="26" ry="21" fill="#fff5e2" stroke="none"/><ellipse cx="147" cy="125" rx="26" ry="21" fill="#fff5e2" stroke="none"/>
              <path d="M117 113 Q128 107 140 113 Q139 125 128 126 Q119 122 117 113" fill="#513329" stroke="#513329"/><ellipse cx="128" cy="113" rx="6" ry="2" fill="#fff" opacity=".6" stroke="none"/>
              <path d="M128 127 Q128 143 111 134 M128 127 Q131 143 148 132" fill="none" stroke="#674129" stroke-width="2.5" stroke-linecap="round"/>
              <path id="tongue" d="M125 139 Q141 136 139 147 Q130 159 125 147 Z" fill="#ed8d95" stroke="#ce6d79"/>
              <g id="blush" opacity="0" fill="#e99a8d" stroke="none"><ellipse cx="85" cy="121" rx="9" ry="5"/><ellipse cx="169" cy="117" rx="9" ry="5"/></g>
            </g>
          </g>
        </svg>
      </button>
      <div id="toyBall" class="toy-ball" hidden></div><div id="petEffect" class="pet-effect" aria-hidden="true"></div>
      <span class="floor-hint">点地板，豆豆会走过去 · 点豆豆，摸摸头</span>
    </div>
    <div class="companion-status"><b>豆豆 <span id="petActivity">在陪你</span></b><span id="bondText">今天还没一起玩</span></div>
    <div class="companion-actions"><button data-companion="call">🐾 过来呀</button><button data-companion="cuddle">♡ 摸摸头</button><button data-companion="ball">◉ 丢小球</button><button data-companion="rest">☾ 睡一会</button></div>
    <small class="care-note">随时都能陪豆豆玩，慢慢学也没关系。</small>`;

  const q = id => document.getElementById(id);
  const room = q('petRoom'), puppet = q('puppet');
  const jointNames = ['rigRoot','head','tail','earLeft','earRight','backLeft','backRight','frontLeft','frontRight','eyeWhites','eyes','closedEyes','pupils','tongue','blush'];
  const joints = Object.fromEntries(jointNames.map(id => [id,q(id)]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduce.matches, state = 'idle', x = .5, target = .5, velocity = 0, until = 0, nextIdle = 0;
  let nextBlink = 2, blinkUntil = 0, last = 0, elapsed = 0, look = 0, contact = 0, ballX = .72, throwAt = 0;
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const names = {idle:'在陪你',walk:'散步中',fetch:'追小球',return:'把球叼回来',cuddle:'被摸得好舒服',sleep:'睡得香香的',happy:'好开心',thinking:'歪头想一想',listening:'认真听你说',sniff:'闻闻新发现',stretch:'伸个懒腰',worried:'再试试就好'};
  function say(text) { q('mood').textContent = text; }
  function enter(next, seconds = 3) {
    state = next; until = elapsed + seconds; nextIdle = until + 5 + Math.random()*5;
    q('petActivity').textContent = names[next] || names.idle;
    room.dataset.state = next;
  }
  function affection() { contact++; q('bondText').textContent = `一起互动了 ${contact} 次 ♡`; }
  function action(kind) {
    q('toyBall').hidden = true; target=x; velocity=0; q('petEffect').textContent='';
    if (kind === 'ball') {
      ballX = x > .5 ? .19 : .81; target=ballX; throwAt=elapsed; q('toyBall').hidden=false;
      enter('fetch',12); say('你丢，我来捡！等我把小球带回来～');
    } else if (kind === 'call') { target=x>.5?.24:.76; enter('walk',8); say('听到你叫我啦，哒哒哒！'); }
    else if (kind === 'rest') { enter('sleep',3600); say('我先眯一会儿。想我了就摸摸我的头。'); }
    else { enter('cuddle',3.4); affection(); say(['喜欢你摸我的头，嘿嘿～','再蹭一下你的手，好舒服呀。','有你陪我，今天真开心！'][contact%3]); }
  }
  document.querySelectorAll('[data-companion]').forEach(button => button.addEventListener('click',()=>action(button.dataset.companion)));
  puppet.addEventListener('click',event=>{event.stopPropagation();action('cuddle');});
  room.addEventListener('click',event=>{
    const rect=room.getBoundingClientRect(); if(event.clientY-rect.top<rect.height*.48)return;
    q('toyBall').hidden=true; q('petEffect').textContent=''; target=clamp((event.clientX-rect.left)/rect.width,.19,.81);
    enter('walk',8);say('那里有什么？我去看看。');
  });
  room.addEventListener('pointermove',event=>{const r=puppet.getBoundingClientRect();look=clamp((event.clientX-r.left-r.width/2)/100,-1,1);});
  room.addEventListener('pointerleave',()=>{look=0;});
  function pauseUI(){q('motionToggle').textContent=paused?'继续动作':'暂停动作';q('motionToggle').setAttribute('aria-pressed',String(paused));}
  q('motionToggle').addEventListener('click',()=>{paused=!paused;pauseUI();});
  reduce.addEventListener('change',event=>{paused=event.matches;pauseUI();});pauseUI();
  window.doudouCompanion = {react(next,duration){
    if(next==='running')return action('call');if(next==='playing')return action('ball');if(next==='cuddly')return action('cuddle');
    if(['idle','sleep','sniff','stretch','thinking','listening'].includes(state)) enter(next,(duration||3000)/1000);
  }};
  function transform(id,value){joints[id].setAttribute('transform',value);}
  function render(dt) {
    const travelling=['walk','fetch','return'].includes(state);
    if(travelling){
      const delta=target-x; const desired=clamp(delta*4,-.32,.32);
      velocity+=(desired-velocity)*Math.min(1,dt*9); x=clamp(x+velocity*dt,.18,.82);
      if(Math.abs(delta)<.009){
        if(state==='fetch'){target=.5;enter('return',10);say('捡到啦！这就带给你。');}
        else {if(state==='return'){affection();say('给你！还要再玩一轮吗？');}q('toyBall').hidden=true;enter(state==='return'?'happy':'sniff',2.2);velocity=0;}
      }
    }
    if(elapsed>until && state!=='idle' && state!=='sleep'){enter('idle',5);}
    if(state==='idle' && elapsed>nextIdle){const pick=Math.random();if(pick<.4){target=.22+Math.random()*.56;enter('walk',8);}else enter(pick<.72?'sniff':'stretch',2.8);}
    if(elapsed>nextBlink){blinkUntil=elapsed+.16;nextBlink=elapsed+2.4+Math.random()*3.5;}
    const gait=Math.sin(elapsed*17), speed=clamp(Math.abs(velocity)*8,0,1), sleepy=state==='sleep', cuddly=state==='cuddle';
    const breathe=Math.sin(elapsed*2.5), hop=state==='happy'?Math.max(0,Math.sin(elapsed*7))*16:0;
    puppet.style.left=`${x*100}%`; q('petShadow').style.left=`${x*100}%`;
    transform('rigRoot',`translate(0 ${sleepy?40:-Math.abs(gait)*4*speed-hop}) translate(120 222) scale(1 ${sleepy?.78:1+breathe*.008}) translate(-120 -222)`);
    for(const [id,phase,px] of [['backLeft',1,88],['backRight',-1,167],['frontLeft',-1,118],['frontRight',1,163]]){
      const angle=sleepy?(phase*20):gait*phase*24*speed+(state==='stretch'&&id.startsWith('front')?-22:0);
      transform(id,`rotate(${angle} ${px} 180)`);
    }
    const tilt=cuddly?Math.sin(elapsed*5)*9:state==='thinking'?12:state==='sniff'?9+Math.sin(elapsed*5)*3:look*5+breathe*1.2;
    transform('head',`translate(${cuddly?Math.sin(elapsed*4)*4:0} ${state==='sniff'?12:0}) rotate(${sleepy?12:tilt} 128 146)`);
    transform('earLeft',`rotate(${gait*speed*12+Math.sin(elapsed*3)*2-(cuddly?8:0)} 75 67)`);
    transform('earRight',`rotate(${-gait*speed*12-Math.sin(elapsed*3+.5)*2+(cuddly?8:0)} 174 65)`);
    transform('tail',`rotate(${sleepy?-16:Math.sin(elapsed*(cuddly||state==='happy'?19:8))*(cuddly?22:13)} 75 164)`);
    const shut=sleepy||cuddly||elapsed<blinkUntil;
    joints.eyeWhites.setAttribute('opacity',shut?'0':'1');joints.eyes.setAttribute('opacity',shut?'0':'1');joints.closedEyes.setAttribute('opacity',shut?'1':'0');
    transform('pupils',`translate(${look*3} 0)`);joints.blush.setAttribute('opacity',cuddly?'.65':'0');
    joints.tongue.setAttribute('opacity',sleepy||state==='thinking'?'0':'1');
    q('petEffect').textContent=cuddly?'♡':sleepy?'z Z':state==='happy'?'♥':'';
    q('petEffect').style.left=`${x*100}%`;q('petEffect').style.transform=`translateY(${Math.sin(elapsed*3)*5}px)`;
    if(!q('toyBall').hidden){const held=state==='return';q('toyBall').style.left=`${(held?x+.04:ballX)*100}%`;q('toyBall').style.bottom=`${held?95:47+Math.abs(Math.sin((elapsed-throwAt)*6))*Math.max(0,1-(elapsed-throwAt)/1.4)*70}px`;}
  }
  function frame(now){const dt=Math.min((now-last)/1000,.04);last=now;if(!document.hidden&&!paused){elapsed+=dt;render(dt);}else if(paused){x=target;render(0);}requestAnimationFrame(frame);}
  enter('idle',5);render(0);requestAnimationFrame(frame);
})();
