import fs from 'fs';
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import markdownItPrism from 'markdown-it-prism';

const file = 'test.md';
const templateFile = 'template/template.html';
const outputFile = 'output.html';

try {
	// Create a MarkdownIt instance and configure plugins
	const md = new MarkdownIt().use(markdownItPrism);
	md.use(MarkdownItContainer, 'tip', {
		validate: params => {
			// Match containers with or without a title
			return params.trim().match(/^tip\s*(.*)$/);
		},
		render: (tokens, idx) => {
			const m = tokens[idx].info.trim().match(/^tip\s*(.*)$/);
			const title = m && m[1] ? m[1] : 'Tip';  // Default title if none is provided

			if (tokens[idx].nesting === 1) {
				// Opening tag for the container
				return `<div class="alert alert-primary" role="alert">
                    <h4 class="alert-heading">${title}</h4>
                    <p>`;
			} else {
				// Closing tag for the container
				return '</p></div>\n';
			}
		},
	});

	// Read markdown content
	const markdownContent = fs.readFileSync(file, 'utf8');

	// Render markdown to HTML
	const htmlContent = md.render(markdownContent);

	// Read template file
	let template = fs.readFileSync(templateFile, 'utf8');

	// Embed HTML into the template
	template = template.replace('$body$', htmlContent);

	// Write final output to an HTML file
	fs.writeFileSync(outputFile, template);

	console.log(`Conversion successful. Output saved to ${outputFile}`);

} catch (error) {
	console.error('Error during the conversion process:', error);
}
