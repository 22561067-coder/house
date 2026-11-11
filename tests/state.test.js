import test from 'node:test';
import assert from 'node:assert/strict';
import {world} from '../src/world.js';
import {createState,update,isBlocked,overlaps} from '../src/state.js';
const walk=(state,input,frames=120,map=world)=>{for(let i=0;i<frames;i++)state=update(state,input,1/60,map);return state;};
test('유효한 시작점, 입력 방향 이동, 상태 불변성',()=>{
  const s=createState(world),before=structuredClone(s);
  assert(!isBlocked(s.player,world));
  for(const input of [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]){
    const next=update(s,input,1/60,world);
    assert.equal(Math.sign(next.player.x-s.player.x),input.x);
    assert.equal(Math.sign(next.player.y-s.player.y),input.y);
  }
  assert.deepEqual(s,before);
});
test('대각선과 직선 이동의 속도가 같다',()=>{
  const s=createState(world),a=update(s,{x:1,y:0},.04,world),b=update(s,{x:1,y:1},.04,world);
  assert(Math.abs(Math.hypot(a.player.x-s.player.x,a.player.y-s.player.y)-Math.hypot(b.player.x-s.player.x,b.player.y-s.player.y))<1e-8);
});
test('모든 장애물을 사방에서 장시간 밀어도 통과하지 않는다',()=>{
  for(const o of world.obstacles){
    const map={...world,obstacles:[o]};
    for(const [x,y,dx,dy] of [[o.x-24,o.y,1,0],[o.x+o.width,o.y,-1,0],[o.x,o.y-24,0,1],[o.x,o.y+o.height,0,-1]]){
      const state=walk({...createState(map),player:{x,y,width:24,height:24}},{x:dx,y:dy},240,map);
      assert(!overlaps(state.player,o),o.id);
      assert.equal(state.player.x,x);assert.equal(state.player.y,y);
    }
  }
});
test('사방 경계를 넘지 않고 긴 프레임에서도 장애물을 관통하지 않는다',()=>{
  const map={...world,obstacles:[]};
  for(const input of [{x:-1,y:0},{x:1,y:0},{x:0,y:-1},{x:0,y:1}])assert(!isBlocked(walk(createState(map),input,1000,map).player,map));
  const thin={...map,obstacles:[{x:500,y:0,width:1,height:640}]};
  const state=update({...createState(thin),player:{x:475,y:300,width:24,height:24}},{x:1,y:0},10,thin);
  assert(state.player.x+24<=500);
});
test('벽 옆 대각선 입력으로 벽을 따라 이동할 수 있다',()=>{
  const map={...world,obstacles:[{x:100,y:0,width:30,height:640}]};
  const s={...createState(map),player:{x:76,y:200,width:24,height:24}};
  const next=walk(s,{x:1,y:1},20,map);
  assert.equal(next.player.x,76);assert(next.player.y>200);
});
