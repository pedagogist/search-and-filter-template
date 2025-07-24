# Search and Filter Template

This is a template of a simple searchable dictionary web application written in HTML, CSS and JavaScript without requiring external libraries or a build process (“vanilla”). It displays a filterable and sortable list of vocabulary entries with information including definitions, parts of speech and categories. You are expected to modify and expand upon this template to suit the needs of your project.

Although this template is designed for undergraduate students of a capstone project course in the Education University of Hong Kong, it can also be used by anyone for other projects.

[Try out the template](https://pedagogist.github.io/search-and-filter-template/) to see how it works.

## Getting Started

> [!NOTE]
> This section is intended for our undergraduate students.
> 
> If you are not new to programming, feel free to use your favourite code editor, the `serve` command, or whatever tools you feel comfortable with.

1. Make sure you are logged in to GitHub. Click “Use this template” → “Create a new repository” at the top right of this page.
2. Pick a name for your project, then click “Create repository”. You may rename it anytime later by clicking the Settings tab on your project page.
3. Launch [Visual Studio Code](https://code.visualstudio.com).
4. Click “Clone Git repository” on the Welcome page.
5. Type in your GitHub username, followed by `/` and the project name you just chose, and press <kbd>Enter</kbd>.
6. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
7. Click the “Go Live” button from the status bar at the bottom to view the app.

## How It Works

- The app loads vocabulary data from a JSON file, dynamically rendering a searchable list of dictionary entries.
- Users can search through entries by word or definition using the search input field.
- Entries can be filtered by category using radio buttons and by parts of speech using checkboxes.
- The list can be sorted by various criteria including ID, word, category, part of speech or definition.
- Pagination controls allow users to navigate through large datasets with customizable entries per page.
- Each entry displays as an expandable item showing the word, category, ID, parts of speech tags and definition.

## Your Next Steps

1. Change the dataset by adding new JSON files within the `data` folder and remove `data/example.json`.
2. Remove all the example resources inside the `res` folder and place your resources referenced in the dataset there.
3. Update the `import` statement at the top of `index.js` to reference your new data file.
4. Decide which fields from your dataset should be searchable and which should be filterable. Consider which field(s) would work best as category filters (radio buttons for single selection) and which field(s) would work as tag filters (checkboxes for multiple selection). Think about what filtering options would be most helpful for your language learners.
5. Update the filtering, sorting, and rendering functions in `index.js` to work with your chosen fields. Modify `renderCategoryFilters`, `renderTagFilters`, `createEntryItem`, and the sorting logic in `sortEntries` to use your selected fields instead of the example's category and parts of speech.
6. Adjust the appearance of the entries in `index.css` by modifying the styling rules for your specific content elements.

If you encounter any technical problems or have questions, don’t hesitate to reach out for help! We’re always here for advice and support. <sub>[Only applicable for students at EdUHK.]</sub>
