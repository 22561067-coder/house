export const WIDTH=1200, HEIGHT=760;
export const catalog=[
  {type:'willow',name:'수양나무',tile:0,size:390},
  {type:'tree',name:'둥근 나무',tile:1,size:260},
  {type:'toadstools',name:'키 큰 버섯',tile:2,size:170},
  {type:'mushrooms',name:'작은 버섯',tile:3,size:106},
  {type:'flowers',name:'들꽃',tile:4,size:130},
  {type:'fern',name:'고사리',tile:5,size:140},
  {type:'grass',name:'클로버',tile:6,size:130},
  {type:'stones',name:'조약돌',tile:7,size:106},
  {type:'log',name:'통나무',tile:8,size:180},
  {type:'basket',name:'바구니',tile:9,size:112},
  {type:'stump',name:'그루터기 찻상',tile:10,size:142},
  {type:'lantern',name:'등불',tile:11,size:145},
  {type:'rabbit',name:'토끼',tile:12,size:114},
];
export const definition=type=>catalog.find(d=>d.type===type);
export function createGarden(){
  const arrangement=[
    ['tree',100,184,1.15],['willow',590,265,1.16],['tree',1110,210,1.2],
    ['toadstools',235,232,1.12],['mushrooms',326,240,.8],['fern',380,222,.9],
    ['flowers',785,240,1],['fern',929,225,1],['grass',1026,259,.8],
    ['stump',792,333,1],['basket',881,359,1],['stones',694,350,.8],
    ['mushrooms',169,333,.9],['flowers',338,347,.9],['fern',1030,367,1],
    ['stones',469,381,.8],['log',464,459,1.1],['rabbit',589,445,1],
    ['lantern',748,461,1],['flowers',800,440,.7],['stones',659,482,.65],
    ['tree',122,552,1.05],['toadstools',265,515,.9],['grass',341,535,.85],
    ['mushrooms',376,495,.65],['fern',1002,501,1],['grass',890,535,.9],
    ['flowers',748,563,.95],['grass',524,561,.7],['mushrooms',613,559,.75],
    ['tree',1139,573,1.05],['stones',938,577,.9],['fern',235,579,.7],
  ];
  return {items:arrangement.map(([type,x,y,scale],i)=>({id:i+1,type,x,y,scale,flip:false})),nextId:arrangement.length+1,selected:null,brush:null};
}
export function inside(x,y){return Number.isFinite(x)&&Number.isFinite(y)&&x>=28&&x<=WIDTH-28&&y>=65&&y<=HEIGHT-115;}
export function placeItem(state,type,x,y){
  if(!definition(type)||!inside(x,y))return state;
  const old=type==='rabbit'?state.items.find(i=>i.type==='rabbit'):null;
  if(old)return {...state,items:state.items.map(i=>i.id===old.id?{...i,x,y}:i),selected:old.id};
  const item={id:state.nextId,type,x,y,scale:1,flip:false};
  return {...state,items:[...state.items,item],nextId:state.nextId+1,selected:item.id};
}
export function deleteSelected(state){return state.selected==null?state:{...state,items:state.items.filter(i=>i.id!==state.selected),selected:null};}
export function moveItem(state,id,x,y){return !inside(x,y)?state:{...state,items:state.items.map(i=>i.id===id?{...i,x,y}:i)};}
export function scaleSelected(state,delta){return {...state,items:state.items.map(i=>i.id===state.selected?{...i,scale:Math.max(.55,Math.min(1.7,+(i.scale+delta).toFixed(2)))}:i)};}
export function flipSelected(state){return {...state,items:state.items.map(i=>i.id===state.selected?{...i,flip:!i.flip}:i)};}
export function itemRect(item){const size=definition(item.type).size*item.scale;return {x:item.x-size/2,y:item.y-size*.9,width:size,height:size};}
export function hitItem(items,x,y,alphaHit){
  return [...items].sort((a,b)=>b.y-a.y||b.id-a.id).find(i=>{const r=itemRect(i);const u=(x-r.x)/r.width,v=(y-r.y)/r.height;return u>=0&&u<1&&v>=0&&v<1&&(!alphaHit||alphaHit(i,i.flip?1-u:u,v));})??null;
}
