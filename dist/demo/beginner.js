/* Three beginner activities. Adult confirmation is explicit; no automatic grading. */
(() => {
  const q=s=>document.querySelector(s);
  const panel=q('#quest-water [data-panel="learn"]');
  const levels=[
    {title:'重力：谁把小球往下拉？',question:'没有人推，小球为什么还会往下掉？',text:'松开手，小球就落下来了。地球会把身边的东西往下拉。这个力，叫重力。',hint:'能说出“地球把小球往下拉”就可以，不用背定义。',action:'松开小球，看一看',result:'小球落下来了！地球在往下拉它，这个力叫重力。',review:'孩子能用自己的话说出：地球把小球往下拉。',src:'../assets/video/pacha-gravity-v1.mp4',poster:'../assets/video/pacha-gravity-poster-v1.jpg'},
    {title:'浮力：谁把瓶子往上托？',question:'松开按在水里的空瓶子，谁在把它往上托？',text:'把拧紧瓶盖的空塑料瓶轻轻按进水里，你会感到水在往上托它。这个力，叫浮力。',hint:'能说出“水把瓶子往上托”就可以。不是瓶子自己跳起来。',action:'松开瓶子，看一看',result:'瓶子往上升，最后浮在水面。水会往上托，地球也仍在往下拉。静静浮着时，这两个力一样大。',review:'孩子能说出水往上托瓶子，并知道地球仍在往下拉。',src:'../assets/video/pacha-buoyancy-v1.mp4',poster:'../assets/video/pacha-buoyancy-poster-v1.jpg',duration:18},
    {title:'沉与浮：两股力一起看',question:'钢珠沉下去的时候，水还在往上托它吗？',text:'水里有两股力：地球往下拉，水往上托。钢珠往下沉时，水也在托它，只是托得不够。小船安静浮着时，上下两股力刚好平衡。',hint:'先讲“钢珠也被水托着，只是托得不够”。船的形状为什么有帮助，下次再探索。',action:'比较钢珠和小船',result:'钢珠：向下的力更大。静静浮着的小船：上下两股力一样大。不是“沉下去就没有浮力”。',review:'孩子能说出钢珠也受水的托举，并能指出静浮小船的两股力平衡。',src:null}
  ];
  const records=levels.map(()=>({observed:false,answer:'',submitted:false,done:false}));
  let current=0;
  const advanced=document.createElement('details');advanced.className='beginner-advanced';
  advanced.innerHTML='<summary>进阶探索：船的形状与装货（可以下次再玩）</summary>';
  ['.resource-tabs','#resource-model','#resource-reading','#resource-real'].forEach(selector=>advanced.append(panel.querySelector(selector)));
  panel.querySelector('.learn-heading h2').textContent='陪帕恰闯三个小关卡';
  panel.querySelector('.learn-heading p').textContent='一次只学一个小秘密。先看一看，再用一句自己的话教帕恰。';
  const root=document.createElement('div');root.id='beginnerLessons';
  panel.querySelector('.learn-heading').after(root);
  panel.querySelector('.lesson-return').before(advanced);
  q('#waterLearnStatus').textContent='完成三个小发现，再把它们连起来讲给帕恰。';
  const finalPanel=q('#quest-water [data-panel="teach"]');
  const questionPanel=q('#quest-water [data-panel="question"]');
  questionPanel.querySelector('.pacha-dialogue p').textContent='小钢珠沉到底了，我们坐的船却还浮着！你能用自己的话告诉我为什么吗？还不知道也没关系，我们一起找答案。';
  questionPanel.querySelector('[data-phase="teach"]').textContent='我来讲给你听';
  finalPanel.querySelector('.pacha-dialogue p').textContent='我想听听你的想法！不用背答案，也不用先看完视频；还没想明白，我们就一起找线索。';
  q('#answer-water').placeholder='我觉得钢珠沉下去是因为……船能浮着是因为……';
  const reviewLabels=finalPanel.querySelectorAll('fieldset label');
  ['地球往下拉物体，这个力叫重力。','水往上托物体，这个力叫浮力；钢珠下沉时也有。','钢珠下沉时向下的力更大；船静浮时上下两股力平衡。'].forEach((text,i)=>reviewLabels[i].lastChild.textContent=' '+text);
  function diagram(index){
    const top='<svg viewBox="0 0 560 260" role="img" aria-label="重力向下、浮力向上的科学示意，不按比例"><defs><marker id="arrowDown" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="#ba5534"/></marker><marker id="arrowUp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="#287bad"/></marker></defs>';
    if(index===0)return top+'<path d="M30 233H530" stroke="#617854" stroke-width="4"/><circle class="falling-ball" cx="250" cy="54" r="21" fill="#e8b946"/><path d="M300 75V160" stroke="#ba5534" stroke-width="5" marker-end="url(#arrowDown)"/><text x="320" y="110">重力：往下拉</text></svg>';
    if(index===1)return top+'<path d="M45 86H515V242H45Z" fill="#bce5ec"/><path d="M45 86H515" stroke="#287bad" stroke-width="3"/><g class="rising-bottle"><rect x="229" y="121" width="55" height="82" rx="15" fill="#fff" fill-opacity=".8" stroke="#638396" stroke-width="3"/><path d="M247 121V110H267V121" fill="#e8b946" stroke="#638396"/></g><path d="M180 187V125" stroke="#287bad" stroke-width="5" marker-end="url(#arrowUp)"/><text x="53" y="57">浮力的方向：向上</text><text x="45" y="234">这里只标浮力；重力也一直存在。</text></svg>';
    return top+'<path d="M15 78H545V255H15Z" fill="#bce5ec"/><path d="M15 78H545" stroke="#287bad" stroke-width="3"/><text x="64" y="33">钢珠向下沉</text><text x="334" y="33">小船静静浮着</text><g class="comparison-ball"><circle cx="118" cy="121" r="19" fill="#8c9ba5"/><path d="M82 127V99" stroke="#287bad" stroke-width="5" marker-end="url(#arrowUp)"/><path d="M160 117V181" stroke="#ba5534" stroke-width="5" marker-end="url(#arrowDown)"/></g><path d="M335 60L352 103H435L452 60" fill="#fff" stroke="#638396" stroke-width="5"/><path d="M315 147V91" stroke="#287bad" stroke-width="5" marker-end="url(#arrowUp)"/><path d="M480 91V147" stroke="#ba5534" stroke-width="5" marker-end="url(#arrowDown)"/><text x="38" y="232">蓝箭头：浮力 ↑</text><text x="325" y="232">红箭头：重力 ↓</text></svg>';
  }
  function render(){
    root.querySelectorAll('video').forEach(v=>v.pause());
    const level=levels[current],record=records[current];
    root.innerHTML=`<nav class="beginner-path" aria-label="三个入门关卡">${levels.map((l,i)=>`<button data-beginner="${i}" ${i>0&&!records[i-1].done?'disabled':''} ${i===current?'aria-current="step"':''}>${records[i].done?'✓':i+1} ${l.title.split('：')[0]}</button>`).join('')}</nav><article class="beginner-card"><span class="eyebrow">第 ${current+1} 关 / 共 3 关</span><h3>${level.title}</h3><p>${level.text}</p><div class="beginner-diagram ${record.observed?'observed':''}" data-level="${current}">${diagram(current)}</div><small>科学示意 · 不按比例 · 箭头表示力，不是物体的运动路线</small><button id="observeBeginner" class="primary">${level.action}</button><p id="beginnerObservation" class="observation" role="status" ${record.observed?'':'hidden'}>${level.result}</p><div class="beginner-video">${level.src?`<video controls playsinline preload="metadata" src="${level.src}" aria-label="${level.title}教学视频"></video>`:'<span>🎬 教学视频准备中</span><small>现在可以先看上面的互动图解。之后这里会换成帕恰的小动画。</small>'}</div>${current===1?'<p class="safety">想亲手试？请大人陪同，用拧紧盖子的空塑料瓶和浅水盆，远离电器，不用玻璃，也不要让宠物靠近。</p>':''}<form id="beginnerAnswer"><label for="beginnerWords">帕恰：${level.question}</label><textarea id="beginnerWords" rows="2" maxlength="600" required placeholder="用你自己的话说一句就好……" ${record.done?'readonly':''}></textarea><small>${level.hint}</small><button type="submit" ${record.done?'disabled':''}>说给帕恰听</button></form><p id="beginnerReply" role="status"></p><form id="beginnerReview" ${record.submitted&&!record.done?'':'hidden'}><p>请陪伴者确认（尚未接入 AI，不自动评分）</p><label><input type="checkbox" required> ${level.review}</label><button type="submit" class="primary">确认这个小发现 · 小鱼饼 +1</button></form><div id="beginnerDone" ${record.done?'':'hidden'}><p>✓ 小发现已完成，奖励已经放进背包。</p>${current<2?'<button id="nextBeginner" class="primary">去下一关 →</button>':'<button data-phase="teach" data-lesson="water" class="primary">把三个小秘密连起来，教帕恰 →</button>'}</div></article>`;
    const video=root.querySelector('video');
    if(video){
      video.poster=level.poster||'';
      video.muted=false;
      const slot=video.parentElement;
      root.querySelector('.beginner-card h3').after(slot);
      const note=document.createElement('small');note.textContent=`约${level.duration||15}秒 · 保留原声 · 点击播放，和帕恰一起观察`;slot.append(note);
      if(current===1){const clarification=document.createElement('p');clarification.textContent='帕恰的小补充：视频说“浮力赢啦”，是在说瓶子松开后向上升。等瓶子静静浮在水面时，水往上托和地球往下拉一样大，不是谁一直赢哦。';slot.append(clarification);}
      const error=document.createElement('p');error.hidden=true;error.setAttribute('role','status');slot.append(error);
      video.addEventListener('error',()=>{error.hidden=false;error.textContent='视频暂时打不开，可以先用下面的互动图解继续。';});
      video.addEventListener('ended',()=>{record.observed=true;q('#beginnerObservation').hidden=false;q('#beginnerReply').textContent=current===1?'你看到瓶子浮上来了！现在试着用自己的话告诉帕恰，谁在把瓶子往上托。':'你看到小球落下来了！现在试着用自己的话告诉帕恰，谁在往下拉它。';});
    }
    q('#beginnerWords').value=record.answer;
    root.querySelectorAll('[data-beginner]').forEach(b=>b.addEventListener('click',()=>{saveDraft();current=Number(b.dataset.beginner);render();}));
    q('#observeBeginner').addEventListener('click',()=>{record.observed=true;root.querySelector('.beginner-diagram').classList.add('observed');q('#beginnerObservation').hidden=false;});
    q('#beginnerWords').addEventListener('input',()=>{record.submitted=false;record.answer=q('#beginnerWords').value;q('#beginnerReview').hidden=true;});
    q('#beginnerAnswer').addEventListener('submit',e=>{e.preventDefault();saveDraft();if(record.done)return;if(!record.observed){q('#beginnerReply').textContent='先点一下上面的观察按钮，和帕恰看看发生了什么。';return;}if(!record.answer.trim()){q('#beginnerReply').textContent='帕恰还没听到，慢慢说一句就好。';return;}record.submitted=true;q('#beginnerReview').hidden=false;q('#beginnerReview').reset();q('#beginnerReply').textContent='我听到啦！请陪伴的大人和我们一起听听，哪里还可以补充。';});
    q('#beginnerReview').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity()||!record.observed||!record.submitted||record.done)return;record.done=true;document.dispatchEvent(new CustomEvent('pacha:beginner-complete',{detail:current}));render();});
    q('#nextBeginner')?.addEventListener('click',()=>{saveDraft();current++;render();});
  }
  function saveDraft(){records[current].answer=q('#beginnerWords').value;}
  // Pause future lesson videos whenever the surrounding game hides their panel.
  new MutationObserver(()=>{root.querySelectorAll('video').forEach(v=>{if(!v.getClientRects().length)v.pause();});}).observe(q('#view-adventure'),{attributes:true,subtree:true,attributeFilter:['hidden']});
  render();
})();
