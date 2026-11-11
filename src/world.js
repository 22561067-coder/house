// 맵 데이터만 정의합니다. NPC/이벤트 데이터는 이후 별도 목록으로 확장합니다.
export const world = {
  width: 960, height: 640,
  spawn: { x: 470, y: 330 },
  npcs: [
    { id: 'hana', name: '하나', x: 560, y: 316, width: 24, height: 24,
      lines: ['안녕하세요! 초록쉼 마을에 오신 걸 환영해요.', '집과 연못을 따라 천천히 산책해 보세요.'] },
  ],
  obstacles: [
    { id: 'home', kind: 'house', x: 160, y: 112, width: 176, height: 144 },
    { id: 'workshop', kind: 'house', x: 672, y: 112, width: 144, height: 112 },
    { id: 'pond', kind: 'pond', x: 608, y: 416, width: 208, height: 128 },
    ...[[64,80],[384,112],[848,64],[80,432],[240,496],[848,432],[400,496]].map(([x,y], i) =>
      ({ id: `tree-${i}`, kind: 'tree', x, y, width: 48, height: 64 })),
  ],
};
