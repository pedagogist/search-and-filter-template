import example from "./data/example.json" with { type: "json" };

// State variables
let currentPage = 1;
let entriesPerPage = 50;
let currentSort = "id";
let searchTerm = "";
let selectedCategory = "all";
let selectedTags = new Set();

// DOM elements
const entriesList = document.getElementById("entries-list");
const searchInput = document.getElementById("search-input");
const categoryList = document.getElementById("category-list");
const tagList = document.getElementById("tag-list");
const sortSelect = document.getElementById("sort-select");
const entriesSelect = document.getElementById("entries-select");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

/**
 * Utility to convert part of speech into an array and remove empty values
 * You are encouraged to further sanitise them by, for example,
 * converting them to lower case and expanding the abbreviations
 */
function normalisePos(pos) {
	return (Array.isArray(pos) ? pos : [pos]).filter(Boolean);
}

/**
 * Utility to convert two values into strings and compare them in English
 */
function compareStrings(a, b) {
	a = a ? String(a) : "";
	b = b ? String(b) : "";
	return a.localeCompare(b, "en");
}

/**
 * Initialize the application
 */
function init() {
	setupFilters();
	setupEventListeners();
	renderEntries();
}

/**
 * Extract unique categories and tags from data and set up filters
 */
function setupFilters() {
	const categories = new Set();
	const tags = new Set();

	for (const item of example) {
		if (item.category) {
			categories.add(item.category);
		}
		for (const pos of normalisePos(item.pos)) {
			tags.add(pos);
		}
	}

	// Create category filter radio buttons
	renderCategoryFilters([...categories].sort(compareStrings));

	// Create tag filter checkboxes
	renderTagFilters([...tags].sort(compareStrings));
}

/**
 * Create category filter radio buttons
 */
function renderCategoryFilters(categories) {
	// Create "All" option
	const allItem = document.createElement("li");
	const allLabel = document.createElement("label");
	const allInput = document.createElement("input");
	allInput.type = "radio";
	allInput.name = "category";
	allInput.value = "all";
	allInput.checked = true;

	const allSpan = document.createElement("span");
	allSpan.textContent = "all";

	allLabel.appendChild(allInput);
	allLabel.appendChild(allSpan);
	allItem.appendChild(allLabel);
	categoryList.appendChild(allItem);

	// Create category options
	for (const category of categories) {
		const li = document.createElement("li");
		const label = document.createElement("label");
		const input = document.createElement("input");
		input.type = "radio";
		input.name = "category";
		input.value = category;

		const span = document.createElement("span");
		span.textContent = category;

		label.appendChild(input);
		label.appendChild(span);
		li.appendChild(label);
		categoryList.appendChild(li);
	}
}

/**
 * Create tag filter checkboxes
 */
function renderTagFilters(tags) {
	for (const tag of tags) {
		const li = document.createElement("li");
		const label = document.createElement("label");
		const input = document.createElement("input");
		input.type = "checkbox";
		input.value = tag;

		const span = document.createElement("span");
		span.textContent = tag;

		label.appendChild(input);
		label.appendChild(span);
		li.appendChild(label);
		tagList.appendChild(li);
	}
}

/**
 * Set up event listeners for all interactive elements
 */
function setupEventListeners() {
	// Search input
	searchInput.addEventListener("input", () => {
		searchTerm = searchInput.value.toLowerCase();
		currentPage = 1;
		renderEntries();
	});

	// Category filters
	for (const radio of categoryList.querySelectorAll('input[type="radio"]')) {
		radio.addEventListener("change", event => {
			selectedCategory = event.target.value;
			currentPage = 1;
			renderEntries();
		});
	}

	// Tag filters
	for (const checkbox of tagList.querySelectorAll('input[type="checkbox"]')) {
		checkbox.addEventListener("change", event => {
			if (event.target.checked) {
				selectedTags.add(event.target.value);
			} else {
				selectedTags.delete(event.target.value);
			}
			currentPage = 1;
			renderEntries();
		});
	}

	// Sort selector
	sortSelect.addEventListener("change", () => {
		currentSort = sortSelect.value;
		renderEntries();
	});

	// Entries per page selector
	entriesSelect.addEventListener("change", () => {
		entriesPerPage = parseInt(entriesSelect.value);
		currentPage = 1;
		renderEntries();
	});

	// Pagination buttons
	prevPageBtn.addEventListener("click", () => {
		if (currentPage > 1) {
			currentPage--;
			renderEntries();
		}
	});

	nextPageBtn.addEventListener("click", () => {
		const filteredEntries = getFilteredEntries();
		const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

		if (currentPage < totalPages) {
			currentPage++;
			renderEntries();
		}
	});
}

/**
 * Filter entries based on current filters
 */
function getFilteredEntries() {
	return example.filter(entry => {
		// Search text filter
		const matchesSearch = searchTerm === "" ||
			entry.word.toLowerCase().includes(searchTerm) ||
			entry.definition.toLowerCase().includes(searchTerm);

		// Category filter
		const matchesCategory = selectedCategory === "all" ||
			entry.category === selectedCategory;

		// Tag filter
		const matchesTags = selectedTags.size === 0 ||
			normalisePos(entry.pos).some(pos => selectedTags.has(pos));

		return matchesSearch && matchesCategory && matchesTags;
	});
}

/**
 * Sort entries based on current sort option
 */
function sortEntries(entries) {
	return [...entries].sort((a, b) => {
		switch (currentSort) {
			case "id":
				return a.id - b.id;
			case "word":
				return compareStrings(a.word, b.word);
			case "category":
				return compareStrings(a.category, b.category);
			case "pos":
				const posA = normalisePos(a.pos);
				const posB = normalisePos(b.pos);
				const minLength = Math.min(posA.length, posB.length);
				for (let index = 0; index < minLength; index++) {
					const comparison = compareStrings(posA[index], posB[index]);
					if (comparison !== 0) {
						return comparison;
					}
				}
				return posA.length - posB.length;
			case "definition":
				return compareStrings(a.definition, b.definition);
			default:
				return 0;
		}
	});
}

/**
 * Render filtered and sorted entries with pagination
 */
function renderEntries() {
	// Get filtered and sorted entries
	const filteredEntries = getFilteredEntries();
	const sortedEntries = sortEntries(filteredEntries);

	// Calculate pagination
	const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
	const startIndex = (currentPage - 1) * entriesPerPage;
	const endIndex = Math.min(startIndex + entriesPerPage, sortedEntries.length);
	const entriesToDisplay = sortedEntries.slice(startIndex, endIndex);

	// Update pagination controls
	pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
	prevPageBtn.disabled = currentPage <= 1;
	nextPageBtn.disabled = currentPage >= totalPages;

	// Clear existing entries
	entriesList.textContent = "";

	// Create entry items
	for (const entry of entriesToDisplay) {
		const entryItem = createEntryItem(entry);
		entriesList.appendChild(entryItem);
	}
}

/**
 * Create a single entry item
 */
function createEntryItem(entry) {
	// Create list item
	const li = document.createElement("li");
	li.classList.add("entry-item");

	// Create details element
	const details = document.createElement("details");

	// Create summary element with title, category, and ID
	const summary = document.createElement("summary");

	const h3 = document.createElement("h3");
	h3.classList.add("entry-word");
	h3.textContent = entry.word;

	const categorySpan = document.createElement("span");
	categorySpan.classList.add("entry-category");
	categorySpan.textContent = entry.category;

	const idSpan = document.createElement("span");
	idSpan.classList.add("entry-id");
	idSpan.textContent = entry.id;

	summary.appendChild(h3);
	summary.appendChild(categorySpan);
	summary.appendChild(idSpan);

	// Create content paragraph with parts of speech and definition
	const content = document.createElement("p");
	content.classList.add("entry-content");

	// Create tags container
	const tagsContainer = document.createElement("div");
	tagsContainer.classList.add("entry-tags");

	// Add parts of speech tags
	for (const pos of normalisePos(entry.pos)) {
		const posSpan = document.createElement("span");
		posSpan.classList.add("entry-pos");
		posSpan.textContent = pos;
		tagsContainer.appendChild(posSpan);
	}

	// Add definition
	const definitionSpan = document.createElement("span");
	definitionSpan.classList.add("entry-definition");
	definitionSpan.textContent = entry.definition;

	content.appendChild(tagsContainer);
	content.appendChild(definitionSpan);

	// Assemble the entry item
	details.appendChild(summary);
	details.appendChild(content);
	li.appendChild(details);

	return li;
}

// Initialize the application when the document is loaded
document.addEventListener("DOMContentLoaded", init);
