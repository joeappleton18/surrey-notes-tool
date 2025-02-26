#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import parseFile from './parse_file.js';



async function main(inputFile) {
	const templateFile = fileURLToPath(new URL('./template/template.html', import.meta.url));
	// Read markdown content
	try {
		const markdownContent = await fs.readFile(inputFile, 'utf8');
		const htmlContent = parseFile(markdownContent, templateFile);
		const fileName = path.basename(inputFile, '.md');
		const outputFileName = `${fileName}.html`;
		fs.writeFile(outputFileName, htmlContent);
	} catch (error) {
		console.error('Error during the conversion process:', error);
	}


}


program
	.version('1.0.0')
	.arguments('<inputFile>')




program.parse();


main(program.args[0]);