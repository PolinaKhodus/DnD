/* eslint-disable linebreak-style */
import Card from './Card';
import * as fn from './function';

export default class Listeners {
  static onClick(event) {
    const { target } = event;
    const column = event.currentTarget;
    const box = column.querySelector('.column-cards-box');
    const footers = column.querySelectorAll('.column-footer');

    if (target.classList.contains('add-sign')
         || target.classList.contains('add-text')) {
      footers.forEach((footer) => footer.classList.toggle('hidden'));
      return;
    }

    if (target.classList.contains('footer-text-del')) {
      footers.forEach((footer) => footer.classList.toggle('hidden'));
      column.querySelector('textarea').value = '';
      return;
    }

    if (target.classList.contains('footer-text-btn')) {
      const title = column.querySelector('textarea').value;

      if (title.trim()) {
        const boxName = box.dataset.name;

        column.querySelector('textarea').value = '';
        footers.forEach((footer) => footer.classList.toggle('hidden'));

        const card = new Card(title);
        card.bindToDOM(box);
        this.state[boxName].push(card);

        return;
      }

      // TODO: Empty textarea field case
    }

    if (target.classList.contains('card-del')) {
      const boxName = box.dataset.name;
      const list = box.children;
      const card = target.closest('.card');
      const index = [...list].findIndex((item) => item === card);

      this.state[boxName].splice(index, 1);
      card.remove();
    }
  }

  static onMouseOver(event) {
    if (event.target.classList.contains('card')) {
      const delElement = event.target.querySelector('.card-del');

      delElement.classList.remove('hidden');

      event.target.addEventListener('mouseleave', function tmp() {
        delElement.classList.add('hidden');
        event.target.removeEventListener('mouseleave', tmp);
      });
    }
  }

  static onMouseDown(event) {
    event.preventDefault();
    const eventTarget = event.target;

    if (eventTarget.classList.contains('column-cards-box')
          || eventTarget.classList.contains('card-del')) {
      return;
    }

    this.draggedEl = eventTarget.closest('.card');
    this.clonedEl = this.draggedEl.cloneNode(true);

    this.deltas.rect = this.draggedEl.getBoundingClientRect();
    this.deltas.x = event.clientX - this.deltas.rect.left;
    this.deltas.y = event.clientY - this.deltas.rect.top;

    this.clonedEl.classList.add('dragged');

    // eslint-disable-next-line no-param-reassign
    document.querySelectorAll('*').forEach((el) => el.style.cursor = 'grabbing');
    this.draggedEl.classList.add('hidden');

    document.body.appendChild(this.clonedEl);
    this.clonedEl.style.width = `${this.deltas.rect.width}px`;
    this.clonedEl.style.height = `${this.deltas.rect.height}px`;

    fn.moveAt(this.clonedEl, this.deltas);
  }

  static onMouseMove(event) {
    event.preventDefault();

    if (!this.draggedEl) {
      return;
    }

    fn.moveAt(this.clonedEl, this.deltas);

    const box = event.target.closest('.column-cards-box');
    const target = event.target.closest('.card');
    const cardRect = this.deltas.rect;

    if (!box && document.querySelector('.card-cap')) {
      this.capEl.remove();
    }

    if (target) {
      const prefix = fn.getPosition(event, target);

      if (!this.capEl) {
        this.capEl = document.createElement('DIV');
        this.capEl.classList.add('card-cap');
        this.capEl.style.width = `${cardRect.width}px`;
        this.capEl.style.height = `${cardRect.height}px`;
      }
      target.insertAdjacentElement(`${prefix ? 'beforebegin' : 'afterend'}`, this.capEl);
    }
  }

  static onMouseUp(event) {
    if (!this.draggedEl) {
      return;
    }

    const box = event.target.closest('.column-cards-box');
    const cap = document.querySelector('.card-cap');
    const fromName = this.draggedEl.closest('.column-cards-box').dataset.name;

    let fromIndex = [...document.querySelector(`[data-name=${fromName}]`).children]
      .findIndex((elem) => elem === this.draggedEl);

    if (box && !box.children.length) {
      box.append(this.draggedEl);
    }

    if (cap) {
      cap.replaceWith(this.draggedEl);
      fromIndex -= 1;
    }

    const toName = this.draggedEl.closest('.column-cards-box').dataset.name;
    const toIndex = [...document.querySelector(`[data-name=${toName}]`).children]
      .findIndex((elem) => elem === this.draggedEl);

    const element = this.state[fromName].splice(fromIndex, 1)[0];
    this.state[toName].splice(toIndex, 0, element);

    this.clonedEl.remove();
    this.draggedEl.classList.remove('hidden');

    this.draggedEl = null;
    this.clonedEl = null;
    this.capEl = null;
    this.deltas = {};

    // eslint-disable-next-line no-param-reassign
    document.querySelectorAll('*').forEach((el) => el.style.cursor = '');
  }

  static onMouseLeave(event) {
    if (!this.draggedEl) {
      return;
    }

    if (event.relatedTarget === null
     || event.relatedTarget.nodeName === 'HTML') {
      this.clonedEl.remove();
      this.draggedEl.classList.remove('hidden');

      // eslint-disable-next-line no-param-reassign
      document.querySelectorAll('*').forEach((el) => el.style.cursor = '');
      if (this.capEl) {
        this.capEl.remove();
      }

      this.draggedEl = null;
      this.clonedEl = null;
      this.capEl = null;
      this.deltas = {};
    }
  }
}
