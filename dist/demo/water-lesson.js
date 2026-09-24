/* A local, scripted learning activity. Free text is never claimed to be AI-graded. */
(() => {
  const q = s => document.querySelector(s);
  const adventure = document.createElement('section');
  adventure.id = 'waterAdventure'; adventure.className = 'water-adventure';
  adventure.setAttribute('aria-label', '和帕恰一起玩水');
  adventure.innerHTML = `
    <ol class="water-steps" aria-label="探索进度"><li aria-current="step">1 一起玩</li><li>2 试着解释</li><li>3 按需学一学</li><li>4 再教帕恰</li></ol>
    <div class="water-heading"><div><label>水上探险 · 公园里的小发现</label><h2>帕恰的公园游船</h2></div><span>一起看故事，再把发现讲给它听</span></div>
    <div class="park-film"><video id="parkFilm" controls playsinline preload="auto" poster="../assets/video/pacha-park-poster-v2.jpg" aria-label="帕恰的公园游船，原声字幕版" aria-describedby="filmNote"><source src="../assets/video/pacha-park-story-v2.mp4" type="video/mp4">你的浏览器暂不支持视频，可以阅读下方剧情。</video></div>
    <div class="film-meta"><span>约 20 秒 · AI 故事短片 · 原声字幕版</span><span id="filmClock">00:00 / 00:20</span></div>
    <p id="filmStatus" role="status" hidden></p>
    <small id="filmNote">帕恰在船内的观察水箱里做实验，不向湖里丢东西。画面为 AI 生成，钢制船是故事设定。</small>
    <div class="water-scene" id="waterScene" data-phase="0">
      <svg viewBox="0 0 520 285" role="img" aria-labelledby="waterDiagramTitle waterDiagramDesc"><title id="waterDiagramTitle">钢珠和空心钢船的沉浮示意</title><desc id="waterDiagramDesc">按开始后，实心钢珠沉入水底，空心船停在水面。图形是剖面示意，不按比例。</desc>
        <path d="M15 110H505V265H15Z" fill="#b3deef"/><path d="M15 110H505" stroke="#398bb2" stroke-width="3"/><text x="22" y="101">水面</text>
        <path class="displacement" d="M286 110L305 146H441L460 110Z" fill="#298db1" opacity=".3"/>
        <g class="diagram-ball"><circle cx="143" cy="83" r="17" fill="#8297a9" stroke="#465d74" stroke-width="3"/><text x="107" y="47">实心钢珠</text></g>
        <g class="diagram-hull"><path d="M283 42L305 94H441L463 42" fill="#fffefa" stroke="#465d74" stroke-width="7" stroke-linejoin="round"/><text x="314" y="26">空心钢船</text><text x="342" y="71" class="diagram-small">空气</text></g>
        <g class="force-arrow"><path d="M373 209V159M362 173L373 158L384 173" stroke="#166980" stroke-width="4" fill="none"/><text x="396" y="192">浮力</text><text x="285" y="248" class="diagram-small">蓝色区域：船排开的水</text></g>
        <text x="20" y="282" class="diagram-small">剖面示意 · 不按比例</text>
      </svg><div class="lesson-dog" role="img" aria-label="帕恰在旁边观察"></div>
    </div>
    <p id="waterCaption" class="water-caption" aria-live="polite">帕恰：带上钢珠和小船，我们来玩水吧！你猜，放进水里会发生什么？</p>
    <div class="water-actions"><button class="primary" id="waterPlay">重播小故事</button><button id="waterPause">播放故事</button><button id="waterNext">直接看问题</button></div>
    <details class="film-transcript"><summary>阅读文字剧情</summary><p>我们带帕恰到公园坐船。帕恰拿起一颗钢珠，在船内把它放进透明观察水箱。钢珠落入水中，一直沉到箱底。帕恰抬头看看仍然浮着的船，问：“钢珠会沉，钢铁做的船为什么能浮？你能教教我吗？”</p></details>
    <div class="water-actions" id="waterChoices" hidden><button class="primary" id="waterTry">我先试着解释</button><button id="waterHelp">还不会，一起学一学</button></div>
    <div class="water-learning" id="waterLearning" hidden>
      <h2>选一种方式，和帕恰找答案</h2><p>不用全做。弄明白后，回来用自己的话告诉帕恰。</p>
      <div class="water-actions" aria-label="学习方式"><button data-resource="animation" aria-pressed="true">看分镜动画</button><button data-resource="experiment" aria-pressed="false">动手做实验</button><button data-resource="reading" aria-pressed="false">读一读</button></div>
      <section class="water-resource" id="resourceAnimation"><h3>小船为什么浮起来？</h3><div class="water-clip"><strong id="clipPage">1 / 3</strong><progress id="clipProgress" max="3" value="1" aria-label="讲解进度"></progress></div><p id="clipText"></p><div class="water-actions"><button id="clipPrev">上一段</button><button class="primary" id="clipNext">下一段</button></div><small>这是可逐段播放的图解动画，不是实拍视频；上方示意图会跟着变化。</small></section>
      <section class="water-resource" id="resourceExperiment" hidden><h3>同一张铝箔，两种形状</h3><p>先预测，再观察：质量不变，改变形状，沉浮会一样吗？</p><ol><li>请大人准备一张铝箔和一盆浅水。把铝箔捏成开口向上、没有破洞的小船，轻轻放入水中。</li><li>取出同一张铝箔，擦干后尽量压紧成实心小团，再放入水中。记下实际结果，不必凑出“正确答案”。</li><li>小团也浮着？检查里面是否还有空气、是否被水面托住。重新压紧再观察。换形状，没有把金属变成另一种材料。</li></ol>
      <p class="water-safety">请大人陪同，用浅水盆，在远离电器的桌面操作。铝箔边缘可能划手；不要吞咽材料，也不要让宠物靠近实验水盆。无需使用钢珠。</p>
      <form class="water-trial" id="waterTrial"><fieldset><legend>实验前：你猜小船会怎样？</legend><label><input required type="radio" name="prediction" value="float">浮着</label><label><input required type="radio" name="prediction" value="sink">下沉</label></fieldset><fieldset><legend>实验后：实际看到什么？</legend><label><input required type="radio" name="observation" value="contrast">船浮、小团沉</label><label><input required type="radio" name="observation" value="bothFloat">两个都浮</label><label><input required type="radio" name="observation" value="other">其他结果</label></fieldset><button type="submit">把观察告诉帕恰</button><output id="trialResult" aria-live="polite">还没有记录。可以先动手，也可以换一种学习方式。</output></form></section>
      <section class="water-resource" id="resourceReading" hidden><h3>不是“钢铁一定沉”，也不是“空心一定浮”</h3><ol><li>水会给物体一个向上的力，叫浮力。钢珠下沉时也受到浮力，只是它不足以托住钢珠的重量。</li><li>船做成空心，连同里面的空气，占据的总体积更大。它能在船舷进水前排开足够多的水，让浮力托住船和货物的总重量。</li><li>船静静浮着时，浮力等于总重量，不是一直大于重量。货物太多或船舱进水，它也可能沉下去。</li></ol><small>家长延伸阅读：<a href="https://openstax.org/books/college-physics/pages/11-7-archimedes-principle" target="_blank" rel="noopener noreferrer">OpenStax · 阿基米德原理</a>。实验参考：<a href="https://www.sciencebuddies.org/stem-activities/aluminum-foil-boats-float" target="_blank" rel="noopener noreferrer">Science Buddies · 铝箔船</a>。</small></section>
      <div class="water-actions"><button class="primary" id="waterReturn">我有新想法了，回去教帕恰</button></div>
    </div>`;
  q('#pet').before(adventure);
  // The scientific diagram remains available as a learning resource, not the story opening.
  q('#resourceAnimation').prepend(q('#waterScene'));
  const film = q('#parkFilm');
  film.muted = false;
  const check = document.createElement('section'); check.className = 'lesson-check'; check.id = 'lessonCheck'; check.hidden = true;
  check.innerHTML = `<h3>帕恰：让我试着用一用！</h3><p>你刚才这样教我：</p><blockquote id="explanationEcho"></blockquote><p>帮我检查下面三个想法，看看我有没有弄混。</p><form id="waterCheckForm">
    <label for="checkSteel">① 钢珠已经在下沉，它还受到浮力吗？</label><select id="checkSteel" required><option value="">选一个想法</option><option value="none">不受浮力，因为它在下沉</option><option value="yes">受到浮力，但浮力小于它的重量</option></select>
    <label for="checkBoat">② 同样是钢铁，空心船为什么可以浮着？</label><select id="checkBoat" required><option value="">选一个解释</option><option value="light">钢铁做成船后，材料本身就变轻了</option><option value="displace">空心船能排开足够多的水，让浮力托住总重量</option><option value="air">有空气的物体一定会浮起来</option></select>
    <label for="checkCargo">③ 如果我不停地往船里加小石头呢？</label><select id="checkCargo" required><option value="">猜一猜，并选择原因</option><option value="always">船是空心的，所以永远不会沉</option><option value="limit">船会更深地浸入水中；超过承载能力或进水，就可能沉</option></select>
    <button class="primary" type="submit">告诉帕恰我的判断</button><button id="checkHelp" type="button">还有点不懂，再学一学</button></form><p id="checkFeedback" role="status"></p><small>试玩说明：自由解释会留在本页对话中；这一版通过后续选择题提供反馈，不会自动判断你的整段解释是否正确，也不会给出虚假的理解度分数。刷新后本次记录清空。</small>`;
  q('.chat-zone').appendChild(check);
  q('.card-title h2').textContent = '帕恰有个问题想问你';
  q('.chat-head h3').textContent = '把你的发现讲给帕恰听';
  q('#chat').replaceChildren();
  message('今天我们去公园坐船！先陪我看一段小故事，你随时可以暂停或重播。');
  q('#start').classList.add('hide');
  q('#teach').textContent = '我先试着解释'; q('#hint').textContent = '还不会，一起学'; q('#play').textContent = '再玩一次小船';
  q('.chips').replaceChildren();
  const help = document.createElement('button'); help.textContent = '我还不会，去学习'; help.type = 'button'; q('.chips').appendChild(help);
  q('#composer small').textContent = '不用背术语，讲讲你看到的现象和你的理由。';
  q('#mic').setAttribute('aria-label','语音输入使用说明');
  q('#mic').title = '可使用设备键盘的语音输入';
  q('#mood').textContent = '一起玩水吧！我带上了小船。';
  q('#progressHint').textContent = '从一次玩耍开始';
  q('.hero h1').innerHTML = '和帕恰一起玩<br><mark>从好奇开始探索。</mark>';
  q('.hero p').textContent = '先发现问题，试着解释；不会就一起学，再回来教它。';
  q('#memory strong').textContent = '探索记录';
  q('#memory small').textContent = '本次完成了自己的解释与三个追问；刷新后记录清空。';
  q('#reward h3').textContent = '你认真解释，还完成了追问！获得一块小鱼饼';
  q('#lab .lab-head span').textContent = '理想模型 · 不按比例';
  const modelNote = document.createElement('p'); modelNote.className='model-note'; modelNote.textContent='模型设定：淡水中，船长 10 cm、深 2 cm、空船质量固定为 20 g，每份货物 15 g。忽略倾覆、变形和船壁厚度；改变宽度时保持空船质量不变。结果仅用于理解承载，不代表真实船只安全标准。'; q('#lab').appendChild(modelNote);
  q('#width').setAttribute('aria-label','船体宽度，刻度每格为 0.1 厘米'); q('#cargo').setAttribute('aria-label','货物份数，每份 15 克'); updateBoat();
  let discovered = false, completed = false, clip = 0, questionShown = false, playRequest = 0;
  const question = '帕恰：钢珠会沉，钢铁做的船为什么能浮？你能教教我吗？';
  function step(n) { adventure.querySelectorAll('.water-steps li').forEach((el,i) => i === n-1 ? el.setAttribute('aria-current','step') : el.removeAttribute('aria-current')); }
  function scene(n) { q('#waterScene').dataset.phase=String(n); }
  function syncFilm() {
    const time = film.currentTime || 0;
    const clock = value => `00:${String(Math.floor(value)).padStart(2,'0')}`;
    q('#filmClock').textContent=`${clock(time)} / ${clock(Number.isFinite(film.duration) ? film.duration : 20)}`;
  }
  function askQuestion() {
    stopStory();
    if (!questionShown) message(question.replace('帕恰：',''));
    questionShown=true; discovered=true; q('#waterCaption').hidden=false; q('#waterCaption').textContent=question;
    q('#waterChoices').hidden=false; q('#start').classList.remove('hide');
    step(2); progress(2); q('#progressHint').textContent='帕恰发现了问题，先说说你的想法';
    setPetState('thinking',1800);
  }
  async function resumeFilm() {
    const request = ++playRequest;
    q('#filmStatus').hidden=true;
    try { await film.play(); if (request !== playRequest) film.pause(); }
    catch (error) { if (request !== playRequest) return; q('#filmStatus').hidden=false; q('#filmStatus').textContent=film.error?'视频暂时没加载成功，可以重播重试，或阅读文字剧情后直接看问题。':'浏览器需要你点一下才能播放声音。点击“有声播放”，原声和字幕都会保留。'; q('#waterPause').textContent='有声播放'; }
  }
  function play(scroll = true) {
    stopStory(); questionShown=false; film.currentTime=0;
    if (film.error) film.load();
    q('#waterLearning').hidden=true; q('#waterNext').hidden=false; q('#waterPause').hidden=false;
    q('#waterChoices').hidden=true; q('#waterCaption').hidden=true; q('#waterPause').textContent='有声播放'; step(1); syncFilm();
    if (!document.hidden && !(scroll === false && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) resumeFilm();
    if(scroll !== false) adventure.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function stopStory() { ++playRequest; film.pause(); q('#waterNext').hidden=true; q('#waterPause').hidden=true; }
  function tryExplain() { if(!discovered) { play(); return; } stopStory(); scene(3); q('#start').classList.add('hide'); q('#composer').classList.remove('hide'); q('#waterLearning').hidden=true; q('#waterScene').classList.remove('is-explaining'); step(2); q('#input').placeholder='钢珠……；小船……。我觉得这是因为……'; q('#pet').scrollIntoView({behavior:'smooth',block:'start'}); q('#input').focus({preventScroll:true}); setPetState('listening'); }
  function learn() { if(!discovered) { play(); return; } stopStory(); step(3); q('#waterLearning').hidden=false; showResource('animation'); q('#waterLearning').scrollIntoView({behavior:'smooth',block:'start'}); setPetState('thinking'); }
  const clips = [
    '先看钢珠：它沉下去了，但水仍在向上托它。只是这时的浮力，小于钢珠的重量。',
    '再看空心船：船连同内部空气占的空间更大，可以排开足够多的水。蓝色区域就是被船挤开的位置。排开水的重量，等于浮力大小。',
    '船静静浮着时，浮力刚好托住船和货物的总重量。加太多货物或让水进入船舱，船也可能沉下去。不是“空心就一定浮”哦！'
  ];
  function showClip() { q('#clipText').textContent=clips[clip]; q('#clipPage').textContent=`${clip+1} / 3`; q('#clipProgress').value=clip+1; q('#clipPrev').disabled=clip===0; q('#clipNext').disabled=clip===2; scene(clip===0?1:2); q('#waterScene').classList.toggle('is-explaining',clip>0); }
  function showResource(name) { ['animation','experiment','reading'].forEach(n=>{q('#resource'+n[0].toUpperCase()+n.slice(1)).hidden=n!==name; q(`[data-resource="${n}"]`).setAttribute('aria-pressed',String(n===name));}); if(name==='animation') showClip(); }
  function explain(text) { if(!discovered) return; if(/^(我还不会|我不会|不知道|不懂|我需要一点提示|给我提示)[。！!？?\s]*$/.test(text)) {message('没关系，我们一起找答案。看动画、做实验或读一读，任选一种就好。'); learn();return;} if(text.trim().length<6) { message('再多讲一点好吗？比如钢珠和小船有什么不同，水又做了什么。不会也可以点“去学习”。'); return; } q('#explanationEcho').textContent=text; check.hidden=false; q('#checkFeedback').textContent='先完成三个追问；如果发现解释还不完整，可以补充后再发送。'; if(!completed) q('#waterCheckForm').reset(); step(4); progress(3); q('#progressHint').textContent='你已经解释了自己的想法，再帮帕恰检查三个问题'; message('我收到你的解释啦！下面有三个想法，我想请你帮我检查，尤其是“再加很多货物”会怎样。'); setPetState('thinking'); check.scrollIntoView({behavior:'smooth',block:'center'}); }
  q('#waterPlay').addEventListener('click',play); q('#waterNext').addEventListener('click',askQuestion);
  q('#waterPause').addEventListener('click',()=>{if(film.paused) resumeFilm();else {++playRequest;film.pause();}});
  film.addEventListener('timeupdate',syncFilm); film.addEventListener('loadedmetadata',syncFilm);
  film.addEventListener('ended',askQuestion);
  film.addEventListener('play',()=>{questionShown=false;q('#waterPause').hidden=false;q('#waterPause').textContent='暂停';q('#filmStatus').hidden=true;});
  film.addEventListener('pause',()=>{q('#waterPause').textContent='继续播放';});
  film.addEventListener('error',()=>{q('#filmStatus').hidden=false;q('#filmStatus').textContent='视频暂时没加载成功。可以重播重试，或阅读文字剧情后直接看问题。';});
  q('#waterTry').addEventListener('click',tryExplain); q('#waterHelp').addEventListener('click',learn); help.addEventListener('click',learn); q('#checkHelp').addEventListener('click',learn);
  q('#waterReturn').addEventListener('click',()=>{tryExplain();step(4);message('你有新发现了吗？这次可以用自己的话，把“形状”和“水的托举”连起来讲给我听。');});
  document.querySelectorAll('[data-resource]').forEach(b=>b.addEventListener('click',()=>showResource(b.dataset.resource)));
  q('#clipPrev').addEventListener('click',()=>{clip=Math.max(0,clip-1);showClip();}); q('#clipNext').addEventListener('click',()=>{clip=Math.min(2,clip+1);showClip();});
  q('#waterTrial').addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.currentTarget); const observed=form.get('observation'); const responses={contrast:'你观察到船浮、小团沉。材料和质量没有变，变的是形状和可以排开水的体积。',bothFloat:'两个都浮也是观察结果！小团里可能还有空气，或受水面张力影响；请大人帮你压紧，再试一次。',other:'先检查船有没有破洞、船边是否进水，以及小团是否压紧。记录真实结果，再换一种学习方式对照。'};q('#trialResult').textContent=`你预测小船会${form.get('prediction')==='float'?'浮着':'下沉'}。${responses[observed]}`;setPetState('listening');});
  q('#waterCheckForm').addEventListener('submit',e=>{e.preventDefault();const missing=[];if(q('#checkSteel').value!=='yes')missing.push('想想：下沉的钢珠也受水的托举，只是还不够。');if(q('#checkBoat').value!=='displace')missing.push('空心不是魔法：关键是能排开足够多的水，托住总重量。');if(q('#checkCargo').value!=='limit')missing.push('小船有承载限度，不会装多少都浮着。');if(missing.length){q('#checkFeedback').textContent=missing.join(' ')+' 可以回去学习，再改一改。';setPetState('thinking');return;}q('#checkFeedback').textContent='三个追问都解释通啦！你还可以对照刚才的话，补充你新发现的理由。';if(!completed){completed=true;progress(4);q('#progressHint').textContent='完成自己的解释和三个追问';q('#reward').classList.remove('hide');q('#memory').classList.remove('hide');message('现在我知道了：钢珠也受浮力；空心船可以排开足够的水托住总重量；装太多或进水也可能沉！谢谢你陪我找答案。');setPetState('happy',1800);notify('探索完成，获得一块小鱼饼');q('#reward').scrollIntoView({behavior:'smooth',block:'center'});}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){++playRequest;film.pause();}});
  window.waterLesson={play,tryExplain,learn,explain}; showClip(); scene(0);q('#waterScene').classList.remove('is-explaining');
  // Start the introduction once, without moving focus or scrolling the page.
  play(false);
})();
