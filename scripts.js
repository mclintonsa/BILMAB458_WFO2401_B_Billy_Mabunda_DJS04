import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Initialize state variables
let page = 1;
let matches = books;

// Function to render book previews
const renderBookPreviews = (books, containerElement) => {
  const fragment = document.createDocumentFragment();

  // Loop through the provided books
  for (const { author, id, image, title } of books) {
    const element = document.createElement('button');
    element.classList.add('preview');
    element.setAttribute('data-preview', id);

    // Created the HTML for each book preview
    element.innerHTML = `
      <img
        class="preview__image"
        src="${image}"
        alt="${title}"
      />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;

    fragment.appendChild(element);
  }

  containerElement.appendChild(fragment);
};

// Function to render options (genres or authors) in a dropdown
const renderOptions = (data, containerElement, defaultOption) => {
  const fragment = document.createDocumentFragment();

  if (defaultOption) {
    const element = document.createElement('option');
    element.value = 'any';
    element.innerText = defaultOption;
    fragment.appendChild(element);
  }

  for (const [id, name] of Object.entries(data)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    fragment.appendChild(element);
  }

  containerElement.appendChild(fragment);
};

const applyTheme = (theme) => {
  const isDarkMode = theme === 'night';
  document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
  document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');
};

// Function to initialize the user interface
const initializeUI = () => {
  const listItems = document.querySelector('[data-list-items]');
  const genreSelect = document.querySelector('[data-search-genres]');
  const authorSelect = document.querySelector('[data-search-authors]');
  const listButton = document.querySelector('[data-list-button]');

  // Functions to render the initial book previews, genres and author select
  renderBookPreviews(matches.slice(0, BOOKS_PER_PAGE), listItems);
  renderOptions(genres, genreSelect, 'All Genres');
  renderOptions(authors, authorSelect, 'All Authors');

  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDarkMode ? 'night' : 'day');
  document.querySelector('[data-settings-theme]').value = prefersDarkMode ? 'night' : 'day';

  listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
  listButton.disabled = matches.length - (page * BOOKS_PER_PAGE) <= 0;
  listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(0, matches.length - (page * BOOKS_PER_PAGE))})</span>
  `;
};

const handleSearchCancel = () => {
  document.querySelector('[data-search-overlay]').open = false;
};

const handleSettingsCancel = () => {
  document.querySelector('[data-settings-overlay]').open = false;
};

const handleHeaderSearch = () => {
  document.querySelector('[data-search-overlay]').open = true;
  document.querySelector('[data-search-title]').focus();
};

const handleHeaderSettings = () => {
  document.querySelector('[data-settings-overlay]').open = true;
};

const handleListClose = () => {
  document.querySelector('[data-list-active]').open = false;
};

const handleSettingsSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  applyTheme(theme);
  document.querySelector('[data-settings-overlay]').open = false;
};

const handleSearchSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    let genreMatch = filters.genre === 'any';

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) genreMatch = true;
    }

    if (
      (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === 'any' || book.author === filters.author) &&
      genreMatch
    ) {
      result.push(book);
    }
  }

  page = 1;
  matches = result;

  const listMessage = document.querySelector('[data-list-message]');
  listMessage.classList.toggle('list__message_show', result.length < 1);

  const listItems = document.querySelector('[data-list-items]');
  listItems.innerHTML = '';
  renderBookPreviews(result.slice(0, BOOKS_PER_PAGE), listItems);

  const listButton = document.querySelector('[data-list-button]');
  listButton.disabled = matches.length - (page * BOOKS_PER_PAGE) <= 0;
  listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(0, matches.length - (page * BOOKS_PER_PAGE))})</span>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('[data-search-overlay]').open = false;
};

const handleListButtonClick = () => {
  const listItems = document.querySelector('[data-list-items]');
  renderBookPreviews(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE), listItems);
  page += 1;
};

const handlePreviewClick = (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  const active = pathArray.find((node) => node?.dataset?.preview)?.dataset?.preview;

  if (active) {
    const selectedBook = books.find((book) => book.id === active);

    if (selectedBook) {
      document.querySelector('[data-list-active]').open = true;
      document.querySelector('[data-list-blur]').src = selectedBook.image;
      document.querySelector('[data-list-image]').src = selectedBook.image;
      document.querySelector('[data-list-title]').innerText = selectedBook.title;
      document.querySelector('[data-list-subtitle]').innerText = `${authors[selectedBook.author]} (${new Date(selectedBook.published).getFullYear()})`;
      document.querySelector('[data-list-description]').innerText = selectedBook.description;
    }
  }
};

initializeUI();

// Event handler functions 
document.querySelector('[data-search-cancel]').addEventListener('click', handleSearchCancel);
document.querySelector('[data-settings-cancel]').addEventListener('click', handleSettingsCancel);
document.querySelector('[data-header-search]').addEventListener('click', handleHeaderSearch);
document.querySelector('[data-header-settings]').addEventListener('click', handleHeaderSettings);
document.querySelector('[data-list-close]').addEventListener('click', handleListClose);
document.querySelector('[data-settings-form]').addEventListener('submit', handleSettingsSubmit);
document.querySelector('[data-search-form]').addEventListener('submit', handleSearchSubmit);
document.querySelector('[data-list-button]').addEventListener('click', handleListButtonClick);
document.querySelector('[data-list-items]').addEventListener('click', handlePreviewClick);