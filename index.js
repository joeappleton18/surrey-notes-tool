#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import parseFile from './parse_file.js';

const templateFile = 'template/template.html';
const outputFile = 'output.html';

async function main(inputFile) {

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



// async function main(inputFolder) {

// 	if (!inputFolder) {
// 		console.error('Please provide a folder path');
// 		return;
// 	}

// 	try {

// 		console.log('Input folder:', inputFolder);
// 		const mdFiles = await glob.sync(`${inputFolder}/**/**.md`, { ignore: ['node_modules/**'] });
// 		const allFolders = dt(inputFolder); 
// 		console.log('Folders:', allFolders);

// 		console.log('Files:', mdFiles);
// 	} catch (error) {
// 		console.error('Error during the conversion process:', error);
// 	}

// }




// function main(inputFile) {
// 	try {
// 		// Create a MarkdownIt instance and configure plugins
// 		const md = new MarkdownIt().use(markdownItPrism);
// 		md.use(MarkdownItContainer, 'tip', {
// 			validate: params => {
// 				// Match containers with or without a title
// 				return params.trim().match(/^tip\s*(.*)$/);
// 			},
// 			render: (tokens, idx) => {
// 				const m = tokens[idx].info.trim().match(/^tip\s*(.*)$/);
// 				const title = m && m[1] ? m[1] : 'Tip';  // Default title if none is provided

// 				if (tokens[idx].nesting === 1) {
// 					// Opening tag for the container
// 					return `<div class="alert alert-primary" role="alert">
//                     <h4 class="alert-heading">${title}</h4>
//                     <p>`;
// 				} else {
// 					// Closing tag for the container
// 					return '</p></div>\n';
// 				}
// 			},
// 		});

// 		// Read markdown content
// 		const markdownContent = fs.readFileSync(inputFile, 'utf8');

// 		// Render markdown to HTML
// 		const htmlContent = md.render(markdownContent);

// 		// Read template file
// 		let template = fs.readFileSync(templateFile, 'utf8');

// 		// Embed HTML into the template
// 		template = template.replace('$body$', htmlContent);

// 		// Write final output to an HTML file
// 		fs.writeFileSync(outputFile, template);

// 		console.log(`Conversion successful. Output saved to ${outputFile}`);

// 	} catch (error) {
// 		console.error('Error during the conversion process:', error);
// 	}

// }

// console.log(import.meta)

// const directory = process.argv[2] ? process.argv[2] : import.meta.dirname;

// main(directory);


program
	.version('1.0.0')
	.arguments('<inputFile>')




program.parse();


main(program.args[0]);