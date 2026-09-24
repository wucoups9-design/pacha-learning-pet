/* Session-only prototype. Manual adult review, not keyword or fake LLM grading.
 * No network requests, no stored child answers, no credentials in the browser.
 */
(() => {
  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];
  const state = {view:'home', active:'water', bag:{food:2,snack:1,toy:0}, lessons:{
    water:{phase:'story',discovered:false,learned:false,submitted:false,completed:false,answer:''},
    garden:{phase:'story',discovered:false,learned:false,submitted:false,completed:false,answer:''}
  }};
  const titles = {water:'游船公园',garden:'帕恰的小花园'};
  const questions = {water:'为什么钢珠会沉下去，船却能浮起来？',garden:'小植物一直在喝水，为什么躲在黑暗里还是长不好？'};
  const rewards = {water:{food:3,snack:2,toy:0},garden:{food:2,snack:1,toy:1}};
  const items = {food:{icon:'🥣',name:'狗粮',desc:'冒险回来，吃一顿香香的饭。',action:'回家喂一份'},snack:{icon:'🍪',name:'小鱼饼',desc:'送给帕恰的小惊喜。',action:'回家喂一块'},toy:{icon:'🎾',name:'探险网球',desc:'花园冒险的纪念品，可以反复玩。',action:'回家一起玩'}};
  let toastTimer, clip=0, playRequest=0;
  function tell(text){q('#toast').textContent=text;q('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>q('#toast').hidden=true,3500);}
  function pet(text, reaction='happy'){window.doudouCompanion.react(reaction,3000);q('#mood').textContent=text;}
  function go(name){
    if(!['home','map','bag','adventure'].includes(name))return;
    if(name!=='adventure'){++playRequest;q('#parkFilm').pause();}
    state.view=name;
    qa('.game-view').forEach(el=>el.hidden=el.id!==`view-${name}`);
    qa('.game-dock button').forEach(b=>b.dataset.go===(name==='adventure'?'map':name)?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));
    q(`#view-${name} h1`).focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
  }
  function renderInventory(){
    q('#bagCount').textContent=`背包 · ${state.bag.food+state.bag.snack+state.bag.toy}`;
    qa('[data-count]').forEach(b=>b.textContent=state.bag[b.dataset.count]);
    qa('.home-inventory [data-use]').forEach(b=>b.disabled=!state.bag[b.dataset.use]);
    q('#inventory').replaceChildren();
    Object.entries(items).forEach(([key,item])=>{
      const card=document.createElement('article');card.className='item-card';
      card.innerHTML=`<span aria-hidden="true">${item.icon}</span><h2>${item.name} <small>× ${state.bag[key]}</small></h2><p>${item.desc}</p><button data-use="${key}" ${state.bag[key]?'':'disabled'}>${state.bag[key]?item.action:(key==='toy'?'花园完成后获得':'去冒险，收集更多')}</button>`;
      q('#inventory').append(card);
    });
    const done=Object.values(state.lessons).filter(x=>x.completed).length;
    q('#mapProgress').textContent=`已探索 ${done} / 2`;
    const garden=q('[data-adventure="garden"]');garden.disabled=!state.lessons.water.completed;
    garden.querySelector('b').textContent=state.lessons.garden.completed?'再去玩玩 →':state.lessons.water.completed?'新地图，出发 →':'🔒 尚未开启';
    garden.querySelector('span:not([class])').textContent=state.lessons.water.completed?'小植物也需要“吃饭”吗？':'教完公园里的发现后解锁';
    q('[data-adventure="water"] b').textContent=state.lessons.water.completed?'已完成 · 再去玩玩 →':'出发探索 →';
    q('#view-home .small-tag').textContent=done===2?'帕恰 · 探索搭档':done===1?'帕恰 · 小小船长':'帕恰 · 好奇宝宝';
    if(done){q('.outing-note h2').textContent=done===1?'新地图亮起来啦！':'今天也有新发现';q('.outing-note p').textContent=done===1?'帕恰想去小花园看看，把刚学会的秘密带上吧。':'两处冒险都留下了我们的脚印。随时回去玩，也可以在家陪帕恰。';}
  }
  function useItem(key){
    if(!items[key]||state.bag[key]<1){tell('背包里暂时没有啦。摸摸头和基础小球随时都能玩。');return;}
    if(key!=='toy')state.bag[key]--;
    go('home');renderInventory();
    if(key==='toy'){pet('探险网球！这是我们一起找到的宝贝。你丢，我来捡～','playing');}
    else{pet(key==='food'?'开饭啦！谢谢你照顾我，吃饱了还想和你一起玩。':'咔嚓！小鱼饼真香。和你一起冒险真开心！');}
    tell(key==='toy'?'探险网球不会消耗，可以反复玩。':`${items[key].name} −1 · 帕恰收到啦`);
  }
  const phaseNames={story:'一起玩',question:'新发现',learn:'找答案',teach:'教帕恰'};
  function phaseNav(id){return `<nav class="quest-steps" aria-label="冒险进度">${Object.entries(phaseNames).map(([key,label],i)=>`<button data-phase="${key}" data-lesson="${id}" ${key==='story'?'aria-current="step"':'disabled'}><span>${i+1}</span>${label}</button>`).join('')}</nav>`;}
  function questionPanel(id){return `<section data-panel="question" hidden><div class="pacha-dialogue"><span class="pacha-avatar" aria-hidden="true"></span><div><small>帕恰的新发现</small><h2>${questions[id]}</h2><p>你愿意当我的小老师吗？先说说你的想法也可以。</p></div></div><div class="choice-row"><button class="primary" data-phase="teach" data-lesson="${id}">我先试着解释</button><button data-phase="learn" data-lesson="${id}">还不会，一起找答案</button></div><p class="reward-preview">这次的宝藏：${id==='water'?'🥣 狗粮 ×3　🍪 小鱼饼 ×2　🌱 新地图':'🥣 狗粮 ×2　🍪 小鱼饼 ×1　🎾 探险网球'}</p></section>`;}
  function teachPanel(id){return `<section data-panel="teach" hidden><div class="pacha-dialogue"><span class="pacha-avatar" aria-hidden="true"></span><div><small>帕恰正竖起耳朵听</small><h2>${questions[id]}</h2><p>${id==='water'?'如果我再往船里加很多东西，会发生什么呢？':'那是不是水浇得越多，植物就长得越好呢？'}</p></div></div><form class="teach-form" data-teach="${id}"><label for="answer-${id}">用自己的话教帕恰，不用背标准答案</label><textarea id="answer-${id}" required maxlength="1500" rows="4" placeholder="我观察到……我觉得这是因为……如果……"></textarea><small>可以用设备键盘的语音输入。不填写姓名、学校等个人信息。</small><div class="choice-row"><button class="primary" type="submit">讲给帕恰听</button><button type="button" data-phase="learn" data-lesson="${id}">还没想清楚，去探索</button></div></form><p id="reply-${id}" class="reply" role="status" hidden></p><section class="review-panel" id="review-${id}" hidden><h3>请陪伴的大人听一听</h3><p>DeepSeek 尚未接入。这是人工确认的试玩，不会自动判断解释是否正确；输入几个关键词不能自动领奖。</p><blockquote id="echo-${id}"></blockquote><form data-review="${id}"><fieldset><legend>孩子能用自己的例子说明下面的意思吗？</legend>${(id==='water'?['钢珠也受到浮力，但不足以托住它的重量。','空心船能排开足够多的水，让浮力托住船和货物。','装得太多或船舱进水，船也可能沉。']:['绿色植物需要光，才能利用水和空气中的二氧化碳制造养分。','需要适量的水，积水太多可能使根部缺氧。','能联系刚才的观察，说出一种合理的照顾方法。']).map(t=>`<label><input type="checkbox" required> ${t}</label>`).join('')}</fieldset><button type="submit" class="primary">陪伴者确认，领取试玩奖励</button><button type="button" data-revise="${id}">再补充一点</button></form></section><p class="completion-note" id="done-${id}" hidden>✓ 这次冒险已经领过奖励，可以继续复习，不会重复发放。</p></section>`;}
  q('#adventureContent').innerHTML=`
    <article id="quest-water" class="quest">${phaseNav('water')}
      <section data-panel="story"><div class="film-stage"><video id="parkFilm" controls playsinline preload="metadata" poster="../assets/video/pacha-park-poster-v2.jpg" aria-label="帕恰的公园游船，原声字幕版"><source src="../assets/video/pacha-park-story-v2.mp4" type="video/mp4"></video></div><div class="film-caption"><span>20 秒的小冒险 · 原声与字幕保留</span><button id="replayFilm">有声播放 / 重播</button></div><p id="filmStatus" role="status" hidden></p><details><summary>阅读故事 / 视频打不开？</summary><p>和帕恰到公园坐船。帕恰把一颗钢珠放进船内的透明观察水箱，钢珠沉到箱底，但船还浮在湖面上。她歪歪头：“都是钢铁，为什么会不一样？”</p><small>AI 故事画面，钢制船是故事设定，不是材料鉴定。实验在观察水箱内，不向湖里丢东西。</small></details><button class="primary story-next" data-discover="water">我看到啦，听听帕恰的问题 →</button></section>
      ${questionPanel('water')}
      <section data-panel="learn" hidden><div class="learn-heading"><h2>找一条线索，就离答案近一点</h2><p>选一种方式探索，再把发现讲给帕恰。</p></div><div class="resource-tabs" role="group" aria-label="探索方式"><button data-resource="model" aria-pressed="true">🛶 小船实验室</button><button data-resource="reading" aria-pressed="false">📖 图解小秘密</button><button data-resource="real" aria-pressed="false">👐 动手试一试</button></div>
      <div id="resource-model" class="resource"><h3>给小船装货，猜猜能装多少？</h3><p>先猜一猜，再调整船宽和货物。看看船是浮着，还是装得太多。</p>
      <svg id="boatDiagram" class="boat-diagram" viewBox="0 0 520 240" role="img" aria-labelledby="boatTitle boatDesc"><title id="boatTitle">小船承载的理想模型</title><desc id="boatDesc">蓝色表示水，U形表示空心船，方块表示货物。调整变量再运行，观察吃水变化。</desc><path d="M0 92H520V240H0Z" fill="#a4d9e5"/><path d="M0 92H520" stroke="#328294" stroke-width="2"/><text x="16" y="80">水面</text><g id="modelHull"><path d="M140 37L160 117H360L380 37" fill="#fffef7" stroke="#557987" stroke-width="6"/><rect id="modelCargo" x="235" y="75" width="50" height="36" rx="3" fill="#e6a946"/></g><text id="modelCaption" x="260" y="213" text-anchor="middle">先预测，再点“放进水里”</text></svg>
      <div class="model-controls"><label>船宽 <output id="widthLabel">6 cm</output><input id="boatWidth" type="range" min="35" max="90" value="60" aria-label="船宽，单位0.1厘米"></label><label>货物 <output id="cargoLabel">45 g</output><input id="boatCargo" type="range" min="0" max="10" value="3" aria-label="货物份数，每份15克"></label></div><button id="runModel" class="primary">放进水里，观察！</button><p id="modelResult" role="status" class="observation">试试改变一个条件，再比较两次结果。</p><details><summary>这是简化模型，不是真实船只安全标准</summary><p>船长 10 cm、深 2 cm、空船质量固定 20 g，每份货物 15 g，淡水密度 1 g/cm³。船宽为滑块数值的十分之一。忽略倾覆、船壁厚度与变形；总质量达到最大排水量时视为开始进水。图形不按比例。</p></details></div>
      <div id="resource-reading" class="resource" hidden><h3 id="clueTitle"></h3><p id="clueText"></p><div class="clue-scale" aria-hidden="true"><span>物体的重量 ↓</span><span>↑ 水的浮力</span></div><div class="choice-row"><button id="cluePrev">上一条</button><span id="clueCount"></span><button id="clueNext">下一条</button></div><button id="readComplete" class="primary" hidden>带着这三条线索，回去教帕恰</button></div>
      <div id="resource-real" class="resource" hidden><h3>同一张铝箔，变个形状</h3><ol><li>请大人准备一张铝箔和一盆浅水，捏成开口向上的小船，轻轻放入水中。</li><li>取出同一张铝箔，擦干、尽量压紧成小团，再放入水中，比较观察。</li><li>小团也浮着？如实记录，可能仍有空气或受到水面张力影响。不要为得到“正确答案”改记录。</li></ol><p class="safety">请大人陪同，远离电器；注意铝箔边缘，不吞咽材料，不让宠物靠近水盆。不用钢珠。</p><form id="realTrial"><label for="prediction">实验前，我猜……</label><select id="prediction" required><option value="">先选一个预测</option><option>船浮、小团沉</option><option>两个都浮</option><option>两个都沉</option></select><label for="observed">实验后，我看到……</label><select id="observed" required><option value="">记录真实结果</option><option>船浮、小团沉</option><option>两个都浮</option><option>两个都沉</option><option>其他结果</option></select><button type="submit">把观察记下来</button><p id="trialReply" role="status"></p></form></div>
      <div class="lesson-return"><span id="waterLearnStatus">选一种方式探索就好，不用全做。</span><button class="primary" data-phase="teach" data-lesson="water">带着发现去教帕恰 →</button></div></section>
      ${teachPanel('water')}
    </article>
    <article id="quest-garden" class="quest" hidden>${phaseNav('garden')}
      <section data-panel="story"><div class="garden-story"><span class="garden-emoji" aria-hidden="true">🌱</span><div><span class="eyebrow">花园里的小意外</span><h2>帕恰把花盆藏进了柜子</h2><p>“这里暖暖的，我每天还会给它浇水！”<br>过了几天，小植物却越来越没精神。</p><button class="primary" data-discover="garden">和帕恰看看，哪里不对劲？</button></div></div><small>文字互动故事 · 生长变化发生在多天内，不是一瞬间。</small></section>
      ${questionPanel('garden')}
      <section data-panel="learn" hidden><div class="learn-heading"><h2>一起安排花盆的新家</h2><p>绿色植物借助光，利用水和空气中的二氧化碳制造养分。根也需要呼吸，不能一直泡在积水里。</p></div><div class="garden-lab"><span id="plantIcon" class="garden-emoji" aria-hidden="true">🪴</span><form id="gardenTrial"><fieldset><legend>把花盆放在哪里？</legend><label><input type="radio" name="light" value="bright" required>有合适光照的窗边</label><label><input type="radio" name="light" value="dark">关上门的暗柜里</label></fieldset><fieldset><legend>怎样浇水？</legend><label><input type="radio" name="water" value="enough" required>根据土壤情况适量浇水，有排水孔</label><label><input type="radio" name="water" value="flood">盆里一直有很多积水</label></fieldset><button class="primary" type="submit">看看这样的照顾会怎样</button></form></div><p id="gardenObservation" class="observation" role="status">这是条件推演，不是实时植物实验。真实生长需要连续多天观察，不同植物需求也不同。</p><details><summary>在家观察：两盆相似的绿植</summary><p>请大人选适合的植物，一盆放在合适光照处，另一盆短期放在较暗处，其他条件尽量相同。连续记录几天的颜色和生长情况，植物出现不适及时恢复正常养护。不要通过过量浇水伤害植物。</p></details><div class="lesson-return"><span id="gardenLearnStatus">试试不同条件，结果不理想也算新发现。</span><button class="primary" data-phase="teach" data-lesson="garden">把发现讲给帕恰 →</button></div></section>
      ${teachPanel('garden')}
    </article>`;
  const film=q('#parkFilm');film.muted=false;
  function setPhase(id,phase){
    const lesson=state.lessons[id];
    if(!phaseNames[phase]||(!lesson.discovered&&phase!=='story'))return;
    lesson.phase=phase;
    if(phase!=='story'){++playRequest;film.pause();}
    qa(`#quest-${id} [data-panel]`).forEach(p=>p.hidden=p.dataset.panel!==phase);
    qa(`#quest-${id} .quest-steps button`).forEach(b=>{b.disabled=!lesson.discovered&&b.dataset.phase!=='story';if(b.dataset.phase===phase)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    q('#adventureTitle').textContent=phase==='story'?'和帕恰一起玩':phase==='question'?'咦，怎么会这样？':phase==='learn'?'一起寻找小秘密':'轮到你当小老师啦';
    if(phase==='teach'){q(`#review-${id}`).hidden=!lesson.submitted||lesson.completed;q(`#done-${id}`).hidden=!lesson.completed;}
    window.scrollTo({top:0,behavior:'instant'});
  }
  async function playFilm(){
    const request=++playRequest;q('#filmStatus').hidden=true;
    try{await film.play();if(request!==playRequest)film.pause();}catch{if(request!==playRequest)return;q('#filmStatus').hidden=false;q('#filmStatus').textContent=film.error?'视频暂时打不开，可以读文字故事继续。':'点一下“有声播放 / 重播”就能听到声音。';}
  }
  function enterAdventure(id){
    if(!state.lessons[id]||(id==='garden'&&!state.lessons.water.completed))return;
    ++playRequest;film.pause();state.active=id;
    qa('.quest').forEach(el=>el.hidden=el.id!==`quest-${id}`);
    q('#locationLabel').textContent=titles[id];go('adventure');setPhase(id,state.lessons[id].phase);
    if(id==='water'&&state.lessons.water.phase==='story')playFilm();
  }
  function discover(id){state.lessons[id].discovered=true;setPhase(id,'question');}
  const beginnerDone = new Set();
  document.addEventListener('pacha:beginner-complete',e=>{
    const id=e.detail;
    if(!Number.isInteger(id)||id<0||id>2||beginnerDone.has(id)||beginnerDone.size!==id)return;
    beginnerDone.add(id);state.bag.snack++;renderInventory();tell('小发现奖励：小鱼饼 +1，已放进背包');
    if(beginnerDone.size===3)learned('water');
  });
  function learned(id){if(id==='water'&&beginnerDone.size!==3)return;state.lessons[id].learned=true;q(`#${id}LearnStatus`).textContent='✓ 找到新线索了，记得讲出你的理由。';}
  function reviewExplanation(id,text){
    const lesson=state.lessons[id];const reply=q(`#reply-${id}`);reply.hidden=false;
    lesson.answer=text;lesson.submitted=false;q(`#review-${id}`).hidden=true;
    if(!text.trim()){reply.textContent='帕恰还没听到你的想法，慢慢说也没关系。';return;}
    if(id!=='water'&&!lesson.learned){reply.textContent='我先把你的想法留在这里。我们去做一次探索，看看你的解释能不能和观察对上，再回来补充吧。';return;}
    if(lesson.completed){reply.textContent='你的补充已经留在这次对话里。奖励领过啦，可以继续探索，也可以回家玩。';return;}
    lesson.submitted=true;q(`#echo-${id}`).textContent=text;q(`#review-${id}`).hidden=false;q(`[data-review="${id}"]`).reset();
    reply.textContent='我听到你的想法啦！这一版还不能用 AI 理解你的回答，请陪伴的大人和你一起核对。';
  }
  function grantReward(id){
    const lesson=state.lessons[id];
    if(lesson.completed||(id!=='water'&&!lesson.learned)||!lesson.submitted||!lesson.answer.trim())return;
    lesson.completed=true;
    Object.entries(rewards[id]).forEach(([key,count])=>state.bag[key]+=count);
    renderInventory();q(`#review-${id}`).hidden=true;q(`#done-${id}`).hidden=false;
    q(`#reply-${id}`).textContent='陪伴者确认完成。这次一起找到的秘密，帕恰记住在本次冒险里啦！';
    q('#rewardDescription').textContent=id==='water'?'狗粮 ×3、小鱼饼 ×2 已放进背包。帕恰的小花园也亮起来啦！':'狗粮 ×2、小鱼饼 ×1、探险网球 ×1 已放进背包。回家和帕恰分享吧！';
    q('#rewardDialog').showModal();
  }
  const clues=[['钢珠也被水托着','钢珠下沉时也受浮力，只是这时向上的浮力比它的重量小，所以还会下沉。'],['空心船能排开更多水','把船做成空心，连同内部空气，占据的总体积就更大。它能在进水前排开足够多的水，让浮力托住船和货物的总重量。'],['浮着，不代表永远不沉','船静静浮着时，浮力等于总重量。装货太多或船舱进水，也可能沉。不能只看材料，也不能只看“空心”。']];
  function showClue(){q('#clueTitle').textContent=clues[clip][0];q('#clueText').textContent=clues[clip][1];q('#clueCount').textContent=`${clip+1} / 3`;q('#cluePrev').disabled=clip===0;q('#clueNext').disabled=clip===2;q('#readComplete').hidden=clip!==2;}
  function modelLabels(){q('#widthLabel').textContent=`${Number(q('#boatWidth').value)/10} cm`;q('#cargoLabel').textContent=`${Number(q('#boatCargo').value)*15} g`;q('#modelResult').textContent='条件改变了。先猜猜结果，再点“放进水里”。';}
  function runModel(){
    const width=Number(q('#boatWidth').value)/10,cargo=Number(q('#boatCargo').value)*15;
    const capacity=width*10*2,mass=20+cargo,depth=mass/(width*10),floating=mass<capacity;
    q('#modelHull').style.transform=`translateY(${floating?depth*40-25:95}px)`;
    q('#modelHull').style.transformOrigin='260px 100px';q('#modelCargo').style.opacity=cargo?'1':'0';
    q('#modelCaption').textContent=floating?'浮着：水的托举 = 总重量':'达到承载限度：可能进水下沉';
    q('#modelResult').textContent=`船和货物一共 ${mass} g，这艘模型船在进水前最多排开约 ${capacity} g 的水。${floating?`现在浮着，吃水约 ${depth.toFixed(1)} cm。加货或缩小船宽再试试。`:'已经达到或超过承载限度。试试少装一点，或把船做宽一些。'}`;
    learned('water');
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.go)go(b.dataset.go);
    if(b.dataset.use)useItem(b.dataset.use);
    if(b.dataset.adventure)enterAdventure(b.dataset.adventure);
    if(b.dataset.discover)discover(b.dataset.discover);
    if(b.dataset.phase)setPhase(b.dataset.lesson,b.dataset.phase);
    if(b.dataset.resource){qa('[data-resource]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['model','reading','real'].forEach(r=>q(`#resource-${r}`).hidden=r!==b.dataset.resource);}
    if(b.dataset.revise){const id=b.dataset.revise;q(`#review-${id}`).hidden=true;state.lessons[id].submitted=false;q(`#answer-${id}`).focus();}
  });
  q('.game-brand').addEventListener('click',e=>{e.preventDefault();go('home');});
  q('#replayFilm').addEventListener('click',()=>{film.currentTime=0;playFilm();});
  film.addEventListener('ended',()=>{if(state.view==='adventure'&&state.active==='water')discover('water');});
  film.addEventListener('error',()=>{q('#filmStatus').hidden=false;q('#filmStatus').textContent='视频暂时打不开，读文字故事也能继续冒险。';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){++playRequest;film.pause();}});
  qa('[data-teach]').forEach(form=>{
    form.addEventListener('submit',e=>{e.preventDefault();reviewExplanation(form.dataset.teach,q(`#answer-${form.dataset.teach}`).value.trim());});
    form.querySelector('textarea').addEventListener('input',()=>{const id=form.dataset.teach;state.lessons[id].submitted=false;q(`#review-${id}`).hidden=true;});
  });
  qa('[data-review]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(form.reportValidity())grantReward(form.dataset.review);}));
  q('#rewardHome').addEventListener('click',()=>{q('#rewardDialog').close();go('home');pet('你回来啦！宝藏在背包里，想和你一起分享。');});
  q('#rewardMap').addEventListener('click',()=>{q('#rewardDialog').close();go('map');});
  q('#boatWidth').addEventListener('input',modelLabels);q('#boatCargo').addEventListener('input',modelLabels);q('#runModel').addEventListener('click',runModel);
  q('#cluePrev').addEventListener('click',()=>{clip=Math.max(0,clip-1);showClue();});q('#clueNext').addEventListener('click',()=>{clip=Math.min(2,clip+1);showClue();});q('#readComplete').addEventListener('click',()=>{learned('water');setPhase('water','teach');});
  q('#realTrial').addEventListener('submit',e=>{e.preventDefault();learned('water');q('#trialReply').textContent=`你预测“${q('#prediction').value}”，观察到“${q('#observed').value}”。${q('#observed').value==='船浮、小团沉'?'材料和质量没有变，变化的是形状和排水体积。':'真实记录最重要。检查空气、破洞或进水情况，再和小船实验室的模型对照。'}`;});
  q('#gardenTrial').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget),bright=data.get('light')==='bright',enough=data.get('water')==='enough';q('#plantIcon').textContent=bright&&enough?'🌿':'🪴';q('#gardenObservation').textContent=`${bright?'合适的光照有助于绿色植物制造养分。':'长期缺少光照，绿色植物不能正常制造足够养分。'}${enough?'土壤保持适当湿润、能排水，有利于根部生长。':'长期积水会妨碍根部获取氧气，可能烂根。'}这些影响需要时间；不同植物还需要合适的温度等条件。`;learned('garden');});
  showClue();renderInventory();pet('你来啦！先摸摸头，还是带我出门玩呀？','idle');
})();
