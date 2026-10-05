# Surrey Notes Tool

This tool is designed to convert markdown to self-contained HTMl files .

The HTML files, along with any images, can be uploaded to a LMS (e.g., Surrey Learn).

## Usage

- Ensure you have node installed
- From terminal, run `npx surrey-notes-tool <input>`
  - `<input>` can be a single markdown file, or a directory. If a directory is given, all markdown files within it (and its subdirectories) are converted.
- The tool will create an HTML file in the same directory as each input file (e.g., `week1/lab-1.md` -> `week1/lab-1.html`).

### Options

| Option | Description |
| --- | --- |
| `-t, --template <file>` | Use a custom HTML template. The template must contain a `$body$` placeholder where the converted markdown is inserted. If omitted, the built-in `template/template.html` is used. |
| `-w, --watch` | Watch the input for changes and regenerate the HTML automatically. New markdown files are picked up too, and changing the template rebuilds everything. |

Examples:

```bash
npx surrey-notes-tool lab-1.md                       # convert one file
npx surrey-notes-tool notes/                         # convert every .md file under notes/
npx surrey-notes-tool notes/ -t my-template.html     # use a custom template
npx surrey-notes-tool notes/ --watch                 # rebuild on change
```

### Uploading to the LMS

- On a module page, in the top menu: click "Course Setup" -> "Manage Files"
- Create a new folder for your content (e.g., "Week 1/lab-1")
- Upload the HTML file and any images to the folder
- Have all the images and assets in the same folder, it makes it easier to manage and upload to the LMS.

### Adding to the material

- Navigate to "Course Materials"
- Click on a topic section (e.g., "Lab 1") and click "Add item Content"
- Click "more"
- Select "course file"
- Select the HTML file you created
