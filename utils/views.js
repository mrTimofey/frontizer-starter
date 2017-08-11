const lorem = require('lorem-ipsum');

let mode;

/**
 * Array of range.
 * @param from
 * @param to
 * @returns {Array}
 */
exports.range = function(from, to) {
	if (!to){
		to = from;
		from = 0;
	}
	to = Math.ceil(to);
	from = Math.ceil(from);
	let a = [];
	while (from++ < to) a.push(from);
	return a;
};

/**
 * Link to view.
 * @param view
 * @returns {string}
 */
exports.linkTo = function(view) {
	if (!view) return '#';
	if (mode === 'app') {
		if (view === 'index') return '/';
		return '/' + view;
	}
	if (view === '/') view = 'index';
	return view.split('/').join('.') + '.html';
};

/**
 * Link to asset.
 * @param path
 * @returns {string}
 */
exports.asset = function(path) {
	return mode === 'app' ? ('/assets/' + path) : ('assets/' + path);
};

exports.lorem = lorem;

exports.init = function(_mode) {
	mode = _mode;

	let path = mode === 'app' ? '/' : '';
	exports.__css = '<link href="' + path + 'bundle.css" rel="stylesheet">'
	exports.__js = '<script src="' + path + 'bundle.js"></script>';

	delete exports.init;
};