// Exercise animation time and user events without a browser or external packages.
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const nodes = new Map();
function element(id) {
  if (!nodes.has(id)) nodes.set(id, {
    style:{},dataset:{},attrs:{},handlers:{},hidden:true,textContent:'',
    setAttribute(k,v){this.attrs[k]=v;},
    addEventListener(k,fn){this.handlers[k]=fn;},
    getBoundingClientRect(){return {left:0,top:0,width:400,height:300};},
  });
  return nodes.get(id);
}
const actions = ['call','cuddle','ball','rest'].map(kind=>{const el=element(kind);el.dataset.companion=kind;return el;});
let callback, time=0;
const document={hidden:false,querySelector:()=>element('zone'),getElementById:element,querySelectorAll:()=>actions};
const window={};
runInNewContext(readFileSync(path.join(__dirname,'../demo/companion.js'),'utf8'),{
  document,window,matchMedia:()=>({matches:false,addEventListener(){}}),requestAnimationFrame:fn=>{callback=fn;},Math,
});
function advance(seconds){for(let i=0;i<seconds*60;i++){time+=1000/60;callback(time);}}
function click(id){element(id).handlers.click({stopPropagation(){}});}
click('call'); advance(.3);
assert.equal(element('petRoom').dataset.state,'walk');
assert.equal(element('pachaSprite').dataset.sheet,'run');
const firstRunFrame=element('pachaSprite').dataset.frame;
advance(.14);
assert.notEqual(element('pachaSprite').dataset.frame,firstRunFrame,'trot advances through actual limb drawings');
assert.ok(parseFloat(element('puppet').style.left)>50);
click('cuddle');advance(.1);
assert.equal(element('pachaSprite').dataset.sheet,'mood');
assert.ok(['2','3'].includes(element('pachaSprite').dataset.frame),'closed-eye nuzzle pose');
click('ball');advance(5);
assert.equal(element('toyBall').hidden,true,'ball returns and leaves the scene');
assert.match(element('bondText').textContent,/2/);
click('rest');advance(1);
assert.equal(element('petRoom').dataset.state,'sleep');
assert.equal(element('pachaSprite').dataset.frame,'6','curled-up sleeping artwork');
click('puppet');advance(.1);
assert.equal(element('petRoom').dataset.state,'cuddle','touch wakes pet');
click('motionToggle'); const pose=element('pachaSprite').dataset.frame; const position=element('puppet').style.left;advance(2);
assert.equal(element('pachaSprite').dataset.frame,pose,'pause freezes pose');
assert.equal(element('puppet').style.left,position,'pause freezes movement');
click('motionToggle');click('ball');advance(.3);click('cuddle');advance(.1);
assert.equal(element('toyBall').hidden,true,'interrupting fetch clears ball');
assert.equal(element('petRoom').dataset.state,'cuddle');
window.doudouCompanion.react('thinking');advance(4);window.doudouCompanion.react('listening');advance(.1);
assert.equal(element('petRoom').dataset.state,'listening');
console.log('PASS: trot frames, travel, affection poses, sleeping artwork, fetch/return, wake, pause, interruption, learning reaction');
