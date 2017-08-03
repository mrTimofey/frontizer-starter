const fs = require('fs'),
	path = require('path'),
	pug = require('pug'),
	viewsUtils = require('./utils/views'),
	utils = require('./utils/server'),
	basedir = path.resolve(process.cwd(), 'views');

if (!fs.existsSync('dist')) fs.mkdirSync('dist');

viewsUtils.init('static');

(function scan(parents) {
	const folder = 'views' + (parents.length ? ('/' + parents.join('/')) : '');

	for (let file of fs.readdirSync(folder)) {
		let viewFullPath = folder + '/' + file,
			htmlFile = parents.concat([file.replace('.pug', '.html')]).join('.');

		// recursively scan subfolders
		if (fs.lstatSync(viewFullPath).isDirectory()) {
			scan(parents.concat([file]));
			continue;
		}

		// ignore wrong extensions
		if (path.extname(file) !== '.pug') continue;

		(function(route, htmlFile, viewFullPath) {
			utils.lookupData(route, 'data', data => {
				Object.keys(viewsUtils).forEach(k => data[k] = viewsUtils[k]);

				// emulate express.req
				data.req = {
					baseUrl: htmlFile,
					hostname: 'localhost',
					ip: '127.0.0.1',
					method: 'GET',
					originalUrl: htmlFile,
					params: {},
					path: htmlFile,
					prototcol: 'http',
					xhr: false,
					query: {}
				};
				data.__livereload = '';
				data.basedir = basedir;
				data.pretty = '\t';

				fs.writeFileSync('dist/' + htmlFile, pug.renderFile(viewFullPath, data), { flags: 'w' });

				console.log('dist/' + htmlFile + ' created');
			});
		})(parents.join('/') + '/' + file.replace('.pug', ''), htmlFile, viewFullPath);
	}
})([]);