// 입력을 방향 벡터로 변환합니다. 포커스 상실 시 눌린 키를 초기화합니다.
export function attachInput(target, onReset = () => {}, onDialogue = () => {}, onDelete = () => {}) {
  const keys = new Set();
  const allowed = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD']);
  const down = e => {
    if (allowed.has(e.code)) { e.preventDefault(); keys.add(e.code); }
    if (e.code === 'KeyR' && !e.repeat) onReset();
    if (e.code === 'KeyE' && !e.repeat) { e.preventDefault(); onDialogue('open'); }
    if (e.code === 'Escape' && !e.repeat) { e.preventDefault(); onDialogue('close'); }
    if (e.code === 'Delete' && !e.repeat) { e.preventDefault(); onDelete(); }
  };
  const up = e => keys.delete(e.code);
  const clear = () => keys.clear();
  const visibility = () => { if (document.hidden) clear(); };
  target.addEventListener('keydown', down);
  target.addEventListener('keyup', up);
  target.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', visibility);
  return {
    read: () => ({ x: Number(keys.has('KeyD')) - Number(keys.has('KeyA')),
      y: Number(keys.has('KeyS')) - Number(keys.has('KeyW')) }),
    dispose() {
      target.removeEventListener('keydown', down);
      target.removeEventListener('keyup', up);
      target.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', visibility);
    },
  };
}
