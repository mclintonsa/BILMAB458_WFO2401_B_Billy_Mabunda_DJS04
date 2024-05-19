class BookPreview extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ['author', 'image', 'title', 'id'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  
    render() {
      const author = this.getAttribute('author');
      const image = this.getAttribute('image');
      const title = this.getAttribute('title');
      const id = this.getAttribute('id');
  
      this.shadowRoot.innerHTML = `
        <style>
          /* Add styles for the book preview */
        </style>
        <button class="preview" data-preview="${id}">
          <img class="preview__image" src="${image}" alt="${title}" />
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
          </div>
        </button>
      `;
    }
  }
  
  customElements.define('book-preview', BookPreview);