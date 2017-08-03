import './styles/fonts.styl';
import './styles/base.styl';
import './styles/grid.styl';
import './styles/common.styl';
import './styles/text.styl';
import './styles/modal.styl';
import './styles/pagination.styl';
import './styles/breadcrumbs.styl';

import { loadSvgSprite } from './utils';

loadSvgSprite(window.spritePath || '/assets/sprite.svg');
const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
if (touchDevice) window.document.documentElement.classList.add('touch-device');