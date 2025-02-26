# Surrey Notes Tool

This tool is designed to convert markdown to self-contained HTMl files .

The HTML files, along with any images, can be uploaded to a LMS (e.g., Surrey Learn).

## Usage

- Ensure you have node installed
- From terminal, run `npx surrey-notes-tool <inputFile>`
- The tool will create an HTML file in the same directory as the input file.

### Uploading to the LMS

- On a module page, in the top menu: click "Course Setup" -> "Manage Files"
- Create a new folder for your content (e.g., "Week 1/lab-1")
- Upload the HTML file and any images to the folder

### Adding to the material

- Navigate to "Course Materials"
- Click on a topic section (e.g., "Lab 1") and click "Add item Content"
- Click "more"
- Select "course file"
- Select the HTML file you created

## TODO

- Add a watch mode to the tool so that it automatically updates the HTML file when the markdown file is changed.
- Add a way to add a template file to the tool so that it can be used to generate the HTML file.
- Make it so it recursively parses all markdown files in a directory.
