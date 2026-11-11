// 대화 규칙만 담당합니다. 렌더링이나 키보드 API에 의존하지 않습니다.
export const TALK_DISTANCE = 64; // 플레이어와 NPC 중심 사이의 거리
export function nearbyNpc(state, map) {
  const p = state.player;
  return (map.npcs ?? []).find(n => Math.hypot(
    p.x + p.width / 2 - n.x - n.width / 2,
    p.y + p.height / 2 - n.y - n.height / 2,
  ) <= TALK_DISTANCE) ?? null;
}
export function openDialogue(state, map) {
  if (state.dialogue) return state;
  const npc = nearbyNpc(state, map);
  return npc ? { ...state, dialogue: { npcId: npc.id, name: npc.name, lines: [...npc.lines] } } : state;
}
export function closeDialogue(state) {
  return state.dialogue ? { ...state, dialogue: null } : state;
}
