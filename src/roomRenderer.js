import {room,exitArea} from './decoration.js';
import {oval,round,line,flower,mushroom,paperTexture,ink} from './art.js';
import {fern,basket} from './scenery.js';
export function renderRoom(c,state,map){
  c.clearRect(0,0,map.width,map.height);c.fillStyle='#d9c5a5';c.fillRect(0,0,map.width,map.height);round(c,68,55,824,510,24,'#a98a6850');round(c,80,55,800,489,20,'#f1dfbb',ink);
  c.save();c.beginPath();c.rect(room.x,room.y,room.width,room.height);c.clip();c.fillStyle='#dcba8e';c.fillRect(room.x,room.y,room.width,room.height);
  for(let y=96;y<544;y+=32){c.fillStyle=y%64?'#dfbf96':'#e6c69f';c.fillRect(96,y,768,32);line(c,[[96,y],[864,y]],'#b5916b60',1);for(let x=96+(y%64?0:96);x<864;x+=192){line(c,[[x,y],[x,y+32]],'#b5916b50',1);line(c,[[x+13,y+11],[x+53,y+10],[x+72,y+12]],'#ba936632',1);}}
  c.fillStyle='#fff0bf35';c.beginPath();c.moveTo(430,96);c.lineTo(530,96);c.lineTo(650,400);c.lineTo(490,400);c.fill();c.restore();
  round(c,416,60,128,32,14,'#a4beb0',ink);line(c,[[480,61],[480,91]],'#fdf0cf',3);line(c,[[420,76],[540,76]],'#fdf0cf',2);line(c,[[410,58],[410,92]],'#bb8064',7);line(c,[[550,58],[550,92]],'#bb8064',7);
  for(let x=116;x<850;x+=90){oval(c,x,74,3,3,'#c99c7960');flower(c,x+15,78,.55,'#c79870');}
  // 벽과 방 가장자리의 작은 소품. 배치 공간과 출구는 그대로 유지합니다.
  [170,710].forEach(x=>{round(c,x,65,76,20,4,'#b7895e',ink);for(let i=0;i<7;i++)round(c,x+7+i*9,51-i%3*4,7,27+i%3*4,2,['#a3a775','#c6906a','#dcc28d'][i%3],ink);round(c,x-3,84,82,5,2,'#a7764e',ink);});
  round(c,296,53,43,38,6,'#b48a5e',ink);round(c,301,58,33,28,3,'#e8d5a6');flower(c,317,70,.9,'#be7b56');
  [77,882].forEach(x=>{round(c,x-12,136,24,31,7,'#ba835b',ink);fern(c,x,138,.8);mushroom(c,x-5,145,.5);basket(c,x,478,.7);fern(c,x,473,.8);});
  for(let x=130;x<845;x+=35){line(c,[[x,55],[x+9,60],[x+21,55]],'#91965a',1.4);oval(c,x+6,57,4,2,'#a0a866');}
  round(c,exitArea.x+2,exitArea.y+4,exitArea.width-4,exitArea.height-8,15,'#b4b18b','#8d9270');round(c,exitArea.x+8,exitArea.y+10,exitArea.width-16,exitArea.height-20,10,'#c6c29c');
  for(let i=0;i<7;i++)line(c,[[exitArea.x+15+i*16,exitArea.y+10],[exitArea.x+15+i*16,exitArea.y+54]],'#e5dbaf',1.5);
  (state.furniture??[]).forEach(f=>{let {x,y,width:w,height:h}=f;oval(c,x+w/2,y+h-2,w*.45,4,'#7a52362a');
    if(f.type==='Chair'){line(c,[[x+7,y+21],[x+6,y+30]],ink,3);line(c,[[x+25,y+21],[x+26,y+30]],ink,3);round(c,x+5,y+2,22,19,8,'#bf9168',ink);line(c,[[x+11,y+6],[x+11,y+16]],'#e1bd8a',2);line(c,[[x+21,y+6],[x+21,y+16]],'#e1bd8a',2);oval(c,x+16,y+22,13,6,'#dfb786',ink);oval(c,x+16,y+21,9,3.5,'#b2ad7f');}
    else{line(c,[[x+12,y+34],[x+9,y+59]],ink,5);line(c,[[x+51,y+34],[x+54,y+59]],ink,5);round(c,x+2,y+5,60,43,15,'#a67854',ink);oval(c,x+32,y+23,30,21,'#d8b181',ink);line(c,[[x+12,y+18],[x+25,y+15],[x+43,y+17]],'#b98e64');oval(c,x+35,y+26,10,7,'#f5e5c8','#d6ba91');oval(c,x+35,y+25,5,4,'#ac7855');oval(c,x+41,y+24,3,2,'#f7e7ca',ink);flower(c,x+20,y+15,.65,'#d49878');}
    if(f.id===state.selected){c.save();c.setLineDash([5,4]);c.strokeStyle='#9e614b';c.lineWidth=2;c.beginPath();c.roundRect(x+1,y+1,w-2,h-2,7);c.stroke();c.restore();}
  });paperTexture(c,map.width,map.height);
}
