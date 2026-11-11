import {overlaps} from './state.js';

export const entrance = {x:248,y:268,radius:60};
export const room = {x:96,y:96,width:768,height:448};
export const exitArea = {x:416,y:480,width:128,height:64};
export const furnitureTypes = {
  Chair:{width:32,height:32}, Table:{width:64,height:64},
};
export function nearEntrance(state){
  const p=state.player;
  return state.scene!=='house' && Math.hypot(p.x+p.width/2-entrance.x,p.y+p.height/2-entrance.y)<=entrance.radius;
}
export function enterHouse(state){
  if(state.dialogue || !nearEntrance(state))return state;
  return {...state,scene:'house',tool:null,selected:null,notice:'Chair 또는 Table을 고르고 방 안을 클릭하세요.'};
}
export function leaveHouse(state){
  return {...state,scene:'village',tool:null,selected:null,notice:''};
}
export function chooseFurniture(state,type){
  if(state.scene!=='house'||!furnitureTypes[type])return state;
  return {...state,tool:type,selected:null,notice:`${type} 선택 · 빈 바닥을 클릭하세요.`};
}
export function canPlaceFurniture(f,items){
  return f.x>=room.x && f.y>=room.y && f.x+f.width<=room.x+room.width &&
    f.y+f.height<=room.y+room.height && !overlaps(f,exitArea) && !items.some(o=>overlaps(f,o));
}
export function clickRoom(state,x,y){
  if(state.scene!=='house'||!Number.isFinite(x)||!Number.isFinite(y))return state;
  const items=state.furniture??[];
  const hit=[...items].reverse().find(f=>x>=f.x&&x<f.x+f.width&&y>=f.y&&y<f.y+f.height);
  if(hit)return {...state,selected:hit.id,tool:null,notice:`${hit.type} 선택됨 · Delete로 삭제`};
  if(!state.tool)return {...state,selected:null,notice:'가구 버튼을 먼저 선택하세요.'};
  const f={id:state.nextFurnitureId??1,type:state.tool,x:Math.floor(x/32)*32,y:Math.floor(y/32)*32,...furnitureTypes[state.tool]};
  if(!canPlaceFurniture(f,items))return {...state,notice:'방 안의 빈 바닥에 배치하세요. 출구와 다른 가구는 비워 두세요.'};
  return {...state,furniture:[...items,f],nextFurnitureId:f.id+1,selected:null,tool:null,notice:`${f.type} 배치 완료 · 가구를 클릭하면 선택됩니다.`};
}
export function deleteFurniture(state){
  if(state.scene!=='house'||state.selected==null)return state;
  return {...state,furniture:(state.furniture??[]).filter(f=>f.id!==state.selected),selected:null,notice:'선택한 가구를 삭제했습니다.'};
}
export function cancelDecoration(state){return {...state,tool:null,selected:null,notice:'선택을 취소했습니다.'};}
