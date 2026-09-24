const $ = (selector) => document.querySelector(selector);
const chat = $('#chat');
const toast = $('#toast');
const petZone = $('.pet-zone');
let stage = 1;

function setPetState(state = 'idle', duration = 0) { window.doudouCompanion?.react(state, duration); }

function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('show'), 2100); }
function progress(value) { stage = Math.max(stage, value); $('#missionProgress').textContent = `${Math.min(stage, 4)} / 4`; $('#progressFill').style.width = `${Math.min(stage * 25, 100)}%`; }
function message(text, who = 'pet') { const row = document.createElement('div'); row.className = `msg ${who}`; if (who === 'pet') row.innerHTML = `<img src="../assets/pets/doudou-concept-v1.png" alt=""><p>${text}</p>`; else { const p = document.createElement('p'); p.textContent = text; row.appendChild(p); } chat.appendChild(row); chat.scrollTop = chat.scrollHeight; }
function answer(text) { window.waterLesson?.explain(text); }
function startCare(withHint = false) { if (withHint) window.waterLesson?.learn(); else window.waterLesson?.tryExplain(); }
function startPlay() { window.waterLesson?.play(); }
function send(value = $('#input').value.trim()) { if (!value) return; message(value, 'user'); $('#input').value = ''; $('#input').style.height = 'auto'; answer(value); }

$('#teach').addEventListener('click', () => startCare(false));
$('#hint').addEventListener('click', () => startCare(true));
$('#play').addEventListener('click', startPlay);
$('#send').addEventListener('click', () => send());
$('#input').addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } });
$('#input').addEventListener('input', () => { $('#input').style.height = 'auto'; $('#input').style.height = `${Math.min($('#input').scrollHeight, 65)}px`; });
document.querySelectorAll('.chips button').forEach((button) => button.addEventListener('click', () => send(button.dataset.text)));
$('#mic').addEventListener('click', () => notify('这一版请先打字，或使用设备键盘的语音输入；不会自动代你回答。'));

$('#feed').addEventListener('click', (event) => { setPetState('happy', 1500); event.currentTarget.disabled = true; event.currentTarget.classList.add('fed'); event.currentTarget.innerHTML = '帕恰吃饱啦 ✓'; $('#mood').textContent = '好好吃！吃饱后我又有问题啦！'; $('#challenge').classList.remove('hide'); notify('小鱼饼送达，帕恰开始提问'); });
document.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', (event) => { setPetState(event.currentTarget.dataset.answer === 'right' ? 'happy' : 'worried', 1500); document.querySelectorAll('[data-answer]').forEach((item) => item.classList.remove('selected')); event.currentTarget.classList.add('selected'); message(event.currentTarget.dataset.answer === 'right' ? '不一定，因为还要看浮力和物体整体的情况。' : '我觉得不一定，但还说不清楚原因。', 'user'); message(event.currentTarget.dataset.answer === 'right' ? '答对啦！轻只是一个线索，不是唯一条件。我们去玩小船实验吧！' : '没关系，我们去实验室改变条件，找出答案吧！'); $('#lab').classList.remove('hide'); $('#mood').textContent = '我们一起做实验找答案！'; notify('新的玩耍场景已解锁'); }));

function updateBoat() { const width = Number($('#width').value); const cargo = Number($('#cargo').value); $('#widthValue').textContent = `${width / 10} cm`; $('#cargoValue').textContent = `${cargo * 15} g`; $('#boat').style.width = `${width * 1.45}px`; $('#labResult').textContent = '条件改变了：先预测，再运行'; }
$('#width').addEventListener('input', updateBoat); $('#cargo').addEventListener('input', updateBoat);
function unlockNextChapter() { const next = document.querySelector('.road button[data-stage="3"]'); if (!next.classList.contains('unlocked')) { next.classList.add('unlocked'); next.querySelector('i').textContent = '✦'; next.style.color = '#9a7747'; next.querySelector('i').style.background = '#d9ad57'; $('#growthCount').textContent = '3'; $('#nextChapter').textContent = '进入下一章 →'; } }
// Ideal open rectangular hull: length 10 cm, depth 2 cm, mass 20 g, fresh water 1 g/cm³.
// Below the rim, displaced volume can support total mass; equality has no freeboard.
$('#run').addEventListener('click', () => { const capacity = Number($('#width').value) * 2; const totalMass = 20 + Number($('#cargo').value) * 15; const floats = totalMass < capacity; $('#labResult').textContent = floats ? `能浮着：总质量 ${totalMass} g，低于进水边界 ${capacity} g` : `到达进水边界：总质量 ${totalMass} g，边界 ${capacity} g`; $('#boat').style.top = floats ? `${32 + totalMass / capacity * 12}%` : '65%'; setPetState(floats ? 'happy' : 'worried', 1600); $('#mood').textContent = floats ? '总重量相同时，宽船浸得浅一些，装载余量也更大。' : '到船边进水了，我们减轻货物或换宽船再试试？'; if (floats) unlockNextChapter(); notify(floats ? '模型实验成功，下一章已解锁' : '调整条件再试试；这是理想模型，不是实际船只的安全标准'); });

const chapters = {1:['认识世界','观察与提问','帕恰学会先观察、再提出问题。'],2:['水上探险','浮力','让帕恰拥有一艘自己的小船。'],3:['阳台园丁','植物生长','下一章：照顾一盆植物，发现阳光和水的作用。'],4:['光影侦探','光与影','下一章：和帕恰一起做手影小剧场。'],5:['天气管家','水循环','下一章：追踪一滴水的一次旅行。'],6:['小小发明家','结构与材料','终章：为帕恰设计一座安全的小窝。']};
document.querySelectorAll('.road button').forEach((button) => button.addEventListener('click', () => { const data = chapters[button.dataset.stage]; if (!button.classList.contains('current') && !button.classList.contains('done') && !button.classList.contains('unlocked')) { notify('完成前面的成长任务后，这里就会解锁'); return; } $('#chapterDetail').querySelector('label').textContent = `CHAPTER · ${data[0]}`; $('#chapterDetail').querySelector('h3').textContent = data[2]; $('#chapterDetail').querySelector('p').textContent = button.dataset.stage === '2' ? '教帕恰浮力、喂小鱼饼，再和它一起完成一次虚拟实验。' : '帕恰会把你教过的知识记在成长日记里。'; }));
$('#nextChapter').addEventListener('click', () => { const next = document.querySelector('.road button[data-stage="3"]'); if (next.classList.contains('unlocked')) { next.click(); $('#growth').scrollIntoView({ behavior: 'smooth', block: 'center' }); } else notify('下一章预览：阳台园丁 · 植物生长'); }); $('#reset').addEventListener('click', () => window.location.reload());

const plantActions = new Set();
const plantCopy = { light: '阳光可以帮助植物制造养分。', water: '适量的水能帮助根部吸收养分，但不是越多越好。', air: '通风能让叶片和周围环境保持健康。' };
document.querySelector('[data-stage="3"]').addEventListener('click', (event) => { if (!event.currentTarget.classList.contains('unlocked')) return; $('#plantLab').classList.remove('hide'); $('#plantLab').scrollIntoView({ behavior: 'smooth', block: 'center' }); $('#mood').textContent = '阳台上的小植物也需要你的照顾！'; });
document.querySelectorAll('[data-plant]').forEach((button) => button.addEventListener('click', (event) => { const action = event.currentTarget.dataset.plant; plantActions.add(action); event.currentTarget.classList.add('selected'); setPetState(plantActions.size === 3 ? 'happy' : 'listening', plantActions.size === 3 ? 1500 : 0); $('#plantStatus').textContent = `${plantActions.size} / 3 个照顾动作`; $('#plantResult').textContent = plantActions.size < 3 ? `帕恰记住啦：${plantCopy[action]} 还要继续观察植物的变化。` : '三项照顾都完成了！第二天，植物长出了一片新叶。帕恰学会了：植物生长需要合适的阳光、水和空气。'; if (plantActions.size === 3) { $('#growthCount').textContent = '4'; $('#mood').textContent = '小植物长出新叶啦！我们越来越会照顾彼此了。'; notify('植物章节完成：帕恰学会了照顾计划'); } }));

const petReactions = { run: { state: 'running', mood: '我来啦！跑到你身边就有好事情～', notice: '帕恰跑过来找你了' }, cuddle: { state: 'cuddly', mood: '嗯嗯，再摸一下嘛……我最喜欢被你照顾了。', notice: '帕恰撒娇中' }, play: { state: 'playing', mood: '接住小球！玩完以后，你也要教我一个新知识哦。', notice: '帕恰跳起来接小球' } };
document.querySelectorAll('[data-pet-action]').forEach((button) => button.addEventListener('click', (event) => { const reaction = petReactions[event.currentTarget.dataset.petAction]; setPetState(reaction.state, 2300); $('#mood').textContent = reaction.mood; notify(reaction.notice); }));
