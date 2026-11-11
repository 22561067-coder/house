import {nearbyNpc} from './dialogue.js';
import {nearEntrance} from './decoration.js';
import {oval,round,line,flower,mushroom,person,bubble,paperTexture,ink} from './art.js';
import {background,canopy,fern,shrub,basket,stones} from './scenery.js';

function house(c,o){
  const {x,y,width:w,height:h}=o,home=o.id==='home';
  oval(c,x+w/2,y+h+2,w*.55,10,'#9c77452a');
  round(c,x+7,y+40,w-14,h-40,[30,30,15,15],'#f6d6a2',ink);
  for(let i=0;i<6;i++){line(c,[[x+16,y+63+i*12],[x+w-14,y+62+i*12]],'#b3865c28');}
  // 알록달록한 버섯 지붕. 출입 위치는 기존 문과 일치합니다.
  c.beginPath();c.moveTo(x+2,y+64);c.bezierCurveTo(x+6,y+8,x+w*.31,y-4,x+w*.55,y+2);c.bezierCurveTo(x+w*.82,y+2,x+w-1,y+26,x+w-2,y+64);c.bezierCurveTo(x+w*.68,y+82,x+w*.31,y+78,x+2,y+64);c.fillStyle=home?'#c46b45':'#929747';c.fill();c.strokeStyle=ink;c.lineWidth=2.5;c.stroke();
  c.beginPath();c.moveTo(x+8,y+61);c.quadraticCurveTo(x+w/2,y+74,x+w-8,y+61);c.strokeStyle=home?'#e5a067':'#c3be74';c.lineWidth=5;c.stroke();
  [[.2,36,.09,.045],[.43,18,.105,.055],[.7,30,.1,.05],[.85,54,.07,.035],[.48,51,.095,.04],[.16,55,.04,.025]].forEach(([a,b,r,s])=>oval(c,x+w*a,y+b,w*r,w*s,home?'#ffe0a0':'#d4ca85'));
  for(let i=0;i<24;i++){let xx=x+20+(i*23%(w-40)),yy=y+23+(i*17%34);oval(c,xx,yy,1.5,1,home?'#a7543d40':'#697c3d60');}
  round(c,x+w/2-17,y+h-47,34,46,[16,16,3,3],'#a97243',ink);
  for(let i=0;i<4;i++)line(c,[[x+w/2-10+i*7,y+h-34],[x+w/2-10+i*7,y+h-3]],'#d2a66d',1);
  oval(c,x+w/2+9,y+h-20,2.5,2.5,'#f6d588',ink);
  [x+35,x+w-35].forEach(cx=>{
    oval(c,cx,y+h-33,14,16,'#a3bba1',ink);line(c,[[cx-13,y+h-33],[cx+13,y+h-33]],'#ffe6b8',2);line(c,[[cx,y+h-48],[cx,y+h-18]],'#ffe6b8',2);
    round(c,cx-20,y+h-18,40,9,3,'#ba7a4e',ink);for(let j=0;j<5;j++)flower(c,cx-14+j*7,y+h-21,.65,j%2?'#edbd6e':'#f7e5b0');
  });
  fern(c,x-3,y+h,.65);mushroom(c,x+11,y+h-1,.8);mushroom(c,x+23,y+h+3,.5);shrub(c,x+w-7,y+h-2,.5);
  if(home){basket(c,x+w+9,y+h-4,.6);stones(c,x+w/2-10,y+h+10,4,8,9);}
  else{round(c,x+w-15,y-10,13,31,3,'#b87a50',ink);oval(c,x+w-9,y-13,12,4,'#d4ac73',ink);}
}
function pond(c,o){
  let {x,y,width:w,height:h}=o;
  round(c,x,y,w,h,26,'#afa76a','#858648');round(c,x+6,y+5,w-12,h-10,24,'#87ac90','#6f8b66');
  const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#b4cba2');g.addColorStop(1,'#79a597');round(c,x+12,y+12,w-24,h-24,20,g);
  for(let i=0;i<14;i++){let xx=x+22+(i*37%(w-48)),yy=y+20+(i*29%(h-40));line(c,[[xx,yy],[xx+12,yy-1],[xx+20,yy]],'#d7dba9',1.3);}
  [[.22,.3],[.71,.7],[.65,.32],[.37,.67]].forEach(([a,b],i)=>{oval(c,x+w*a,y+h*b,15,8,'#91ad70','#6c864e');line(c,[[x+w*a,y+h*b],[x+w*a+13,y+h*b-5]],'#c1c77c');if(i%2)flower(c,x+w*a,y+h*b-5,.9,'#f6d6b2');});
  for(let i=0;i<9;i++)oval(c,x+12+i*23,y+h-2+(i%2)*3,7+i%3,4,'#d7ba88','#a07d51');
  for(let i=0;i<5;i++){fern(c,x+5,y+25+i*18,.4);flower(c,x+w-2,y+15+i*19,.6,'#eed4a0');}
}
let scenery;
export function render(c,state,map,debug=false){
  if(!scenery){
    scenery=document.createElement('canvas');scenery.width=map.width;scenery.height=map.height;
    const s=scenery.getContext('2d');s.lineCap='round';s.lineJoin='round';background(s,map);
    map.obstacles.forEach(o=>{if(o.kind==='house')house(s,o);else if(o.kind==='pond')pond(s,o);else canopy(s,o.x+o.width/2,o.y+o.height-15,o.id==='tree-1'?1.3:1,o.id==='tree-1');});
    paperTexture(s,map.width,map.height);
  }
  c.clearRect(0,0,map.width,map.height);c.drawImage(scenery,0,0);
  [...(map.npcs??[]).map(n=>({...n,npc:true})),{...state.player,npc:false}].sort((a,b)=>a.y-b.y).forEach(p=>person(c,p,p.npc));
  const nearby=nearbyNpc(state,map);
  if(nearby&&!state.dialogue)bubble(c,'E  대화하기',nearby.x+12,nearby.y-66);
  if(nearEntrance(state)&&!state.dialogue)bubble(c,'E  집에 들어가기',248,278);
  if(debug){c.strokeStyle='#b04444';c.lineWidth=1;[...map.obstacles,state.player].forEach(o=>c.strokeRect(o.x+.5,o.y+.5,o.width-1,o.height-1));}
}
