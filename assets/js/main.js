import { loadSvgSprite } from './utils';
loadSvgSprite(window.spritePath || '/assets/static/sprite.svg');
const touchDevice =  'ontouchstart' in window || navigator.maxTouchPoints;
if (touchDevice) window.document.documentElement.classList.add('touch-device');