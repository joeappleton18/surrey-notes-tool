#!/usr/bin/env node

import fs from 'fs';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const args = process.argv.slice(2); // Get all arguments excluding the first two (node and script name)
if (args.length < 1) {
	console.error("Please provide the Markdown file as an argument.");
	process.exit(1); // Exit if no file is provided
}

const file = args[0]

// Configure marked for syntax highlighting
marked.setOptions({
	highlight: (code, lang) => {
		const language = hljs.getLanguage(lang) ? lang : 'plaintext';
		return hljs.highlight(code, { language }).value;
	},
	langPrefix: 'hljs language-', // Add hljs prefix for Highlight.js
	breaks: true, // Enable line breaks in Markdown (like for paragraphs)
});

// Custom container extension for :::tip syntax
// const customContainers = {
// 	name: 'customContainer',
// 	level: 'block',
// 	start(src) {
// 		// Match the start of a :::tip block
// 		return -1;
// 		return src.match(/^:::\b/)?.index;
// 	},
// 	tokenizer(src) {
// 		// Match the content inside :::tip ... :::
// 		const match = /:::tip(?:\s+([^]+?))?\s+([\s\S]+?):::\s*/m.exec(src);

// 		if (match) {
// 			console.log("tip matched", match, "end of block")

// 			console.log(match[1])

// 			process.exit(0)

// 			return {
// 				type: 'customContainer',
// 				title: match[1] ? match[1].trim() : 'Tip', // Default title is "Tip"
// 				text: match[2].trim(),
// 				raw: match[0], // Store the raw markdown for replacement
// 			};
// 		}
// 		return null; // Return null if no match is found
// 	},
// 	renderer(token) {
// 		if (token.type === 'customContainer') {
// 			// Render the custom container (alert box)
// 			return `
//         <div class="alert alert-primary" role="alert">
//           <h4 class="alert-heading">${token.title}</h4>
//           <p>${token.text}</p>
//         </div>
//       `;
// 		}
// 		return ''; // Fallback for other token types
// 	},
// };

// // Register the custom container extension
// marked.use({ extensions: [customContainers] });

// Read the Markdown file
const markdownContent = fs.readFileSync(file, 'utf8');

// Convert Markdown to HTML
let htmlContent = marked(markdownContent);

// Function to add target="_blank" to all links
const addTargetBlank = (html) => {
	return html.replace(/<a\s+(href="[^"]+")/g, '<a $1 target="_blank"');
};

// Update all links to have target="_blank"
htmlContent = addTargetBlank(htmlContent);

// Read the HTML template
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let template = fs.readFileSync(`${__dirname}/template/template.html`, 'utf8');

// Embed the converted HTML into the template
template = template.replace('$body$', htmlContent);

// Write the output to an HTML file
fs.writeFileSync('output.html', template);

console.log('Markdown has been converted to HTML with custom containers and links set to open in a new tab.');
