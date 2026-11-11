import {oval,round,line,flower,mushroom,ink} from './art.js';

const greens=['#7c924a','#96a44f','#657c43','#a4ad62','#879f54'];
export function leaf(c,x,y,w,h,a,color){c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-w,-h*.4,-w*.6,-h,0,-h);c.bezierCurveTo(w*.7,-h,w,-h*.3,0,0);c.fillStyle=color;c.fill();c.strokeStyle='#63723b';c.lineWidth=.8;c.stroke();line(c,[[0,-1],[0,-h+3]],'#d5d28a70',.7);c.restore();}
export function fern(c,x,y,s=1){
  for(let j=-1;j<=1;j++){c.save();c.translate(x,y);c.rotate(j*.6);line(c,[[0,0],[0,-28*s]],'#6f7b40',1.2);for(let i=0;i<5;i++){const k=5-i;leaf(c,0,-i*4.5*s,k*s,10*s,-.85,'#8d9a50');leaf(c,0,-i*4.5*s,k*s,10*s,.85,'#9ba65a');}c.restore();}
}
export function shrub(c,x,y,s=1){
  oval(c,x,y+2,25*s,7*s,'#6a74302b');
  for(let i=0;i<12;i++){const a=i*2.4,r=9+(i%3)*5;oval(c,x+Math.cos(a)*r*s,y-9*s+Math.sin(a)*r*s,9*s,8*s,greens[i%5],'#6c783f');}
  for(let i=0;i<18;i++)line(c,[[x+(i*13%37-18)*s,y+(i*7%26-24)*s],[x+(i*13%37-15)*s,y+(i*7%26-27)*s]],'#c6c77c',1);
}
function grass(c,x,y,s=1){for(let j=-2;j<=2;j++){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+j*2*s,y-7*s,x+j*4*s,y-(8+Math.abs(j)%2*4)*s);c.strokeStyle=greens[(j+3)%5];c.lineWidth=1.4*s;c.stroke();}}
export function stones(c,x,y,count=5,dx=14,dy=4){for(let i=0;i<count;i++){let xx=x+i*dx,yy=y+i*dy+(i%2)*3;oval(c,xx,yy,7+i%3,4,'#e3c397','#ae7957');line(c,[[xx-3,yy-2],[xx+2,yy-3]],'#fae1ac',1);}}
export function basket(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);round(c,-16,-6,32,22,6,'#b49b55',ink);for(let i=-12;i<16;i+=6)line(c,[[i,-5],[i+1,13]],'#ead18c',1);for(let j=0;j<15;j+=5)line(c,[[-15,j],[15,j]],'#7f7945',1);c.beginPath();c.ellipse(0,-6,16,7,0,Math.PI,Math.PI*2);c.strokeStyle=ink;c.lineWidth=2;c.stroke();for(let i=0;i<4;i++)oval(c,-10+i*7,-7-i%2*3,5,6,i%2?'#d69557':'#e6c27e',ink);c.restore();}
function log(c,x,y){round(c,x,y,47,19,8,'#a3774f',ink);oval(c,x+43,y+9,10,10,'#e5c28c',ink);oval(c,x+43,y+9,6,6,'#d7b47d','#9b734b');oval(c,x+43,y+9,2,2,'#c89e67');line(c,[[x+6,y+5],[x+31,y+4]],'#d6af75',2);line(c,[[x+7,y+13],[x+30,y+11]],'#795941',1);}
export function background(c,map){
  c.fillStyle='#edd0a4';c.fillRect(0,0,map.width,map.height);
  // 풀 덩어리를 불규칙한 섬처럼 모아 손으로 그린 숲 바닥을 만듭니다.
  for(let i=0;i<84;i++){
    const x=(i*167+21)%960,y=(i*89+9)%640;
    if((y>272&&y<390)||(x>413&&x<532))continue;
    const r=18+i%24;
    for(let j=0;j<8;j++){let a=j*2.39;oval(c,x+Math.cos(a)*r*.65,y+Math.sin(a)*r*.37,r*.6,r*.4,['#a7b56c','#b5bd7a','#b9c385','#a0b16c'][i%4]);}
  }
  // 곡선 산책로, 기존 이동 가능한 십자 통로와 출입 위치를 유지합니다.
  c.beginPath();c.moveTo(-25,329);c.bezierCurveTo(190,294,280,354,470,328);c.bezierCurveTo(645,309,787,350,990,321);c.strokeStyle='#f6dcb5';c.lineWidth=66;c.lineCap='round';c.stroke();
  c.beginPath();c.moveTo(471,-20);c.bezierCurveTo(451,127,494,222,472,330);c.bezierCurveTo(450,450,489,552,470,660);c.lineWidth=65;c.stroke();
  c.beginPath();c.moveTo(248,250);c.quadraticCurveTo(230,294,249,331);c.lineWidth=43;c.stroke();
  for(let i=0;i<450;i++){
    let x=(i*131+23)%960,y=(i*83+51)%640;
    if((y>282&&y<379)||(x>422&&x<523)||map.obstacles.some(o=>x>o.x-9&&x<o.x+o.width+9&&y>o.y-9&&y<o.y+o.height+9))continue;
    grass(c,x,y,.45+(i%4)*.12);
    if(i%7===0)flower(c,x+3,y-4,.6+i%3*.1,['#bf7352','#faf0c4','#e7ad6c'][i%3]);
    if(i%29===0)mushroom(c,x,y,.5+i%3*.15);
  }
  for(let i=0;i<110;i++){let x=(i*79+17)%960,y=304+(i*19%49);oval(c,x,y,1.3,1,'#be8a5b45');}
  stones(c,208,278,6,14,8);stones(c,518,344,5,14,-6);stones(c,450,409,7,7,15);
  // 小道具는 장식 레이어이며 기존 충돌 데이터에는 손대지 않습니다.
  [[139,239,.7],[353,209,.7],[618,180,.8],[823,241,.7],[554,448,.7],[180,466,.9],[345,564,.8],[85,221,.7],[897,556,.8]].forEach(([x,y,s])=>{fern(c,x,y,s);mushroom(c,x+15,y+8,s);mushroom(c,x+27,y+10,s*.65);});
  [[114,264,.6],[357,245,.8],[618,249,.7],[836,266,.7],[571,496,.8],[284,462,.8],[139,581,.9],[789,589,.8]].forEach(([x,y,s])=>{shrub(c,x,y,s);for(let i=0;i<5;i++)flower(c,x-17+i*9*s,y+12,.6,i%2?'#edc287':'#f6e6bd');});
  basket(c,350,271,.75);basket(c,819,251,.65);log(c,99,506);log(c,760,70);
  for(let i=0;i<17;i++){const x=12+i*60;shrub(c,x,7,.9);if(i%2)mushroom(c,x+13,26,.8);shrub(c,x+13,635,.9);}
  for(let i=0;i<9;i++){let y=45+i*72;if(y>280&&y<380)continue;shrub(c,4,y,.9);shrub(c,958,y+20,.9);mushroom(c,26,y+17,.75);}
}
export function canopy(c,x,y,s=1,willow=false){
  c.save();c.translate(x,y);c.scale(s,s);
  oval(c,0,14,40,11,'#69573030');
  c.beginPath();c.moveTo(-9,18);c.quadraticCurveTo(0,-10,-12,-43);c.lineTo(8,-43);c.quadraticCurveTo(10,-3,15,18);c.quadraticCurveTo(0,11,-9,18);c.fillStyle='#b18757';c.fill();c.strokeStyle=ink;c.lineWidth=2;c.stroke();line(c,[[1,12],[2,-20],[-14,-33]],'#825936',2);
  if(willow){
    for(let i=0;i<16;i++){let a=i*2.4;oval(c,Math.cos(a)*29,-41+Math.sin(a)*16,24,18,greens[i%5],'#6b7d42');}
    for(let i=-8;i<=8;i++){let xx=i*5,yy=-43+Math.abs(i)*1.7;c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx+10,yy+28,xx-1,yy+50-Math.abs(i)*2);c.strokeStyle='#869b4d';c.lineWidth=5;c.stroke();for(let j=0;j<7;j++)leaf(c,xx+Math.sin(j)*2,yy+j*5,2,7,j%2?.4:-.4,j%2?'#a4af60':'#718948');}
  }else{
    for(let i=0;i<13;i++){let a=i*2.4;oval(c,Math.cos(a)*24,-32+Math.sin(a)*20,23,19,greens[i%5],'#66783f');}
    for(let i=0;i<65;i++){let xx=(i*17%70)-35,yy=(i*13%47)-55;if(xx*xx/1500+(yy+31)*(yy+31)/700<1){line(c,[[xx,yy],[xx+2,yy-3],[xx+4,yy]],i%2?'#c3c67a':'#5e7945',1.4);}}
  }
  mushroom(c,-20,17,.75);mushroom(c,-31,20,.5);fern(c,25,21,.55);c.restore();
}
