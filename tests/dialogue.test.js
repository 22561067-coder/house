import test from 'node:test';
import assert from 'node:assert/strict';
import {world} from '../src/world.js';
import {createState,update} from '../src/state.js';
import {nearbyNpc,openDialogue,closeDialogue,TALK_DISTANCE} from '../src/dialogue.js';
const npc=world.npcs[0];
const atDistance=d=>({...createState(world),player:{x:npc.x-d,y:npc.y,width:24,height:24}});
test('멀리서는 E 대화를 열지 않는다',()=>{
  const s=createState(world);assert.equal(nearbyNpc(s,world),null);assert.equal(openDialogue(s,world),s);
});
test('근접 거리의 경계 안쪽에서만 안내/대화가 가능하다',()=>{
  assert.equal(nearbyNpc(atDistance(TALK_DISTANCE),world)?.id,npc.id);
  assert.equal(nearbyNpc(atDistance(TALK_DISTANCE+.01),world),null);
  const s=openDialogue(atDistance(40),world);
  assert.equal(s.dialogue.name,'하나');assert.equal(s.dialogue.lines.length,2);
  assert.equal(openDialogue(s,world),s);
});
test('대화 중 모든 이동을 막고 닫은 뒤 이동을 재개한다',()=>{
  const s=openDialogue(atDistance(40),world);
  for(const input of [{x:1,y:0},{x:0,y:1},{x:-1,y:-1}])assert.deepEqual(update(s,input,.05,world).player,s.player);
  const closed=closeDialogue(s);assert.equal(closed.dialogue,null);
  assert(update(closed,{x:0,y:1},.05,world).player.y>closed.player.y);
  assert(s.dialogue); // 원래 상태는 바뀌지 않습니다.
});
test('NPC 목록이 없는 기존 맵에서도 동작한다',()=>{
  const map={...world,npcs:undefined},s=createState(map);
  assert.equal(nearbyNpc(s,map),null);assert.equal(openDialogue(s,map),s);
});
