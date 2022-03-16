/* eslint-disable linebreak-style */
import Listener from './Listener';
import Card from './Card';

export default class TrelloWidget {
  constructor() {
    this.widget = document.querySelector('.widget-container');
    this.columns = document.querySelectorAll('.widget-column');
    this.cardBoxes = document.querySelectorAll('.column-cards-box');

    this.draggedEl = null;
    this.clonedEl = null;
    this.capEl = null;
    this.deltas = {};
  }

  init() {
    this.restoreFromStorage();
    this.registerListeners();
  }

  registerListeners() {
    this.columns.forEach((column) => {
      column.addEventListener('click', (event) => this.onClick(event));
    });

    this.cardBoxes.forEach((box) => {
      box.addEventListener('mouseover', (event) => this.onMouseOver(event));
      box.addEventListener('mousedown', (event) => this.onMouseDown(event));
    });

    this.widget.addEventListener('mouseout', (event) => this.onMouseLeave(event));
    this.widget.addEventListener('mouseup', (event) => this.onMouseUp(event));

    window.addEventListener('beforeunload', () => this.saveState());
    document.addEventListener('mousemove', (event) => this.onMouseMove(event));
  }

  onClick(event) {
    Listener.onClick.call(this, event);
  }

  onMouseOver(event) {
    Listener.onMouseOver(event);
  }

  onMouseDown(event) {
    Listener.onMouseDown.call(this, event);
  }

  onMouseMove(event) {
    Listener.onMouseMove.call(this, event);
  }

  onMouseLeave(event) {
    Listener.onMouseLeave.call(this, event);
  }

  onMouseUp(event) {
    Listener.onMouseUp.call(this, event);
  }

  restoreFromStorage() {
    const storage = localStorage.getItem('trello');

    if (!storage) {
      this.state = {
        todo: [],
        progress: [],
        done: [],
      };
      return;
    }

    this.state = JSON.parse(storage);

    Object.entries(this.state).forEach((entry) => {
      if (entry[0].length) {
        entry[1].forEach((item) => {
          const card = new Card(item.title);
          card.bindToDOM(document.querySelector(`[data-name=${entry[0]}]`));
        });
      }
    });
  }

  saveState() {
    localStorage.setItem('trello', JSON.stringify(this.state));
  }
}
