import {readFile,writeFile,readdir} from 'node:fs/promises';
const files=await readdir(new URL('../dist/assets/',import.meta.url));
const read=ext=>readFile(new URL('../dist/assets/'+files.find(f=>f.endsWith(ext)),import.meta.url),'utf8');
const [js,css]=await Promise.all([read('.js'),read('.css')]);
const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>작은 마을 · 이동 프로토타입</title><style>${css}</style></head><body><div id="root"></div><script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
await writeFile(new URL('../play.html',import.meta.url),html);
console.log('play.html: 브라우저에서 직접 열 수 있는 단일 파일 생성');
