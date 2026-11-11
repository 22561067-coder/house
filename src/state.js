// 순수 게임 규칙: React, Canvas, 키보드 API에 의존하지 않습니다.
export const PLAYER_SIZE = 24;
export const SPEED = 180; // 월드 좌표 / 초
export function createState(map) {
  return { player: { ...map.spawn, width: PLAYER_SIZE, height: PLAYER_SIZE }, elapsed: 0, dialogue: null,
    scene:'village', furniture:[], nextFurnitureId:1, selected:null, tool:null, notice:'' };
}
export function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}
export function isBlocked(player, map) {
  return player.x < 0 || player.y < 0 || player.x + player.width > map.width ||
    player.y + player.height > map.height || map.obstacles.some(o => overlaps(player, o));
}
export function update(state, input, seconds, map) {
  // 긴 프레임/탭 복귀 시 점프를 제한하고 작은 단위로 이동해 장애물 관통을 방지합니다.
  const dt = Math.max(0, Math.min(seconds, 0.05));
  if (state.dialogue) return { ...state, elapsed: state.elapsed + dt };
  const length = Math.hypot(input.x, input.y);
  if (!length) return { ...state, elapsed: state.elapsed + dt };
  const dx = input.x / length * SPEED * dt;
  const dy = input.y / length * SPEED * dt;
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 4));
  let player = { ...state.player };
  for (let i = 0; i < steps; i++) {
    const horizontal = { ...player, x: player.x + dx / steps };
    if (!isBlocked(horizontal, map)) player = horizontal;
    const vertical = { ...player, y: player.y + dy / steps };
    if (!isBlocked(vertical, map)) player = vertical;
  }
  return { ...state, player, elapsed: state.elapsed + dt };
}
