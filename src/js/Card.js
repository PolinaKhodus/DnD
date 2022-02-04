/* eslint-disable linebreak-style */
export default class Card {
  constructor(title) {
    this.title = title;
    this.cardEl = this.createElement();
  }

  createMarkup() {
    return ` 
      <header class="card-header">
        ${this.title}
        <span class="card-del hidden" title="Удалить карточку">&#xd7;</span>
      </header>
      <div class='card-content'>
        Content of card
      </div>      
    `;
  }

  createElement() {
    const card = document.createElement('DIV');
    card.classList.add('card');
    card.insertAdjacentHTML('beforeend', this.createMarkup());

    return card;
  }

  bindToDOM(container) {
    container.append(this.cardEl);
  }
}
