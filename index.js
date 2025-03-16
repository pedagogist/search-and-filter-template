import example from "./data/example.json" with { type: "json" };

// State variables
let currentPage = 1;
let entriesPerPage = 50;
let currentSort = 'id';
let searchTerm = '';
let selectedCategory = 'all';
let selectedTags = new Set();

// DOM elements
const entriesList = document.getElementById('entries-list');
const searchInput = document.getElementById('search-input');
const categoryList = document.getElementById('category-list');
const tagList = document.getElementById('tag-list');
const sortSelect = document.getElementById('sort-select');
const entriesSelect = document.getElementById('entries-select');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

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
    
    example.forEach(item => {
        if (item.category) categories.add(item.category);
        if (Array.isArray(item.pos)) {
            item.pos.forEach(pos => tags.add(pos));
        } else if (item.pos) {
            tags.add(item.pos);
        }
    });
    
    // Create category filter radio buttons
    renderCategoryFilters(Array.from(categories));
    
    // Create tag filter checkboxes
    renderTagFilters(Array.from(tags));
}

/**
 * Create category filter radio buttons
 */
function renderCategoryFilters(categories) {
    // Create "All" option
    const allItem = document.createElement('li');
    const allLabel = document.createElement('label');
    const allInput = document.createElement('input');
    allInput.type = 'radio';
    allInput.name = 'category';
    allInput.value = 'all';
    allInput.checked = true;
    
    const allSpan = document.createElement('span');
    allSpan.textContent = 'All';
    
    allLabel.appendChild(allInput);
    allLabel.appendChild(allSpan);
    allItem.appendChild(allLabel);
    categoryList.appendChild(allItem);
    
    // Create category options
    categories.forEach(category => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'category';
        input.value = category;
        
        const span = document.createElement('span');
        span.textContent = category;
        
        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        categoryList.appendChild(li);
    });
}

/**
 * Create tag filter checkboxes
 */
function renderTagFilters(tags) {
    tags.forEach(tag => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = tag;
        
        const span = document.createElement('span');
        span.textContent = tag;
        
        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        tagList.appendChild(li);
    });
}

/**
 * Set up event listeners for all interactive elements
 */
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', () => {
        searchTerm = searchInput.value.toLowerCase();
        currentPage = 1;
        renderEntries();
    });
    
    // Category filters
    document.querySelectorAll('#category-list input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectedCategory = e.target.value;
            currentPage = 1;
            renderEntries();
        });
    });
    
    // Tag filters
    document.querySelectorAll('#tag-list input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedTags.add(e.target.value);
            } else {
                selectedTags.delete(e.target.value);
            }
            currentPage = 1;
            renderEntries();
        });
    });
    
    // Sort selector
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        renderEntries();
    });
    
    // Entries per page selector
    entriesSelect.addEventListener('change', () => {
        entriesPerPage = parseInt(entriesSelect.value);
        currentPage = 1;
        renderEntries();
    });
    
    // Pagination buttons
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderEntries();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
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
        const matchesSearch = searchTerm === '' || 
            entry.word.toLowerCase().includes(searchTerm) || 
            entry.definition.toLowerCase().includes(searchTerm);
            
        // Category filter
        const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
        
        // Tag filter
        let matchesTags = true;
        if (selectedTags.size > 0) {
            matchesTags = Array.isArray(entry.pos) 
                ? entry.pos.some(pos => selectedTags.has(pos))
                : selectedTags.has(entry.pos);
        }
        
        return matchesSearch && matchesCategory && matchesTags;
    });
}

/**
 * Sort entries based on current sort option
 */
function sortEntries(entries) {
    return [...entries].sort((a, b) => {
        switch (currentSort) {
            case 'id':
                return a.id - b.id;
            case 'word':
                return a.word.localeCompare(b.word);
            case 'category':
                return (a.category || '').localeCompare(b.category || '');
            case 'pos':
                const posA = Array.isArray(a.pos) ? a.pos[0] : a.pos;
                const posB = Array.isArray(b.pos) ? b.pos[0] : b.pos;
                return (posA || '').localeCompare(posB || '');
            case 'definition':
                return a.definition.localeCompare(b.definition);
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
    entriesList.innerHTML = '';
    
    // Create entry items
    entriesToDisplay.forEach(entry => {
        const entryItem = createEntryItem(entry);
        entriesList.appendChild(entryItem);
    });
}

/**
 * Create a single entry item
 */
function createEntryItem(entry) {
    // Create list item
    const li = document.createElement('li');
    li.classList.add('entry-item');
    
    // Create details element
    const details = document.createElement('details');
    
    // Create summary element with title, category, and ID
    const summary = document.createElement('summary');
    
    const h3 = document.createElement('h3');
    h3.classList.add('entry-word');
    h3.textContent = entry.word;
    
    const categorySpan = document.createElement('span');
    categorySpan.classList.add('entry-category');
    categorySpan.textContent = entry.category;
    
    const idSpan = document.createElement('span');
    idSpan.classList.add('entry-id');
    idSpan.textContent = entry.id;
    
    summary.appendChild(h3);
    summary.appendChild(categorySpan);
    summary.appendChild(idSpan);
    
    // Create content paragraph with parts of speech and definition
    const content = document.createElement('p');
    content.classList.add('entry-content');
    
    // Create tags container
    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('entry-tags');
    
    // Add parts of speech tags
    if (Array.isArray(entry.pos)) {
        entry.pos.forEach(pos => {
            const posSpan = document.createElement('span');
            posSpan.classList.add('entry-pos');
            posSpan.textContent = pos;
            tagsContainer.appendChild(posSpan);
        });
    } else if (entry.pos) {
        const posSpan = document.createElement('span');
        posSpan.classList.add('entry-pos');
        posSpan.textContent = entry.pos;
        tagsContainer.appendChild(posSpan);
    }
    
    // Add definition
    const definitionSpan = document.createElement('span');
    definitionSpan.classList.add('entry-definition');
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
document.addEventListener('DOMContentLoaded', init);
