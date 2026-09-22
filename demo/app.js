const $ = (selector) => document.querySelector(selector);
const chat = $('#chat');
const toast = $('#toast');
let stage = 1;
let replyTimer;

const replyMap = {
  empty: { text: '“里面是空心的”是一个重要线索！可是，水是怎样托住船的呢？你能讲讲水对船产生了什么力吗？', mood: '我在认真听！水是怎么帮忙的呢？', stage: 2 },
  force: { text: '说得很好！水会对浸在水里的船产生一个向上的力，这个力叫做<strong>浮力</strong>。那排开的水越多，浮力会怎样变化？', mood: '原来水也会“托举”东西！', stage: 3 },
  hint: { text: '给你两个小线索：轮船虽然是钢铁做的，但里面有空气；水会对船产生向上的力。试着把它们连起来。', mood: '提示卡来啦，慢慢想！', stage: 2 },
  fallback: { text: '我听见啦！能不能再用“浮力”“排开水”或“平均密度”中的一个词，把原因讲清楚一点？', mood: '我好像懂了一点，再教教我～', stage: 2 }
};

function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('show'), 2100); }
function progress(value) { stage = Math.max(stage, value); $('#missionProgress').textContent = `${Math.min(stage, 4)} / 4`; $('#progressFill').style.width = `${Math.min(stage * 25, 100)}%`; }
function message(text, who = 'pet') { const row = document.createElement('div'); row.className = `msg ${who}`; row.innerHTML = who === 'pet' ? `<img src="../assets/pets/doudou-concept-v1.png" alt=""><p>${text}</p>` : `<p>${text}</p>`; chat.appendChild(row); chat.scrollTop = chat.scrollHeight; }
function typing() { const row = document.createElement('div'); row.className = 'msg pet'; row.id = 'typing'; row.innerHTML = '<img src="../assets/pets/doudou-concept-v1.png" alt=""><p>···</p>'; chat.appendChild(row); chat.scrollTop = chat.scrollHeight; }
function answer(text) { let reply = replyMap.fallback; if (text.includes('提示')) reply = replyMap.hint; else if (text.includes('浮力') || text.includes('向上') || text.includes('排开')) reply = replyMap.force; else if (text.includes('空') || text.includes('空气') || text.includes('轻')) reply = replyMap.empty; typing(); clearTimeout(replyTimer); replyTimer = setTimeout(() => { $('#typing')?.remove(); message(reply.text); $('#mood').textContent = reply.mood; progress(reply.stage); if (reply.stage >= 3) $('#reward').classList.remove('hide'); }, 600); }
function startCare(withHint = false) { $('#start').classList.add('hide'); $('#composer').classList.remove('hide'); message(withHint ? '我需要一点提示' : '我来试试看！', 'user'); answer(withHint ? '我需要一点提示' : '因为轮船里面是空心的'); if (!withHint) notify('很好，先从自己的想法开始！'); }
function startPlay() { $('#start').classList.add('hide'); $('#composer').classList.remove('hide'); message('我们先陪豆豆玩一会儿吧！', 'user'); message('好呀！我们来玩“漂浮小球”！不过小球总是沉下去，你能一边玩一边告诉我，水为什么能托住东西吗？'); $('#mood').textContent = '玩耍时间！顺便教我一个秘密～'; progress(2); notify('玩耍也可以发现科学！'); }
function send(value = $('#input').value.trim()) { if (!value) return; message(value, 'user'); $('#input').value = ''; $('#input').style.height = 'auto'; answer(value); }

$('#teach').addEventListener('click', () => startCare(false));
$('#hint').addEventListener('click', () => startCare(true));
$('#play').addEventListener('click', startPlay);
$('#send').addEventListener('click', () => send());
$('#input').addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } });
$('#input').addEventListener('input', () => { $('#input').style.height = 'auto'; $('#input').style.height = `${Math.min($('#input').scrollHeight, 65)}px`; });
document.querySelectorAll('.chips button').forEach((button) => button.addEventListener('click', () => send(button.dataset.text)));
$('#mic').addEventListener('click', () => { notify('正在聆听（Demo 模拟）'); $('#mood').textContent = '我听见你在说话啦……'; setTimeout(() => { $('#input').value = '水会产生向上的浮力，轮船排开了更多的水'; $('#input').dispatchEvent(new Event('input')); notify('已识别语音，你可以修改后发送'); }, 850); });

$('#feed').addEventListener('click', (event) => { event.currentTarget.disabled = true; event.currentTarget.classList.add('fed'); event.currentTarget.innerHTML = '豆豆吃饱啦 ✓'; $('#mood').textContent = '好好吃！吃饱后我又有问题啦！'; $('#challenge').classList.remove('hide'); notify('小鱼饼送达，豆豆开始提问'); });
document.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', (event) => { document.querySelectorAll('[data-answer]').forEach((item) => item.classList.remove('selected')); event.currentTarget.classList.add('selected'); message(event.currentTarget.dataset.answer === 'right' ? '不一定，因为还要看浮力和物体整体的情况。' : '我觉得不一定，但还说不清楚原因。', 'user'); message(event.currentTarget.dataset.answer === 'right' ? '答对啦！轻只是一个线索，不是唯一条件。我们去玩小船实验吧！' : '没关系，我们去实验室改变条件，找出答案吧！'); $('#lab').classList.remove('hide'); $('#mood').textContent = '我们一起做实验找答案！'; notify('新的玩耍场景已解锁'); }));

function updateBoat() { const width = Number($('#width').value); const cargo = Number($('#cargo').value); $('#widthValue').textContent = width; $('#cargoValue').textContent = cargo; $('#boat').style.width = `${width * 1.45}px`; $('#boat').style.top = `${37 + Math.max(0, cargo - 4) * 5}%`; }
$('#width').addEventListener('input', updateBoat); $('#cargo').addEventListener('input', updateBoat);
function unlockNextChapter() { const next = document.querySelector('.road button[data-stage="3"]'); if (!next.classList.contains('unlocked')) { next.classList.add('unlocked'); next.querySelector('i').textContent = '✦'; next.style.color = '#9a7747'; next.querySelector('i').style.background = '#d9ad57'; $('#growthCount').textContent = '3'; $('#nextChapter').textContent = '进入下一章 →'; } }
$('#run').addEventListener('click', () => { const floats = Number($('#width').value) - Number($('#cargo').value) * 3 > 49; $('#labResult').textContent = floats ? '实验结果：浮起来了！' : '实验结果：船身下沉了'; $('#boat').style.top = floats ? '37%' : '60%'; progress(4); $('#memory').classList.remove('hide'); $('#mood').textContent = floats ? '原来宽一点，就能排开更多的水！' : '货物太重啦，我们再调整一下？'; if (floats) unlockNextChapter(); notify(floats ? '实验成功：豆豆学会了浮力的秘密，下一章已解锁' : '再调整一次，找到让船浮起来的组合'); });

const chapters = {1:['认识世界','观察与提问','豆豆学会先观察、再提出问题。'],2:['水上探险','浮力','让豆豆拥有一艘自己的小船。'],3:['阳台园丁','植物生长','下一章：照顾一盆植物，发现阳光和水的作用。'],4:['光影侦探','光与影','下一章：和豆豆一起做手影小剧场。'],5:['天气管家','水循环','下一章：追踪一滴水的一次旅行。'],6:['小小发明家','结构与材料','终章：为豆豆设计一座安全的小窝。']};
document.querySelectorAll('.road button').forEach((button) => button.addEventListener('click', () => { const data = chapters[button.dataset.stage]; if (!button.classList.contains('current') && !button.classList.contains('done') && !button.classList.contains('unlocked')) { notify('完成前面的成长任务后，这里就会解锁'); return; } $('#chapterDetail').querySelector('label').textContent = `CHAPTER · ${data[0]}`; $('#chapterDetail').querySelector('h3').textContent = data[2]; $('#chapterDetail').querySelector('p').textContent = button.dataset.stage === '2' ? '教豆豆浮力、喂小鱼饼，再和它一起完成一次虚拟实验。' : '豆豆会把你教过的知识记在成长日记里。'; }));
$('#nextChapter').addEventListener('click', () => { const next = document.querySelector('.road button[data-stage="3"]'); if (next.classList.contains('unlocked')) { next.click(); $('#growth').scrollIntoView({ behavior: 'smooth', block: 'center' }); } else notify('下一章预览：阳台园丁 · 植物生长'); }); $('#reset').addEventListener('click', () => window.location.reload());

const plantActions = new Set();
const plantCopy = { light: '阳光可以帮助植物制造养分。', water: '适量的水能帮助根部吸收养分，但不是越多越好。', air: '通风能让叶片和周围环境保持健康。' };
document.querySelector('[data-stage="3"]').addEventListener('click', (event) => { if (!event.currentTarget.classList.contains('unlocked')) return; $('#plantLab').classList.remove('hide'); $('#plantLab').scrollIntoView({ behavior: 'smooth', block: 'center' }); $('#mood').textContent = '阳台上的小植物也需要你的照顾！'; });
document.querySelectorAll('[data-plant]').forEach((button) => button.addEventListener('click', (event) => { const action = event.currentTarget.dataset.plant; plantActions.add(action); event.currentTarget.classList.add('selected'); $('#plantStatus').textContent = `${plantActions.size} / 3 个照顾动作`; $('#plantResult').textContent = plantActions.size < 3 ? `豆豆记住啦：${plantCopy[action]} 还要继续观察植物的变化。` : '三项照顾都完成了！第二天，植物长出了一片新叶。豆豆学会了：植物生长需要合适的阳光、水和空气。'; if (plantActions.size === 3) { $('#growthCount').textContent = '4'; $('#mood').textContent = '小植物长出新叶啦！我们越来越会照顾彼此了。'; notify('植物章节完成：豆豆学会了照顾计划'); } }));
