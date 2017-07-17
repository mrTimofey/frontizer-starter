/**
 * Load svg sprite asynchronously.
 * @param {string} src file path
 * @param {string} v version
 * @returns {undefined}
 */
export function loadSvgSprite(src, v = '') {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', src, true);
	xhr.onload = () => {
		const div = document.createElement('div');
		div.style.display = 'none';
		div.innerHTML = xhr.responseText;
		if (document.body.childNodes && document.body.childNodes.length) document.body.insertBefore(div, document.body.childNodes[0]);
		else document.body.appendChild(div);
	};
	xhr.send();
}