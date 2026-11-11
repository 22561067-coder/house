import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import atlasUrl from './atlasData.js';
import {WIDTH,HEIGHT,catalog,createGarden,placeItem,deleteSelected,moveItem,scaleSelected,flipSelected,hitItem,inside} from './gardenState.js';
import {prepareAtlas,renderGarden} from './gardenRender.js';
import './style.css';

function Icon({name}){return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{name==='select'?<path d="M5 3L18 13L12 14L9 20Z"/>:name==='delete'?<><path d="M5 6H19M8 6V3H16V6M7 6L8 21H16L17 6M10 10V17M14 10V17"/></>:name==='undo'?<path d="M8 5L3 10L8 15M3 10H13Q21 10 20 18"/>:name==='redo'?<path d="M16 5L21 10L16 15M21 10H11Q3 10 4 18"/>:name==='flip'?<><path d="M12 3V21M3 17L9 7V17ZM21 17L15 7V17Z"/></>:name==='plus'?<path d="M5 12H19M12 5V19"/>:name==='minus'?<path d="M5 12H19"/>:<path d="M5 9L12 16L19 9"/>}</svg>;}
function App(){
  const canvas=useRef(),scene=useRef(createGarden()),atlas=useRef(),alpha=useRef(),effects=useRef([]),hover=useRef(null),drag=useRef(null),past=useRef([]),future=useRef([]);
  const [view,setView]=useState(scene.current),[loaded,setLoaded]=useState('loading'),[folded,setFolded]=useState(false),[history,setHistory]=useState({past:0,future:0});
  function historyStatus(){setHistory({past:past.current.length,future:future.current.length});}
  function commit(next,remember=false){if(next===scene.current)return;if(remember){past.current.push(scene.current);if(past.current.length>80)past.current.shift();future.current=[];historyStatus();}scene.current=next;setView(next);}
  function effect(item,kind='place'){if(!item)return;effects.current.push({id:item.id,x:item.x,y:item.y,kind,time:performance.now()/1000});}
  function undo(){if(!past.current.length)return;future.current.push(scene.current);const next=past.current.pop();commit({...next,selected:null,brush:null});historyStatus();}
  function redo(){if(!future.current.length)return;past.current.push(scene.current);const next=future.current.pop();commit({...next,selected:null,brush:null});historyStatus();}
  function remove(){const item=scene.current.items.find(i=>i.id===scene.current.selected);if(!item)return;effect(item,'delete');commit(deleteSelected(scene.current),true);}
  function point(e){const r=canvas.current.getBoundingClientRect();return {x:(e.clientX-r.left)*WIDTH/r.width,y:(e.clientY-r.top)*HEIGHT/r.height};}
  function down(e){
    if(!atlas.current||e.button!==0)return;const p=point(e);hover.current=p;
    if(scene.current.brush){const next=placeItem(scene.current,scene.current.brush,p.x,p.y);if(next!==scene.current){effect(next.items.find(i=>i.id===next.selected));commit(next,true);}return;}
    const hit=hitItem(scene.current.items,p.x,p.y,alpha.current);
    commit({...scene.current,selected:hit?.id??null});
    if(hit){canvas.current.setPointerCapture(e.pointerId);drag.current={id:hit.id,at:p,item:hit,before:scene.current,moved:false};if(hit.type==='rabbit')effect(hit,'pet');}
  }
  function move(e){const p=point(e);hover.current=inside(p.x,p.y)?p:null;
    if(!drag.current)return;const d=drag.current,dx=p.x-d.at.x,dy=p.y-d.at.y;
    if(Math.hypot(dx,dy)>5)d.moved=true;
    if(d.moved)commit(moveItem(scene.current,d.id,Math.max(28,Math.min(WIDTH-28,d.item.x+dx)),Math.max(65,Math.min(HEIGHT-115,d.item.y+dy))));
  }
  function up(e){const d=drag.current;if(d?.moved){past.current.push(d.before);future.current=[];historyStatus();effect(scene.current.items.find(i=>i.id===d.id));}drag.current=null;if(canvas.current.hasPointerCapture(e.pointerId))canvas.current.releasePointerCapture(e.pointerId);}
  function cancel(e){if(drag.current)commit(drag.current.before);drag.current=null;hover.current=null;if(canvas.current.hasPointerCapture(e.pointerId))canvas.current.releasePointerCapture(e.pointerId);}
  useEffect(()=>{
    const img=new Image();let alive=true,frame;img.onload=()=>{if(!alive)return;atlas.current=img;alpha.current=prepareAtlas(img);setLoaded('ready');};img.onerror=()=>{if(alive)setLoaded('error');};img.src=atlasUrl;
    const c=canvas.current.getContext('2d');
    function loop(now){const t=now/1000;effects.current=effects.current.filter(e=>t-e.time<1.5);if(atlas.current)renderGarden(c,scene.current,atlas.current,t,effects.current,hover.current,!!drag.current);frame=requestAnimationFrame(loop);}
    frame=requestAnimationFrame(loop);
    function key(e){if(drag.current)return;
      if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove();}
      if(e.key==='Escape'){commit({...scene.current,brush:null,selected:null});hover.current=null;}
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();}
    }
    window.addEventListener('keydown',key);return()=>{alive=false;cancelAnimationFrame(frame);window.removeEventListener('keydown',key);};
  },[]);
  const selected=view.items.find(i=>i.id===view.selected);
  return <main className="garden" aria-label="토끼의 숲 공간 꾸미기">
    <canvas ref={canvas} width={WIDTH} height={HEIGHT} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onPointerLeave={()=>{if(!drag.current)hover.current=null;}} style={{cursor:view.brush?'crosshair':selected?'grab':'default'}} aria-label="숲 공간. 아래 소품을 고른 뒤 클릭해서 놓고, 물건을 클릭하거나 드래그해서 선택·이동하세요. Delete로 삭제합니다."/>
    {loaded!=='ready'&&<div className="loading" role="status">{loaded==='error'?'그림을 불러오지 못했어요. 새로고침해 주세요.':'✿'}</div>}
    <div className="history"><button aria-label="되돌리기" title="되돌리기 · Ctrl+Z" disabled={!history.past} onClick={undo}><Icon name="undo"/></button><button aria-label="다시 하기" title="다시 하기 · Ctrl+Shift+Z" disabled={!history.future} onClick={redo}><Icon name="redo"/></button></div>
    {selected&&!view.brush&&<div className="selection-tools" aria-label="선택한 오브젝트 편집"><button aria-label="작게" onClick={()=>commit(scaleSelected(scene.current,-.1),true)}><Icon name="minus"/></button><button aria-label="크게" onClick={()=>commit(scaleSelected(scene.current,.1),true)}><Icon name="plus"/></button><button aria-label="좌우 뒤집기" onClick={()=>commit(flipSelected(scene.current),true)}><Icon name="flip"/></button><button aria-label="선택 삭제" title="Delete" onClick={remove}><Icon name="delete"/></button></div>}
    <section className={'shelf '+(folded?'folded':'')} aria-label="배치할 자연물과 소품"><button className="shelf-toggle" aria-label={folded?'소품 펼치기':'소품 접기'} onClick={()=>setFolded(!folded)}><Icon name="fold"/></button>{!folded&&<><button className={'select-tool '+(!view.brush?'active':'')} aria-label="선택 모드" title="선택 · 드래그로 이동" onClick={()=>commit({...scene.current,brush:null})}><Icon name="select"/></button><div className="items">{catalog.map(d=><button key={d.type} className={'item '+(view.brush===d.type?'active':'')} aria-label={`${d.name} 배치`} aria-pressed={view.brush===d.type} title={d.name} onClick={()=>commit({...scene.current,brush:view.brush===d.type?null:d.type,selected:null})}><span className="thumbnail" style={{backgroundImage:`url(${atlasUrl})`,backgroundPosition:`${d.tile%4*100/3}% ${Math.floor(d.tile/4)*100/3}%`}}/><span className="item-name">{d.name}</span></button>)}</div></>}</section>
  </main>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
