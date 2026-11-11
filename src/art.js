// 공통 일러스트 도구. 게임 상태와 충돌 영역을 변경하지 않습니다.
export const ink='#875036';
export function oval(c,x,y,rx,ry,fill,stroke=null){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.6;c.stroke();}}
export function round(c,x,y,w,h,r,fill,stroke=null){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.8;c.stroke();}}
export function line(c,points,color=ink,width=1.5){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
export function text(c,s,x,y,color=ink,size=12){c.fillStyle=color;c.font=`600 ${size}px "Malgun Gothic",sans-serif`;c.textAlign='center';c.fillText(s,x,y);}
export function flower(c,x,y,s=1,color='#c98463'){line(c,[[x,y+9*s],[x,y]],'#7d8b50',1.4);oval(c,x-3*s,y+5*s,4*s,1.8*s,'#9ba15d');for(let i=0;i<5;i++){let a=i*Math.PI*2/5;oval(c,x+Math.cos(a)*3*s,y+Math.sin(a)*3*s,2.5*s,2.5*s,color);}oval(c,x,y,1.8*s,1.8*s,'#efcc7f');}
export function mushroom(c,x,y,s=1){round(c,x-3*s,y-3*s,6*s,12*s,3*s,'#f7e6c3',ink);c.beginPath();c.moveTo(x-10*s,y);c.bezierCurveTo(x-10*s,y-15*s,x+10*s,y-15*s,x+10*s,y);c.quadraticCurveTo(x,y+4*s,x-10*s,y);c.fillStyle='#bd6b51';c.fill();c.strokeStyle=ink;c.lineWidth=1.3;c.stroke();oval(c,x-4*s,y-5*s,2*s,1.4*s,'#f6dfad');oval(c,x+4*s,y-7*s,2*s,1.4*s,'#f6dfad');}
export function person(c,p,npc=false){
  const x=p.x+p.width/2,y=p.y+p.height;
  oval(c,x,y+1,17,5,'#72543130');
  if(!npc){oval(c,x-7,y-35,5,11,'#f9ebca',ink);oval(c,x+7,y-37,5,11,'#f9ebca',ink);oval(c,x-7,y-35,2,6,'#e9bb91');oval(c,x+7,y-37,2,6,'#e9bb91');}
  oval(c,x,y-18,17,22,npc?'#f3d6a3':'#fff0d0',ink);
  oval(c,x-9,y-1,5,3,'#e1b889',ink);oval(c,x+9,y-1,5,3,'#e1b889',ink);
  oval(c,x-15,y-14,4,7,npc?'#eed19f':'#f9e8c5',ink);oval(c,x+15,y-14,4,7,npc?'#eed19f':'#f9e8c5',ink);
  oval(c,x-6,y-24,1.8,2.3,ink);oval(c,x+6,y-24,1.8,2.3,ink);
  oval(c,x-10,y-19,4,2,'#e7a47f');oval(c,x+10,y-19,4,2,'#e7a47f');
  c.beginPath();c.arc(x,y-22,3,.15,Math.PI-.15);c.strokeStyle=ink;c.lineWidth=1.4;c.stroke();
  if(npc){
    c.beginPath();c.moveTo(x-24,y-32);c.bezierCurveTo(x-28,y-62,x+25,y-62,x+25,y-32);c.quadraticCurveTo(x,y-25,x-24,y-32);c.fillStyle='#c9744e';c.fill();c.strokeStyle=ink;c.lineWidth=2;c.stroke();
    [[-13,-39,5,3],[0,-47,6,4],[13,-38,5,3]].forEach(([a,b,r,s])=>oval(c,x+a,y+b,r,s,'#ffe5b4'));
    round(c,x-11,y-14,22,9,5,'#97a15d',ink);flower(c,x+10,y-11,.65,'#f5deb4');
  }else{
    round(c,x-14,y-14,28,7,4,'#cb8156',ink);round(c,x+6,y-10,7,12,3,'#cb8156',ink);
    oval(c,x-9,y-44,4,2,'#98ab5b');
  }
}
export function bubble(c,s,x,y){c.save();c.font='600 12px "Malgun Gothic",sans-serif';let w=c.measureText(s).width+30;round(c,x-w/2,y-23,w,30,12,'#fff4dbee','#b58c67');text(c,s,x,y-3);c.restore();}
let paper;
export function paperTexture(c,w,h){if(!paper){paper=document.createElement('canvas');paper.width=960;paper.height=640;let p=paper.getContext('2d'),seed=47;for(let i=0;i<65000;i++){seed=(seed*16807)%2147483647;let x=seed%960;seed=(seed*16807)%2147483647;let y=seed%640;p.fillStyle=i%2?'#87512217':'#fff6d82b';p.fillRect(x,y,1+(i%3),1);}}c.drawImage(paper,0,0,w,h);}
