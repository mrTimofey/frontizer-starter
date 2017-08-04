import { resolve } from 'path';

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import stylus from './rollup/stylus';
import copy from 'rollup-plugin-copy';
import json from 'rollup-plugin-json';

const prod = process.env.NODE_ENV === 'production';

export default {
	entry: 'src/main.js',
	format: 'iife',
	plugins: [
		nodeResolve({
			jsnext: true,
			main: true,
			browser: true
		}),
		commonjs({
			include: 'node_modules/**',
			sourceMap: false
		}),
		buble({
			include: '**/*.js',
			exclude: 'node_modules/**',
			transforms: {
				dangerousForOf: true
			}
		}),
		stylus({
			config(s) {
				s.import(resolve(process.cwd(), 'node_modules/kouto-swiss/index.styl'));
				s.import(resolve(process.cwd(), 'src/shared.styl'));
				if (prod) s.set('compress', true);
			}
		}),
		json(),
		prod && uglify(),
		prod && copy({
			'assets': 'dist/assets'
		})
	],
	dest: (prod ? 'dist' : 'dev') + '/bundle.js',
	sourceMap: !prod,
	watch: {
		useChokidar: false,
		exclude: ['node_modules/**']
	}
};