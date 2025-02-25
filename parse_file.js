import fs from 'fs';
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import markdownItPrism from 'markdown-it-prism';


const translateFile = (markdownContent, templateFile) => {

	try {
		// Create a MarkdownIt instance and configure plugins
		const md = new MarkdownIt({
			html: true,  // Enable HTML tags parsing
			breaks: true,
			linkify: true
		}).use(markdownItPrism);

		md.use((md) => {
			const defaultRender = md.renderer.rules.html_block || function(tokens, idx, options, env, self) {
				return tokens[idx].content;
			};

			md.renderer.rules.html_block = function(tokens, idx, options, env, self) {
				const content = tokens[idx].content;
				if (content.includes('<iframe') && content.includes('</iframe>')) {
					// You can add additional security checks here if needed
					return content;
				}
				return defaultRender(tokens, idx, options, env, self);
			};
		});

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



		md.use(MarkdownItContainer, 'hint', {
			validate: params => {
				// Match containers with or without a title
				return params.trim().match(/^hint\s*(.*)$/);
			},
			render: (tokens, idx) => {
				const m = tokens[idx].info.trim().match(/^hint\s*(.*)$/);
				const title = m && m[1] ? m[1] : 'Hint';  // Default title if none is provided

				if (tokens[idx].nesting === 1) {
					// Opening tag for the container
					return `<div class="alert alert-success" role="alert">
	                    <h4 class="alert-heading">${title}</h4>
	                    <p>`;
				} else {
					// Closing tag for the container
					return '</p></div>\n';
				}
			},
		});

		// 		// Read markdown content

		// 		// Render markdown to HTML
		const htmlContent = md.render(markdownContent);

		// 		// Read template file
		let template = fs.readFileSync(templateFile, 'utf8');

		// 		// Embed HTML into the template
		template = template.replace('$body$', htmlContent);


		return template;


	} catch (error) {
		console.error('Error during the conversion process:', error);
	}

}

export default translateFile;