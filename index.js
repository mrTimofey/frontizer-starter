const fs = require('fs'),
	rollup = require('rollup'),
	config = require('./config'),
	utils = require('./utils/server'),
	viewsUtils = require('./utils/views');

if (!fs.existsSync('dev')) fs.mkdirSync('dev');

if (config.appPort) {
	const express = require('express'),
		app = express();

	viewsUtils.init('app');

	app.use('/assets', express.static('assets'));
	app.use('/dist', express.static('dev'));

	app.set('view engine', 'pug');
	app.set('view cache', false);

	Object.keys(viewsUtils).forEach(k => app.locals[k] = viewsUtils[k]);

	// allows absolute path in 'extends' for jade
	app.locals.basedir = app.get('views');
	app.locals.pretty = "\t";

	app.get(/^\/(.*)$/, (req, res) => {
		let reqPath = req.params[0];
		if (reqPath === '') reqPath = 'index';

		utils.lookupData(reqPath, 'data', data => {
			if (config.livereloadPort)
				data.__livereload = '<script src="//' +
					req.hostname + ':' + config.livereloadPort + '/livereload.js"></script>';
			else data.__livereload = false;
			data.req = req;
			try {
				res.render(reqPath, data, (err, output) => {
					if (err) {
						res.status(500).end(err.toString());
						console.error('View error in: ' + reqPath);
						console.error(err);
					}
					else res.end(output);
				});
			}
			catch (e) {
				res.status(404).end('Not found');
			}
		});
	});

	app.listen(config.appPort);
}

if (config.livereloadPort) require('livereload').createServer({ port: config.livereloadPort }).watch('dev');