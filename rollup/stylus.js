import path from 'path'
import fs from 'fs'
import { createFilter } from 'rollup-pluginutils'
import stylus from 'stylus'

const START_CSS = '/** !!!__START_CSS_CODE__!!!',
	END_CSS = '!!!__END_CSS_CODE__!!! **/',
	ESCAPE_COMMENT = '__CSS_ESCAPE_COMMENT__';

export default function(options) {
	const filter = createFilter(options.include, options.exclude),
		sourceMap = options.sourceMap !== false,
		outputFile = typeof options.output === 'string',
		outputFunction = typeof options.output === 'function';

	let extractedCss = '';

	return {
		transform: async (code, id) => {
			if (!filter(id) || path.extname(id) !== '.styl') return null;

			const style = stylus(code);
			if (options.config) options.config(style);

			style.set('filename', path.relative(process.cwd(), id));

			let css = await style.render();

			css = css.replace(/\*\//g, ESCAPE_COMMENT);

			return {
				id: `${id}.css`,
				code: START_CSS + css + END_CSS,
				map: { mappings: '' }
			};
		},

		transformBundle(source) {
			const pieces = source.split(START_CSS).map(piece => piece.split(END_CSS));

			let allCode = '';
			extractedCss = '';

			for (let [css, code] of pieces) {
				if (code) {
					allCode += code;
					extractedCss += css;
				}
				else allCode += css;
			}

			return {
				code: allCode,
				map: { mappings: '' },
			}
		},

		onwrite (opts) {
			if (extractedCss) {
				return new Promise((resolveExtract, rejectExtract) => {
					const destPath = path.join(path.dirname(opts.dest), `${path.basename(opts.dest, path.extname(opts.dest))}.css`);
					fs.writeFile(destPath, extractedCss, err => {
						if (err) rejectExtract(err);
						resolveExtract();
					})
				})
			}
			return null;
		}
	}
}