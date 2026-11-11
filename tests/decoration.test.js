import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../src/state.js';
import {world} from '../src/world.js';
import {enterHouse,leaveHouse,chooseFurniture,clickRoom,deleteFurniture,nearEntrance} from '../src/decoration.js';
const atDoor=()=>({...createState(world),player:{x:236,y:256,width:24,height:24},eventProgress:{done:true}});
const inside=()=>enterHouse(atDoor());
const place=(s,type,x,y)=>clickRoom(chooseFurniture(s,type),x,y);
test('문 근처에서만 입장하며 대화 중에는 입장하지 않는다',()=>{
  const far=createState(world);assert.equal(enterHouse(far),far);
  assert(nearEntrance(atDoor()));assert.equal(inside().scene,'house');
  const talking={...atDoor(),dialogue:{name:'하나'}};assert.equal(enterHouse(talking),talking);
});
test('의자와 테이블 배치, 격자 정렬, 고유 ID',()=>{
  let s=place(inside(),'Chair',140,140);s=place(s,'Table',225,225);
  assert.equal(s.furniture.length,2);assert.equal(s.furniture[0].x,128);
  assert.equal(s.furniture[1].width,64);assert.notEqual(s.furniture[0].id,s.furniture[1].id);assert.equal(s.tool,null);
});
test('가구 선택 후 Delete, 선택 없이 삭제해도 안전',()=>{
  let s=place(inside(),'Chair',140,140);s=clickRoom(s,140,140);assert.equal(s.selected,s.furniture[0].id);
  s=deleteFurniture(s);assert.equal(s.furniture.length,0);assert.equal(s.selected,null);assert.equal(deleteFurniture(s),s);
});
test('실외 클릭/삭제, 도구 없이 클릭, 방 밖/출구/겹침 배치 방지',()=>{
  const outside=atDoor();assert.equal(clickRoom(outside,140,140),outside);assert.equal(deleteFurniture(outside),outside);
  assert.equal(clickRoom(inside(),140,140).furniture.length,0);
  for(const [x,y] of [[50,50],[850,530],[440,510]])assert.equal(place(inside(),'Table',x,y).furniture.length,0);
  const s=place(inside(),'Table',160,160);
  assert.equal(place(s,'Table',128,160).furniture.length,1);
  assert.equal(clickRoom(chooseFurniture(s,'Chair'),170,170).selected,s.furniture[0].id);
});
test('퇴장/재입장 시 가구와 야외 위치 및 기존 이벤트 상태 유지',()=>{
  const start=atDoor();let s=place(enterHouse(start),'Chair',140,140);
  s=leaveHouse(s);assert.equal(s.scene,'village');assert.deepEqual(s.player,start.player);assert.deepEqual(s.eventProgress,start.eventProgress);
  s=enterHouse(s);assert.equal(s.furniture.length,1);assert.equal(s.selected,null);
});
