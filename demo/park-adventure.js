/* Session-only story -> explanation -> experiment -> transfer -> home memory.
   Free text is never graded by keywords, stored, or sent over the network. */
(() => {
  const q=s=>document.querySelector(s), bridge=window.pachaParkBridge;
  let explanation='', follow='', cargo=0, prediction='', lastCargo=-1;
  let seenFloat=false, seenSink=false, recovered=false, ready=false, complete=false;
  const toyItems=[];
  const quest=q('#quest-water');
  const boat=document.createElement('section');boat.dataset.panel='boat';boat.hidden=true;boat.className='park-play';
  boat.innerHTML=`<span class="eyebrow">帕恰的装船挑战</span><h2 tabindex="-1">把玩具带去野餐吧！</h2><p>帕恰：我听到你的想法啦。我们试试，玩具装多了，小船会怎样？</p>
    <div id="parkBoatDiagram"></div><div class="park-cargo" aria-label="装船玩具"><button id="parkLess" aria-label="拿下一件玩具">−</button><strong id="parkCargo" aria-live="polite"></strong><button id="parkMore" aria-label="装上一件玩具">＋</button></div>
    <fieldset class="park-predict"><legend>放进水里以前，先猜一猜</legend><label><input type="radio" name="parkGuess" value="float">还能浮着</label><label><input type="radio" name="parkGuess" value="sink">可能进水下沉</label></fieldset>
    <button class="primary" id="parkLaunch">放进水里！</button><p id="parkResult" role="status">先装几件玩具，再猜猜结果。猜错也没关系。</p>
    <ul id="parkChecks" class="park-checks"></ul><button id="parkFollow" class="primary" disabled>听听帕恰的新问题 →</button>
    <button data-phase="learn" data-lesson="water">需要线索，一起找答案</button>
    <details><summary>给陪伴者：这是玩具船简化模型</summary><p>空船20克，每件玩具15克；固定最大排水量120克。小于120克时可静浮，达到或超过时视作可能进水下沉。忽略倾覆与波浪，不用于真实乘船安全判断。示意图不按比例。</p></details>`;
  boat.querySelector('#parkBoatDiagram').innerHTML=`<div class="park-lake" aria-label="帕恰陪你给玩具船装货"><span class="pacha-avatar lake-pacha" aria-hidden="true"></span><div class="lake-boat-position" id="parkBoatPosition"><div class="lake-boat"><img src="../assets/pets/park-toy-boat-v1.png" alt="蓝色星星玩具船"><div id="parkToyIcons" class="lake-toys" aria-label="船上的玩具"></div></div></div><span id="parkLakeCaption" class="lake-caption">选一件喜欢的玩具，装上船吧</span></div><div class="park-toy-tray" aria-label="挑选玩具"><button data-load-toy="🧸" aria-label="装一只小熊">🧸<small>小熊</small></button><button data-load-toy="⚽" aria-label="装一个皮球">⚽<small>皮球</small></button><button data-load-toy="🧩" aria-label="装一块积木">🧩<small>积木</small></button><button data-load-toy="🪀" aria-label="装一个悠悠球">🪀<small>悠悠球</small></button></div><small>每件玩具在这个游戏里都按15克计算。</small>`;quest.append(boat);
  const followPanel=document.createElement('section');followPanel.dataset.panel='follow';followPanel.hidden=true;followPanel.className='park-play';
  followPanel.innerHTML=`<div class="pacha-dialogue"><span class="pacha-avatar" aria-hidden="true"></span><div><small>帕恰又有一个想法</small><h2 tabindex="-1">船是空心的，就能一直装玩具吗？</h2><p>刚才你让小船重新浮起来了。如果我再塞满玩具，你会怎么提醒我？为什么？</p></div></div><p id="parkEvidence"></p><form id="parkFollowForm"><label for="parkFollowWords">用自己的话告诉帕恰</label><textarea id="parkFollowWords" required maxlength="800" rows="3" placeholder="我会提醒你……因为刚才我看到……"></textarea><button class="primary">讲给帕恰听</button><button type="button" data-phase="boat" data-lesson="water">再玩一次找线索</button></form><p>帕恰的追问是预设故事对话；尚未接入 AI，由陪伴者确认解释。</p>`;
  quest.append(followPanel);
  const nav=quest.querySelector('.quest-steps');
  for(const [phase,label] of [['boat','装船挑战'],['follow','帕恰追问']]){const b=document.createElement('button');b.dataset.phase=phase;b.dataset.lesson='water';b.disabled=true;b.textContent=label;nav.append(b);}
  // Keep optional resources optional, and return to the original question.
  q('#waterLearnStatus').textContent='需要哪条线索就看哪条；随时可以回来讲自己的想法。';
  q('#quest-water .learn-heading p').textContent='先看一看、试一试，再回去帮帕恰解答。小关卡可按顺序探索，也可以随时返回。';
  const adultLabels=q('#review-water fieldset').querySelectorAll('label');
  ['能解释：钢珠也被水往上托，但不足以托住它；空心船能排开更多水来托住自己。','能联系装船观察，解释装得太多会有进水下沉的风险。','能用自己的话提醒帕恰少装一些，不只是重复一句“空心就会浮”。'].forEach((t,i)=>adultLabels[i].lastChild.textContent=' '+t);
  const toy=document.createElement('section');toy.id='parkMemory';toy.hidden=true;toy.className='park-memory';
  toy.innerHTML=`<span class="eyebrow">我们的小发现 · 游船公园</span><h2>帕恰记住你的提醒啦</h2><div class="pacha-dialogue"><span class="pacha-avatar" aria-hidden="true"></span><p id="parkHomeSpeech">“这是我们带回来的玩具船！我来装玩具给你看。”</p></div><div class="park-home-toys" aria-label="帕恰的玩具船"><span>🛶</span><span id="parkHomeCargo">🧸 ⚽ 🧩 🪀 🧸 ⚽ 🧩</span></div><button id="parkHomeDemo" class="primary">看看帕恰怎么装玩具</button><details><summary>我们一起说过的话（仅本次试玩）</summary><p id="parkMemoryWords"></p></details>`;
  q('#view-home .home-inventory').after(toy);
  function draw(){
    q('#parkCargo').textContent=`${cargo} 件玩具 · 船和玩具共 ${20+cargo*15} 克`;
    q('#parkLess').disabled=cargo===0;q('#parkMore').disabled=cargo===9;
    q('#parkToyIcons').replaceChildren(...toyItems.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
    q('#parkLakeCaption').textContent='装好后，先猜一猜';
    q('#parkBoatPosition').style.transform='translateY(0)';
    boat.querySelectorAll('[data-load-toy]').forEach(b=>b.disabled=cargo===9);
  }
  function checks(){
    q('#parkChecks').replaceChildren(...[[seenFloat,'观察小船浮着'],[seenSink,'观察装得太多'],[recovered,'拿下一些玩具，让小船重新浮起来']].map(([done,t])=>{const li=document.createElement('li');li.textContent=(done?'✓ ':'○ ')+t;return li;}));
    q('#parkFollow').disabled=!(seenFloat&&seenSink&&recovered);
  }
  function change(n,icon='🧸'){if(n>0&&cargo<9)toyItems.push(icon);else if(n<0&&cargo>0)toyItems.pop();cargo=toyItems.length;prediction='';q('#parkLaunch').disabled=false;boat.querySelectorAll('input').forEach(i=>i.checked=false);q('#parkResult').textContent='条件变了，再猜一次，看看会发生什么。';draw();}
  boat.querySelectorAll('[data-load-toy]').forEach(b=>b.onclick=()=>change(1,b.dataset.loadToy));
  q('#parkLess').onclick=()=>change(-1);q('#parkMore').onclick=()=>change(1);
  boat.querySelectorAll('input').forEach(i=>i.onchange=()=>prediction=i.value);
  q('#parkLaunch').onclick=()=>{
    if(!prediction){q('#parkResult').textContent='先选一个猜想吧，猜错也是发现！';return;}
    const floats=20+cargo*15<120;
    if(floats){seenFloat=true;if(seenSink)recovered=true;}else seenSink=true;
    lastCargo=cargo;
    q('#parkBoatPosition').style.transform=`translateY(${floats?cargo*3:95}px) rotate(${floats?0:8}deg)`;
    q('#parkLakeCaption').textContent=floats?'浮起来啦！水托住了小船和玩具':'太重啦！拿下一些玩具再试试';
    q('#parkResult').textContent=`${prediction===(floats?'float':'sink')?'和你的猜想一样！':'结果不一样，也是一条新线索！'} ${cargo}件玩具：${floats?'小船浮着。试着再多装一些。':'超过这艘模型船的承载限度了。拿下一些玩具，再试一次。'}`;
    q('#parkLaunch').disabled=true;checks();
  };
  q('#parkFollow').onclick=()=>{q('#parkEvidence').textContent=`我们的发现：装太多时可能下沉，拿下一些后又浮起来了。最近一次装了${lastCargo}件。`;bridge.phase('follow');};
  document.addEventListener('pacha:park-explanation',e=>{explanation=e.detail;ready=false;bridge.phase('boat');});
  q('#parkFollowForm').onsubmit=e=>{e.preventDefault();follow=q('#parkFollowWords').value.trim();if(!follow||!recovered)return;ready=true;bridge.review(`${explanation}\n\n帕恰的追问：船是空心的，就能一直装玩具吗？\n我的提醒：${follow}`);};
  q('#parkFollowWords').oninput=()=>{ready=false;q('#review-water').hidden=true;};
  document.addEventListener('pacha:park-complete',()=>{complete=true;toy.hidden=false;q('#parkMemoryWords').textContent=explanation+'\n我的提醒：'+follow;});
  let homeStep=0;
  q('#parkHomeDemo').onclick=()=>{
    homeStep=(homeStep+1)%3;
    q('#parkHomeCargo').textContent=homeStep===2?'🧸 ⚽ 🧩':'🧸 ⚽ 🧩 🪀 🧸 ⚽ 🧩';
    q('#parkHomeCargo').classList.toggle('unloaded',homeStep===2);
    q('#parkHomeSpeech').textContent=homeStep===1?'“等等！你提醒过我，空心船也不能一直装。玩具太多，会有下沉的危险！”':homeStep===2?'“我拿下四件，留下三件。先看看船能不能稳稳浮着，再出发！谢谢你教我。”':'“这是我们带回来的玩具船！我来装玩具给你看。”';
    q('#parkHomeDemo').textContent=homeStep===1?'看看她怎么做':homeStep===2?'再看一次':'看看帕恰怎么装玩具';
    window.doudouCompanion.react(homeStep===2?'happy':'curious',2500);
  };
  window.pachaParkAdventure={canBoat:()=>!!explanation.trim(),canFollow:()=>!!explanation.trim()&&seenFloat&&seenSink&&recovered,canReward:()=>ready&&recovered&&!complete};
  draw();checks();
})();
