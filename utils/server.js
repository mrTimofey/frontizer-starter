const fs = require('fs');

/**
 * Lookups all data files and merges them into one object.
 * @param {String} path request path
 * @param {String} folder to lookup in
 * @param {Function} after callback to call after data is collected; data passes as parameter
 */
exports.lookupData = (path, folder, after) => {
	path = (path && path !== 'index') ? path.split('/') : [];
	if (path[0] === 'index') path.shift();

	let prefix = '';
	// concatenate path segments
	path = path.map((el) => {
		prefix += '/' + el;
		return prefix;
	});

	// always fetch home data
	path.unshift('/index');

	let data = {};

	// function checks data file existance, merges data and
	// calls itself again until path array exhausted
	(function next() {
		if (!path.length) return after(data);
		let file = process.cwd() + '/' + folder + path.shift();

		fs.exists(file + '.js', exists => {
			if (exists) {
				let fileData = require(file);
				delete require.cache[require.resolve(file)];
				Object.keys(fileData).forEach(k => {
					data[k] = fileData[k];
				});
			}
			next();
		});
	})();
};