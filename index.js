#!/usr/bin/env node

import { program } from 'commander';
import chokidar from 'chokidar';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import parseFile from './parse_file.js';

const defaultTemplate = fileURLToPath(new URL('./template/template.html', import.meta.url));

// Convert a single markdown file, writing the HTML alongside it
async function convertFile(inputFile, templateFile) {
	try {
		const markdownContent = await fs.readFile(inputFile, 'utf8');
		const htmlContent = parseFile(markdownContent, templateFile);
		const outputFile = path.join(path.dirname(inputFile), `${path.basename(inputFile, '.md')}.html`);
		await fs.writeFile(outputFile, htmlContent);
		console.log(`Converted ${inputFile} -> ${outputFile}`);
	} catch (error) {
		console.error(`Error converting ${inputFile}:`, error);
	}
}

// Resolve the input to a list of markdown files (recursing into directories)
async function findMarkdownFiles(input) {
	const stats = await fs.stat(input);
	if (stats.isDirectory()) {
		return glob('**/*.md', { cwd: input, absolute: true, ignore: '**/node_modules/**' });
	}
	return [input];
}

async function main(input, options) {
	const templateFile = path.resolve(options.template ?? defaultTemplate);

	try {
		await fs.access(templateFile);
	} catch {
		console.error(`Template file not found: ${templateFile}`);
		process.exit(1);
	}

	let files;
	try {
		files = await findMarkdownFiles(input);
	} catch {
		console.error(`Input not found: ${input}`);
		process.exit(1);
	}

	if (files.length === 0) {
		console.log(`No markdown files found in ${input}`);
	}

	for (const file of files) {
		await convertFile(file, templateFile);
	}

	if (options.watch) {
		console.log(`Watching ${input} for changes...`);
		const isNonMarkdownFile = (file, stats) => stats?.isFile() && !file.endsWith('.md');
		chokidar
			.watch([input, templateFile], {
				ignoreInitial: true,
				ignored: (file, stats) => file.includes('node_modules') || (file !== templateFile && isNonMarkdownFile(file, stats)),
			})
			.on('add', file => convertFile(file, templateFile))
			.on('change', async file => {
				if (path.resolve(file) === templateFile) {
					// Template changed: rebuild everything
					for (const f of await findMarkdownFiles(input)) {
						await convertFile(f, templateFile);
					}
				} else {
					await convertFile(file, templateFile);
				}
			});
	}
}

program
	.version('1.0.0')
	.argument('<input>', 'markdown file, or directory to search recursively for markdown files')
	.option('-t, --template <file>', 'HTML template to use (defaults to the built-in template.html)')
	.option('-w, --watch', 'watch for changes and regenerate the HTML automatically')
	.action(main);

program.parse();
