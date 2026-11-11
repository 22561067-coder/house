import {WIDTH,HEIGHT,definition,itemRect} from './gardenState.js';
let ground;
export function prepareAtlas(image){
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
  const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
  const data=c.getImageData(0,0,image.width,image.height).data;
  return (item,u,v)=>{const tile=definition(item.type).tile,cell=image.width/4;
    const x=Math.min(image.width-1,Math.floor((tile%4+u)*cell)),y=Math.min(image.height-1,Math.floor((Math.floor(tile/4)+v)*image.height/4));
    return data[(y*image.width+x)*4+3]>35;
  };
}
function groundLayer(){
  if(ground)return ground;
  ground=document.createElement('canvas');ground.width=WIDTH;ground.height=HEIGHT;
  const c=ground.getContext('2d');c.fillStyle='#f3cda4';c.fillRect(0,0,WIDTH,HEIGHT);
  const glow=c.createRadialGradient(600,290,80,600,380,760);glow.addColorStop(0,'#ffe2b75a');glow.addColorStop(1,'#c58d6226');c.fillStyle=glow;c.fillRect(0,0,WIDTH,HEIGHT);
  let seed=9123;const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
  for(let i=0;i<78000;i++){const x=rand()*WIDTH,y=rand()*HEIGHT;c.fillStyle=i%3?'#a35f2b13':'#fff3ce48';c.fillRect(x,y,rand()*2+.3,rand()*1.3+.3);}
  return ground;
}
export function drawTile(c,image,tile,r,flip=false){
  const cellW=image.width/4,cellH=image.height/4;
  c.save();if(flip){c.translate(r.x+r.width,r.y);c.scale(-1,1);}else c.translate(r.x,r.y);
  c.drawImage(image,tile%4*cellW,Math.floor(tile/4)*cellH,cellW,cellH,0,0,r.width,r.height);c.restore();
}
function rabbitPose(t){
  const blink=t%5.3;if(blink>4.96&&blink<5.16)return 13;
  const cycle=t%14;if(cycle>8.8&&cycle<10)return 14;if(cycle>11.5&&cycle<12.8)return 15;
  return 12;
}
export function renderGarden(c,state,image,time,effects,hover,dragging=false){
  c.clearRect(0,0,WIDTH,HEIGHT);c.drawImage(groundLayer(),0,0);
  const sorted=[...state.items].sort((a,b)=>a.y-b.y||a.id-b.id);
  for(const item of sorted){
    const def=definition(item.type),base=itemRect(item),born=effects.find(e=>e.id===item.id&&e.kind==='place');
    const age=born?(time-born.time):2;
    let scale=1,dy=0;
    if(age<.55){const t=Math.max(0,age/.55);scale=1+Math.sin(t*Math.PI*2.5)*(1-t)*.15;dy=-Math.sin(t*Math.PI)*13;}
    const rabbit=item.type==='rabbit';
    const breath=rabbit?Math.sin(time*2.3)*.012:0;
    const sway=['willow','tree','fern','flowers','grass'].includes(item.type)?Math.sin(time*.85+item.id)*.008:0;
    c.save();c.translate(item.x,item.y);c.scale(scale,scale);c.rotate(sway);
    c.fillStyle='#75432b20';c.beginPath();c.ellipse(0,0,def.size*item.scale*.19,def.size*item.scale*.045,0,0,Math.PI*2);c.fill();
    c.translate(0,dy);c.scale(1-breath,1+breath);
    const pet=rabbit&&effects.some(e=>e.id===item.id&&e.kind==='pet'&&time-e.time<1);
    drawTile(c,image,rabbit?(pet?15:rabbitPose(time)):def.tile,{...base,x:base.x-item.x,y:base.y-item.y},item.flip);
    if(item.type==='lantern'){
      const r=def.size*item.scale*.16;const g=c.createRadialGradient(0,-base.height*.5,0,0,-base.height*.5,r*2);g.addColorStop(0,`rgba(255,197,83,${.16+Math.sin(time*5)*.04})`);g.addColorStop(1,'#ffd48a00');c.fillStyle=g;c.fillRect(-r*2,-base.height*.5-r*2,r*4,r*4);
    }
    c.restore();
    if(item.id===state.selected&&!state.brush){
      c.save();c.strokeStyle='#a75536bb';c.lineWidth=1.8;c.setLineDash([3,5]);c.beginPath();c.ellipse(item.x,item.y+3,def.size*item.scale*.27,def.size*item.scale*.075,0,0,Math.PI*2);c.stroke();c.restore();
      c.fillStyle='#fff0c8';c.strokeStyle='#ae6342';c.beginPath();c.arc(item.x,item.y+4,4,0,7);c.fill();c.stroke();
    }
  }
  if(hover&&state.brush&&!dragging){
    const item={type:state.brush,x:hover.x,y:hover.y,scale:1,flip:false};c.save();c.globalAlpha=.55;drawTile(c,image,definition(item.type).tile,itemRect(item));c.restore();
    c.strokeStyle='#9d704580';c.setLineDash([2,5]);c.beginPath();c.ellipse(hover.x,hover.y,25,7,0,0,7);c.stroke();c.setLineDash([]);
  }
  for(const e of effects){
    const age=time-e.time;if(age<0||age>1)continue;const t=age;
    c.save();c.globalAlpha=(1-t)*.7;c.strokeStyle=e.kind==='delete'?'#b88c5a':'#fff3bf';c.lineWidth=2;c.beginPath();c.ellipse(e.x,e.y,10+t*35,3+t*11,0,0,7);c.stroke();
    for(let i=0;i<8;i++){const a=i*Math.PI/4,rx=e.x+Math.cos(a)*(10+t*34),ry=e.y-12+Math.sin(a)*t*20-t*25;c.fillStyle=i%2?'#f9e9b1':'#c69455';c.beginPath();c.ellipse(rx,ry,1.8*(1-t)+.4,2.5*(1-t)+.4,a,0,7);c.fill();}
    c.restore();
  }
}
