import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {world} from './world.js';
import {createState, update} from './state.js';
import {attachInput} from './input.js';
import {render} from './renderer.js';
import {openDialogue, closeDialogue} from './dialogue.js';
import {nearEntrance,enterHouse,leaveHouse,chooseFurniture,clickRoom,deleteFurniture,cancelDecoration} from './decoration.js';
import {renderRoom} from './roomRenderer.js';
import './style.css';

function App() {
  const canvas=useRef(null), game=useRef(createState(world));
  const [dialogue,setDialogue]=useState(null);
  const [view,setView]=useState(()=>game.current);
  const indoors=view.scene==='house';
  const closeButton=useRef(null);
  function commit(next){game.current=next;setView(next);}
  function reset(){if(game.current.dialogue||game.current.scene==='house')return;game.current={...game.current,player:createState(world).player};}
  function handleDialogue(action){
    if(game.current.scene==='house'){
      if(action==='close')commit(cancelDecoration(game.current));
      return;
    }
    if(action==='open'&&nearEntrance(game.current)&&!game.current.dialogue){commit(enterHouse(game.current));return;}
    game.current=action==='open'?openDialogue(game.current,world):closeDialogue(game.current);
    setDialogue(game.current.dialogue);
  }
  function handleRoomClick(e){
    if(game.current.scene!=='house')return;
    const rect=e.currentTarget.getBoundingClientRect();
    commit(clickRoom(game.current,(e.clientX-rect.left)*world.width/rect.width,(e.clientY-rect.top)*world.height/rect.height));
  }
  useEffect(()=>{if(dialogue)closeButton.current?.focus();},[dialogue]);
  useEffect(()=>{
    const ctx=canvas.current.getContext('2d');
    const input=attachInput(window,reset,handleDialogue,()=>commit(deleteFurniture(game.current)));
    let frame,previous;
    function loop(now){
      const dt=previous===undefined?0:(now-previous)/1000;
      previous=now;
      if(game.current.scene==='house')renderRoom(ctx,game.current,world);
      else{
        game.current=update(game.current,input.read(),dt,world);
        render(ctx,game.current,world);
      }
      frame=requestAnimationFrame(loop);
    }
    frame=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(frame);input.dispose();};
  },[]);
  return <main className="game" aria-label="숲속 마을 게임">
    <canvas ref={canvas} width={world.width} height={world.height} onClick={handleRoomClick} style={{cursor:indoors?'crosshair':'default'}} aria-label={indoors?'집 내부. 가구 선택 후 방을 클릭해 배치':'마을. WASD 이동, E 대화와 집 입장'}/>
    {indoors&&<div className="room-controls" aria-label="집 꾸미기"><div className="tools">{['Chair','Table'].map(type=><button key={type} aria-pressed={view.tool===type} onClick={()=>commit(chooseFurniture(game.current,type))}><svg viewBox="0 0 40 40" aria-hidden="true">{type==='Chair'?<><path d="M11 22V9Q20 3 29 9V22M11 28L9 36M29 28L31 36"/><ellipse cx="20" cy="25" rx="14" ry="6"/></>:<><path d="M9 23L7 36M31 23L33 36"/><ellipse cx="20" cy="18" rx="17" ry="12"/></>}</svg><span>{type}</span></button>)}<button className="icon-button" aria-label="선택한 가구 삭제" title="Delete" disabled={view.selected==null} onClick={()=>commit(deleteFurniture(game.current))}><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 13L14 33H27L29 13M9 11H32M16 10V6H25V10M19 17V27M23 17V27"/></svg></button></div><button className="leave" aria-label="집 밖으로 나가기" onClick={()=>commit(leaveHouse(game.current))}><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 34V10L24 5V34ZM24 20H36M31 15L36 20L31 25"/></svg></button>{view.notice?.startsWith('방 안의')&&<p className="placement-error" role="status">여기에는 놓을 수 없어요.</p>}</div>}
    {dialogue&&<div className="dialog-backdrop"><section className="dialogue" role="dialog" aria-modal="true" aria-labelledby="npc-name" aria-describedby="npc-lines"><h2 id="npc-name">{dialogue.name}</h2><div id="npc-lines">{dialogue.lines.map((line,i)=><p key={i}>{line}</p>)}</div><button ref={closeButton} aria-label="대화 닫기" onClick={()=>handleDialogue('close')}>닫기 ✕</button></section></div>}
  </main>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
