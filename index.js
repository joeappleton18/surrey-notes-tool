#!/usr/bin/env node

import fs from 'fs';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
// ^:::([^:::])+:::
const descriptionList = {
	name: 'descriptionList',
	level: 'block',                                     // Is this a block-level or inline-level tokenizer?
	start(src) { return src.match(/:::tip[^:::\n]/)?.index; }, // Hint to Marked.js to stop and check for a match
	tokenizer(src, tokens) {
		const rule = /^:::tip([^:::])+:::/;    // Regex for the complete token, anchor to string start
		const title = /^:::tip([^:::])+:::/;
		const match = rule.exec(src);
		if (match) {

			console.log(match[0]);
			const token = {                                 // Token to generate
				type: 'descriptionList',                      // Should match "name" above
				raw: match[0],                                // Text to consume from the source
				text: match[0].trim(),                        // Additional custom properties
				tokens: []                                    // Array where child inline tokens will be generated
			};
			this.lexer.inline(token.text, token.tokens);    // Queue this data to be processed for inline tokens
			return token;
		}
	},
	renderer(token) {


		return ` <div class="alert alert-primary" role="alert">${this.parser.parseInline(token.tokens)}\n</div>`; // parseInline to turn child tokens into HTML
	}
};



const description = {
	name: 'description',
	level: 'inline',                                 // Is this a block-level or inline-level tokenizer?
	start(src) { return src.match(/:::/)?.index; },    // Hint to Marked.js to stop and check for a match
	tokenizer(src, tokens) {
		const rule = /^:([^:\n]+):([^:\n]*)(?:\n|$)/;  // Regex for the complete token, anchor to string start
		const match = rule.exec(src);
		if (match) {
			return {                                         // Token to generate
				type: 'description',                           // Should match "name" above
				raw: match[0],                                 // Text to consume from the source
				dt: this.lexer.inlineTokens(match[1].trim()),  // Additional custom properties, including
				dd: this.lexer.inlineTokens(match[2].trim())   //   any further-nested inline tokens
			};
		}
	},
	renderer(token) {
		return `\n<dt>${this.parser.parseInline(token.dt)}</dt><dd>${this.parser.parseInline(token.dd)}</dd>`;
	},
	childTokens: ['dt', 'dd'],                 // Any child tokens to be visited by walkTokens
};

function walkTokens(token) {                        // Post-processing on the completed token tree
	if (token.type === 'strong') {
		token.text += ' walked';
		token.tokens = this.Lexer.lexInline(token.text)
	}
}

// Custom container extension for :::tip syntax
const customContainers = {
	name: 'customContainer',
	level: 'block',
	start(src) {
		// Match the start of a :::tip block
		return src.match(/^:::\s*tip\b/)?.index;

	},
	tokenizer(src) {
		// Match the content inside :::tip ... :::
		const match = /^:::\s*tip(?:\s+([^]+?))?\s+([\s\S]+?):::\s*/m.exec(src);

		if (match) {

			console.log(match);
			return {
				type: 'customContainer',
				title: match[1] ? match[1].trim() : 'Tip', // Default title is "Tip"
				text: match[2].trim(),
				raw: match[0], // Store the raw markdown for replacement
			};
		}
		return false; // Return null if no match is found
	},
	renderer(token) {
		if (token.type === 'customContainer') {
			// Render the custom container (alert box)
			return `
                <div class="alert alert-primary" role="alert">
                    <h4 class="alert-heading">${token.title}</h4>
                    <p>${token.text}</p>
                </div>
            `;
		}
		return ''; // Fallback for other token types
	},
};

// Register the custom container extension
marked.use({ extensions: [descriptionList, description], walkTokens });
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
